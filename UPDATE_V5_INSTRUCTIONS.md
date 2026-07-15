# AI Architecture Studio — Update v5

Gói này chứa các tệp phải ghi đè đúng đường dẫn ở thư mục gốc repository.

Sau khi cập nhật thành công, mã nguồn phải có:

- `src/App.tsx`: hiển thị **500 prompt tuyển chọn**.
- `src/data/additional-prompts.ts`: có `newArchitecturePrompts` và `newInteriorPrompts`.
- `public/images/welcome-architecture.webp`: ảnh chào mừng WebP khoảng 172 KB.
- `api/analyze-image.ts`: có `FALLBACK_MODELS` và phân loại lỗi quota.

Không upload nguyên tệp ZIP vào repository. Hãy giải nén trước, sau đó chép các thư mục `src`, `api`, `public` vào thư mục gốc repository và đồng ý ghi đè tệp cũ.

Kiểm tra sau deploy:

1. Màn hình chào mừng phải hiển thị toàn bộ ảnh biệt thự.
2. Nội dung phải ghi “500 prompt chuyên sâu” và “500 prompt tuyển chọn”.
3. Tìm kiếm thư viện phải có prompt số 301–500.
