import urllib.request, re

sheet_id = '1wOAcBhlmhc7K89sbl1Jy9ijvktfdhW8rCtb5s6hOLaw'
url = f'https://docs.google.com/spreadsheets/d/{sheet_id}/htmlview'

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

tabs = re.findall(r'id=["\']sheet-button-(\d+)["\'][^>]*><a[^>]*>([^<]+)</a>', html)
if not tabs:
    tabs = re.findall(r'gid=(\d+)[^"\'>]*["\'>]([^<]+)<', html)

print(f"Total tabs found: {len(tabs)}")
for gid, name in tabs:
    print(f"gid={gid} : {name.strip()}")
