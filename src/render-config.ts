export type Discipline = 'architecture' | 'interior' | 'landscape' | 'planning'
export type ScopedOption = { value: string; label: string; scope?: Discipline[] }

export const DISCIPLINES: ScopedOption[] = [
  { value: 'architecture', label: 'Kiến trúc' }, { value: 'interior', label: 'Nội thất' },
  { value: 'landscape', label: 'Cảnh quan' }, { value: 'planning', label: 'Quy hoạch' },
]

const standard = { value: 'standard', label: 'Tiêu chuẩn (mặc định)' }

export const STYLES: Record<Discipline, ScopedOption[]> = {
  architecture: [standard, ...[
    'Hiện đại nhiệt đới','Tối giản đương đại','Brutalism tinh tế','Bauhaus','Art Deco','Tân cổ điển tiết chế','Đông Dương đương đại','Vernacular Việt Nam','Nhà vườn Bắc Bộ','Nam Bộ đương đại','Địa Trung Hải','Modern Farmhouse','Industrial','High-tech','Neo-futurism','Parametric','Deconstructivism','Biophilic','Kiến trúc xanh','Organic modern','Mid-century modern','Postmodern','Adaptive reuse','Heritage contemporary','Monolithic','Modular','Prefab contemporary','Earth architecture','Timber architecture','Stone vernacular',
  ].map((label) => ({ value: label, label }))],
  interior: [standard, ...[
    'Modern Luxury','Minimal Luxury','Quiet Luxury','Japandi','Wabi-sabi','Scandinavian','Đông Dương đương đại','Art Deco','Tân cổ điển','Mid-century modern','Organic modern','Biophilic','Tropical contemporary','Industrial loft','Bauhaus','Memphis tiết chế','Maximalism có kiểm soát','Coastal contemporary','Mediterranean','Modern Farmhouse','Zen','Korean minimal','Parisian contemporary','Retro 1970s','Futuristic','High-tech','Rustic refined','Boutique hotel','Gallery-like','Family-centered',
  ].map((label) => ({ value: label, label }))],
  landscape: [standard, ...[
    'Nhiệt đới bản địa','Vườn Việt đương đại','Zen Nhật Bản','Vườn thiền khô','Formal garden','English naturalistic','Địa Trung Hải','Desert xeriscape','Coastal landscape','Forest garden','Biophilic','Ecological restoration','Sponge landscape','Rain garden','Wetland park','Urban contemporary','Minimal landscape','Organic naturalism','Resort tropical','Botanical garden','Productive landscape','Community garden','Healing garden','Sensory garden','Playful landscape','Heritage garden','Mountain landscape','Riverfront ecology','Pollinator garden','Low-maintenance native',
  ].map((label) => ({ value: label, label }))],
  planning: [standard, ...[
    'Đô thị nén','Đô thị 15 phút','Transit Oriented Development','Mixed-use urbanism','New Urbanism','Landscape urbanism','Ecological urbanism','Sponge city','Smart city','Low-carbon city','Net-zero district','Walkable city','Cycling-first city','Blue-green network','Riverfront regeneration','Heritage-led regeneration','Adaptive urban reuse','Courtyard block','Perimeter block','Superblock','Garden city contemporary','Compact satellite city','Resilient coastal city','Flood-adaptive urbanism','Inclusive city','Child-friendly city','Age-friendly city','Creative district','Campus urbanism','Vietnamese urban identity',
  ].map((label) => ({ value: label, label }))],
}

export const PROJECT_TYPES: ScopedOption[] = [standard,
  {value:'Nhà phố',label:'Nhà phố',scope:['architecture','interior']},{value:'Biệt thự',label:'Biệt thự',scope:['architecture','interior','landscape']},
  {value:'Căn hộ chung cư',label:'Căn hộ chung cư',scope:['architecture','interior']},{value:'Chung cư cao tầng',label:'Chung cư cao tầng',scope:['architecture','planning']},
  {value:'Nhà ở xã hội',label:'Nhà ở xã hội',scope:['architecture','planning']},{value:'Homestay',label:'Homestay',scope:['architecture','interior','landscape']},
  {value:'Khách sạn',label:'Khách sạn',scope:['architecture','interior','landscape']},{value:'Resort',label:'Khu nghỉ dưỡng',scope:['architecture','interior','landscape','planning']},
  {value:'Nhà hàng',label:'Nhà hàng',scope:['architecture','interior','landscape']},{value:'Quán cà phê',label:'Quán cà phê',scope:['architecture','interior','landscape']},
  {value:'Trung tâm thương mại',label:'Trung tâm thương mại',scope:['architecture','interior','planning']},{value:'Cửa hàng bán lẻ',label:'Cửa hàng bán lẻ',scope:['architecture','interior']},
  {value:'Cao ốc văn phòng',label:'Cao ốc văn phòng',scope:['architecture','interior','planning']},{value:'Trụ sở doanh nghiệp',label:'Trụ sở doanh nghiệp',scope:['architecture','interior','landscape']},
  {value:'Co-working space',label:'Co-working space',scope:['interior']},{value:'Trung tâm hành chính',label:'Trung tâm hành chính',scope:['architecture','interior','landscape','planning']},
  {value:'Trường mầm non',label:'Trường mầm non',scope:['architecture','interior','landscape']},{value:'Trường học',label:'Trường học',scope:['architecture','interior','landscape','planning']},
  {value:'Đại học',label:'Khuôn viên đại học',scope:['architecture','interior','landscape','planning']},{value:'Bệnh viện',label:'Bệnh viện',scope:['architecture','interior','landscape','planning']},
  {value:'Phòng khám',label:'Phòng khám',scope:['architecture','interior']},{value:'Trung tâm thể thao',label:'Trung tâm thể thao',scope:['architecture','interior','landscape','planning']},
  {value:'Sân vận động',label:'Sân vận động',scope:['architecture','landscape','planning']},{value:'Bảo tàng',label:'Bảo tàng',scope:['architecture','interior','landscape']},
  {value:'Thư viện',label:'Thư viện',scope:['architecture','interior','landscape']},{value:'Trung tâm văn hóa',label:'Trung tâm văn hóa',scope:['architecture','interior','landscape','planning']},
  {value:'Nhà hát',label:'Nhà hát',scope:['architecture','interior','landscape']},{value:'Công trình tôn giáo',label:'Công trình tôn giáo',scope:['architecture','interior','landscape']},
  {value:'Nhà máy',label:'Nhà máy',scope:['architecture','landscape','planning']},{value:'Kho logistics',label:'Kho logistics',scope:['architecture','planning']},
  {value:'Nhà ga',label:'Nhà ga',scope:['architecture','interior','landscape','planning']},{value:'Sân bay',label:'Nhà ga sân bay',scope:['architecture','interior','landscape','planning']},
  {value:'Quảng trường',label:'Quảng trường',scope:['landscape','planning']},{value:'Công viên đô thị',label:'Công viên đô thị',scope:['landscape','planning']},
  {value:'Công viên ven sông',label:'Công viên ven sông',scope:['landscape','planning']},{value:'Khu đô thị mới',label:'Khu đô thị mới',scope:['architecture','landscape','planning']},
  {value:'Khu phức hợp',label:'Khu phức hợp đa chức năng',scope:['architecture','planning']},{value:'Khu công nghiệp',label:'Khu công nghiệp',scope:['architecture','landscape','planning']},
  {value:'Khu du lịch sinh thái',label:'Khu du lịch sinh thái',scope:['architecture','landscape','planning']},{value:'Pavilion',label:'Pavilion / công trình nhỏ',scope:['architecture','interior','landscape']},
]

export const TIMES = [standard,...['Bình minh','Buổi sáng trong trẻo','Giữa trưa','Đầu giờ chiều','Cuối chiều','Golden hour','Hoàng hôn','Blue hour','Ban đêm','Đêm muộn'].map(label=>({value:label,label}))]
export const WEATHER = [standard,...['Trời quang','Có mây nhẹ','Nhiều mây khuếch tán','Sau cơn mưa','Mưa phùn nhẹ','Sương sớm','Không khí mùa hè','Mùa thu khô ráo','Gió ven biển','Trời âm u điện ảnh'].map(label=>({value:label,label}))]

export const LIGHTING: ScopedOption[] = [standard,
  {value:'Nắng sớm xiên nhẹ',label:'Nắng sớm xiên nhẹ',scope:['architecture','landscape','planning']},{value:'Nắng trưa rõ khối',label:'Nắng trưa rõ khối',scope:['architecture','landscape','planning']},
  {value:'Golden hour ấm',label:'Golden hour ấm',scope:['architecture','landscape','planning']},{value:'Hoàng hôn ngược sáng',label:'Hoàng hôn ngược sáng',scope:['architecture','landscape']},
  {value:'Blue hour cân bằng đèn',label:'Blue hour cân bằng đèn',scope:['architecture','interior','landscape','planning']},{value:'Đêm đô thị sang trọng',label:'Đêm đô thị sang trọng',scope:['architecture','landscape','planning']},
  {value:'Trời mây khuếch tán',label:'Trời mây khuếch tán',scope:['architecture','landscape','planning']},{value:'Sau mưa phản chiếu',label:'Sau mưa phản chiếu',scope:['architecture','landscape','planning']},
  {value:'Volumetric light qua cây',label:'Volumetric light xuyên tán cây',scope:['architecture','interior','landscape']},{value:'Ánh sáng mùa hè rực rỡ',label:'Ánh sáng mùa hè rực rỡ',scope:['architecture','landscape','planning']},
  {value:'Daylight qua rèm mỏng',label:'Daylight qua rèm mỏng',scope:['interior']},{value:'Ánh sáng cửa sổ bên hông',label:'Ánh sáng cửa sổ bên hông',scope:['interior']},
  {value:'Skylight khuếch tán',label:'Skylight khuếch tán',scope:['interior','architecture']},{value:'Ánh sáng giếng trời',label:'Ánh sáng giếng trời',scope:['interior','architecture']},
  {value:'Ambient 3000K + task light',label:'Ambient 3000K + task light',scope:['interior']},{value:'Indirect cove lighting',label:'Đèn hắt trần gián tiếp',scope:['interior']},
  {value:'Accent lighting gallery',label:'Chiếu điểm kiểu gallery',scope:['interior']},{value:'Hospitality lighting 2700K',label:'Hospitality lighting 2700K',scope:['interior']},
  {value:'High-key commercial',label:'High-key thương mại',scope:['interior']},{value:'Low-key cinematic',label:'Low-key điện ảnh',scope:['interior','architecture']},
]

export const CONTEXTS: ScopedOption[] = [standard,...[
  'Đường phố Việt Nam','Một con đường tại Việt Nam','Khu đô thị hiện đại','Triền dốc Đà Lạt','Đường dốc quanh co','Đường vắng có vỉa hè và cây xanh đô thị','Phố trung tâm Hà Nội','Phố hiện đại TP.HCM','Khu dân cư Đà Nẵng','Khu ven sông Sài Gòn','Bờ sông Hàn','Ven hồ đô thị','Khu phố cổ tiết chế','Khu ngoại ô Việt Nam','Làng quê Bắc Bộ','Miền quê Nam Bộ','Bờ biển miền Trung','Đồi thông Đà Lạt','Thung lũng miền núi','Khu đô thị ven biển','CBD mật độ cao','Khu công nghệ cao','Khu công nghiệp sạch','Khu đại học xanh','Quảng trường trung tâm','Công viên ven sông','Công viên tuyến tính','Khu nghỉ dưỡng nhiệt đới','Resort ven biển','Sườn đồi nhìn ra biển','Đảo nhiệt đới','Rừng tự nhiên được bảo tồn','Cảnh quan ruộng bậc thang','Khu đất ngập nước','Khu đô thị sau mưa','Phố đi bộ cuối tuần','Khu giao thông công cộng TOD','Khu ở yên tĩnh cao cấp','Khu di sản thích ứng','Bối cảnh tối giản trung tính',
].map(label=>({value:label,label}))]

export const CAMERAS: ScopedOption[] = [standard,
  {value:'Chính diện',label:'Góc chính diện',scope:['architecture','interior']},{value:'Sâu trái',label:'Góc sâu bên trái',scope:['architecture','interior','landscape']},
  {value:'Sâu phải',label:'Góc sâu bên phải',scope:['architecture','interior','landscape']},{value:'Hero low angle',label:'Góc hùng vĩ thấp',scope:['architecture']},
  {value:'Bird eye',label:'Góc chim bay',scope:['architecture','landscape','planning']},{value:'Drone 45 độ',label:'Flycam 45 độ',scope:['architecture','landscape','planning']},
  {value:'Top-down 90 độ',label:'Top-down 90°',scope:['landscape','planning']},{value:'Eye-level pedestrian',label:'Tầm mắt người đi bộ',scope:['architecture','landscape','planning']},
  {value:'Street corner',label:'Góc giao lộ đường phố',scope:['architecture','planning']},{value:'Long lens',label:'Tele 70mm nén phối cảnh',scope:['architecture','landscape']},
  {value:'Wide establishing',label:'Toàn cảnh rộng 24mm',scope:['architecture','interior','landscape','planning']},{value:'Material close-up',label:'Cận cảnh vật liệu',scope:['architecture','interior','landscape']},
  {value:'Interior doorway',label:'Nhìn qua khung cửa nội thất',scope:['interior']},{value:'Interior corner',label:'Góc phòng chéo 2 điểm tụ',scope:['interior']},
  {value:'One-point interior',label:'Nội thất phối cảnh 1 điểm tụ',scope:['interior']},{value:'Human seated',label:'Tầm mắt người ngồi',scope:['interior']},
  {value:'Kitchen island',label:'Qua đảo bếp nhìn không gian',scope:['interior']},{value:'Interior detail',label:'Cận chi tiết nội thất 50mm',scope:['interior']},
  {value:'Axonometric',label:'Axonometric',scope:['architecture','interior','landscape','planning']},{value:'Panorama',label:'Panorama không gian',scope:['architecture','interior','landscape','planning']},
]

export const SOURCE_TYPES = [standard,...['Phác thảo tay','Line drawing','Screenshot SketchUp','Screenshot Revit','Screenshot 3ds Max','Screenshot Rhino','Clay render','Ảnh mô hình vật lý','Ảnh phối cảnh nháp'].map(label=>({value:label,label}))]
export const PRESERVATION = [standard,{value:'strict',label:'Khóa hình khối tuyệt đối'},{value:'high',label:'Giữ hình khối cao'},{value:'balanced',label:'Cân bằng'},{value:'creative',label:'Cho phép bổ sung chi tiết'}]
export const PEOPLE = [standard,{value:'none',label:'Không người'},{value:'few',label:'Ít người'},{value:'natural',label:'Hoạt động tự nhiên'},{value:'busy',label:'Đông người có kiểm soát'}]
export const VEGETATION = [standard,{value:'minimal',label:'Cây xanh tối giản'},{value:'native',label:'Cây bản địa'},{value:'lush',label:'Xanh tốt nhiệt đới'},{value:'mature',label:'Cây trưởng thành'}]
export const ASPECTS = [{value:'1536x1024',label:'Ngang 3:2 — tiêu chuẩn'},{value:'1024x1024',label:'Vuông 1:1'},{value:'1024x1536',label:'Dọc 2:3'}]
export const QUALITY = [{value:'medium',label:'Tiêu chuẩn — Medium'},{value:'high',label:'Cao — High'},{value:'low',label:'Nhanh — Low'}]

export type RenderSelection = { discipline: Discipline; style: string; projectType: string; sourceType: string; time: string; weather: string; lighting: string; context: string; camera: string; preservation: string; people: string; vegetation: string; aspect: string; quality: string; notes: string }

const labelOf = (items: ScopedOption[], value: string) => items.find(item=>item.value===value)?.label ?? value
const chosen = (items: ScopedOption[], value: string) => value === 'standard' ? 'Tiêu chuẩn, để AI suy luận phù hợp từ ảnh nguồn' : labelOf(items,value)

export function buildRenderPrompt(s: RenderSelection) {
  const discipline = labelOf(DISCIPLINES,s.discipline)
  return `Chuyển ảnh nguồn thành phối cảnh ${discipline.toLowerCase()} photorealistic chuyên nghiệp.

YÊU CẦU BẢO TOÀN: ${chosen(PRESERVATION,s.preservation)}. Nhận diện chính xác hình khối, số tầng, tỷ lệ, kết cấu, hệ cửa, mặt đứng, đồ nội thất chính, địa hình và góc camera từ ảnh nguồn. Không đảo gương, không làm cong đường thẳng, không thêm tầng hoặc thay đổi thiết kế ngoài mức cho phép.

CẤU HÌNH:
- Chuyên ngành: ${discipline}
- Loại công trình: ${chosen(PROJECT_TYPES,s.projectType)}
- Loại ảnh nguồn: ${chosen(SOURCE_TYPES,s.sourceType)}
- Phong cách: ${chosen(STYLES[s.discipline],s.style)}
- Bối cảnh: ${chosen(CONTEXTS,s.context)}
- Thời điểm: ${chosen(TIMES,s.time)}
- Thời tiết: ${chosen(WEATHER,s.weather)}
- Kịch bản ánh sáng: ${chosen(LIGHTING,s.lighting)}
- Camera: ${chosen(CAMERAS,s.camera)}
- Con người/hoạt động: ${chosen(PEOPLE,s.people)}
- Cây xanh: ${chosen(VEGETATION,s.vegetation)}

CHẤT LƯỢNG: vật liệu PBR đúng tỷ lệ, texture tự nhiên, global illumination, bóng tiếp xúc chính xác, kính phản xạ hợp lý, vertical lines thẳng, màu sắc kiểu tạp chí kiến trúc, chi tiết thi công tin cậy. Giữ công trình là chủ thể chính. ${s.notes ? `Ghi chú bổ sung: ${s.notes}.` : ''}

LOẠI BỎ: geometry méo, cửa và cột sai vị trí, tầng thừa, vật thể lơ lửng, cây xuyên công trình, người biến dạng, xe méo, texture lặp, bề mặt nhựa, ánh sáng cháy, HDR quá mức, chữ, logo, watermark.`
}
