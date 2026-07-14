import type { PromptItem } from '../types'

const architecture = [
  'Biệt thự hiện đại nhiệt đới','Nhà phố trên lô đất hẹp','Biệt thự tân cổ điển tiết chế',
  'Resort ven biển đương đại','Khách sạn đô thị ban đêm','Quán cà phê sân vườn',
  'Trường học xanh thân thiện','Cao ốc văn phòng mặt dựng kính','Trung tâm thương mại sôi động',
  'Trung tâm văn hóa bản địa','Nhà vườn Bắc Bộ đương đại','Homestay trên triền dốc Đà Lạt',
  'Nhà hàng ven sông','Trung tâm thể thao cộng đồng','Bảo tàng tối giản đơn khối',
  'Nhà máy công nghiệp hiện đại','Công trình tâm linh Việt Nam','Thư viện cộng đồng mở',
  'Chung cư xanh nhiều ban công','Quảng trường đô thị đa chức năng','Trạm nghỉ đường cao tốc',
  'Cải tạo nhà cũ thích ứng','Flycam khu phức hợp',
]

const interiors = [
  'Phòng khách Đông Dương đương đại','Bếp tối giản có đảo','Phòng ngủ khách sạn cao cấp',
  'Phòng tắm phong cách spa','Văn phòng mở linh hoạt','Sảnh khách sạn sang trọng',
  'Nhà hàng fine dining','Quán cà phê diện tích nhỏ','Showroom nội thất cao cấp',
  'Căn hộ studio thông minh','Phòng trẻ em trung tính','Thư viện tại gia',
  'Phòng họp lãnh đạo','Phòng trị liệu spa','Cửa hàng thời trang tối giản',
  'Phòng thờ hiện đại trang nghiêm','Bếp nhà hàng chuyên nghiệp','Không gian co-working sáng tạo',
  'Phòng gym hiện đại','Phòng trưng bày nghệ thuật','Phòng khách nhỏ thoáng sáng',
  'Phòng thay đồ walk-in','Vườn trong nhà và giếng trời',
]

const edits = [
  {
    title: 'Thay vật liệu chính xác theo vùng tô',
    description: 'Đổi vật liệu chỉ trong vùng mask và giữ toàn bộ phần còn lại.',
    prompt: 'Chỉnh sửa ảnh nguồn chỉ trong vùng màu {argument name="màu mask" default="đỏ"}: thay bằng vật liệu từ ảnh tham chiếu. Bám đúng phối cảnh, tỷ lệ viên, hướng lát, mạch ron, ánh sáng và phản xạ hiện hữu. Không thay geometry, camera, vật thể hay vùng ngoài mask; kết quả photorealistic, không watermark.',
  },
  {
    title: 'Xóa vật thể và phục hồi nền',
    description: 'Loại bỏ vật thể không mong muốn và tái tạo nền tự nhiên.',
    prompt: 'Xóa {argument name="vật thể" default="vật thể được đánh dấu"} khỏi ảnh nguồn. Phục hồi nền dựa trên đường nét, vật liệu, bóng đổ và phối cảnh lân cận; không thay vùng khác, không crop, không đổi camera hoặc ánh sáng. Kết quả sạch, liền mạch và chân thực.',
  },
  {
    title: 'Thay bầu trời đồng bộ ánh sáng',
    description: 'Đổi thời tiết và cân bằng ánh sáng hợp lý.',
    prompt: 'Thay bầu trời ảnh nguồn thành {argument name="bầu trời" default="trời xanh có mây nhẹ"}. Giữ nguyên kiến trúc và cảnh quan; đồng bộ nhiệt màu, bóng đổ, phản xạ kính và độ ẩm không khí. Không làm biến dạng đường biên mái, không HDR quá mức.',
  },
  {
    title: 'Ghép đồ vật từ ảnh tham chiếu',
    description: 'Chèn đồ vật đúng mẫu, tỷ lệ và phối cảnh.',
    prompt: 'Chèn vật thể từ ảnh tham chiếu vào vùng được chỉ định. Giữ chính xác hình dáng, màu và vật liệu của mẫu; khớp tỷ lệ, điểm tụ, tiêu cự, hướng sáng, bóng tiếp xúc và độ nét. Không sửa kiến trúc hoặc đồ vật khác, không tạo thêm biến thể.',
  },
  {
    title: 'Chuyển cảnh ban ngày sang blue hour',
    description: 'Biến đổi thời điểm nhưng giữ nguyên thiết kế.',
    prompt: 'Chuyển ảnh kiến trúc ban ngày sang blue hour. Giữ tuyệt đối hình khối, vật liệu, cây, người, xe và camera; tạo bầu trời xanh sâu, bật đèn nội thất có chọn lọc 3000K, đèn cảnh quan nhẹ và phản xạ hợp lý. Không thêm cửa hay nguồn sáng phi logic.',
  },
  {
    title: 'Nâng cấp phác thảo thành ảnh thực tế',
    description: 'Chuyển sketch hoặc screenshot 3D thành ảnh chân thực.',
    prompt: 'Chuyển ảnh phác thảo hoặc screenshot 3D thành ảnh kiến trúc photorealistic. Khóa hình khối, số tầng, tỷ lệ, hệ cửa, nội thất chính, địa hình và camera; xóa nét line nhưng giữ cạnh kiến trúc. Áp vật liệu {argument name="phong cách" default="hiện đại tối giản"}, ánh sáng tự nhiên và bối cảnh phù hợp, không redesign.',
  },
]

const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const base = (title: string, number: number, category: string, description: string, prompt: string): PromptItem => ({
  id: `studio-${slugify(title)}-${number}`, number, title, rawTitle: title, category, description, prompt,
  images: [], author: { name: 'PhuDong AI Studio', url: '' }, source: null,
  published: '14 tháng 7, 2026', language: 'vi', tryLink: '', featured: false, raycastFriendly: true,
})

const architecturePrompts = architecture.map((title, index) => base(
  title, 249 + index, 'Kiến trúc — Ngoại thất',
  `Tạo phối cảnh ${title.toLowerCase()} chân thực và bảo toàn thiết kế nguồn.`,
  `Chuyển ảnh nguồn thành phối cảnh ${title.toLowerCase()} chuyên nghiệp. Giữ nguyên tuyệt đối hình khối, số tầng, tỷ lệ mặt đứng, kết cấu, hệ cửa, mái, địa hình và góc camera. Hoàn thiện vật liệu PBR đúng tỷ lệ, bối cảnh {argument name="bối cảnh" default="Việt Nam hiện đại"}, ánh sáng {argument name="ánh sáng" default="ban ngày dịu"}, cây xanh và hoạt động vừa phải. Ống kính 28mm, đường đứng thẳng, photorealistic architectural photography, 16:9, không redesign, không đảo gương, không thêm tầng, không logo giả, không watermark.`,
))

const interiorPrompts = interiors.map((title, index) => base(
  title, 272 + index, 'Nội thất',
  `Diễn họa ${title.toLowerCase()} với vật liệu và ánh sáng chân thực.`,
  `Render ${title.toLowerCase()} từ ảnh hoặc mô hình nguồn. Khóa tường, trần, sàn, cửa, tỷ lệ, đồ nội thất chính và camera; không di chuyển công năng. Hoàn thiện vật liệu {argument name="vật liệu chủ đạo" default="gỗ tự nhiên và đá sáng"}, ánh sáng tự nhiên kết hợp đèn {argument name="nhiệt màu" default="3000K"}, phụ kiện tối thiểu đúng tỷ lệ. Ống kính 24mm, vertical lines thẳng, màu sắc biên tập nội thất cao cấp, photorealistic, không làm rộng sai thực tế, không logo giả, không watermark.`,
))

const editPrompts = edits.map((item, index) => base(item.title, 295 + index, 'Chỉnh sửa ảnh', item.description, item.prompt))

export const additionalPrompts: PromptItem[] = [...architecturePrompts, ...interiorPrompts, ...editPrompts]
