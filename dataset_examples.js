/** 100 mẫu đã kiểm tra từ DATA_SET_THE_LONG_TRAVEL_FORM_MOI.docx (25/11/2026), dùng cho dataset_learner.js. */
const DATASET_EXAMPLES = [
{
"raw": "chị đặt xe :  chuyến 20h /  ngày  23 tháng 11 /  1 khách /  đón Hang Múa Eco Garden/  trả công viên cầu giấy /  Hoàng Xuân Vinh/  0385 661 539",
"fields": {
"Đại lý": "Hang Múa Eco Garden",
"Mã booking": "TL231126",
"Ngày đi": "23/11/2026",
"Lịch trình": "NB - HN",
"Loại xe": "limosine",
"Số lượng khách": "1",
"Thông tin khách": "Hoàng Xuân Vinh – 0385 661 539",
"Giờ đón": "19:45 - 20:15",
"Điểm đón": "Hang Múa Eco Garden",
"Điểm trả": "công viên cầu giấy",
"Giá dịch vụ": "220k/pax",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "15:10 đặt xe đón 5 pax từ bến thuyền tràng an\n4pax về bích động\n1pax trả  Si Grand Hotel",
"fields": {
"Đại lý": "vpl",
"Mã booking": "TL231126",
"Ngày đi": "23/11/2026",
"Lịch trình": "taxi tràng an - nb",
"Loại xe": "7c",
"Số lượng khách": "5",
"Thông tin khách": "",
"Giờ đón": "15h10",
"Điểm đón": "bến thuyền tràng an",
"Điểm trả": "4 khách: Bích Động; 1 khách: Si Grand Hotel",
"Giá dịch vụ": "200k",
"Ghi chú": ""
}
},
{
"raw": "Ngày 23/11\n1k Tam Coc - Cat Ba\nChuyến : 13h30\nĐón: The Luna hostel $ bar\nTrả: báo sau\nTên: Manee margain +60125408630",
"fields": {
"Đại lý": "Nb FootPrint",
"Mã booking": "TL231126",
"Ngày đi": "23/11/2026",
"Lịch trình": "NB - CB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "Manee margain – +60125408630",
"Giờ đón": "12:45 - 13:00",
"Điểm đón": "The Luna hostel $ bar",
"Điểm trả": "báo sau",
"Giá dịch vụ": "",
"Ghi chú": "a/c vui lòng thanh toán bk khi kế toán gửi công nợ theo ngày"
}
},
{
"raw": "chị đặt xe :  chuyến 14h chiều nay /  ngày 23 tháng 10/  1 khách /  đón công viên cầu giấy /  trả trường cấp 3 Nguyễn Công Trứ - Ninh Bình /  Hoàng Xuân Vinh /  0385 661 539",
"fields": {
"Đại lý": "Hang Múa Eco Garden",
"Mã booking": "TL231026",
"Ngày đi": "23/10/2026",
"Lịch trình": "HN - NB",
"Loại xe": "limo",
"Số lượng khách": "1",
"Thông tin khách": "Hoàng Xuân Vinh – 0385661539",
"Giờ đón": "13:10",
"Điểm đón": "Công viên Cầu Giấy",
"Điểm trả": "Trường cấp 3 Nguyễn Công Trứ - Ninh Bình",
"Giá dịch vụ": "",
"Ghi chú": "a/c vui lòng thanh toán bk khi kế toán gửi công nợ theo ngày"
}
},
{
"raw": "23/11, 15h30, 1k\nLars Blekkenhorst\nEmail larsblekkenhorst1310@gmail.com\nPhone +31651057085\nCB-NB bus thg ạ",
"fields": {
"Đại lý": "GMN",
"Mã booking": "TL231126",
"Ngày đi": "23/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "Lars Blekkenhorst – +31651057085",
"Giờ đón": "15:00 - 15:30",
"Điểm đón": "228 1/4",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "Ngày                    : 23/11/2026\nLoại xe                 : Limousine\nSL khách             : 2\nTên khách           : Rondinoni Maria Paula\nGiờ đón               : 5:00 PM\nĐón                      : Indochine\nTrả                        : PARAGON 2 BOUTIQUE HOTEL AND POOL",
"fields": {
"Đại lý": "Indochine",
"Mã booking": "TL231126",
"Ngày đi": "23/11/2026",
"Lịch trình": "NB - HN",
"Loại xe": "Limousine",
"Số lượng khách": "2",
"Thông tin khách": "Rondinoni Maria Paula",
"Giờ đón": "17:00 - 17:30",
"Điểm đón": "Indochine",
"Điểm trả": "PARAGON 2 BOUTIQUE HOTEL AND POOL",
"Giá dịch vụ": "360 / pax",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi / Giờ đón 5:00 PM"
}
},
{
"raw": "@All  Trưa nay 23/11, em gửi thêm 2 bus CB - NB. Đón bến Bèo\nHD Nghĩa - 0342159201 giao khách\n2k - Renana Straussman +972 58-449-9000 => Team hỏi khách điểm trả giúp e nhé ạ",
"fields": {
"Đại lý": "sunlight",
"Mã booking": "TL231126",
"Ngày đi": "23/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "Renana Straussman – +972 58-449-9000",
"Giờ đón": "12:00 - 12:30",
"Điểm đón": "bến Bèo (HD Nghĩa - 0342159201 giao khách)",
"Điểm trả": "",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi / Team hỏi khách điểm trả giúp e nhé ạ"
}
},
{
"raw": "23/11, 12h30, 2k\nChristopher Christmas\nEmail xxmass@live.com\nPhone +19058186712\nCB-NB bus thg ạ",
"fields": {
"Đại lý": "GMN",
"Mã booking": "TL231126",
"Ngày đi": "23/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus thường",
"Số lượng khách": "2",
"Thông tin khách": "Christopher Christmas – +19058186712",
"Giờ đón": "12:00 - 12:30",
"Điểm đón": "Cát Bà",
"Điểm trả": "Ninh Bình",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "AAVQ7948\nThứ 4 25 thg 11 2026 · Express 16\nRoute: Hoa Binh to Tam Coc  13:30\nđón :Mac Thanh Homestay\ntrả   Tam Coc Sunshine Hostel\nCác hành khách  3 × Adult\nTali Paz\nAdi Vaknin\nShani Bar\nSố điện thoại: +972528668762",
"fields": {
"Đại lý": "VPL",
"Mã booking": "TL251126",
"Ngày đi": "25/11/2026",
"Lịch trình": "MC - NB",
"Loại xe": "MINIVAN",
"Số lượng khách": "3",
"Thông tin khách": "Tali Paz – +972528668762",
"Giờ đón": "13:00 - 13:20",
"Điểm đón": "Mac Thanh Homestay",
"Điểm trả": "Tam Coc Sunshine Hostel",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "Xác nhận đặt chỗ\nMã đặt chỗ: R4985\nNgày khởi hành: 25 tháng 11 năm 2026\nLịch trình: bus Ninh Bình - Cát Bà (đã bao gồm vé phà)\nLoại phương tiện: bus \nSố lượng hành khách: 1\nTên hành khách: Pasquale Scarano +39 340 735 3382\nThời gian đón: 6:40 - 7:00\nĐiểm đón: Tam Coc Sunseekers Homestay 2\nĐiểm trả: Cat Ba Love House\nnote : thu khách 250k",
"fields": {
"Đại lý": "VPL  R4985",
"Mã booking": "TL251126",
"Ngày đi": "25/11/2026",
"Lịch trình": "NB - CB",
"Loại xe": "bus",
"Số lượng khách": "1",
"Thông tin khách": "Pasquale Scarano – +39 340 735 3382",
"Giờ đón": "6:40 - 7:00",
"Điểm đón": "Tam Coc Sunseekers Homestay 2",
"Điểm trả": "Cat Ba Love House",
"Giá dịch vụ": "",
"Ghi chú": "thu khách 250k"
}
},
{
"raw": "Alo em 1k ninh bình 9h00 25/11 đón tại ks Phương Phương +43 664 4112015",
"fields": {
"Đại lý": "em phương cát bà",
"Mã booking": "TL251126",
"Ngày đi": "25/11/2026",
"Lịch trình": "cb-nb",
"Loại xe": "bus",
"Số lượng khách": "1",
"Thông tin khách": "johann – +43 664 4112015",
"Giờ đón": "7h45 8h",
"Điểm đón": "ks Phương Phương",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": "gửi unc trước khi khách đi để booking có hiệu lực - stk nhận tiền 5285678386 techcombank PHAM HOANG PHUC"
}
},
{
"raw": "#AAVQ5679 \nThứ 6 26 thg 2 2027 · Express 16\n\nRoute: Ninh Binh to Pu Luong\n13:00\n3h 10m\n16:10\nThe Long Travel\nOH Pu Luong Homestay\nCác hành khách\n2 × Adult\nCác hành khách\nTên\tFare\tQuốc tịch\tTicket / seat\nEric Maxime Joyal\nSố điện thoại: +18195002830 · E-mail: eric_joyal@hotmail.com\nAdult\n—\t—\nCathy Seguin\nSố điện thoại: +18195002830 · E-mail: eric_joyal@hotmail.com\nAdult",
"fields": {
"Đại lý": "AAVQ5679",
"Mã booking": "TL260227",
"Ngày đi": "26/02/2027",
"Lịch trình": "NB - PL",
"Loại xe": "minivan",
"Số lượng khách": "2",
"Thông tin khách": "Eric Maxime Joyal – +18195002830",
"Giờ đón": "12:45 - 13:00",
"Điểm đón": "The Long Travel",
"Điểm trả": "OH Pu Luong Homestay",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "#AAVB5627\nRoute:\nTam Coc boat station to mai châu\nVehicle: Express 16\nDeparture station: tam coc boat station\nDeparture at: 25-11-2026 08:00\nArrival station: Little Mai Chau Homestay\nAdult: 2pax\nPeter Bennetts\nPhone:\n+84366114397",
"fields": {
"Đại lý": "VPL",
"Mã booking": "TL251126",
"Ngày đi": "25/11/2026",
"Lịch trình": "NB - MC",
"Loại xe": "MINIVAN",
"Số lượng khách": "2",
"Thông tin khách": "Peter Bennetts – +84366114397",
"Giờ đón": "7:45 - 8:00",
"Điểm đón": "tam coc boat station",
"Điểm trả": "Little Mai Chau Homestay",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "EM  GỬI  2    PAX   CB - NB    CHUYẾN  12:30PM   NGÀY   25/10\nTÊN : Marc\nCODE:  810\nĐÓN:  CATBA BUFFALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO 810",
"Mã booking": "TL251026",
"Ngày đi": "25/10/2026",
"Lịch trình": "CB - NB",
"Loại xe": "BUS",
"Số lượng khách": "2",
"Thông tin khách": "Marc",
"Giờ đón": "12:00 - 12:30",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "BÁO SAU",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "EM GỬI 2  KHÁCH  CATBA - NINH BINH- PHONG NHA  CHUYẾN 12PM   NGÀY  25/10 ( CABIN 20)\nTÊN:  GRACE + ARCHIE\nĐÓN:   FAMILY HOME CATBA\nĐÓN: NINH BÌNH 20:00\nCODE: 970\nWS +447523354006",
"fields": {
"Đại lý": "FAMILY HOME BUS 970",
"Mã booking": "TL251026",
"Ngày đi": "25/10/2026",
"Lịch trình": "CB - NB",
"Loại xe": "bus + VIP 20",
"Số lượng khách": "2",
"Thông tin khách": "GRACE + ARCHIE – +447523354006",
"Giờ đón": "12:00 - 12:20",
"Điểm đón": "FAMILY HOME CATBA",
"Điểm trả": "60 Trần Nhân Tông ( nối Phong Nha chuyến 20:00 )",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "EM GỬI  5  KHÁCH  CATBA - NINH BINH  CHUYẾN  12PM   NGÀY  25/10\nTÊN:  SADIE + JOSEPH + OLIVER + IRIS + ROWAN\nĐÓN:   FAMILY HOME CATBA\nCODE: 971\nWS: +18673322306",
"fields": {
"Đại lý": "FAMILY HOME BUS 971",
"Mã booking": "TL251026",
"Ngày đi": "25/10/2026",
"Lịch trình": "CB - NB",
"Loại xe": "bus",
"Số lượng khách": "5",
"Thông tin khách": "SADIE + JOSEPH + OLIVER + IRIS + ROWAN – +18673322306",
"Giờ đón": "12:00 - 12:20",
"Điểm đón": "FAMILY HOME CATBA",
"Điểm trả": "Tam Coc",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "Chiều 25/10 đón 1 pax Ninh Binh- Puluong\n- tên celine. \nNote thu 350k\ntrả Qui E Ora",
"fields": {
"Đại lý": "PL LAN ANH",
"Mã booking": "TL251026",
"Ngày đi": "25/10/2026",
"Lịch trình": "NB - PL",
"Loại xe": "BUS",
"Số lượng khách": "1",
"Thông tin khách": "celine",
"Giờ đón": "13:00 - 13:30",
"Điểm đón": "The Long Hotel",
"Điểm trả": "Qui E Ora",
"Giá dịch vụ": "",
"Ghi chú": "Note thu 350k"
}
},
{
"raw": "ngày 25/11, bên e book 2 vé đi tour cúc phương , tên khách Murillo Gonzalez Marta ạ",
"fields": {
"Đại lý": "Hoang minh",
"Mã booking": "TL251126",
"Ngày đi": "25/11/2026",
"Lịch trình": "CÚC PHƯƠNG",
"Loại xe": "minivan",
"Số lượng khách": "2",
"Thông tin khách": "Murillo Gonzalez Marta",
"Giờ đón": "8:45 - 9:10",
"Điểm đón": "Hoang minh",
"Điểm trả": "Hoang minh",
"Giá dịch vụ": "",
"Ghi chú": "a/c vui lòng thanh toán bk khi kế toán gửi công nợ theo ngày"
}
},
{
"raw": "Ninh Bình - Mai Châu\n13:30\n25/11/2026\n2 ghế:\n1, 2\nMã vé:\n05XOY2\nMã đặt chỗ:\nO3K69HS\nĐón:\n13:10\nTC Đón:\nTam Cốc Sunshine Hostel\nTrả:\n17:30 - La Mai Chau Home - M34C+6PP, Nà Chiềng, Mai Châu, Phú Thọ 36400, Viêt @Kế Toán Việt Nam Easy Go Travel \nAnaïs Ventura\nSĐT:\n33766385151\nEmail:\nanaisv.sylvainl@gmail.com\nGhi chú:\n+33766385151, có dùng",
"fields": {
"Đại lý": "VXR 05XOY2",
"Mã booking": "TL251126",
"Ngày đi": "25/11/2026",
"Lịch trình": "Ninh Bình - Mai Châu",
"Loại xe": "MINIVAN",
"Số lượng khách": "2",
"Thông tin khách": "Anaïs Ventura – +33766385151",
"Giờ đón": "12:45 - 13:00",
"Điểm đón": "Tam Cốc Sunshine Hostel",
"Điểm trả": "La Mai Chau Home",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "EM  GỬI 4  PAX   CB - NB    CHUYẾN  12:30PM   NGÀY   24/11\nTÊN :  SADIE X 4 PAX\nCODE:     4458\nĐÓN:  CATBA BUFF\\ALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO 4458",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "",
"Số lượng khách": "4",
"Thông tin khách": "SADIE",
"Giờ đón": "12:00 - 12:30",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "NINH BINH",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "EM  GỬI 3  PAX   CB - NB    CHUYẾN  12:30PM   NGÀY   24/11\nTÊN :  Styim, Maurice, Sophie \nCODE:      3437\nĐÓN:  CATBA BUFF\\ALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO 3437",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "3",
"Thông tin khách": "Styim, Maurice, Sophie",
"Giờ đón": "12:20 - 12:40",
"Điểm đón": "Catba Buffalo Hostel",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "@Thế Long Travel Cho chị đặt 1 khách chuyến 12h ngày mai ( 20/11 ) đón khách tại Lô 27B, Cảng tàu Tuần Châu, Phường Tuần Châu, Quảng Ninh.\ntên khách Tjelfe-Madita Hinz\nSDT +49 176 24123406\nTrả k tại Ninh binh - mình báo điểm trả sau nhé \nThanks team",
"fields": {
"Đại lý": "85 mã mây",
"Mã booking": "TL201126",
"Ngày đi": "20/11/2026",
"Lịch trình": "HL - NB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "Tjelfe-Madita Hinz – +49 176 24123406",
"Giờ đón": "11:45 - 12:15",
"Điểm đón": "Lô 27B, Cảng tàu Tuần Châu",
"Điểm trả": "Ninh Bình (báo sau)",
"Giá dịch vụ": "",
"Ghi chú": "a/c vui lòng thanh toán bk khi kế toán gửi công nợ theo ngày"
}
},
{
"raw": "24/11 em book 2v đi pu luong \nJackomino Sam\nĐón 13:00 pm \nThu hộ 800k",
"fields": {
"Đại lý": "Lotus Field",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "Ninh Bình - Pù Luông",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "Jackomino Sam",
"Giờ đón": "13:00 - 13:30",
"Điểm đón": "Lotus Field",
"Điểm trả": "Pù Luông",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi / Thu hộ 800k"
}
},
{
"raw": "EM  GỬI  1   PAX   CB - NB    CHUYẾN  12:30PM   NGÀY   24/11\nTÊN :  CONNOR\nCODE:       3127\nĐÓN:  CATBA BUFFALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO 3127",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "bus",
"Số lượng khách": "1",
"Thông tin khách": "CONNOR",
"Giờ đón": "12:00 - 12:30",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "NINH BINH",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "EM  GỬI 4  PAX   CB - NB    CHUYẾN  12:30PM   NGÀY   24/11\nTÊN :  SADIE X 4 PAX\nCODE:     4458\nĐÓN:  CATBA BUFF\\ALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO 4458",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "",
"Số lượng khách": "4",
"Thông tin khách": "SADIE",
"Giờ đón": "12:00 - 12:30",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "NINH BINH",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "EM  GỬI 3  PAX   CB - NB    CHUYẾN  12:30PM   NGÀY   24/11\nTÊN :  Styim, Maurice, Sophie \nCODE:      3437\nĐÓN:  CATBA BUFF\\ALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO 3437",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "3",
"Thông tin khách": "Styim, Maurice, Sophie",
"Giờ đón": "12:20 - 12:40",
"Điểm đón": "Catba Buffalo Hostel",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "EM  GỬI 1  PAX   CB - NB    CHUYẾN  12:30PM   NGÀY   24/11\nTÊN :  ELLA\nCODE:      4262\nĐÓN:  CATBA BUFF\\ALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO 4262",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "ELLA",
"Giờ đón": "12:00 - 12:30",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "EM  GỬI 1  PAX   CB - NB    CHUYẾN  12:30PM   NGÀY   24/11\nTÊN :   gaia\nCODE:      4259\nĐÓN:  CATBA BUFF\\ALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO 4259",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "gaia",
"Giờ đón": "12:00 - 12:30",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "EM  GỬI  2   PAX   CB - NB    CHUYẾN  3:30PM   NGÀY   24/11\nTÊN :  marlene  x  2pax\nCODE:      4258\nĐÓN:  CATBA BUFFALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO 4258",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "Marlene",
"Giờ đón": "15:20 - 15:40",
"Điểm đón": "Catba Buffalo Hostel",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "EM  GỬI  1   PAX   CB - NB    CHUYẾN  8;15AM   NGÀY   24/11\nTÊN :   saoirse \nCODE:       4452\nĐÓN:  CATBA BUFFALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO 4452",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "saoirse",
"Giờ đón": "7:45 - 8:15",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "EM  GỬI  1   PAX   CB - NB    CHUYẾN  3;30PM   NGÀY   23/11\nTÊN :    Pablo\nCODE:       4139\nĐÓN:  CATBA BUFFALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO HOSTEL 4139",
"Mã booking": "TL231126",
"Ngày đi": "23/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "Pablo",
"Giờ đón": "15:00 - 15:30",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "Ninh Bình",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "ngày 25/11, bên e book 2 vé đi tour cúc phương , tên khách Murillo Gonzalez Marta ạ",
"fields": {
"Đại lý": "Hoang minh",
"Mã booking": "TL251126",
"Ngày đi": "25/11/2026",
"Lịch trình": "CÚC PHƯƠNG",
"Loại xe": "minivan",
"Số lượng khách": "2",
"Thông tin khách": "Murillo Gonzalez Marta",
"Giờ đón": "8:45 - 9:10",
"Điểm đón": "Hoang minh",
"Điểm trả": "Hoang minh",
"Giá dịch vụ": "",
"Ghi chú": "a/c vui lòng thanh toán bk khi kế toán gửi công nợ theo ngày"
}
},
{
"raw": "23/11, cho em book 2 vé từ home lên phố cổ (địa chỉ báo sau) chuyến 6:00pm đón tại home lúc 5:30pm\ntên khách: sofia gonzaga p104",
"fields": {
"Đại lý": "hoang minh",
"Mã booking": "TL231126",
"Ngày đi": "23/11/2026",
"Lịch trình": "NB - HN",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "sofia gonzaga p104",
"Giờ đón": "17:30 - 18:00",
"Điểm đón": "Hoang Minh Villa",
"Điểm trả": "phố cổ (địa chỉ báo sau)",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi / Đón tại home lúc 5:30pm, chuyến 6:00pm, địa chỉ trả phố cổ báo sau"
}
},
{
"raw": "Ngày 22/11, bên e book 2 vé bus home - Sapa, chuyến 22h30 ( loại xe 22 cabin ) \nTên khách Bhatnagar Dhruv, p 116 ạ",
"fields": {
"Đại lý": "Hoàng Minh",
"Mã booking": "TL221126",
"Ngày đi": "22/11/2026",
"Lịch trình": "Home - Sa Pa (chuyến 22h30)",
"Loại xe": "Cabin 22 phòng",
"Số lượng khách": "2",
"Thông tin khách": "Bhatnagar Dhruv (P.116",
"Giờ đón": "đi chuyến 10h30 đón về vp là lúc 7h pm",
"Điểm đón": "P.116 (về văn phòng Thế Long đợi xe)",
"Điểm trả": "Sa Pa",
"Giá dịch vụ": "1.040.000",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi. Xe đón 19:00  về văn phòng Thế Long đợi xe, chuyến 22h30."
}
},
{
"raw": "Code                    : VNEG24112026\nNgày đi                :  24/11/2026\nLịch trình             :   Ninh Binh -  mai châu\nLoại xe                 : MINIVAN \nSố lượng khách  : 2\nTên khách            Macias Iñigo\nthời gian đón        : 13:15-13:30\nĐiểm đón              :  Tam cốc pamela HSt\ntrả                         little Mai Chau Homestay",
"fields": {
"Đại lý": "VPL",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "NB - MC",
"Loại xe": "MINIVAN",
"Số lượng khách": "2",
"Thông tin khách": "Macias Iñigo",
"Giờ đón": "12:45 - 13:00",
"Điểm đón": "Tam cốc pamela HSt",
"Điểm trả": "little Mai Chau Homestay",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "AAVQ7948\nThứ 4 25 thg 11 2026 · Express 16\nRoute: Hoa Binh to Tam Coc  13:30\nđón :Mac Thanh Homestay\ntrả   Tam Coc Sunshine Hostel\nCác hành khách  3 × Adult\nTali Paz\nAdi Vaknin\nShani Bar\nSố điện thoại: +972528668762",
"fields": {
"Đại lý": "VPL",
"Mã booking": "TL251126",
"Ngày đi": "25/11/2026",
"Lịch trình": "MC - NB",
"Loại xe": "MINIVAN",
"Số lượng khách": "3",
"Thông tin khách": "Tali Paz – +972528668762",
"Giờ đón": "13:00 - 13:20",
"Điểm đón": "Mac Thanh Homestay",
"Điểm trả": "Tam Coc Sunshine Hostel",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "AAVQ7863\nCN 29 thg 11 2026 · Tourist AC\n\nRoute: Quang Ninh to Tam Coc [Tourist AC]  12:30\nđón  Ha Long Happy Travel Tuan Chau\ntrả Tam Coc Sunshine Hostel\nCác hành khách  2 × Adult\nDragos Neamtu\nMaria Sorana Pircalabu\nSố điện thoại: +40729061347",
"fields": {
"Đại lý": "VPL",
"Mã booking": "TL291126",
"Ngày đi": "29/11/2026",
"Lịch trình": "HL - NB",
"Loại xe": "BUS",
"Số lượng khách": "2",
"Thông tin khách": "Dragos Neamtu – +40729061347",
"Giờ đón": "11:45 - 12:10",
"Điểm đón": "Ha Long Happy Travel",
"Điểm trả": "Tam Coc Sunshine Hostel",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "Xác nhận đặt chỗ\nMã đặt chỗ: R4985\nNgày khởi hành: 25 tháng 11 năm 2026\nLịch trình: bus Ninh Bình - Cát Bà (đã bao gồm vé phà)\nLoại phương tiện: bus \nSố lượng hành khách: 1\nTên hành khách: Pasquale Scarano +39 340 735 3382\nThời gian đón: 6:40 - 7:00\nĐiểm đón: Tam Coc Sunseekers Homestay 2\nĐiểm trả: Cat Ba Love House\nnote : thu khách 250k",
"fields": {
"Đại lý": "VPL  R4985",
"Mã booking": "TL251126",
"Ngày đi": "25/11/2026",
"Lịch trình": "NB - CB",
"Loại xe": "bus",
"Số lượng khách": "1",
"Thông tin khách": "Pasquale Scarano – +39 340 735 3382",
"Giờ đón": "6:40 - 7:00",
"Điểm đón": "Tam Coc Sunseekers Homestay 2",
"Điểm trả": "Cat Ba Love House",
"Giá dịch vụ": "",
"Ghi chú": "thu khách 250k"
}
},
{
"raw": "#AAVQ4897\nThứ 4 25 thg 11 2026 · Tourist AC\n\nRoute: Tam Coc to Dao Cat Ba\n09:30\n4h 30m\n14:00\nTam Coc Sunshine Hostel\n243 Nui Ngoc\nCác hành khách\n1 × Adult\nLukas Raffael Gromes\nAdult\nSố điện thoại\n+4917676989924\nE-mail\nlukas.gromes@web.de",
"fields": {
"Đại lý": "vpl AAVQ4897",
"Mã booking": "TL251126",
"Ngày đi": "25/11/2026",
"Lịch trình": "NB - CB",
"Loại xe": "BUS",
"Số lượng khách": "1",
"Thông tin khách": "Lukas Raffael Gromes – +4917676989924",
"Giờ đón": "9:00 - 9:35",
"Điểm đón": "Tam Coc Sunshine Hostel",
"Điểm trả": "243 Nui Ngoc",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "EM  GỬI  1   PAX   CB - NB    CHUYẾN  12:30PM   NGÀY   21/11\nTÊN : ANTONIA\nCODE:   4439\nĐÓN:  CATBA BUFFALO HOSTE",
"fields": {
"Đại lý": "BUFFALO 4439",
"Mã booking": "TL211126",
"Ngày đi": "21/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "ANTONIA",
"Giờ đón": "12:20 - 12:40",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "EM  GỬI  1 PAX   CB - NB    CHUYẾN  3:30PM   NGÀY   20/11\nTÊN : DEEPTHI \nCODE:   3123\nĐÓN:  CATBA BUFFALO HOSTE",
"fields": {
"Đại lý": "BUFFALO 3123",
"Mã booking": "TL201126",
"Ngày đi": "20/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "",
"Số lượng khách": "1",
"Thông tin khách": "DEEPTHI",
"Giờ đón": "15:00 - 15:30",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "Còn một chỗ hôm nay Ninh Bình Cát Bà hai giờ không em?\nĐón a 1k luôn",
"fields": {
"Đại lý": "gmn",
"Mã booking": "TL221126",
"Ngày đi": "22/11/2026",
"Lịch trình": "NB - CB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "roos – +31625162864",
"Giờ đón": "13:30 - 14:00",
"Điểm đón": "the long",
"Điểm trả": "Cát Bà",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "Ngày 22/11 (hôm nay)\n- 3 khách\n- Tuyến: Cat Ba - Tam Coc\n- Chuyến: 15h30\n\n- Tên: Samuel \n- SDT: ‪‪‪‪‪+32485044414\n\n- Đón: 213 đường 1/4 - Full Moon Office",
"fields": {
"Đại lý": "Hoài cát bà",
"Mã booking": "TL221126",
"Ngày đi": "22/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "BUS",
"Số lượng khách": "3",
"Thông tin khách": "Samuel – +32485044414",
"Giờ đón": "15:15 - 15:45",
"Điểm đón": "213 đường 1/4 - Full Moon Office",
"Điểm trả": "Tam Cốc",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "#AAVN5914\nCN 22 thg 11 2026 · Tourist AC\n\nRoute: Cat Ba to Ninh Binh\n15:20\n4h 10m\n19:30\n243 Nui Ngoc\nThe Long Travel\nCác hành khách\n2 × Adult\nCác hành khách\nTên\tFare\tQuốc tịch\tTicket / seat\nSimon Rivolta\nSố điện thoại: +33651824601 · E-mail: srivolta@outlook.com\nAdult\n—\t—\nClara Ceniccola\nSố điện thoại: +33651824601 · E-mail: srivolta@outlook.com",
"fields": {
"Đại lý": "AAVN5914",
"Mã booking": "TL221126",
"Ngày đi": "22/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Tourist AC",
"Số lượng khách": "2",
"Thông tin khách": "Simon Rivolta, Clara Ceniccola – +33651824601",
"Giờ đón": "15:00 - 15:20",
"Điểm đón": "243 Nui Ngoc",
"Điểm trả": "The Long Travel",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "22/11 đón e 2k Amelia Fend 15h30 ở Ks cat ba island trả tràng an precious homestay",
"fields": {
"Đại lý": "Nb Ventures",
"Mã booking": "TL221126",
"Ngày đi": "22/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "Amelia Fend",
"Giờ đón": "15:00 - 15:30",
"Điểm đón": "Ks cat ba island",
"Điểm trả": "tràng an precious homestay",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "Ngày                    : 22/11/2026\nLoại xe                 : Limousine\nSL khách             : 1\nTên khách           : Đạt\nGiờ đón               : 13:00 \nĐón                      : Indochine\nTrả                        : Phố vọng",
"fields": {
"Đại lý": "indochine hotel",
"Mã booking": "TL221126",
"Ngày đi": "22/11/2026",
"Lịch trình": "",
"Loại xe": "Limousine",
"Số lượng khách": "1",
"Thông tin khách": "Đạt",
"Giờ đón": "13:00",
"Điểm đón": "Indochine",
"Điểm trả": "Phố vọng",
"Giá dịch vụ": "",
"Ghi chú": "phụ thu 30kđón"
}
},
{
"raw": "1 vé ngày đi 22/11 hạ long - ninh bình chuyến 11h30 đón tại cảng sun \nTrả Sparrow's Song Homestay - Đội 4, Thôn Hành Cung, Nam Hoa Lư, Ninh Bình\nTên: Naura Aboso Facon +590690804453",
"fields": {
"Đại lý": "64 TRẦN NHẬT DUẬT",
"Mã booking": "TL221126",
"Ngày đi": "22/11/2026",
"Lịch trình": "Hạ Long - Ninh Bình",
"Loại xe": "limo 11c",
"Số lượng khách": "1",
"Thông tin khách": "Naura Aboso Facon – +590690804453",
"Giờ đón": "11:30 - 12:00",
"Điểm đón": "Cảng Sun",
"Điểm trả": "Sparrow's Song Homestay - Đội 4, Thôn Hành Cung, Nam Hoa Lư, Ninh Bình",
"Giá dịch vụ": "350k",
"Ghi chú": "Thanh toán gửi unc để vào vé"
}
},
{
"raw": "Tên khách : David\nSDT: +34 625 96 34 66\nĐiểm đón : Văn Phòng\nĐiểm trả : Sunrise Ocean Hotel and Rooftop Bar",
"fields": {
"Đại lý": "Pu Luong Wandering",
"Mã booking": "TL221126",
"Ngày đi": "22/11/2026",
"Lịch trình": "Ninh Bình - Cát Bà",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "David – +34 625 96 34 66",
"Giờ đón": "13:00 - 13:30",
"Điểm đón": "Văn phòng The Long",
"Điểm trả": "Sunrise Ocean Hotel and Rooftop Bar",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "hdw báo 2k catba - ninh binh \nNgày 22/11 chuyến 12h30\nĐón: catba buffalo\nTên khách. Reese owen",
"fields": {
"Đại lý": "hideaway",
"Mã booking": "TL221126",
"Ngày đi": "22/11/2026",
"Lịch trình": "Cát Bà - Ninh Bình",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "Reese owen",
"Giờ đón": "12:30 -",
"Điểm đón": "Catba Buffalo",
"Điểm trả": "Ninh Bình",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "- Booking no.: HPT1022221126\n- Booker: Kaleb Wyatt | Contact: WA +1 (360) 454-3915\n- # of person: 2\n- Service: Halong Bay to Ninh Binh Transfer Shared Limousine 11 chỗ\n- Pick up date: Sunday, 22 November, 2026\n- Pick up time: from 12:00\n- Pick up place: Amour Cruise, Tuan Chau Marina, Lot 39A\n- Drop off place: Tam Coc boat station",
"fields": {
"Đại lý": "Hải phòng tour - thê long -HPT1022221126",
"Mã booking": "TL221126",
"Ngày đi": "22/11/2026",
"Lịch trình": "Hạ Long - Ninh Bình",
"Loại xe": "Limousine",
"Số lượng khách": "2",
"Thông tin khách": "Kaleb Wyatt – +1 (360) 454-3915",
"Giờ đón": "12:00 -",
"Điểm đón": "Amour Cruise, Tuan Chau Marina, Lot 39A",
"Điểm trả": "Tam Coc boat station",
"Giá dịch vụ": "350k pax",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "EM  GỬI 2  PAX   CB - NB    CHUYẾN  3:30PM   NGÀY   19/11\nTÊN :    TABEA + SEMEA\nCODE:        1448\nĐÓN:  CATBA BUFFALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO 1448",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "TABEA + SEMEA",
"Giờ đón": "15:00 - 15:30",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "Ninh Bình",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "Nay 19/11\nTam Cốc - Cát Bà\nChuyến 13:30\n2k Tên: Tuukka \nĐón : Văn Phòng Foot Print\nTrả: Cát Bà",
"fields": {
"Đại lý": "Nb FootPrint",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "NB - CB",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "Tuukka",
"Giờ đón": "13:00 - 13:30",
"Điểm đón": "Văn Phòng Foot Print",
"Điểm trả": "Cát Bà",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "19/11 don c 4k ten Sofia +393421795756 chuyen 14h tam coc di cb",
"fields": {
"Đại lý": "GMN",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "NB - CB",
"Loại xe": "Bus",
"Số lượng khách": "4",
"Thông tin khách": "Sofia – +393421795756",
"Giờ đón": "12:45 - 13:00",
"Điểm đón": "the long",
"Điểm trả": "Cát Bà",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "1 vé Catba- bus\nChuyến 1h30 chiều nay 19/11\nKhách: Kilian Hacker( g27)\nĐón tại home",
"fields": {
"Đại lý": "Forest Sunset",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "NB - CB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "Kilian Hacker (g27",
"Giờ đón": "13:00 - 13:30",
"Điểm đón": "Home",
"Điểm trả": "Cát Bà",
"Giá dịch vụ": "170k",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "19/11 : đón a 2 tour ghép Trang An - Hang Mua, tên Rua, R106",
"fields": {
"Đại lý": "Ngọc linh",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "Tour ghép Tràng An - Hang Múa",
"Loại xe": "minivan",
"Số lượng khách": "2",
"Thông tin khách": "Rua",
"Giờ đón": "11h30-11h50",
"Điểm đón": "Ngọc linh",
"Điểm trả": "Ngọc linh",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "AAVK1344\nThứ 5 19 thg 11 2026 · Express 16\n\nRoute: Tam Coc Pu Luong (minivan16 )  13:30\nđón  vp the long\ntrả   0km pu luong\nCác hành khách  2 × Adult\nLorenzo Stradi\nMaria victoria Fernandez\nSố điện thoại: +34686665271",
"fields": {
"Đại lý": "VPL AAVK1344",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "NB - PL",
"Loại xe": "Express 16",
"Số lượng khách": "2",
"Thông tin khách": "Lorenzo Stradi – +34686665271",
"Giờ đón": "13:00 - 13:30",
"Điểm đón": "vp the long",
"Điểm trả": "0km pu luong",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "EM  GỬI  1  PAX   CB - NB    CHUYẾN  12:30PM   NGÀY   19/11\nTÊN :  A VƯỢNG\nCODE:      3122\nĐÓN:  CATBA BUFFALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO HOSTEL  3122",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "A VƯỢNG",
"Giờ đón": "12:00 - 12:30",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "Ninh Bình",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "BK8112 - Rodrigo Guevara (+5218123400454)\nSố lượng: 2 khách\nBus NB-CB 7h00 ngày 19/11. Điểm đón: update - Bèo >> em báo điểm đón tại Catalina Hotel Tam Coc",
"fields": {
"Đại lý": "Beka Travel BK8112",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "NB - CB",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "Rodrigo Guevara – +5218123400454",
"Giờ đón": "9h-9h40",
"Điểm đón": "Catalina Hotel Tam Coc",
"Điểm trả": "Bèo",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "em GỬI 2 KHÁCH catba - ninh bình 19/11\nTÊN : Anton Riethmüller\nTIME: 8h am\nĐÓN: anh quan hotel",
"fields": {
"Đại lý": "Anh Quan Viewpoint Hotel",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "Anton Riethmüller",
"Giờ đón": "7:30 - 8:00",
"Điểm đón": "anh quan hotel",
"Điểm trả": "Ninh Bình",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "19/11:1k tour 4đ đón tam cốc westlake homestay \nName :Nathan +14166979580",
"fields": {
"Đại lý": "BESTPRICE",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "Tour Hoa Lư-Bái Đính-Tràng An_Hang Múa",
"Loại xe": "minivan",
"Số lượng khách": "1",
"Thông tin khách": "Nathan – +14166979580",
"Giờ đón": "8:00 - 8:30",
"Điểm đón": "tam cốc westlake homestay",
"Điểm trả": "tam cốc westlake homestay",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "A guiwr bk\n19/11/2026\tCB NB\t15h30\t6k\t Tourist Bus + Ferry\t\t\t\tJames Horton\t Cat Ba Waterside Hotel\t            BX Đồng Gừng",
"fields": {
"Đại lý": "DUC DUONG (4 BAT SU)",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Tourist Bus + Ferry",
"Số lượng khách": "2",
"Thông tin khách": "Nora Volnova",
"Giờ đón": "15:00 - 15:30",
"Điểm đón": "Cat Ba Waterside Hotel",
"Điểm trả": "BX Đồng Gừng",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "Cho a đặt 3ve Hanoi tam cốc \n14:10 xe đón anh\nĐón 37ly quốc sư \nVà trả khách center tam cốc Homestay",
"fields": {
"Đại lý": "Trường Thủy",
"Mã booking": "TL151126",
"Ngày đi": "15/11/2026",
"Lịch trình": "HN - NB",
"Loại xe": "LIMO",
"Số lượng khách": "3V",
"Thông tin khách": "Krim – +32 493 50 46 79",
"Giờ đón": "14:10",
"Điểm đón": "37 LÝ QUỐC SƯ",
"Điểm trả": "center tam cốc Homestay",
"Giá dịch vụ": "220K/PAX",
"Ghi chú": "a/c vui lòng thanh toán UNC luôn để bk có hiệu lực"
}
},
{
"raw": "Hôm nay 15/11\n2k Tam Coc - Cát Bà\nĐón: Quang Quang Garden Homestay\nTên: Sheetal\nTrả: Cát Bà Sky View Hotel\nChuyến 13:30",
"fields": {
"Đại lý": "chú ngọc",
"Mã booking": "TL151126",
"Ngày đi": "15/11/2026",
"Lịch trình": "nb cb",
"Loại xe": "bus",
"Số lượng khách": "2",
"Thông tin khách": "Sheetal",
"Giờ đón": "13h 13h15",
"Điểm đón": "Quang Quang Garden Homestay",
"Điểm trả": "Cát Bà Sky View Hotel",
"Giá dịch vụ": "",
"Ghi chú": "CN"
}
},
{
"raw": "Dạ cho e đặt 2  vé tour trang an - hang  nhé\nPhilip Dokter ạ",
"fields": {
"Đại lý": "Ánh hương homestay",
"Mã booking": "TL151126",
"Ngày đi": "15/11/2026",
"Lịch trình": "Tràng An - Hang Múa",
"Loại xe": "minivan",
"Số lượng khách": "2",
"Thông tin khách": "Philip Dokter",
"Giờ đón": "13:00 - 13:10",
"Điểm đón": "Ánh hương homestay",
"Điểm trả": "Ánh hương homestay",
"Giá dịch vụ": "650k/pax",
"Ghi chú": "a/c vui lòng thanh toán bk khi kế toán gửi công nợ theo ngày"
}
},
{
"raw": "15/11 don c 2k chiyen 14h taij ben tau tam coc ten Anais +33648297430. Di cb",
"fields": {
"Đại lý": "GMN",
"Mã booking": "TL151126",
"Ngày đi": "15/11/2026",
"Lịch trình": "nb cb",
"Loại xe": "bus",
"Số lượng khách": "2",
"Thông tin khách": "Anais – +33648297430",
"Giờ đón": "12:45 - 13:00",
"Điểm đón": "the long",
"Điểm trả": "cb",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "Booking ID:\n#AAVE6023\nHoa Binh to Tam Coc\nVehicle:\nExpress 16\nDuration:\n3h 30m\nDeparture station:\nMac Thanh Homestay\nDeparture at:\n15-11-2026 13:30\nArrival station:\nTam Coc Sunshine Hostel\nOlaf Schoenrock 2pax \n+491716956515",
"fields": {
"Đại lý": "VPL",
"Mã booking": "TL151126",
"Ngày đi": "15/11/2026",
"Lịch trình": "MC - NB",
"Loại xe": "MINIVAN",
"Số lượng khách": "2",
"Thông tin khách": "Olaf Schoenrock – +491716956515",
"Giờ đón": "13:00 - 13:20",
"Điểm đón": "Mac Thanh Homestay",
"Điểm trả": "Tam Coc Sunshine Hostel",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "A gửi bk\n15/11/2026\tCB NB\t15h30\t2k\t limousine \t\"Maiwenn Canu           \tCat Ba Waterside Hotel\t            Bx Đồng Gừng",
"fields": {
"Đại lý": "DUC DUONG (4 BAT SU)",
"Mã booking": "TL151126",
"Ngày đi": "15/11/2026",
"Lịch trình": "CATBA - NINH BINH",
"Loại xe": "limosin",
"Số lượng khách": "2",
"Thông tin khách": "Maiwenn Canu",
"Giờ đón": "15h30",
"Điểm đón": "Cat Ba Waterside Hotel",
"Điểm trả": "Bx Đồng Gừng",
"Giá dịch vụ": "",
"Ghi chú": "a/c vui lòng thanh toán bk khi kế toán gửi công nợ theo ngày"
}
},
{
"raw": "GYG2Q87Y8WNX Sharys Ivonn Varela Larrotta +971585624300\nSL: 1 khách \nBus NB-CB 7h00 ngày 21/11. đón  Bến thuyền tam cốc /bèo",
"fields": {
"Đại lý": "BEKA TRAVEL -GYG2Q87Y8WNX",
"Mã booking": "TL211126",
"Ngày đi": "21/11/2026",
"Lịch trình": "NB - CB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "Sharys Ivonn Varela Larrotta – +971585624300",
"Giờ đón": "6:30 - 7:00",
"Điểm đón": "Bến thuyền tam cốc /bèo",
"Điểm trả": "Cát Bà",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "BK8112 - Rodrigo Guevara (+5218123400454)\nSố lượng: 2 khách\nBus NB-CB 7h00 ngày 19/11. Điểm đón: update - Bèo >> em báo điểm đón tại Catalina Hotel Tam Coc",
"fields": {
"Đại lý": "Beka Travel BK8112",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "NB - CB",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "Rodrigo Guevara – +5218123400454",
"Giờ đón": "9h-9h40",
"Điểm đón": "Catalina Hotel Tam Coc",
"Điểm trả": "Bèo",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "BK08988 Alice Adiletta +393489060239\nSL: 3 khách \nBus CB-NB 12h30 ngày 19/11. đón bèo trả NB(check khách )",
"fields": {
"Đại lý": "BEKA TRAVEL BK08988",
"Mã booking": "TL191126",
"Ngày đi": "19/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "3",
"Thông tin khách": "Alice Adiletta – +393489060239",
"Giờ đón": "12:00 - 12:30",
"Điểm đón": "Bến Bèo",
"Điểm trả": "NB (check khách)",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "Tên khach:\nMichal Halama. Chilling honestay đặt 2 vé đi hạ long sáng mai 25/11 lúc",
"fields": {
"Đại lý": "Chilling Hst",
"Mã booking": "TL251126",
"Ngày đi": "25/11/2026",
"Lịch trình": "NB - HL",
"Loại xe": "bus",
"Số lượng khách": "2",
"Thông tin khách": "Michal Halama",
"Giờ đón": "6:40 - 7:00",
"Điểm đón": "Chilling homestay",
"Điểm trả": "HẠ LONG",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "26/11, 15h30, 2k\nRamona Reinelt\nEmail ramona-reinelt@gmx.de\nPhone +491707820732\nCB-NB bus thg ạ",
"fields": {
"Đại lý": "GMN",
"Mã booking": "TL261126",
"Ngày đi": "26/11/2026",
"Lịch trình": "CB-nb",
"Loại xe": "BUS",
"Số lượng khách": "2",
"Thông tin khách": "Ramona Reinelt",
"Giờ đón": "15:30",
"Điểm đón": "228 1/4",
"Điểm trả": "Bến xe Tam Cốc",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "EM  GỬI 4  PAX   CB - NB    CHUYẾN  12:30PM   NGÀY   24/11\nTÊN :  SADIE X 4 PAX\nCODE:     4458\nĐÓN:  CATBA BUFF\\ALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO 4458",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "",
"Số lượng khách": "4",
"Thông tin khách": "SADIE",
"Giờ đón": "12:00 - 12:30",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "NINH BINH",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "24/11: 1k tour 4 điểm bích động \nName: Finn đón tam cốc river view (+31622075113) thu tiền luôn 1 khách đấy",
"fields": {
"Đại lý": "bestprice",
"Mã booking": "TL241126",
"Ngày đi": "24.11.2026",
"Lịch trình": "tour 4đ bích động",
"Loại xe": "",
"Số lượng khách": "1",
"Thông tin khách": "Finn – +31622075113",
"Giờ đón": "8h 8h30",
"Điểm đón": "tam cốc river view",
"Điểm trả": "tam cốc river view",
"Giá dịch vụ": "",
"Ghi chú": "thu hộ 1tr1"
}
},
{
"raw": "EM GỬI 1 KHÁCH  CATBA - NINH BINH   CHUYẾN   12:00PM   NGÀY  24/11\nTÊN: TOMAS\nĐÓN:   FAMILY HOME\nCODE: 1136\nWS: +4915225946773",
"fields": {
"Đại lý": "FAMILY HOME 1136",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "TOMAS – +4915225946773",
"Giờ đón": "12:00 - 12:10",
"Điểm đón": "FAMILY HOME",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "EM GỬI 1 KHÁCH  CATBA - NINH BINH   CHUYẾN  8AM   NGÀY  25/11\nTÊN: LENKA \nĐÓN:   FAMILY HOME\nCODE: 1251\nWS: +420737357785",
"fields": {
"Đại lý": "FAMILY HOME 1251",
"Mã booking": "TL251126",
"Ngày đi": "25/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "bus",
"Số lượng khách": "1",
"Thông tin khách": "LENKA – +420737357785",
"Giờ đón": "7:30 - 8:00",
"Điểm đón": "FAMILY HOME",
"Điểm trả": "NINH BINH",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "- Tên khách:charpentier\n- Thời gian : 8am\n- Số điện thoại: \n- Địa điểm đón : Khách sạn Hương Cảng\n- Số Lượng: 2NL\n- Cát bà - Ninh Binh\n- Xe bus thường\n- Đi ngày:  24/11/2026\n+ Tổng =>",
"fields": {
"Đại lý": "Hương cảng",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "charpentier",
"Giờ đón": "8:00 - 8:10",
"Điểm đón": "Khách sạn Hương Cảng",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "EM GỬI 1 KHÁCH  CATBA - NINH BINH   CHUYẾN   8:00 AM   NGÀY  24/11\nTÊN: CHIARA\nĐÓN:  FAMILY HOME\nCODE: 1132\nWS: +393206336135",
"fields": {
"Đại lý": "FAMILY HOME 1132",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "Chiara – +393206336135",
"Giờ đón": "8:00 - 8:10",
"Điểm đón": "Family Home",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": "a/c vui lòng thanh toán bk khi kế toán gửi công nợ theo ngày"
}
},
{
"raw": "EM GỬI 2 KHÁCH  CATBA - NINH BINH   CHUYẾN   8:00 AM   NGÀY  24/11\nTÊN: JESS + JONAH\nĐÓN:  FAMILY HOME\nCODE: 1213\nWS: +61416332873",
"fields": {
"Đại lý": "FAMILY HOME 1213",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "JESS + JONAH – +61416332873",
"Giờ đón": "8:00 - 8:10",
"Điểm đón": "FAMILY HOME",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "24/11: đón e 3k 9h nb - cb limo\nLukas Quandt  1k\nDon:BamBoo Villa Homestay  \nTra: Cat ba Buffalo Hostel  84325978403\n\nJulian Kapp 2k\nDon: \n4917645968827\n\nNt hỏi điểm đón hẹn giờ giúp e nhé\nKhách hỏi sao đón muộn thì bảo đông giúp e nhez",
"fields": {
"Đại lý": "Quý Limo Cát Bà",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "NB - CB",
"Loại xe": "Limo",
"Số lượng khách": "3 (1+2)",
"Thông tin khách": "Lukas Quandt / Julian Kapp – +84325978403 / +4917645968827",
"Giờ đón": "9:00 - 9:35",
"Điểm đón": "BamBoo Villa Homestay / Báo Sau (Julian Kapp)",
"Điểm trả": "Cat ba Buffalo Hostel",
"Giá dịch vụ": "",
"Ghi chú": "a/c vui lòng thanh toán bk khi kế toán gửi công nợ theo ngày"
}
},
{
"raw": "Xe limousine khởi hành\nNgày: 24 tháng 11\nThời gian đón: +-7 giờ sáng\nTên: Sylvie\nSố điện thoại:‪‬‬‪‬‪+33 7 70 49 34 06‬\nSố người: 2\nĐịa điểm đón: Pu Luong Roots Homestay\nĐịa điểm trả: The Green House Homestay Ta Coc",
"fields": {
"Đại lý": "Pù Luông Roots",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "PL - NB",
"Loại xe": "Limo",
"Số lượng khách": "2",
"Thông tin khách": "Sylvie – +33770493406",
"Giờ đón": "7:00 - 7:30",
"Điểm đón": "Pu Luong Roots Homestay",
"Điểm trả": "The Green House Homestay Tam Coc",
"Giá dịch vụ": "",
"Ghi chú": "a/c vui lòng thanh toán bk khi kế toán gửi công nợ theo ngày"
}
},
{
"raw": "Ngày 24/11 \nHạ Long - Tam Cốc \nđón 12:00 \n2k Tên : Dioni \n+33 6 71 63 46 03\nĐón :  lô 27b Tuần Châu, Tàu Aqua Of The Sea\nTrả : Báo sau",
"fields": {
"Đại lý": "anh sơn",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "HL - NB",
"Loại xe": "limosine",
"Số lượng khách": "2",
"Thông tin khách": "Dioni – +33 6 71 63 46 03",
"Giờ đón": "11:45 - 12:15",
"Điểm đón": "lô 27b Tuần Châu, Tàu Aqua Of The Sea",
"Điểm trả": "bến thuyền tam cốc",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "Mai 24/11: a hùng HT homestay gửi 1k Cát Bà -Ninh Bình chuyến 4pm đón k tại 218 hà sen HT homestay nhé!",
"fields": {
"Đại lý": "HUNG HOMESTAY CÁT BÀ 0988304569",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "Bus",
"Số lượng khách": "1",
"Thông tin khách": "fernandez alfonso",
"Giờ đón": "15:00 - 15:30",
"Điểm đón": "218 hà sen HT homestay",
"Điểm trả": "Ninh Bình",
"Giá dịch vụ": "",
"Ghi chú": "Thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "#AAVP7910\nTue 24 Nov 2026 · Tourist AC\nRoute: Quang Ninh to Tam Coc [Tourist AC]\n12:30pm\nđón Ha Long Happy Travel Tuan Chau\ntrả Tam Coc Sunshine Hostel\nPassengers\n2 × Adult\nEmma Jones\nPhone: +447794595741",
"fields": {
"Đại lý": "VPL AAVP7910",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "HL - NB",
"Loại xe": "Bus",
"Số lượng khách": "2",
"Thông tin khách": "Emma Jones – +447794595741",
"Giờ đón": "11:45 - 12:10",
"Điểm đón": "Ha Long Happy Travel Tuan Chau",
"Điểm trả": "Tam Coc Sunshine Hostel",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "24/11 cho chị 2 vé Hạ Long- Ninh Bình, đón Lô 28A Tuần Châu, tên khách Valentica , số ‪+39 333 455 5772‬ Lúc 12h nhé em",
"fields": {
"Đại lý": "45 Ngõ Huyện",
"Mã booking": "TL241126",
"Ngày đi": "24/11/2026",
"Lịch trình": "Hạ Long-Ninh bình",
"Loại xe": "bus",
"Số lượng khách": "2",
"Thông tin khách": "Valentica – +39 333 455 5772",
"Giờ đón": "11:45 - 12:10",
"Điểm đón": "Lô 28A Tuần Châu",
"Điểm trả": "THE LONG",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "Code này ngày 11/11 đổi điểm đón giúp em nhé team\nBooking ID: 261018LHT1\nGuests' name: Natasja Megens\nNo of pax: 01\n\n11th Nov 2026 - Limousine bus  Ha Long - Tam Coc at 12:00\nPick up: Rosy Cruise - Tuan Chau Harbor\nDrop off: Nan House\n\n13th Nov 2026 - Limousine bus Tam Coc - Hanoi at 12:30\nPick up: Nan House\nDrop off: Eliana Premio Hotel & Spa",
"fields": {
"Đại lý": "Get Up And Go Vietnam  261018LHT1",
"Mã booking": "TL111126",
"Ngày đi": "11/11/2026",
"Lịch trình": "Ha Long - Tam Coc",
"Loại xe": "Limousine 11 c",
"Số lượng khách": "1",
"Thông tin khách": "Natasja Megens",
"Giờ đón": "12h",
"Điểm đón": "Rosy Cruise - Tuan Chau Harbor",
"Điểm trả": "Nan House",
"Giá dịch vụ": "350k/pax",
"Ghi chú": "thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "@Thế Long Travel em gửi 2k Cb-NB  trưa nay 12/11, đón bến Bèo\nHD Toàn 0353108515 giao khách\n2k\tNina Böttcher +4915236817516=> trả NB hỏi giúp e điểm trả ạ",
"fields": {
"Đại lý": "sunlight",
"Mã booking": "TL121126",
"Ngày đi": "12/11/2026",
"Lịch trình": "cb nb",
"Loại xe": "bus",
"Số lượng khách": "2",
"Thông tin khách": "Nina Böttcher – +4915236817516",
"Giờ đón": "12h-12h15",
"Điểm đón": "bến Bèo - HD Toàn 0353108515",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": "CN"
}
},
{
"raw": "Trưa mai 12/11, em gửi 3 bus HL - NB. Đón Lô 27 Cảng Tuần Châu\nHD Hồng  0368835756 giao khách\n1k\tJoan den Otter +31639664045  \n1k\tJaden Farrugia +61490817696\n1k\tRushil Bhavinchandra Purohit +447985658807",
"fields": {
"Đại lý": "Sunlight",
"Mã booking": "TL121126",
"Ngày đi": "12/11/2026",
"Lịch trình": "HL - NB",
"Loại xe": "bus",
"Số lượng khách": "3",
"Thông tin khách": "Joan den Otter – +31639664045",
"Giờ đón": "11:45-12:20",
"Điểm đón": "Lô 27 Cảng Tuần Châu",
"Điểm trả": "THE LONG",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "@Thế Long Travel em gửi 2k Cb-NB  trưa nay 12/11, đón bến Bèo\nHD Toàn 0353108515 giao khách\n2k\tNina Böttcher +4915236817516=> trả NB hỏi giúp e điểm trả ạ",
"fields": {
"Đại lý": "sunlight",
"Mã booking": "TL121126",
"Ngày đi": "12/11/2026",
"Lịch trình": "cb nb",
"Loại xe": "bus",
"Số lượng khách": "2",
"Thông tin khách": "Nina Böttcher – +4915236817516",
"Giờ đón": "12h-12h15",
"Điểm đón": "bến Bèo - HD Toàn 0353108515",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": "CN"
}
},
{
"raw": "12/11/2026 Cat Ba - NB 15:30  1 Bus12GO34263374 \"Ori Harush\n+972586120404\" TL 243 Núi Ngọc Dong Gung Bus Station",
"fields": {
"Đại lý": "chú ngọc",
"Mã booking": "TL121126",
"Ngày đi": "12/11/2026",
"Lịch trình": "cb nb",
"Loại xe": "bus",
"Số lượng khách": "1",
"Thông tin khách": "Ori Harush – +972586120404",
"Giờ đón": "15h30",
"Điểm đón": "243 Núi Ngọc",
"Điểm trả": "bx đồng gừng",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "11/11 đón c 1k ten Jules +33750701938 chuyen 14h tại bến tàu tcoc đi cb",
"fields": {
"Đại lý": "GMN",
"Mã booking": "TL111126",
"Ngày đi": "11/11/2026",
"Lịch trình": "NB- CÁT BÀ",
"Loại xe": "bus",
"Số lượng khách": "1",
"Thông tin khách": "Jules – +33750701938",
"Giờ đón": "13:15",
"Điểm đón": "THE LONG",
"Điểm trả": "CÁT BÀ",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "EM  GỬI  1  PAX   CB - NB    CHUYẾN  3:30PM   NGÀY   11/11\nTÊN :  YANNICK \nCODE:  4375\nĐÓN:  CATBA BUFFALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO4375",
"Mã booking": "TL111126",
"Ngày đi": "11/11/2026",
"Lịch trình": "CB - NB",
"Loại xe": "bus",
"Số lượng khách": "1",
"Thông tin khách": "YANNICK",
"Giờ đón": "15:10 - 15:20",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "THE LONG",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "11/11: 15.20pm Sinclair - +44 7948 447304 drop in Hà Nội là Mejor hotel 22 tạ hiền - 2 limousine- please coònirm\nVào sổ nhé",
"fields": {
"Đại lý": "Tam Cốc Holiday",
"Mã booking": "TL111126",
"Ngày đi": "11/11/2026",
"Lịch trình": "nb - hn",
"Loại xe": "LIMO",
"Số lượng khách": "2",
"Thông tin khách": "Sinclair – +44 7948 447304",
"Giờ đón": "15:20",
"Điểm đón": "garden Đoan",
"Điểm trả": "22 tạ hiền",
"Giá dịch vụ": "",
"Ghi chú": ""
}
},
{
"raw": "Cho em 2 ghế lúc 10h sáng mai 11/11 như sau: \nTên khách: Andy Phua\nSĐT: +65 96934875\nĐón: Rạp Xiếc Trung Ương lúc 9h10\nTrả: TRANG AN LUXURY HOMESTAY, Tràng An, Tây Hoa Lư, Ninh Bình, Việt Nam",
"fields": {
"Đại lý": "23 Thông Phong",
"Mã booking": "TL111126",
"Ngày đi": "11/11/2026",
"Lịch trình": "hn nb",
"Loại xe": "limo",
"Số lượng khách": "2",
"Thông tin khách": "Andy Phua – +65 96934875",
"Giờ đón": "9h10",
"Điểm đón": "Rạp Xiếc Trung Ương",
"Điểm trả": "TRANG AN LUXURY HOMESTAY",
"Giá dịch vụ": "440k",
"Ghi chú": "ck gửi unc"
}
},
{
"raw": "1 tour/ 11-11/ HL- HM- TA- BĐ\n👉🧑‍🏭: Julian\n👉☎️: +49 178 5318609",
"fields": {
"Đại lý": "TƯỜNG VI - homestay",
"Mã booking": "TL111126",
"Ngày đi": "11/11/2026",
"Lịch trình": "hoa lu- bai dinh -trang an - hang mua",
"Loại xe": "minivan",
"Số lượng khách": "1",
"Thông tin khách": "Julian – +49 178 5318609",
"Giờ đón": "8h-8h30",
"Điểm đón": "TƯỜNG VI - homestay",
"Điểm trả": "TƯỜNG VI - homestay",
"Giá dịch vụ": "",
"Ghi chú": "thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "EM  GỬI  2  PAX   CB - NB    CHUYẾN  8:30AM   NGÀY   11/11\nTÊN :  CELINE,  JAN\nCODE:  3074\nĐÓN:  CATBA BUFFALO HOSTEL",
"fields": {
"Đại lý": "BUFFALO HOSTEL 3074",
"Mã booking": "TL111126",
"Ngày đi": "11/11/2026",
"Lịch trình": "cb-nb",
"Loại xe": "bus",
"Số lượng khách": "2",
"Thông tin khách": "CELINE, JAN",
"Giờ đón": "8h-8h30",
"Điểm đón": "CATBA BUFFALO HOSTEL",
"Điểm trả": "tam coc",
"Giá dịch vụ": "",
"Ghi chú": "thanh toán khi kế toán gửi công nợ ngày theo dõi"
}
},
{
"raw": "C gửi bk 11/11:\n2 k tam cốc- cát bà at 7:00am\nTên khách: Barton Zirbu\nĐiểm đón: tam cốc catalina hst\nĐiểm trả: báo sau\nSdt khách: + 48513158285",
"fields": {
"Đại lý": "tam coc tour",
"Mã booking": "TL111126",
"Ngày đi": "11/11/2026",
"Lịch trình": "nb-cb",
"Loại xe": "bus",
"Số lượng khách": "2",
"Thông tin khách": "barton zirbu – +48513158285",
"Giờ đón": "6:30-7h",
"Điểm đón": "tam coc catalina hst",
"Điểm trả": "Cát Bà (điểm cụ thể báo sau)",
"Giá dịch vụ": "170k/pax",
"Ghi chú": "thanh toán khi kế toán gửi công nợ"
}
},
{
"raw": "Đặt xe Limo Hanoi - Ninh Bình ngày 09/11 chuyến 14:10PM. Code:L2018\nTheo như trao đổi qua điện thoại, vui lòng xác nhận thông tin đặt tour như sau:\nName: Jamang Sushila\nContact number: +81 809 647 5175 \nNationality: Nepal\nNumber of pax: 02 pax \nDeparture date: 14PM - 14:10PM \nPick up point: 47B Lý Quốc Sư\nDrop off point:  Tam Cốc",
"fields": {
"Đại lý": "37 Hàng Mành",
"Mã booking": "TL091126",
"Ngày đi": "09/11/2026",
"Lịch trình": "hn-NB",
"Loại xe": "limosine",
"Số lượng khách": "2",
"Thông tin khách": "Jamang Sushila – +81 809 647 5175",
"Giờ đón": "14:10",
"Điểm đón": "47B Lý Quốc Sư",
"Điểm trả": "Tam Cốc",
"Giá dịch vụ": "",
"Ghi chú": "gửi unc trước khi khách đi để booking co hiệu lực stk nhận tiền 5285678386 techcombank"
}
},
{
"raw": "Hi team, Chị đặt booking 1 khách đi xe 1 chiều ( Ha Noi -Ninh Binh )  ngày 09/11 chuyến 11:00 am\n- Tên khách: Fardin Shaik  ( +918280040806 )\n- Số lượng: 1 người lớn/ ĐÓN : 45-47n  Hàng Bông ( k.san HN Wanderlust Hotel )",
"fields": {
"Đại lý": "Asia local Tours",
"Mã booking": "TL091126",
"Ngày đi": "09/11/2026",
"Lịch trình": "hn nb",
"Loại xe": "limo",
"Số lượng khách": "1",
"Thông tin khách": "Fardin Shaik – +918280040806",
"Giờ đón": "11h",
"Điểm đón": "45-47n  Hàng Bông ( k.san HN Wanderlust Hotel )",
"Điểm trả": "the long",
"Giá dịch vụ": "",
"Ghi chú": "gửi unc trước khi khách đi để booking có hiệu lực - stk nhận tiền 5285678386 techcombank PHAM HOANG PHUC"
}
},
{
"raw": "AAUY9966\nTuyến đường:  Pu Luong to Ninh Binh\nPhương tiện giao thông: Express 16\nĐiểm khởi hành:  OH Pu Luong Homestay\nKhởi hành tại:  14-11-2026    07:15\nĐiểm đến: Trang An Luxury Homestay\nThông tin hành khách (2pax)\nAdult:\nMathilde Grandon\nEnzo Della Pietra\nPhone:\n+33772046246",
"fields": {
"Đại lý": "AAUY9966",
"Mã booking": "TL141126",
"Ngày đi": "14/11/2026",
"Lịch trình": "PL NB",
"Loại xe": "16C",
"Số lượng khách": "2",
"Thông tin khách": "Mathilde Grandon – +33772046246",
"Giờ đón": "6H50 7H10",
"Điểm đón": "OH Pu Luong Homestay",
"Điểm trả": "Trang An Luxury Homestay",
"Giá dịch vụ": "",
"Ghi chú": ""
}
}
];
if (typeof module !== "undefined") module.exports = DATASET_EXAMPLES;
if (typeof window !== "undefined") window.DATASET_EXAMPLES = DATASET_EXAMPLES;
