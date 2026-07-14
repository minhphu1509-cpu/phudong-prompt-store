# PhuDong Prompt Store

Website thư viện prompt AI được xây dựng bằng React, TypeScript và Vite. Dữ liệu được
trích xuất tự động từ `README_vi-VN.md` của repository nguồn.

## Chạy trên máy

```bash
npm install
npm run dev
```

Mở `http://localhost:4173`.

## Kiểm tra bản production

```bash
npm run build
npm run preview
```

## Cập nhật dữ liệu

Sau khi cập nhật `README_vi-VN.md`, chạy `npm run generate:data`. Script cũng được
chạy tự động trước `dev` và `build`.

## Tính năng

- Tìm kiếm toàn văn, hỗ trợ tiếng Việt không dấu.
- Lọc theo danh mục và sắp xếp prompt.
- Lưu yêu thích bằng `localStorage`.
- Sao chép prompt một chạm.
- Nhận diện và thay thế biến `{argument ...}` trực tiếp.
- Modal chi tiết, nguồn và tác giả.
- Responsive cho desktop, tablet và điện thoại.

Xem [NOTICE.md](./NOTICE.md) để biết thông tin nguồn và giấy phép.
