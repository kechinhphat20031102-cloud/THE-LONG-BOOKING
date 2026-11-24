import urllib.request, csv, io

sheet_id = '1wOAcBhlmhc7K89sbl1Jy9ijvktfdhW8rCtb5s6hOLaw'
gid = '1330423694' # 24/11
url = f'https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&gid={gid}'

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8')

reader = list(csv.reader(io.StringIO(content)))

print(f"Tab 24/11 total rows: {len(reader)}")
row1 = reader[1] if len(reader) > 1 else []
row3 = reader[3] if len(reader) > 3 else []
row5 = reader[5] if len(reader) > 5 else []

# Check row 5 headers
print("Row 5 non-empty columns:")
for c, val in enumerate(row5):
    if val.strip():
        print(f"Col {c} ({chr(65+c) if c<26 else 'A'+chr(65+c-26)}): {val}")

# Check row 12 where Buffalo 4452 is
print("\nRow 12 details:")
row12 = reader[12]
for c in range(len(row12)):
    if row12[c].strip():
        col_letter = chr(65+c) if c < 26 else 'A' + chr(65+c-26)
        print(f"Col {c} ({col_letter}): '{row12[c]}'")
