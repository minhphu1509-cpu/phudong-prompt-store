import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dataPath = join(root, 'src/data/prompts.json')
const current = JSON.parse(readFileSync(dataPath, 'utf8'))
const base = current.filter((item) => !String(item.id).startsWith('infographiclib-') && !String(item.id).startsWith('marketinglib-'))

const infographicPrompts = [
  {
    title: 'Concept board ý tưởng kiến trúc',
    description: 'Tóm tắt câu chuyện thiết kế thành bảng concept có trật tự thị giác rõ ràng.',
    prompt: 'Thiết kế concept board A2 ngang cho dự án {argument name="loại công trình" default="trung tâm văn hóa cộng đồng"}. Cấu trúc gồm: tuyên ngôn ý tưởng tối đa 35 từ, 3 từ khóa lớn, sơ đồ hình thành khối 4 bước, bảng vật liệu, mood hình ảnh và một phối cảnh chủ đạo. Phong cách editorial kiến trúc đương đại, lưới 12 cột, nền trắng ngà, đen than và điểm nhấn đỏ gạch. Chỉ dùng nội dung người dùng cung cấp; phần thiếu ghi “cần bổ sung”. Chữ tiếng Việt đúng chính tả, không logo giả, không chèn dữ liệu kỹ thuật chưa xác minh, xuất sắc nét để thuyết trình.',
  },
  {
    title: 'Infographic phân tích hiện trạng khu đất',
    description: 'Trình bày điều kiện khu đất, kết nối và cơ hội thiết kế trên một bảng tổng hợp.',
    prompt: 'Tạo infographic phân tích hiện trạng khu đất {argument name="diện tích" default="5.000 m²"} trên khổ A1 ngang. Bao gồm bản đồ vị trí, ranh giới, tiếp cận giao thông, công trình lân cận, cao độ tương đối, cây hiện hữu, hướng nhìn tốt–xấu, nguồn ồn và 5 kết luận thiết kế. Dùng hệ màu xanh rêu, cam đất, xám và trắng; icon nét mảnh, mũi tên rõ, legend thống nhất. Không tự suy đoán tọa độ hoặc kích thước; dữ liệu chưa có ghi “cần khảo sát”. Phong cách competition board chuyên nghiệp, chữ tiếng Việt dễ đọc ở khoảng cách trình bày.',
  },
  {
    title: 'Biểu đồ vi khí hậu công trình',
    description: 'Diễn giải nắng, mưa, nhiệt độ và độ ẩm thành chiến lược thiết kế khí hậu.',
    prompt: 'Thiết kế infographic dọc 4:5 về vi khí hậu cho dự án tại {argument name="địa điểm" default="Đà Nẵng"}. Thể hiện 4 biểu đồ: nhiệt độ theo tháng, lượng mưa, độ ẩm, giờ nắng; kèm hướng nắng chính, mùa gió và 6 chiến lược kiến trúc thụ động. Dữ liệu chỉ lấy từ bảng người dùng cung cấp, không bịa số liệu; thiếu dữ liệu dùng ký hiệu —. Bố cục khoa học, màu xanh lam–vàng nắng–xám trung tính, nhãn trục đầy đủ, đơn vị chính xác, chú giải dễ hiểu, typography tiếng Việt rõ nét, phù hợp báo cáo thiết kế bền vững.',
  },
  {
    title: 'Sun-path và nghiên cứu bóng đổ',
    description: 'Minh họa quỹ đạo mặt trời và tác động bóng đổ theo các mốc thời gian.',
    prompt: 'Tạo bảng phân tích sun-path và bóng đổ cho {argument name="ngày khảo sát" default="hạ chí"}. Bố cục A3 ngang gồm sơ đồ hướng Bắc, quỹ đạo mặt trời, 4 khung bóng đổ lúc 08:00, 11:00, 14:00, 17:00 và kết luận che nắng. Giữ nguyên hình khối công trình từ mô hình nguồn; không tự thay đổi vị trí địa lý. Dùng vàng cho nắng, xanh tím cho bóng, nền sáng, timestamp và legend rõ. Nếu thiếu tọa độ phải ghi “mô phỏng minh họa, cần xác minh”. Phong cách technical diagram sạch, đường nét sắc, chữ tiếng Việt chính xác.',
  },
  {
    title: 'Sơ đồ gió và thông gió tự nhiên',
    description: 'Trực quan hóa luồng gió quanh công trình và các giải pháp thông gió thụ động.',
    prompt: 'Thiết kế infographic phân tích gió cho {argument name="mùa" default="mùa hè"} từ mặt bằng và mô hình công trình nguồn. Thể hiện hướng gió chủ đạo, vùng áp suất tương đối, luồng xuyên phòng, khoảng mở đón–thoát gió và các điểm có nguy cơ bí khí. Dùng mũi tên xanh theo 3 cấp cường độ, mặt bằng xám nhạt, chú thích tối đa 12 từ mỗi điểm. Không trình bày như mô phỏng CFD chính xác khi chưa có dữ liệu; ghi rõ “sơ đồ nguyên lý”. Bố cục A3 ngang, trực quan, dễ dùng trong thuyết minh kiến trúc.',
  },
  {
    title: 'Sơ đồ giao thông và luồng người dùng',
    description: 'Phân tách các tuyến giao thông để đánh giá xung đột và khả năng tiếp cận.',
    prompt: 'Tạo sơ đồ circulation cho {argument name="công trình" default="khách sạn 120 phòng"}. Trên mặt bằng nguồn, phân biệt khách, nhân viên, dịch vụ, giao hàng và thoát hiểm bằng màu và kiểu nét riêng; đánh dấu sảnh, nút giao, thang, điểm kiểm soát và xung đột tiềm năng. Không thay đổi mặt bằng, không tự xác nhận tuân thủ quy chuẩn; các tuyến an toàn phải ghi “cần chuyên gia kiểm tra”. Nền trắng, đường luồng nổi bật, legend rõ, icon đồng nhất, A3 ngang, tiếng Việt chính xác và dễ đọc.',
  },
  {
    title: 'Biểu đồ chương trình diện tích',
    description: 'Chuyển bảng diện tích thành biểu đồ chương trình dễ so sánh và kiểm soát.',
    prompt: 'Thiết kế infographic chương trình diện tích cho {argument name="dự án" default="trường học liên cấp"}. Chuyển dữ liệu người dùng cung cấp thành treemap theo nhóm công năng, biểu đồ cột diện tích yêu cầu–đề xuất và bảng tổng hợp diện tích sử dụng, giao thông, kỹ thuật. Mỗi số liệu phải có đơn vị m² và giữ nguyên giá trị nguồn; không tự làm tròn gây sai tổng. Dùng màu pastel tương phản tốt, nhãn trực tiếp, tổng cộng nổi bật, bố cục A3 dọc, phong cách data visualization kiến trúc hiện đại, chữ tiếng Việt rõ.',
  },
  {
    title: 'Infographic trước và sau cải tạo',
    description: 'So sánh hiện trạng và phương án cải tạo bằng hệ thống chú thích trực quan.',
    prompt: 'Tạo infographic before–after cho dự án cải tạo {argument name="hạng mục" default="mặt tiền nhà phố"}. Dùng hai ảnh nguồn cùng kích thước, cùng crop và cùng cân bằng sáng; không thay đổi nội dung ảnh. Bên dưới trình bày tối đa 6 thay đổi có đánh số: công năng, vật liệu, chiếu sáng, cây xanh, nhận diện và khả năng tiếp cận. Chỉ mô tả thay đổi có bằng chứng; không tự tạo chi phí hoặc mức tiết kiệm. Bố cục 16:9, typography lớn, đường dẫn chú thích gọn, màu trung tính với một màu nhấn, phù hợp thuyết trình khách hàng.',
  },
  {
    title: 'Dashboard chỉ số thiết kế bền vững',
    description: 'Tổng hợp các chỉ số môi trường thành dashboard có nguồn và đơn vị rõ ràng.',
    prompt: 'Thiết kế dashboard 16:9 cho các chỉ số bền vững của {argument name="dự án" default="tòa nhà văn phòng"}. Gồm năng lượng, nước, tỷ lệ cây xanh, vật liệu tái chế, phát thải vận hành và tiện nghi người dùng; mỗi KPI có giá trị, đơn vị, mục tiêu và nguồn dữ liệu. Không bịa chứng nhận hoặc mức đạt chuẩn; dữ liệu thiếu hiển thị “N/A”. Dùng biểu đồ bullet, donut và sparkline có chọn lọc, màu xanh lá–xanh dương–xám, phân cấp rõ, không dùng hiệu ứng 3D gây sai lệch, phù hợp báo cáo lãnh đạo.',
  },
  {
    title: 'Infographic cơ cấu chi phí xây dựng',
    description: 'Biến bảng dự toán thành hình ảnh phân bổ chi phí minh bạch và dễ kiểm tra.',
    prompt: 'Tạo infographic cơ cấu chi phí cho {argument name="loại dự án" default="nhà ở 3 tầng"} từ bảng dự toán được cung cấp. Hiển thị tổng ngân sách, tỷ trọng phần thô, hoàn thiện, MEP, nội thất, cảnh quan, tư vấn và dự phòng bằng stacked bar và bảng số. Giữ nguyên đơn vị tiền tệ, không tự tạo giá hoặc thay đổi tổng; mọi khoản chưa có dùng —. Nền sáng, màu có độ tương phản tốt, số lớn dễ đọc, chú thích ngắn, ghi rõ thời điểm dự toán và phạm vi nếu có, tỷ lệ A4 dọc.',
  },
  {
    title: 'Vòng đời vật liệu kiến trúc',
    description: 'Mô tả hành trình vật liệu từ nguồn gốc đến tái sử dụng bằng sơ đồ tuần hoàn.',
    prompt: 'Thiết kế infographic vòng đời cho vật liệu {argument name="vật liệu" default="gỗ kỹ thuật"}. Sơ đồ vòng tròn gồm khai thác, sản xuất, vận chuyển, thi công, vận hành, tháo dỡ, tái sử dụng và tái chế; mỗi bước có icon nguyên bản và mô tả tối đa 14 từ. Chỉ sử dụng dữ liệu môi trường do người dùng cung cấp, không tự gắn nhãn “xanh” hoặc chứng nhận. Màu đất, xanh lá và than, nền ngà, lưới cân đối, mũi tên liên tục, có hộp “điểm cần xác minh”, chữ tiếng Việt chuẩn, tỷ lệ 1:1.',
  },
  {
    title: 'Wayfinding và khả năng tiếp cận',
    description: 'Trình bày hệ thống định hướng không gian và các điểm cần kiểm tra tiếp cận toàn diện.',
    prompt: 'Tạo infographic wayfinding cho {argument name="công trình" default="trung tâm y tế"}. Gồm sơ đồ tầng đơn giản, tuyến chính, điểm thông tin, mã màu khu vực, hệ biển chỉ dẫn, vị trí thang máy và các điểm cần kiểm tra tiếp cận. Dùng ký hiệu phổ quát, độ tương phản cao, font sans-serif dễ đọc và mô phỏng 4 loại biển. Không tuyên bố đạt quy chuẩn; ghi “cần đối chiếu tiêu chuẩn hiện hành”. Bố cục A2 dọc, legend rõ, khoảng trắng rộng, tiếng Việt ngắn gọn, không logo giả.',
  },
  {
    title: 'Sơ đồ chiến lược an toàn và thoát nạn',
    description: 'Tạo sơ đồ truyền đạt phương án an toàn ở mức minh họa để phục vụ rà soát chuyên môn.',
    prompt: 'Tạo bảng minh họa chiến lược an toàn cho {argument name="loại công trình" default="văn phòng nhiều tầng"} từ mặt bằng nguồn. Thể hiện lối ra, thang thoát, vùng tập kết, thiết bị báo cháy và phạm vi cần kiểm tra bằng ký hiệu rõ; không tự thay đổi kiến trúc hoặc bịa khoảng cách. Gắn cảnh báo nổi bật: “Sơ đồ truyền thông, không thay thế hồ sơ PCCC được phê duyệt”. Màu đỏ chỉ dùng cho thông tin khẩn cấp, nền trắng, đường thoát xanh, legend và số tầng rõ, A3 ngang, dễ đọc khi in.',
  },
  {
    title: 'Ma trận so sánh phương án thiết kế',
    description: 'So sánh nhiều phương án theo tiêu chí thống nhất mà không tự áp đặt điểm số.',
    prompt: 'Thiết kế comparison matrix cho {argument name="số phương án" default="3 phương án kiến trúc"}. Hàng tiêu chí gồm công năng, chi phí, vi khí hậu, thi công, vận hành, bản sắc và khả năng mở rộng; cột là từng phương án với ảnh thumbnail, ưu điểm, hạn chế và điểm do người dùng cung cấp. Không tự chấm điểm hoặc tuyên bố phương án thắng; giá trị thiếu ghi “chưa đánh giá”. Bố cục A3 ngang, màu trung tính, heatmap nhẹ, thang điểm có chú giải, typography rõ, phù hợp workshop ra quyết định.',
  },
  {
    title: 'Infographic mật độ và hình thái đô thị',
    description: 'Giải thích các chỉ số mật độ bằng mô hình khối và biểu đồ có đơn vị.',
    prompt: 'Tạo infographic về mật độ cho khu {argument name="quy mô" default="20 ha"}. Thể hiện FAR, mật độ xây dựng, tầng cao, dân số, tỷ lệ không gian mở và ba mẫu hình thái minh họa bằng axonometric đồng tỷ lệ. Chỉ dùng số liệu đầu vào; không tự suy ra chỉ tiêu pháp lý. Mỗi biểu đồ có đơn vị và định nghĩa ngắn, các giá trị thiếu ghi “cần xác minh”. Dùng xanh lam, cam đất và xám, nền sáng, lưới 3 cột, A2 ngang, phong cách urban design analytical.',
  },
  {
    title: 'Lịch mùa vụ và bảng cây cảnh quan',
    description: 'Trình bày đặc tính cây và mùa biến đổi để hỗ trợ lựa chọn cảnh quan.',
    prompt: 'Thiết kế infographic planting calendar cho {argument name="vùng khí hậu" default="miền Nam Việt Nam"}. Gồm 12 tháng và 12 loài cây do người dùng cung cấp; thể hiện mùa hoa, quả, thay lá, nhu cầu tưới, tầng cao và vị trí sử dụng. Không tự xác nhận loài bản địa hoặc độc tính; thông tin thiếu ghi “cần chuyên gia thực vật kiểm tra”. Bố cục ngang 16:9, màu theo mùa, icon cây tối giản, tên Việt và tên khoa học tách rõ, legend dễ hiểu, phù hợp hồ sơ ý tưởng cảnh quan.',
  },
]

const marketingPrompts = [
  {
    title: 'Key visual ra mắt dự án kiến trúc',
    description: 'Tạo hình ảnh chủ đạo cho chiến dịch ra mắt với khoảng trống thương hiệu linh hoạt.',
    prompt: 'Thiết kế key visual ra mắt dự án {argument name="tên dự án" default="The Green Courtyard"}. Dùng ảnh kiến trúc nguồn làm hero, giữ nguyên công trình và phối cảnh; tạo hệ khung hình 16:9 với tiêu đề, mô tả tối đa 20 từ, địa điểm và vùng đặt logo thật. Phong cách premium contemporary, nền than, chữ trắng và điểm nhấn đồng; ánh sáng ảnh được cân bằng nhưng không thay vật liệu. Không tự tạo giải thưởng, giá bán, pháp lý hoặc logo. Typography tiếng Việt sắc nét, có safe zone cho web và màn hình LED.',
  },
  {
    title: 'Carousel giới thiệu dự án bất động sản',
    description: 'Xây dựng bộ carousel có mạch kể chuyện và dữ liệu dự án kiểm soát.',
    prompt: 'Thiết kế carousel Instagram {argument name="số trang" default="8 trang"} giới thiệu dự án bất động sản. Cấu trúc: cover, vị trí, ý tưởng, tiện ích, mặt bằng, vật liệu, không gian sống và CTA. Mỗi trang dùng một thông điệp ngắn, ảnh nguồn không bị biến dạng, hệ lưới và màu thương hiệu đồng nhất. Chỉ sử dụng thông tin do người dùng cung cấp; không bịa giá, cam kết lợi nhuận, pháp lý hoặc tiến độ. Tỷ lệ 4:5, chữ tiếng Việt dễ đọc trên điện thoại, CTA trung tính, không logo giả.',
  },
  {
    title: 'Case study dự án cho portfolio studio',
    description: 'Trình bày một dự án hoàn chỉnh thành câu chuyện portfolio chuyên nghiệp.',
    prompt: 'Thiết kế case study dạng landing page dài cho studio kiến trúc với dự án {argument name="tên dự án" default="Courtyard Residence"}. Các phần: hero, nhiệm vụ, bối cảnh, ý tưởng, sơ đồ, vật liệu, 4 ảnh dự án, kết quả và thông tin nhóm. Giữ ảnh nguồn trung thực, caption ngắn, khoảng trắng rộng, phong cách minimal editorial. Không tự thêm khách hàng, diện tích, giải thưởng hoặc số liệu kết quả; phần thiếu bỏ trống. Responsive desktop–mobile, typography cao cấp, CTA “Xem dự án tiếp theo”.',
  },
  {
    title: 'Email banner giới thiệu bộ sưu tập vật liệu',
    description: 'Tạo banner email rõ sản phẩm, thông điệp và nút hành động.',
    prompt: 'Thiết kế email hero banner 1200 × 600 px cho bộ sưu tập {argument name="tên bộ sưu tập" default="Earth Surface 2026"}. Đặt texture và sản phẩm nguồn làm trung tâm, giữ đúng màu và tỷ lệ; thêm tiêu đề tối đa 7 từ, mô tả một dòng và nút CTA. Bố cục an toàn khi crop mobile, nền nhẹ, chữ tương phản cao, dung lượng hình ảnh tối ưu. Không tự tạo mức giảm giá, chứng nhận hoặc logo; dùng placeholder cho nội dung chưa cung cấp. Phong cách material editorial cao cấp.',
  },
  {
    title: 'Billboard quảng bá dự án đô thị',
    description: 'Tạo biển quảng cáo ngoài trời dễ đọc nhanh và không chứa tuyên bố chưa kiểm chứng.',
    prompt: 'Thiết kế billboard tỷ lệ {argument name="tỷ lệ" default="3:1"} cho dự án đô thị. Ảnh phối cảnh nguồn chiếm khoảng 65%, phần chữ gồm tên dự án, một thông điệp tối đa 8 từ, địa điểm và vùng CTA. Ưu tiên độ tương phản cao, chữ lớn đọc được từ xa, không dùng quá hai font và ba màu. Không bịa giá, ưu đãi, pháp lý, thời gian bàn giao hoặc cam kết đầu tư. Giữ nguyên hình khối công trình, không ghép bối cảnh gây hiểu sai, có vùng an toàn và bleed cho in khổ lớn.',
  },
  {
    title: 'Catalog sản phẩm vật liệu kiến trúc',
    description: 'Trình bày dòng sản phẩm bằng hệ catalog có thông số và ảnh nhất quán.',
    prompt: 'Thiết kế spread catalog A4 ngang cho {argument name="dòng sản phẩm" default="gạch ngoại thất"}. Mỗi spread gồm ảnh ứng dụng, ảnh cận texture, mã sản phẩm, kích thước, bề mặt, màu và vùng ghi chú kỹ thuật. Giữ màu và vân đúng ảnh tham chiếu; không tự tạo thông số, chứng nhận hoặc bảo hành. Dữ liệu thiếu dùng —. Bố cục lưới 6 cột, nền trắng, typography sans-serif, màu nhấn theo bộ nhận diện, ảnh 300 dpi, có lề gáy và vùng an toàn in ấn.',
  },
  {
    title: 'Ảnh hero thương mại điện tử nội thất',
    description: 'Tạo ảnh sản phẩm sạch, đúng tỷ lệ và phù hợp trang thương mại điện tử.',
    prompt: 'Tạo ảnh hero e-commerce cho sản phẩm {argument name="sản phẩm" default="ghế lounge"} từ ảnh tham chiếu. Giữ tuyệt đối hình dáng, màu, vật liệu, logo thật và tỷ lệ; làm sạch nền thành studio sáng, bóng tiếp xúc tự nhiên và góc camera 50mm. Bố cục 1:1 có khoảng trống cho tên sản phẩm, ba thuộc tính do người dùng cung cấp và nút CTA. Không tự đổi thiết kế, không thêm phụ kiện gây hiểu sai, không tạo giá hoặc nhãn giảm giá, photorealistic, cạnh sản phẩm sắc nét.',
  },
  {
    title: 'Thiết kế bao bì mẫu vật liệu',
    description: 'Tạo mockup bao bì có cấu trúc nhãn rõ và thông tin kiểm soát.',
    prompt: 'Thiết kế bao bì cho bộ mẫu {argument name="loại vật liệu" default="gỗ veneer"}. Tạo hộp cứng mở nắp, khay mẫu bên trong và sleeve ngoài; dùng logo thật do người dùng cung cấp, tên bộ sưu tập, mã màu và vùng thông tin kỹ thuật. Phong cách sustainable premium, giấy tái chế màu tự nhiên, mực một màu và dập chìm tinh tế. Không tự gắn chứng nhận môi trường hoặc thông số; dùng placeholder rõ cho phần thiếu. Render studio 3 góc nhìn, ánh sáng mềm, đúng tỷ lệ sản phẩm.',
  },
  {
    title: 'Gian hàng triển lãm thương hiệu kiến trúc',
    description: 'Tạo phối cảnh booth triển lãm kết hợp trưng bày, gặp gỡ và nhận diện.',
    prompt: 'Thiết kế gian hàng triển lãm {argument name="diện tích" default="6 × 6 m"} cho thương hiệu vật liệu kiến trúc. Phân khu gồm quầy đón, tường mẫu, màn hình, bàn tư vấn, kho nhỏ và lối tiếp cận thông thoáng. Dùng nhận diện do người dùng cung cấp; vật liệu kết cấu lắp ghép, ánh sáng 3500K, bảng hiệu đọc rõ từ hai hướng. Không tự tạo logo, chứng nhận hoặc thông điệp thương hiệu. Render 28mm eye-level, có người theo tỷ lệ, nền hội chợ tiết chế, photorealistic.',
  },
  {
    title: 'Bảng dịch vụ studio kiến trúc',
    description: 'Trình bày các gói dịch vụ minh bạch mà không tự tạo giá hoặc cam kết.',
    prompt: 'Thiết kế service menu 4:5 cho studio kiến trúc gồm {argument name="số gói" default="3 gói dịch vụ"}. Mỗi gói có tên, phạm vi, đầu ra, thời gian và vùng giá do người dùng nhập; dùng dấu — nếu chưa có dữ liệu. Không tự thêm chi phí, ưu đãi, cam kết cấp phép hoặc kết quả. Bố cục ba cột dễ so sánh, một gói được nhấn nhẹ nhưng không dùng thủ thuật gây áp lực, màu than–trắng–đỏ gạch, icon nguyên bản, chữ tiếng Việt rõ, CTA “Yêu cầu tư vấn”.',
  },
  {
    title: 'Thẻ phản hồi khách hàng có kiểm chứng',
    description: 'Biến phản hồi được cung cấp thành social card đáng tin cậy và dễ đọc.',
    prompt: 'Thiết kế testimonial card tỷ lệ 1:1 cho studio thiết kế. Chỉ sử dụng nguyên văn trích dẫn {argument name="trích dẫn" default="Nội dung phản hồi đã được khách hàng phê duyệt"}, tên và vai trò do người dùng cung cấp; không tự viết lời khen hoặc tạo danh tính. Bố cục gồm dấu ngoặc kép, trích dẫn tối đa 45 từ, ảnh dự án nhỏ và vùng logo thật. Phong cách editorial ấm, nền kem, chữ than, điểm nhấn terracotta, độ tương phản cao, có dòng “Đăng với sự đồng ý của khách hàng” nếu được yêu cầu.',
  },
  {
    title: 'Poster sự kiện kiến trúc và thiết kế',
    description: 'Tạo poster sự kiện có cấu trúc thông tin rõ cho cả in ấn và mạng xã hội.',
    prompt: 'Thiết kế poster cho sự kiện {argument name="tên sự kiện" default="Future of Vietnamese Cities"}. Phân cấp: tên sự kiện, chủ đề, ngày giờ, địa điểm, diễn giả, đơn vị tổ chức và QR placeholder. Chỉ sử dụng thông tin cung cấp; không tự tạo diễn giả, đối tác hoặc logo. Phong cách Swiss–architectural, hình khối trừu tượng lấy cảm hứng từ bản đồ đô thị, nền sáng, chữ đen và xanh cobalt. Khổ A2 dọc đồng thời crop tốt sang 4:5, lề an toàn, chữ tiếng Việt chuẩn và dễ đọc.',
  },
  {
    title: 'Bảng nộp giải thưởng kiến trúc',
    description: 'Trình bày dự án cho hồ sơ dự giải mà không tạo thành tích hoặc dữ liệu giả.',
    prompt: 'Thiết kế award submission board A1 ngang cho dự án {argument name="tên dự án" default="Community Courtyard"}. Gồm statement 80–120 từ do người dùng cung cấp, 3 ảnh chính, mặt bằng, mặt cắt, sơ đồ bền vững và thông tin dự án. Không tự tạo giải thưởng, thành tích, số liệu môi trường, khách hàng hoặc tác giả; dữ liệu thiếu ghi “chưa cung cấp”. Lưới chặt chẽ, nền trắng, caption nhỏ rõ, ảnh đồng tông, diagram màu tiết chế, không logo ngoài logo thật của đơn vị và ban tổ chức.',
  },
  {
    title: 'Chiến dịch trước–sau cho dịch vụ cải tạo',
    description: 'Tạo bộ quảng bá cải tạo trung thực, giữ góc nhìn và tránh phóng đại kết quả.',
    prompt: 'Thiết kế social campaign before–after cho dịch vụ cải tạo {argument name="không gian" default="căn hộ 70 m²"}. Dùng ảnh trước và sau do người dùng cung cấp, căn cùng crop, tỷ lệ và cân bằng sáng; không thêm hoặc xóa chi tiết làm sai hiện trạng. Tạo 5 slide 4:5: cover, before, after, ba thay đổi chính, CTA. Không tự tạo ngân sách, thời gian, mức tiết kiệm hoặc lời chứng thực. Phong cách clean editorial, nhãn BEFORE/AFTER rõ, caption tiếng Việt ngắn và trung thực.',
  },
  {
    title: 'Storyboard video giới thiệu dự án',
    description: 'Lập storyboard video ngắn có nhịp hình, nội dung và CTA nhất quán.',
    prompt: 'Tạo storyboard {argument name="thời lượng" default="30 giây"} giới thiệu một dự án kiến trúc trên mạng xã hội. Chia 8 cảnh: mở đầu địa điểm, ngoại thất, tiếp cận, không gian chính, vật liệu, ánh sáng, trải nghiệm và end card. Mỗi cảnh có thumbnail, thời lượng, chuyển động camera, chữ trên màn hình tối đa 8 từ và ghi chú âm thanh không bản quyền. Chỉ dựa trên ảnh/video nguồn; không tự tạo tiện ích hoặc tiến độ. Tỷ lệ 9:16, nhịp hiện đại, CTA trung tính, chữ tiếng Việt dễ đọc.',
  },
  {
    title: 'Hero landing page thu hút khách hàng tiềm năng',
    description: 'Thiết kế phần mở đầu landing page rõ dịch vụ, bằng chứng và hành động tiếp theo.',
    prompt: 'Thiết kế hero landing page desktop và mobile cho dịch vụ {argument name="dịch vụ" default="thiết kế kiến trúc trọn gói"}. Nội dung gồm headline tối đa 10 từ, mô tả 24 từ, CTA chính, CTA phụ, ảnh dự án thật và ba điểm tin cậy do người dùng cung cấp. Không tự tạo số dự án, giải thưởng, đối tác, bảo hành hoặc lời cam kết. Phong cách premium minimal, nền tối, ảnh lớn, chữ trắng, điểm nhấn đỏ gạch, tương phản đạt mức dễ đọc, form chỉ hỏi thông tin cần thiết, responsive rõ ràng.',
  },
]

const slugify = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function makeItems(items, category, prefix) {
  return items.map((item, index) => {
    const number = base.length + (prefix === 'marketinglib' ? infographicPrompts.length : 0) + index + 1
    return {
      id: `${prefix}-${slugify(item.title)}-${number}`,
      number,
      title: item.title,
      rawTitle: item.title,
      category,
      description: item.description,
      prompt: item.prompt,
      images: [],
      author: { name: 'PhuDong AI Studio', url: '' },
      source: null,
      published: '14 tháng 7, 2026',
      language: 'vi',
      tryLink: '',
      featured: index < 2,
      raycastFriendly: true,
    }
  })
}

if (infographicPrompts.length !== 16 || marketingPrompts.length !== 16) throw new Error('Each visual communication category must contain exactly 16 generated prompts.')
const generated = [
  ...makeItems(infographicPrompts, 'Đồ họa thông tin', 'infographiclib'),
  ...makeItems(marketingPrompts, 'Sản phẩm & Marketing', 'marketinglib'),
]
writeFileSync(dataPath, `${JSON.stringify([...base, ...generated], null, 2)}\n`)
console.log(`Generated ${generated.length} visual communication prompts (${base.length + generated.length} total).`)
