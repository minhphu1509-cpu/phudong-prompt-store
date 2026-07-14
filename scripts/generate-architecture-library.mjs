import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dataPath = join(root, 'src/data/prompts.json')
const current = JSON.parse(readFileSync(dataPath, 'utf8'))
const base = current.filter((item) => !String(item.id).startsWith('archlib-'))

const styles = [
  'Hiện đại nhiệt đới', 'Tối giản đương đại', 'Brutalism tinh tế', 'Bauhaus', 'Art Deco',
  'Tân cổ điển tiết chế', 'Đông Dương đương đại', 'Wabi-sabi', 'Japandi', 'Scandinavian',
  'Địa Trung Hải', 'Modern Farmhouse', 'Công nghiệp', 'High-tech', 'Futuristic hữu cơ',
  'Parametric', 'Deconstructivism', 'Neo-futurism', 'Biophilic', 'Kiến trúc xanh',
  'Vernacular Việt Nam', 'Nhà vườn Bắc Bộ', 'Duyên hải miền Trung', 'Nam Bộ đương đại', 'Mountain modern',
  'Desert modern', 'Coastal contemporary', 'Resort nhiệt đới', 'Zen', 'Organic modern',
  'Mid-century modern', 'Postmodern', 'Expressionism', 'Minimal luxury', 'Quiet luxury',
  'Maximalism có kiểm soát', 'Retro-futurism', 'Cyberpunk tiết chế', 'Solarpunk', 'Adaptive reuse',
  'Heritage contemporary', 'Monolithic', 'Modular', 'Prefab contemporary', 'Earth architecture',
  'Timber architecture', 'Stone vernacular', 'Glass pavilion', 'Urban contemporary', 'Human-centered design',
]

const architectureTypes = [
  'Biệt thự sân vườn', 'Nhà phố mặt tiền hẹp', 'Nhà ở nông thôn', 'Nhà ven biển', 'Nhà trên sườn dốc',
  'Nhà nghỉ cuối tuần', 'Căn hộ chung cư', 'Chung cư cao tầng', 'Nhà ở xã hội', 'Khu nhà ở thấp tầng',
  'Khách sạn đô thị', 'Khu nghỉ dưỡng sinh thái', 'Homestay bản địa', 'Nhà hàng độc lập', 'Quán cà phê',
  'Trung tâm thương mại', 'Cửa hàng flagship', 'Chợ cộng đồng', 'Tòa nhà văn phòng', 'Trụ sở doanh nghiệp',
  'Co-working space', 'Trường mầm non', 'Trường phổ thông', 'Khuôn viên đại học', 'Thư viện công cộng',
  'Bảo tàng nghệ thuật', 'Trung tâm văn hóa', 'Nhà hát biểu diễn', 'Nhà triển lãm', 'Nhà sinh hoạt cộng đồng',
  'Bệnh viện đa khoa', 'Phòng khám chuyên khoa', 'Trung tâm chăm sóc người cao tuổi', 'Trung tâm thể thao', 'Sân vận động',
  'Nhà thi đấu đa năng', 'Ga đường sắt', 'Nhà ga sân bay', 'Bến xe liên tỉnh', 'Trạm dừng chân',
  'Nhà máy công nghệ sạch', 'Kho logistics', 'Trung tâm dữ liệu', 'Nông trại thẳng đứng', 'Nhà kính nghiên cứu',
  'Công trình tôn giáo đương đại', 'Đài tưởng niệm cộng đồng', 'Trung tâm cứu hộ động vật', 'Pavilion sự kiện', 'Cabin nghỉ dưỡng',
]

const interiorTypes = [
  'Phòng khách biệt thự', 'Phòng khách căn hộ nhỏ', 'Bếp mở gia đình', 'Phòng ăn trang trọng', 'Phòng ngủ master',
  'Phòng ngủ trẻ em linh hoạt', 'Phòng làm việc tại nhà', 'Phòng đọc sách', 'Phòng giải trí gia đình', 'Phòng thay đồ',
  'Phòng tắm spa', 'Sảnh căn hộ', 'Sảnh khách sạn', 'Phòng khách sạn tiêu chuẩn', 'Suite nghỉ dưỡng',
  'Nhà hàng fine dining', 'Nhà hàng gia đình', 'Quán cà phê đặc sản', 'Tiệm bánh thủ công', 'Quầy bar không cồn',
  'Cửa hàng thời trang', 'Showroom nội thất', 'Showroom ô tô điện', 'Cửa hàng mỹ phẩm', 'Nhà sách',
  'Văn phòng mở', 'Phòng họp lãnh đạo', 'Không gian co-working', 'Phòng sáng tạo', 'Pantry văn phòng',
  'Lớp học mầm non', 'Lớp học thông minh', 'Thư viện trường học', 'Phòng thí nghiệm giáo dục', 'Sảnh bệnh viện',
  'Phòng khám thân thiện', 'Phòng phục hồi chức năng', 'Không gian chăm sóc người cao tuổi', 'Phòng gym', 'Studio yoga',
  'Spa trị liệu', 'Salon tóc', 'Phòng trưng bày nghệ thuật', 'Bảo tàng tương tác', 'Khán phòng nhỏ',
  'Nhà nguyện tĩnh lặng', 'Khoang tàu cao cấp', 'Lounge sân bay', 'Tiny house đa năng', 'Không gian bếp cộng đồng',
]

const landscapeTypes = [
  'Sân vườn biệt thự', 'Vườn trong nhà phố', 'Sân thượng xanh', 'Ban công căn hộ', 'Vườn thiền',
  'Vườn nhiệt đới', 'Vườn khô ít tưới', 'Vườn mưa sinh thái', 'Vườn rau cộng đồng', 'Vườn trị liệu',
  'Công viên khu ở', 'Công viên đô thị trung tâm', 'Công viên ven sông', 'Công viên ven biển', 'Công viên đất ngập nước',
  'Công viên tuyến tính', 'Pocket park', 'Quảng trường công cộng', 'Phố đi bộ', 'Đường dạo ven hồ',
  'Lối dạo trong rừng', 'Đường mòn núi', 'Khu cắm trại sinh thái', 'Khu vui chơi trẻ em', 'Sân chơi đa thế hệ',
  'Sân trường xanh', 'Khuôn viên đại học', 'Cảnh quan bệnh viện', 'Cảnh quan khu nghỉ dưỡng', 'Cảnh quan khách sạn đô thị',
  'Cảnh quan văn phòng', 'Cảnh quan nhà máy sạch', 'Cảnh quan khu công nghiệp', 'Vườn bảo tàng', 'Vườn tượng',
  'Vườn tưởng niệm', 'Khu bảo tồn chim', 'Vườn thực vật', 'Nông trại giáo dục', 'Vườn ươm cộng đồng',
  'Bờ kè sinh thái', 'Hành lang xanh', 'Dải phân cách sinh học', 'Nút giao cảnh quan', 'Bãi đỗ xe xanh',
  'Trạm xe buýt xanh', 'Sân ga cảnh quan', 'Khu chợ ngoài trời', 'Không gian sự kiện ngoài trời', 'Pavilion giữa vườn',
]

const planningTypes = [
  'Khu đô thị mới', 'Khu đô thị ven sông', 'Khu đô thị ven biển', 'Đô thị vệ tinh', 'Khu ở mật độ thấp',
  'Khu ở mật độ cao', 'Khu nhà ở xã hội', 'Khu phức hợp TOD', 'Khu phức hợp đa chức năng', 'Trung tâm CBD',
  'Khu phố đi bộ', 'Tái thiết khu phố cũ', 'Bảo tồn khu lịch sử', 'Làng đô thị', 'Khu dân cư nông thôn mới',
  'Khu nghỉ dưỡng tổng hợp', 'Khu du lịch sinh thái', 'Khu đại học', 'Khu y tế tập trung', 'Khu thể thao',
  'Khu văn hóa sáng tạo', 'Khu công nghệ cao', 'Khu công nghiệp sinh thái', 'Cụm logistics', 'Khu cảng',
  'Khu vực nhà ga', 'Khu vực sân bay', 'Trung tâm giao thông liên phương thức', 'Hành lang xe buýt nhanh', 'Mạng lưới xe đạp',
  'Quy hoạch công viên trung tâm', 'Hệ thống không gian mở', 'Hành lang xanh ven sông', 'Mạng lưới mặt nước', 'Đô thị bọt biển',
  'Khu thích ứng ngập lụt', 'Khu tái định cư', 'Khu phục hồi sau thiên tai', 'Cụm làng miền núi', 'Điểm dân cư hải đảo',
  'Khu nông nghiệp đô thị', 'Khu năng lượng tái tạo', 'Khu đô thị không carbon', 'Khu đô thị thông minh', 'Khu đô thị 15 phút',
  'Siêu ô phố thân thiện người đi bộ', 'Mô hình courtyard block', 'Khu phát triển hỗn hợp ven metro', 'Quy hoạch vùng liên huyện', 'Tầm nhìn đô thị 2050',
]

const contexts = [
  'đô thị Việt Nam năng động', 'khí hậu nhiệt đới gió mùa', 'khu ven sông có địa hình thấp', 'khu ven biển nhiều gió',
  'sườn đồi có tầm nhìn rộng', 'khu dân cư hiện hữu', 'trung tâm thành phố mật độ cao', 'vùng ngoại ô đang phát triển',
  'khu vực giàu cây xanh', 'bối cảnh di sản cần tôn trọng',
]

const palettes = [
  'bê tông sáng, kính low-e, gỗ xử lý ngoài trời và đá địa phương',
  'gạch nung, vữa khoáng, tre ép và kim loại sơn tĩnh điện',
  'đá tự nhiên, gỗ sồi, vải dệt thô và đồng xước',
  'bê tông trần, thép đen, kính trung tính và gỗ tái chế',
  'đất nện, đá thô, gỗ bản địa và mái xanh',
  'terrazzo, gỗ veneer ấm, kính gân và inox mờ',
  'đá vôi, vữa màu cát, gỗ tối và gốm thủ công',
  'nhôm anodized, kính hiệu suất cao, tấm xi măng và cây bản địa',
  'gỗ kết cấu, kính trong, đá cuội và vải tự nhiên',
  'gạch không nung, bê tông tái chế, tre và mái thu nước mưa',
]

const lights = [
  'bình minh dịu với sương mỏng', 'nắng sớm trong trẻo', 'ánh sáng trưa trung tính', 'nắng xiên cuối chiều',
  'golden hour ấm', 'blue hour cân bằng đèn nhân tạo', 'trời nhiều mây khuếch tán', 'sau mưa với phản chiếu nhẹ',
  'đêm đô thị có kiểm soát chói sáng', 'ánh sáng mùa hè xuyên qua tán cây',
]

const cameras = [
  '24mm eye-level, đường đứng thẳng', '28mm góc ba phần tư', '35mm tầm nhìn người đi bộ', '50mm nén phối cảnh nhẹ',
  'flycam 45 độ', 'axonometric rõ cấu trúc', 'góc thấp nhấn mạnh mái và hiên', 'góc chính diện cân xứng',
  'panorama rộng có tiền cảnh', 'cận cảnh vật liệu kết hợp bối cảnh',
]

const slugify = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function promptFor(domain, type, style, index) {
  const context = contexts[index % contexts.length]
  const palette = palettes[(index * 3) % palettes.length]
  const light = lights[(index * 7) % lights.length]
  const camera = cameras[(index * 9) % cameras.length]
  const styleArg = `{argument name="phong cách" default="${style}"}`
  const lightArg = `{argument name="ánh sáng" default="${light}"}`

  if (domain === 'Kiến trúc — Ngoại thất') return `Tạo phối cảnh kiến trúc chuyên nghiệp cho ${type} theo phong cách ${styleArg}. Nếu có ảnh hoặc mô hình nguồn, giữ nguyên hình khối, số tầng, nhịp kết cấu, hệ cửa và tỷ lệ chính; không tự ý redesign. Bối cảnh ${context}, tổ chức tiếp cận rõ ràng và tỷ lệ con người tự nhiên. Bảng vật liệu: ${palette}, thể hiện đúng độ nhám, phản xạ và kích thước thực. ${lightArg}, camera ${camera}, cây xanh phù hợp khí hậu, vật liệu PBR, global illumination, ảnh tạp chí kiến trúc chân thực, 8K, không chữ, không logo, không watermark, không méo hình.`
  if (domain === 'Nội thất') return `Thiết kế hình ảnh ${type} theo phong cách ${styleArg}, ưu tiên công năng, lưu thông thuận tiện và tỷ lệ nội thất thực tế. Nếu có ảnh mặt bằng hoặc mô hình nguồn, bảo toàn tường, cột, cửa, cao độ trần và góc camera. Sử dụng ${palette}; phối màu hài hòa, chi tiết tiếp giáp thi công hợp lý, đồ nội thất có khoảng sử dụng rõ ràng. ${lightArg}, kết hợp chiếu sáng chức năng 3000–4000K, bóng đổ mềm, camera ${camera}, vertical lines thẳng, editorial interior photography, photorealistic, không bề mặt nhựa giả, không vật thể lơ lửng, không watermark.`
  if (domain === 'Cảnh quan') return `Tạo phối cảnh thiết kế ${type} theo tinh thần ${styleArg} trong ${context}. Tổ chức tuyến đi bộ dễ hiểu, điểm dừng nghỉ, lớp cây cao–trung–thấp và tầm nhìn an toàn. Ưu tiên cây bản địa, đa dạng sinh học, bề mặt thấm nước, thu nước mưa và bảo trì thực tế; không dùng loài cây phi thực tế. Vật liệu ${palette}. ${lightArg}, camera ${camera}, thể hiện đúng kích thước cây theo tuổi, bóng cây tự nhiên, hoạt động cộng đồng vừa phải, landscape architecture visualization chân thực, không chữ, không logo, không watermark.`
  return `Tạo hình ảnh quy hoạch cho ${type} theo định hướng ${styleArg}, đặt trong ${context}. Thể hiện mạng đường phân cấp, ô phố, mật độ xây dựng, tầng cao tương đối, giao thông công cộng, mạng đi bộ–xe đạp, không gian mở và hạ tầng xanh–xanh dương. Ưu tiên cấu trúc đô thị thích ứng khí hậu, bán kính phục vụ hợp lý và không gian công cộng dễ tiếp cận. Góc nhìn ${camera}, phong cách masterplan competition board kết hợp mô hình 3D, màu zoning rõ nhưng trang nhã, legend tối giản. Không bịa số liệu pháp lý; dữ liệu chưa có ghi "cần xác minh", không logo, không watermark.`
}

const domainSets = [
  ['Kiến trúc — Ngoại thất', architectureTypes],
  ['Nội thất', interiorTypes],
  ['Cảnh quan', landscapeTypes],
  ['Quy hoạch & Đô thị', planningTypes],
]

const generated = []
for (const [domainIndex, [domain, types]] of domainSets.entries()) {
  types.forEach((type, index) => {
    const style = styles[(index + domainIndex * 11) % styles.length]
    const number = base.length + generated.length + 1
    const title = `${type} — ${style}`
    generated.push({
      id: `archlib-${slugify(domain)}-${slugify(type)}-${number}`,
      number,
      title,
      rawTitle: title,
      category: domain,
      description: `Prompt tạo hình ${type.toLowerCase()} theo phong cách ${style}, có kiểm soát bối cảnh, vật liệu, camera và ánh sáng.`,
      prompt: promptFor(domain, type, style, index),
      images: [],
      author: { name: 'PhuDong AI Studio', url: '' },
      source: null,
      published: '14 tháng 7, 2026',
      language: 'vi',
      tryLink: '',
      featured: index < 2,
      raycastFriendly: true,
    })
  })
}

if (generated.length !== 200) throw new Error(`Expected 200 prompts, received ${generated.length}`)
writeFileSync(dataPath, `${JSON.stringify([...base, ...generated], null, 2)}\n`)
console.log(`Generated ${generated.length} architecture prompts (${base.length + generated.length} total).`)
