import {
  CAMERAS, CONTEXTS, LIGHTING, PEOPLE, PRESERVATION, PROJECT_TYPES, SOURCE_TYPES,
  STYLES, TIMES, VEGETATION, WEATHER, type Discipline, type ScopedOption,
} from '../render-config'

export type QuickFilter = { key: string; label: string; options: { value: string; label: string }[] }
const standard = { value: 'standard', label: 'Tiêu chuẩn (mặc định)' }
const list = (...labels: string[]) => [standard, ...labels.map((label) => ({ value: label, label }))]
const scoped = (items: ScopedOption[], discipline: Discipline) => items.filter((item) => !item.scope || item.scope.includes(discipline))

const visualFilters = (discipline: Discipline): QuickFilter[] => [
  { key: 'projectType', label: 'Loại công trình', options: scoped(PROJECT_TYPES, discipline) },
  { key: 'style', label: 'Phong cách thiết kế', options: STYLES[discipline] },
  { key: 'context', label: 'Bối cảnh', options: scoped(CONTEXTS, discipline) },
  { key: 'time', label: 'Thời điểm', options: TIMES },
  { key: 'weather', label: 'Thời tiết', options: WEATHER },
  { key: 'lighting', label: 'Kịch bản ánh sáng', options: scoped(LIGHTING, discipline) },
  { key: 'camera', label: 'Góc nhìn camera', options: scoped(CAMERAS, discipline) },
  { key: 'sourceType', label: 'Loại ảnh nguồn', options: SOURCE_TYPES },
  { key: 'preservation', label: 'Mức bảo toàn', options: PRESERVATION },
  { key: 'people', label: 'Con người / hoạt động', options: PEOPLE },
  { key: 'vegetation', label: 'Cây xanh', options: VEGETATION },
  { key: 'materials', label: 'Vật liệu chủ đạo', options: list('Bê tông trần + kính','Đá tự nhiên + gỗ','Gạch nung + gỗ','Kim loại + kính low-e','Microcement + gỗ sồi','Đá travertine + đồng','Vật liệu bản địa','Vật liệu tái chế','Màu và vật liệu theo ảnh nguồn') },
  { key: 'lens', label: 'Ống kính', options: list('18mm siêu rộng','24mm góc rộng','28mm kiến trúc','35mm tự nhiên','50mm chi tiết','70mm nén phối cảnh') },
  { key: 'aspect', label: 'Tỷ lệ ảnh', options: list('16:9 ngang','4:3 ngang','3:2 ngang','1:1 vuông','4:5 dọc','9:16 dọc','A3 ngang') },
  { key: 'quality', label: 'Chất lượng hình ảnh', options: list('Photorealistic 4K','Ultra realistic 8K','Editorial architecture','Cinematic visualization','Ảnh tạp chí cao cấp','Bản thuyết trình ý tưởng') },
  { key: 'palette', label: 'Bảng màu', options: list('Trung tính ấm','Trung tính lạnh','Đất nung tự nhiên','Đen trắng tối giản','Xanh nhiệt đới','Pastel tinh tế','Tương phản điện ảnh','Theo màu ảnh nguồn') },
]

const editingFilters: QuickFilter[] = [
  { key: 'editMode', label: 'Chế độ chỉnh sửa', options: list('Thay vật liệu','Thay nền / bối cảnh','Xóa vật thể','Thêm vật thể tham chiếu','Đổi ánh sáng','Đổi thời tiết','Ngày sang đêm','Phục hồi ảnh','Tăng độ nét','Sketch thành ảnh thật') },
  { key: 'scope', label: 'Phạm vi tác động', options: list('Chỉ vùng mask','Chỉ chủ thể được chọn','Toàn bộ ảnh nhưng giữ cấu trúc','Chỉ nền ảnh') },
  { key: 'strength', label: 'Cường độ thay đổi', options: list('Nhẹ — bảo toàn cao','Cân bằng','Mạnh — thay đổi rõ') },
  { key: 'reference', label: 'Ưu tiên ảnh tham chiếu', options: list('Khớp vật liệu tuyệt đối','Khớp màu sắc','Khớp hình dáng','Khớp phong cách tổng thể') },
  { key: 'preservation', label: 'Bảo toàn ảnh gốc', options: list('Khóa hình học tuyệt đối','Giữ camera và phối cảnh','Giữ ánh sáng hiện hữu','Giữ mọi vùng ngoài mask') },
  { key: 'edge', label: 'Xử lý biên vùng chọn', options: list('Biên chính xác','Chuyển tiếp mềm','Theo đường ron / mạch vật liệu','Theo cạnh kiến trúc') },
  { key: 'output', label: 'Đầu ra', options: list('Photorealistic 4K','Ultra realistic 8K','Giữ đúng kích thước nguồn','16:9','4:3','1:1') },
]

const infographicFilters: QuickFilter[] = [
  { key: 'format', label: 'Loại đồ họa', options: list('Infographic quy trình','Timeline','Sơ đồ phân khu','Exploded axonometric','Bảng so sánh','Bản đồ dữ liệu','Dashboard','Poster thông tin') },
  { key: 'style', label: 'Phong cách đồ họa', options: list('Swiss Modern','Bauhaus','Editorial tối giản','Bản vẽ kiến trúc','Isometric','Brutalist graphic','Corporate premium') },
  { key: 'layout', label: 'Bố cục', options: list('Dọc 4:5','Dọc A3','Ngang 16:9','Ngang A3','Vuông 1:1','Lưới 12 cột') },
  { key: 'palette', label: 'Bảng màu', options: list('Trắng ngà + đỏ gạch','Đen trắng + cam','Xám than + xanh lam','Pastel phân khu','Đơn sắc kiến trúc') },
  { key: 'density', label: 'Mật độ thông tin', options: list('Tối giản','Cân bằng','Chi tiết chuyên sâu') },
  { key: 'language', label: 'Ngôn ngữ', options: list('Tiếng Việt','Song ngữ Việt–Anh','Tiếng Anh') },
  { key: 'quality', label: 'Đầu ra', options: list('Web sắc nét','Slide 16:9','In A3 300 DPI','In A1 300 DPI') },
]

const marketingFilters: QuickFilter[] = [
  { key: 'asset', label: 'Định dạng nội dung', options: list('Poster quảng cáo','Social post','Carousel','Hero landing page','Banner website','Brochure','Lookbook','Bao bì','Storyboard video') },
  { key: 'channel', label: 'Kênh sử dụng', options: list('Facebook','Instagram','TikTok','Zalo OA','Website','Email marketing','Sàn thương mại điện tử','In ấn') },
  { key: 'audience', label: 'Khách hàng mục tiêu', options: list('Chủ nhà','Chủ đầu tư','Kiến trúc sư','Nhà thiết kế nội thất','Doanh nghiệp','Khách hàng cao cấp','Người mua lần đầu') },
  { key: 'tone', label: 'Giọng điệu', options: list('Sang trọng','Chuyên gia','Tối giản','Truyền cảm hứng','Thân thiện','Mạnh mẽ','Tin cậy') },
  { key: 'style', label: 'Phong cách hình ảnh', options: list('Premium minimal','Editorial architecture','Luxury dark','Clean commercial','Lifestyle tự nhiên','Swiss Modern') },
  { key: 'cta', label: 'Mục tiêu hành động', options: list('Đăng ký tư vấn','Xem dự án','Nhận báo giá','Tải tài liệu','Tham gia sự kiện','Mua ngay','Lưu bài viết') },
  { key: 'aspect', label: 'Tỷ lệ đầu ra', options: list('1:1','4:5','9:16','16:9','A4 dọc','Banner 3:1') },
]

export function getQuickFilters(category: string, title: string): QuickFilter[] {
  if (category === 'Chỉnh sửa ảnh') return editingFilters
  if (category === 'Đồ họa thông tin') return infographicFilters
  if (category === 'Sản phẩm & Marketing') return marketingFilters
  if (category.includes('Nội thất') || /phòng|bếp|sảnh|căn hộ|showroom|spa/i.test(title)) return visualFilters('interior')
  if (category.includes('Cảnh quan')) return visualFilters('landscape')
  if (category.includes('Quy hoạch')) return visualFilters('planning')
  return visualFilters('architecture')
}

export function buildQuickConfig(filters: QuickFilter[], values: Record<string, string>) {
  const rows = filters.map((field) => {
    const value = values[field.key] ?? 'standard'
    const label = field.options.find((option) => option.value === value)?.label ?? value
    return `- ${field.label}: ${label}`
  })
  return `\n\nCẤU HÌNH TÙY BIẾN NHANH:\n${rows.join('\n')}\nƯu tiên tính nhất quán, tỷ lệ thực tế, chi tiết đáng tin cậy; không chữ sai chính tả, không logo giả, không watermark.`
}
