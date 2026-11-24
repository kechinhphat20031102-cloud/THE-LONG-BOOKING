import urllib.request, csv, io

sheet_id = '1wOAcBhlmhc7K89sbl1Jy9ijvktfdhW8rCtb5s6hOLaw'
gid = '1745536383'
url = f'https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&gid={gid}'

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8')

reader = list(csv.reader(io.StringIO(content)))
row1 = reader[1] if len(reader) > 1 else []
row3 = reader[3] if len(reader) > 3 else []
row5 = reader[5] if len(reader) > 5 else []

blocks = []
for c in range(len(row5)):
    if 'ĐẠI LÝ' in row5[c].upper():
        t1 = ''
        t3 = ''
        for offset in range(-2, 4):
            idx = c + offset
            if 0 <= idx < len(row1) and row1[idx].strip() and not t1:
                t1 = row1[idx].strip()
            if 0 <= idx < len(row3) and row3[idx].strip() and not t3:
                t3 = row3[idx].strip()
        title = f"{t1} - {t3}".strip(' -')
        blocks.append({'col_start': c, 'title': title})

print(f"Found {len(blocks)} trip blocks in Google Sheet:")
for b in blocks:
    print(f"Col {b['col_start']}: {b['title']}")

# Now extract all bookings across all rows (row 6 onwards)
all_bookings = []
for r_idx in range(6, len(reader)):
    row = reader[r_idx]
    for b in blocks:
        cs = b['col_start']
        # Typically cols are: ĐẠI LÝ, ĐIỂM ĐÓN, ĐIỂM TRẢ, TÊN/CODE, SL, GHI CHÚ
        if cs < len(row):
            agency = row[cs].strip() if cs < len(row) else ''
            p1 = row[cs+1].strip() if cs+1 < len(row) else ''
            p2 = row[cs+2].strip() if cs+2 < len(row) else ''
            cust = row[cs+3].strip() if cs+3 < len(row) else ''
            sl = row[cs+4].strip() if cs+4 < len(row) else ''
            note = row[cs+5].strip() if cs+5 < len(row) else ''

            if agency and agency.upper() not in ['TỔNG', 'ĐẠI LÝ', 'YÊU CẦU']:
                all_bookings.append({
                    'trip': b['title'],
                    'agency': agency,
                    'pickup': p1,
                    'drop': p2,
                    'customer': cust,
                    'sl': sl,
                    'note': note
                })

print(f"\nTotal active bookings extracted from your real Google Sheet: {len(all_bookings)}")
for b in all_bookings[:15]:
    print(f"[{b['trip'][:25]}] {b['agency']} | Đón: {b['pickup'][:20]} | Khách: {b['customer']} ({b['sl']}k) | {b['note']}")
