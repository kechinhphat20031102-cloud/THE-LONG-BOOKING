"""Loopback-only booking storage. Standard library; no package installation."""
import argparse, json, sqlite3, threading, time, webbrowser, urllib.request
from pathlib import Path
from contextlib import contextmanager, closing
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

ROOT = Path(__file__).resolve().parent
ASSETS = {'index.html','app.js','parser.js','gemini_service.js','booking_memory.js','booking_history.js'}
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
    def allowed(self):
        host = self.headers.get('Host','')
        return host in {f'127.0.0.1:{self.server.server_port}',f'localhost:{self.server.server_port}'}
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
        if not self.allowed() or self.headers.get('Origin') not in {f'http://127.0.0.1:{self.server.server_port}', f'http://localhost:{self.server.server_port}'}:
            return self.reply(403, {'error':'Chỉ cho phép ghi từ trang ứng dụng local.'})
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

def make_server(port=8765, db_path=None):
    server = ThreadingHTTPServer(('127.0.0.1',port), Handler)
    server.db_path = Path(db_path) if db_path else ROOT / 'data' / 'bookings.sqlite'
    with database(server.db_path): pass
    return server

if __name__ == '__main__':
    p=argparse.ArgumentParser(); p.add_argument('--open',action='store_true'); p.add_argument('--port',type=int,default=8765); args=p.parse_args()
    url=f'http://127.0.0.1:{args.port}/'
    try: server=make_server(args.port)
    except OSError:
        with urllib.request.urlopen(url+'api/health',timeout=3) as res:
            if json.load(res).get('app') != 'thelong-booking': raise RuntimeError('Port occupied')
        if args.open: webbrowser.open(url)
    else:
        if args.open: webbrowser.open(url)
        server.serve_forever()
