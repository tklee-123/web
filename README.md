#Tạo cơ sở dữ liệu và check api:
Sau khi clone code về máy, chạy npm install bla bla
- Chạy file create.js trong algorithms: node create.js
- Sau khi có cơ sở dữ liệu trong máy, test các api (trong postman nha mấy con đỗn):
1. Chạy thuật toán matching
- GET : http://localhost:8000/runcode
- sau khi chạy thì check xem trong database đã có collection internship_results chưa
2. Báo cáo hàng tuần
- Mô tả: thêm báo cáo hàng tuần cho sinh viên nếu id valid, báo cáo thêm vào sẽ được add thêm vào array báo cáo đã có, ví dụ như id 21002100 trong array reports đang có báo cáo của tuần 1,2,3 thêm 1 báo cáo nữa thì array đó sẽ thành 4 phần tử
- POST: http://localhost:8000/report
- request body example:
  {
    "_id": "21002100",  
    "report": {
        "time": "2023-01-01T09:00:00.000Z",  
        "work": "Completed project tasks", 
        "progress": "80%" 
    }

}

3. Tin tuyển dụng: 
- Mô tả: thêm tin tuyển dụng, id của news sẽ cho tăng dần, ví dụ trong collection đang là id news18 rồi thì tin tiếp theo được thêm vào sẽ có id là news19
- POST : http://localhost:8000/add_news
- request body example:
  {
    "businessId": "B1", 
    "title": "Tuyển Nhân Viên Bán Hàng Tiktok Shop",
    "startTime": "2023-01-01T08:00:00", 
    "endTime": "2023-12-31T17:00:00", 
    "describe": "Bán hàng qua kênh Tiktok shop và chỉnh sửa video bằng Capcut",
    "requirement": "Không yêu cầu kinh nghiệm, Tiếng Anh cơ bản đến khá, Nhanh nhẹn và chăm chỉ, Biết xem Tiktok và chỉnh sửa Capcut là một lợi thế",
    "profit": "Lương cứng từ 3.500.000 - 5.000.000 VND + % hoa hồng theo KPI",
    "address": "52A TT2 KĐT mới Văn Phú - Phú La - Hà Đông - Hà Nội, Hà Đông"
}

4. Final report
- POST: http://localhost:8000/final_report
- request body example:
  {
    "_id": 21002101,
    "project": "Web",
    "result": 9.0

}

5. Kết quả thực tập
- Mô tả: add kết quả thực tập cho mấy đứa thực tập ngoài, chỉ cần nhập id, tên vị trí và tên doanh nghiệp mấy thuộc tính khác tự động được thêm nếu id valid
- POST: http://localhost:8000/result
- request body example:
  {
    "id": "21002103", 
    "position": "Software Engineer",  
    "business": "TechCompany" 
}
- check trong database xem mấy cái thêm vào trong internship_results đấy có tự động thêm name, birthday,... hay chưa nha
