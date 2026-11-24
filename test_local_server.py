import json, tempfile, threading, urllib.request, urllib.error, unittest
from pathlib import Path
from local_server import make_server

class StorageTest(unittest.TestCase):
    def test_persistence_conflicts_and_backups(self):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'data'/'bookings.sqlite'
            server=make_server(0,path)
            thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
            url=f'http://127.0.0.1:{server.server_port}'
            def request(route, body=None, origin=None):
                req=urllib.request.Request(url+route,data=json.dumps(body).encode() if body is not None else None,method='PUT' if body is not None else 'GET',headers={'Content-Type':'application/json','Origin':origin or url})
                try:
                    with urllib.request.urlopen(req,timeout=5) as res:return res.status,json.load(res)
                except urllib.error.HTTPError as e:return e.code,json.load(e)
            try:
                self.assertEqual(request('/api/history')[1],{'revision':0,'bookings':[]})
                booking={'id':1,'confirmedDay':'2026-11-24','parsed':{'customerString':'Updated guest','travelDate':'30/11/2026','zaloMsg':'Corrected form'},'checkStatus':'found'}
                self.assertEqual(request('/api/history',{'revision':0,'bookings':[booking]})[0],200)
                self.assertEqual(request('/api/history')[1]['bookings'],[booking])
                self.assertEqual(request('/api/history',{'revision':0,'bookings':[]})[0],409)
                self.assertEqual(request('/api/history',{'revision':1,'bookings':[]},'https://example.com')[0],403)
                self.assertEqual(request('/data/bookings.sqlite')[0],404)
                self.assertEqual(request('/api/history',{'revision':1,'bookings':[booking,booking]})[0],400)
                self.assertTrue(list((Path(folder)/'backups').glob('*.sqlite')))
            finally:server.shutdown();server.server_close();thread.join()
            restarted=make_server(0,path)
            worker=threading.Thread(target=restarted.serve_forever,daemon=True);worker.start()
            try:
                with urllib.request.urlopen(f'http://127.0.0.1:{restarted.server_port}/api/history') as res:
                    data=json.load(res)
                self.assertEqual(data['bookings'],[booking]);self.assertEqual(data['revision'],1)
            finally:restarted.shutdown();restarted.server_close();worker.join()

if __name__=='__main__':unittest.main()
