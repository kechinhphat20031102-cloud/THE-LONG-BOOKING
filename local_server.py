"""Loopback-only booking storage. Standard library; no package installation."""
import argparse, json, sqlite3, threading, time, webbrowser, urllib.request
from pathlib import Path
from contextlib import contextmanager, closing
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

ROOT = Path(__file__).resolve().parent
ASSETS = {'index.html','app.js','parser.js','gemini_service.js','booking_memory.js','booking_history.js','firebase_config.js','booking_history_firebase.js','dataset_examples.js','dataset_learner.js'}
LOCK = threading.Lock()

def validate(items):
    if not isinstance(items, list) or len(items) > 100000: raise ValueError('Invalid booking list')
    ids = set()
    for b in items:
        if not isinstance(b, dict) or type(b.get('id')) is not int or b['id'] < 1 or b['id'] in ids: raise ValueError('Invalid or duplicate ID')
        ids.add(b['id'])
        if not isinstance(b.get('parsed'), dict): raise ValueError('Invalid booking')
        from datetime import date
        date.fromisoformat(b.get('confirmedDay',''))
    return items

@contextmanager
def database(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path)
    db.execute('CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL, payload TEXT NOT NULL)')
    db.execute("INSERT OR IGNORE INTO state VALUES(1,0,'[]')")
    db.commit()
    try:
        yield db
    finally:
        db.close()

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args): pass
    def reply(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status); self.send_header('Content-Type','application/json; charset=utf-8'); self.send_header('Cache-Control','no-store'); self.end_headers(); self.wfile.write(body)
    def is_local_or_lan(self, host_or_origin):
        import ipaddress, urllib.parse
        if not host_or_origin: return False
        if host_or_origin.startswith(('http://', 'https://')):
            parsed = urllib.parse.urlparse(host_or_origin)
            host = parsed.hostname or ''
            port = parsed.port or (443 if parsed.scheme == 'https' else 80)
            if port != self.server.server_port: return False
        else:
            host = host_or_origin.split(':')[0]
        if host in {'127.0.0.1', 'localhost'}: return True
        try:
            ip = ipaddress.ip_address(host)
            return ip.is_private or ip.is_loopback
        except ValueError:
            return host.endswith('.local')
    def allowed(self):
        host = self.headers.get('Host','')
        return self.is_local_or_lan(host)
    def do_GET(self):
        if not self.allowed(): return self.reply(403, {'error':'Invalid host'})
        route = self.path.split('?')[0]
        if route == '/api/health': return self.reply(200, {'app':'thelong-booking','storage':'sqlite'})
        if route == '/api/history':
            with LOCK, database(self.server.db_path) as db:
                revision,payload = db.execute('SELECT revision,payload FROM state WHERE id=1').fetchone()
            return self.reply(200, {'revision':revision,'bookings':json.loads(payload)})
        asset = route.lstrip('/') or 'index.html'
        if asset not in ASSETS: return self.reply(404, {'error':'Not found'})
        body = (ROOT / asset).read_bytes()
        self.send_response(200); self.send_header('Content-Type','text/html; charset=utf-8' if asset.endswith('.html') else 'text/javascript; charset=utf-8'); self.send_header('Cache-Control','no-store'); self.end_headers(); self.wfile.write(body)
    def do_PUT(self):
        origin = self.headers.get('Origin', '')
        if not self.allowed() or not self.is_local_or_lan(origin):
            return self.reply(403, {'error':'Chỉ cho phép ghi từ trang ứng dụng local/mạng nội bộ.'})
        if self.path != '/api/history': return self.reply(404, {'error':'Not found'})
        try:
            size = int(self.headers.get('Content-Length','0'))
            if not 0 < size <= 20_000_000: raise ValueError('Request too large')
            data = json.loads(self.rfile.read(size)); items = validate(data['bookings'])
            with LOCK, database(self.server.db_path) as db:
                revision,payload = db.execute('SELECT revision,payload FROM state WHERE id=1').fetchone()
                if data.get('revision') != revision: return self.reply(409, {'error':'Lịch sử đã thay đổi ở tab khác. Xuất bản sao trước khi tải lại trang.'})
                serialized = json.dumps(items,ensure_ascii=False)
                if serialized != payload:
                    backups = self.server.db_path.parent.parent / 'backups'; backups.mkdir(exist_ok=True)
                    dest = backups / f'bookings-{time.time_ns()}.sqlite'
                    with closing(sqlite3.connect(dest)) as backup: db.backup(backup)
                    revision += 1
                    db.execute('UPDATE state SET revision=?,payload=? WHERE id=1',(revision,serialized)); db.commit()
                    # Retain 30 most recent recovery copies; only files created by this service.
                    for old in sorted(backups.glob('bookings-*.sqlite'))[:-30]: old.unlink()
            self.reply(200, {'revision':revision})
        except (ValueError,KeyError,TypeError,json.JSONDecodeError) as e: self.reply(400, {'error':str(e)})
        except Exception: self.reply(500, {'error':'Không ghi được SQLite. Kiểm tra dung lượng và quyền thư mục.'})

def get_local_ip():
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def make_server(port=8765, db_path=None, host='127.0.0.1'):
    server = ThreadingHTTPServer((host, port), Handler)
    server.db_path = Path(db_path) if db_path else ROOT / 'data' / 'bookings.sqlite'
    with database(server.db_path): pass
    return server

if __name__ == '__main__':
    p=argparse.ArgumentParser(); p.add_argument('--open',action='store_true'); p.add_argument('--port',type=int,default=8765); args=p.parse_args()
    local_ip = get_local_ip()
    url = f'http://127.0.0.1:{args.port}/'
    lan_url = f'http://{local_ip}:{args.port}/'
    try: server = make_server(args.port, host='0.0.0.0')
    except OSError:
        with urllib.request.urlopen(url+'api/health',timeout=3) as res:
            if json.load(res).get('app') != 'thelong-booking': raise RuntimeError('Port occupied')
        if args.open: webbrowser.open(url)
    else:
        print("="*60)
        print("THẾ LONG TRAVEL - HỆ THỐNG ĐIỀU HÀNH & ĐỒNG BỘ BOOKING")
        print("="*60)
        print("Máy chủ đang chạy và sẵn sàng đồng bộ giữa các máy:")
        print(f"👉 Trên máy chủ này: {url}")
        print(f"👉 Các máy khác gõ:   {lan_url}  (chung Wifi/LAN)")
        print(f"\nDữ liệu lưu chung tại: data/bookings.sqlite")
        print("Tất cả các máy truy cập đều dùng chung 1 lịch sử booking!")
        print("="*60)
        if args.open: webbrowser.open(url)
        server.serve_forever()
