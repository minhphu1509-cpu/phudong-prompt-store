# AI Architecture Studio

Không gian làm việc AI dành cho kiến trúc sư và nhà thiết kế Việt Nam: tạo phối cảnh từ mô hình, phân tích ảnh, tạo prompt và khám phá thư viện chuyên ngành.

## Tính năng

- Duyệt, tìm kiếm, lọc và lưu prompt yêu thích.
- Thư viện 200 prompt chuyên ngành, chia đều cho kiến trúc ngoại thất, nội thất, cảnh quan và quy hoạch đô thị.
- Bao phủ 200 loại hình không gian/công trình và 50 phong cách thiết kế từ bản địa, di sản đến hiện đại, sinh thái và tương lai.
- Bổ sung 32 prompt truyền thông thị giác: 16 đồ họa thông tin và 16 sản phẩm–marketing.
- Tùy biến biến số trong prompt và sao chép nhanh.
- Tải ảnh JPG, PNG hoặc WebP để phân tích không gian, vật liệu, góc máy và ánh sáng.
- Tạo prompt tiếng Việt, tiếng Anh, negative prompt và thiết lập hình ảnh gợi ý.
- BYOK: người dùng nhập khóa API OpenAI, Google Gemini hoặc Anthropic Claude của riêng họ.
- Tự động xoay tua và chuyển sang nhà cung cấp tiếp theo khi một mô hình không phản hồi.
- Render Studio chuyển sketch, clay render và screenshot SketchUp/Revit/3ds Max/Rhino thành phối cảnh thực tế bằng OpenAI GPT Image hoặc Google Gemini.
- Hai nhóm công cụ được tách thành tab “Tạo ảnh phối cảnh” và “Tạo prompt từ ảnh”, đồng thời giữ trạng thái khi chuyển tab.
- Bộ cấu hình render gồm 4 chuyên ngành, 120 phong cách, 40 loại công trình, 40 bối cảnh, 20 kịch bản ánh sáng và 20 góc camera; mọi nhóm đều có lựa chọn tiêu chuẩn.

## Quyền riêng tư của API key

API key chỉ được lưu trong `sessionStorage` của tab hiện tại. Khóa được gửi tạm thời tới Vercel Function để gọi nhà cung cấp đã chọn, không được ghi vào GitHub, biến môi trường, cơ sở dữ liệu hay `localStorage`. Đóng tab sẽ xóa cấu hình phiên.

## Chạy cục bộ

```bash
npm install
npm run dev
```

Lệnh kiểm tra bản production:

```bash
npm run build
```

Tạo lại bộ thư viện kiến trúc theo cấu hình nguồn:

```bash
npm run generate:architecture-library
npm run generate:visual-communication-library
```

API phân tích ảnh nằm tại `api/analyze-image.ts`; API tạo phối cảnh nằm tại `api/generate-render.ts`. Cả hai được Vercel triển khai tự động cùng ứng dụng Vite.

## Nguồn cảm hứng

Giao diện và hướng sản phẩm được phát triển từ ý tưởng thư viện [Awesome GPT Image 2 Prompts](https://github.com/YouMind-OpenLab/awesome-gpt-image-2). Nội dung prompt trong ứng dụng là bộ nội dung riêng của AI Architecture Studio.

## Giấy phép

MIT — xem `LICENSE`.
