import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight, Bookmark, Building2, Camera, Check, ChevronDown, Copy, ExternalLink, Flame, Github,
  Grid2X2, Heart, Images, Library, Menu, MessageSquareText, QrCode, Search, SlidersHorizontal, Sparkles, Users, WandSparkles, X,
} from 'lucide-react'
import rawPrompts from './data/prompts.json'
import { additionalPrompts } from './data/additional-prompts'
import { buildQuickConfig, getQuickFilters } from './data/quick-filters'
import ImageAnalyzer from './ImageAnalyzer'
import RenderStudio from './RenderStudio'
import type { PromptItem } from './types'

const prompts = [...rawPrompts as PromptItem[], ...additionalPrompts]
const PAGE_SIZE = 18
type AppView = 'home' | 'tools' | 'library'

const normalize = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .toLowerCase()

const extractArguments = (prompt: string) => {
  const variables = new Map<string, string>()
  const pattern = /\{argument name=["']([^"']+)["'] default=["']([^"']*)["']\}/g
  for (const match of prompt.matchAll(pattern)) variables.set(match[1], match[2])
  return [...variables.entries()].map(([name, defaultValue]) => ({ name, defaultValue }))
}

const applyArguments = (prompt: string, values: Record<string, string>) => prompt.replace(
  /\{argument name=["']([^"']+)["'] default=["']([^"']*)["']\}/g,
  (_match, name, defaultValue) => values[name] || defaultValue,
)

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span>A</span></span>
}

function WelcomeScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="welcome-screen" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-backdrop" />
      <button className="welcome-close" onClick={onClose} aria-label="Đóng màn hình chào mừng"><X size={19} /></button>
      <div className="welcome-layout">
        <section className="welcome-copy">
          <div className="welcome-brand"><BrandMark /><span><strong>AI Architecture</strong><small>Studio · by PhuDong AI</small></span></div>
          <span className="welcome-kicker"><Sparkles size={13} /> Creative intelligence for architecture</span>
          <h1 id="welcome-title">Biến ý tưởng thành<br /><em>không gian sống động.</em></h1>
          <p>Nền tảng AI dành cho kiến trúc sư và nhà thiết kế Việt Nam — tạo phối cảnh chân thực, phân tích hình ảnh và khai thác 500 prompt chuyên sâu trong một không gian làm việc.</p>
          <div className="welcome-features">
            <article><Images size={19} /><span><strong>Tạo ảnh phối cảnh</strong><small>Từ phác thảo và mô hình 3D</small></span></article>
            <article><MessageSquareText size={19} /><span><strong>Prompt từ hình ảnh</strong><small>Phân tích bối cảnh và ánh sáng</small></span></article>
            <article><Library size={19} /><span><strong>500 prompt tuyển chọn</strong><small>Kiến trúc, nội thất và sáng tạo</small></span></article>
          </div>
          <div className="welcome-actions">
            <button className="welcome-primary" onClick={onClose}>Khám phá Studio <ArrowRight size={17} /></button>
            <a href="https://phudong-appstore.vercel.app/" target="_blank" rel="noreferrer">Thư viện ứng dụng AI <ExternalLink size={15} /></a>
            <a href="https://zalo.me/g/kodwgn037" target="_blank" rel="noreferrer"><Users size={15} /> Tham gia nhóm Zalo</a>
          </div>
          <small className="welcome-credit">Developed with precision by <strong>PhuDong AI</strong></small>
        </section>
        <section className="welcome-showcase" aria-label="Hình ảnh demo">
          <div className="welcome-main-image">
            <img src="/images/welcome-design-board.webp" alt="Đồ án tổng hợp kiến trúc, nội thất và quy hoạch" width="1600" height="900" fetchPriority="high" />
            <span>Architecture · Interior · Masterplan <b>01</b></span>
          </div>
          <div className="welcome-mini-images">
            <figure><img src="/images/welcome-design-board.webp" alt="" width="1600" height="900" /><figcaption><Camera size={13} /> Kiến trúc & nội thất</figcaption></figure>
            <figure><img src="/images/welcome-design-board.webp" alt="" width="1600" height="900" /><figcaption><Building2 size={13} /> Quy hoạch tổng thể</figcaption></figure>
          </div>
          <div className="welcome-image-note"><i /><span><strong>AI DESIGN LAB</strong> Kiến trúc · Nội thất · Quy hoạch</span></div>
        </section>
      </div>
    </div>
  )
}

function VisualPlaceholder({ item, large = false }: { item: PromptItem; large?: boolean }) {
  return (
    <span className={`visual-placeholder ${large ? 'large' : ''}`} aria-hidden="true">
      <span className="visual-orbit" />
      <WandSparkles size={large ? 42 : 28} />
      <small>{item.category}</small>
      <strong>{item.title.slice(0, 2).toUpperCase()}</strong>
    </span>
  )
}

type HeaderProps = {
  query: string
  setQuery: (value: string) => void
  favoriteCount: number
  showFavorites: boolean
  setShowFavorites: (value: boolean) => void
  onMenu: () => void
  activeView: AppView
  onNavigate: (view: AppView) => void
}

function Header({ query, setQuery, favoriteCount, showFavorites, setShowFavorites, onMenu, activeView, onNavigate }: HeaderProps) {
  return (
    <header className="site-header">
      <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Mở bộ lọc"><Menu size={20} /></button>
      <button className="brand brand-button" onClick={() => onNavigate('home')} aria-label="AI Architecture Studio - Trang chủ">
        <BrandMark />
        <span><strong>AI Architecture</strong><small>Studio</small></span>
      </button>
      <label className="header-search">
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm prompt, phong cách, tác giả..."
          aria-label="Tìm kiếm prompt"
        />
        <kbd>⌘ K</kbd>
      </label>
      <nav className="header-actions" aria-label="Điều hướng chính">
        <button className={`header-task header-task-primary ${activeView === 'tools' ? 'active' : ''}`} onClick={() => onNavigate('tools')}><WandSparkles size={17} /><span><strong>Công cụ AI</strong><small>Tạo ảnh & prompt</small></span></button>
        <button className={`header-task header-task-library ${activeView === 'library' && !showFavorites ? 'active' : ''}`} onClick={() => onNavigate('library')}><Library size={17} /><span><strong>Thư viện prompt</strong><small>500 mẫu tuyển chọn</small></span></button>
        <button className={`favorites-button ${showFavorites ? 'active' : ''}`} onClick={() => { setShowFavorites(!showFavorites); onNavigate('library') }}>
          <Heart size={17} fill={showFavorites ? 'currentColor' : 'none'} />
          <span>Đã lưu</span><b>{favoriteCount}</b>
        </button>
      </nav>
    </header>
  )
}

type SidebarProps = {
  categories: Array<[string, number]>
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  open: boolean
  onClose: () => void
}

function Sidebar({ categories, selectedCategory, setSelectedCategory, open, onClose }: SidebarProps) {
  const choose = (category: string) => { setSelectedCategory(category); onClose() }
  return (
    <>
      <button className={`sidebar-scrim ${open ? 'visible' : ''}`} onClick={onClose} aria-label="Đóng bộ lọc" />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-heading">
          <span>Danh mục</span>
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
        </div>
        <button className={`category-button ${selectedCategory === 'Tất cả' ? 'active' : ''}`} onClick={() => choose('Tất cả')}>
          <span className="category-icon"><Grid2X2 size={16} /></span><span>Tất cả prompt</span><b>{prompts.length}</b>
        </button>
        {categories.map(([category, count]) => (
          <button key={category} className={`category-button ${selectedCategory === category ? 'active' : ''}`} onClick={() => choose(category)}>
            <span className="category-dot" /><span>{category}</span><b>{count}</b>
          </button>
        ))}
        <div className="sidebar-card">
          <Sparkles size={20} /><strong>Góc sáng tạo</strong>
          <p>Thay đổi các biến trong prompt để tạo phiên bản riêng của bạn.</p>
          <a href="#gallery">Khám phá ngay <ArrowRight size={14} /></a>
        </div>
      </aside>
    </>
  )
}

function Hero({ featured, onOpen, onNavigate }: { featured: PromptItem; onOpen: (prompt: PromptItem) => void; onNavigate: (view: AppView) => void }) {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={15} /> AI Architecture Studio cho người Việt</div>
        <h1>Từ ý tưởng thiết kế đến<br /><em>phối cảnh chân thực.</em></h1>
        <p>Một không gian làm việc AI thống nhất để tạo phối cảnh từ mô hình 3D, phân tích ảnh, viết prompt và khám phá thư viện kiến trúc chuyên sâu.</p>
        <div className="hero-actions">
          <button className="primary-button" onClick={() => onNavigate('tools')}><Sparkles size={17} /> Mở bộ công cụ AI</button>
          <button className="secondary-button" onClick={() => onNavigate('library')}>Khám phá thư viện <ArrowRight size={17} /></button>
        </div>
        <div className="hero-stats">
          <div><strong>{prompts.length}</strong><span>prompt tuyển chọn</span></div><i />
          <div><strong>{new Set(prompts.map((item) => item.category)).size}</strong><span>danh mục sáng tạo</span></div><i />
          <div><strong>CC BY</strong><span>có thể tùy biến</span></div>
        </div>
      </div>
      <button className="featured-visual" onClick={() => onOpen(featured)} aria-label={`Xem ${featured.title}`}>
        {featured.images[0]
          ? <img src={featured.images[0]} alt={featured.title} />
          : <VisualPlaceholder item={featured} large />}
        <span className="featured-badge"><Flame size={14} /> Nổi bật tuần này</span>
        <span className="visual-caption">
          <small>{featured.category}</small><strong>{featured.title}</strong><span>Xem chi tiết <ArrowRight size={15} /></span>
        </span>
      </button>
    </section>
  )
}

type ToolTab = 'render' | 'prompt'

function ToolWorkspace({ active, setActive, onCopy }: { active: ToolTab; setActive: (tab: ToolTab) => void; onCopy: (text: string) => void }) {
  return (
    <section className="tools-hub" id="tools">
      <div className="tools-hub-heading">
        <div><span className="section-kicker"><Sparkles size={14} /> Không gian làm việc</span><h2>Chọn công cụ theo nhiệm vụ</h2><p>Mỗi tab là một quy trình riêng; cấu hình và ảnh đang làm vẫn được giữ nguyên khi chuyển đổi.</p></div>
        <span className="tools-hub-badge">2 công cụ chuyên biệt</span>
      </div>
      <div className="tool-tabs" role="tablist" aria-label="Nhóm công cụ AI">
        <button role="tab" aria-selected={active === 'render'} aria-controls="render-tool-panel" className={active === 'render' ? 'active' : ''} onClick={() => setActive('render')}>
          <span><Images size={20} /></span><strong>Tạo ảnh phối cảnh</strong><small>Sketch / 3D screenshot → ảnh thực tế</small>
        </button>
        <button role="tab" aria-selected={active === 'prompt'} aria-controls="prompt-tool-panel" className={active === 'prompt' ? 'active' : ''} onClick={() => setActive('prompt')}>
          <span><MessageSquareText size={20} /></span><strong>Tạo prompt từ ảnh</strong><small>Trích xuất bối cảnh và ánh sáng</small>
        </button>
      </div>
      <div id="render-tool-panel" role="tabpanel" className={`tool-pane ${active === 'render' ? 'active' : ''}`} aria-hidden={active !== 'render'}><RenderStudio onCopy={onCopy} /></div>
      <div id="prompt-tool-panel" role="tabpanel" className={`tool-pane ${active === 'prompt' ? 'active' : ''}`} aria-hidden={active !== 'prompt'}><ImageAnalyzer onCopy={onCopy} /></div>
    </section>
  )
}

type PromptCardProps = {
  item: PromptItem
  favorite: boolean
  onFavorite: (id: string) => void
  onOpen: (prompt: PromptItem) => void
  onCopy: (text: string) => void
}

function PromptCard({ item, favorite, onFavorite, onOpen, onCopy }: PromptCardProps) {
  return (
    <article className="prompt-card">
      <button className="card-image" onClick={() => onOpen(item)} aria-label={`Xem ${item.title}`}>
        {item.images[0]
          ? <img src={item.images[0]} alt={item.title} loading="lazy" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} />
          : <VisualPlaceholder item={item} />}
        <span className="card-overlay"><span>Xem prompt <ArrowRight size={15} /></span></span>
        {item.featured && <span className="mini-featured"><Sparkles size={12} /> Chọn lọc</span>}
      </button>
      <div className="card-body">
        <div className="card-meta"><span>{item.category}</span><span>•</span><span>{item.language.toUpperCase()}</span></div>
        <button className="card-title" onClick={() => onOpen(item)}>{item.title}</button>
        <p>{item.description}</p>
        <div className="card-footer">
          <span className="author">{item.author?.name ?? 'Cộng đồng'}</span>
          <div>
            <button onClick={() => onCopy(item.prompt)} aria-label="Sao chép prompt" title="Sao chép prompt"><Copy size={16} /></button>
            <button className={favorite ? 'favorite' : ''} onClick={() => onFavorite(item.id)} aria-label={favorite ? 'Bỏ lưu prompt' : 'Lưu prompt'} title={favorite ? 'Bỏ lưu' : 'Lưu prompt'}>
              <Bookmark size={17} fill={favorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

type PromptDialogProps = {
  item: PromptItem
  favorite: boolean
  onFavorite: (id: string) => void
  onClose: () => void
  onCopy: (text: string) => void
}

function PromptDialog({ item, favorite, onFavorite, onClose, onCopy }: PromptDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const variables = useMemo(() => extractArguments(item.prompt), [item.prompt])
  const quickFilters = useMemo(() => getQuickFilters(item.category, item.title), [item.category, item.title])
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(variables.map((v) => [v.name, v.defaultValue])))
  const [quickValues, setQuickValues] = useState<Record<string, string>>(() => Object.fromEntries(quickFilters.map((field) => [field.key, 'standard'])))
  const finalPrompt = useMemo(() => applyArguments(item.prompt, values) + buildQuickConfig(quickFilters, quickValues), [item.prompt, values, quickFilters, quickValues])
  const resetQuickFilters = () => setQuickValues(Object.fromEntries(quickFilters.map((field) => [field.key, 'standard'])))

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal()
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [])

  return (
    <dialog ref={dialogRef} className="prompt-dialog" onClose={onClose}>
      <button className="dialog-scrim" onClick={() => dialogRef.current?.close()} aria-label="Đóng" />
      <div className="dialog-panel">
        <button className="dialog-close" onClick={() => dialogRef.current?.close()} aria-label="Đóng"><X size={20} /></button>
        <div className="dialog-media">
          {item.images[0]
            ? <img src={item.images[0]} alt={item.title} />
            : <VisualPlaceholder item={item} large />}
          {item.images.length > 1 && <div className="image-count">1 / {item.images.length} ảnh</div>}
        </div>
        <div className="dialog-content">
          <div className="dialog-labels">
            <span>{item.category}</span>
            {item.featured && <span className="highlight"><Sparkles size={12} /> Nổi bật</span>}
          </div>
          <h2>{item.title}</h2>
          <p className="dialog-description">{item.description}</p>
          <div className="dialog-byline"><span>Đóng góp bởi <strong>{item.author?.name ?? 'Cộng đồng'}</strong></span><span>{item.published}</span></div>

          <section className="variables-panel">
              <div className="section-title"><span><SlidersHorizontal size={16} /> Tùy biến nhanh</span><span className="filter-title-actions"><small>{variables.length + quickFilters.length} tùy chọn</small><button onClick={resetQuickFilters}>Đặt lại</button></span></div>
              <div className="variable-grid">
                {variables.map((variable) => (
                  <label key={variable.name}><span>{variable.name}</span>
                    <input value={values[variable.name] ?? ''} onChange={(event) => setValues({ ...values, [variable.name]: event.target.value })} />
                  </label>
                ))}
                {quickFilters.map((field) => (
                  <label key={field.key}><span>{field.label}</span>
                    <div className="quick-select"><select value={quickValues[field.key] ?? 'standard'} onChange={(event) => setQuickValues({ ...quickValues, [field.key]: event.target.value })}>
                      {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select><ChevronDown size={14} /></div>
                  </label>
                ))}
              </div>
            </section>

          <section className="prompt-panel">
            <div className="section-title"><span><WandSparkles size={16} /> Prompt hoàn chỉnh</span><small>{finalPrompt.length.toLocaleString('vi-VN')} ký tự</small></div>
            <pre>{finalPrompt}</pre>
          </section>

          <div className="dialog-actions">
            <button className="primary-button" onClick={() => onCopy(finalPrompt)}><Copy size={17} /> Sao chép prompt</button>
            <button className={`save-button ${favorite ? 'active' : ''}`} onClick={() => onFavorite(item.id)}>
              <Bookmark size={17} fill={favorite ? 'currentColor' : 'none'} />{favorite ? 'Đã lưu' : 'Lưu prompt'}
            </button>
            {item.source?.url && <a className="source-button" href={item.source.url} target="_blank" rel="noreferrer">Nguồn <ExternalLink size={15} /></a>}
          </div>
        </div>
      </div>
    </dialog>
  )
}

function App() {
  const [welcomeOpen, setWelcomeOpen] = useState(() => sessionStorage.getItem('ai-architecture-welcomed') !== '1')
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [sort, setSort] = useState('featured')
  const [selected, setSelected] = useState<PromptItem | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [activeTool, setActiveTool] = useState<ToolTab>('render')
  const [activeView, setActiveView] = useState<AppView>('home')
  const [toast, setToast] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('phudong-favorites') ?? '[]')) }
    catch { return new Set() }
  })

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of prompts) counts.set(item.category, (counts.get(item.category) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [])

  const filtered = useMemo(() => {
    const needle = normalize(query.trim())
    const result = prompts.filter((item) => {
      if (showFavorites && !favorites.has(item.id)) return false
      if (selectedCategory !== 'Tất cả' && item.category !== selectedCategory) return false
      if (!needle) return true
      return normalize([item.title, item.category, item.description, item.prompt, item.author?.name].join(' ')).includes(needle)
    })
    return [...result].sort((a, b) => {
      if (sort === 'name') return a.title.localeCompare(b.title, 'vi')
      if (sort === 'newest') return b.id.localeCompare(a.id)
      return Number(b.featured) - Number(a.featured)
    })
  }, [favorites, query, selectedCategory, showFavorites, sort])

  useEffect(() => setVisibleCount(PAGE_SIZE), [query, selectedCategory, showFavorites, sort])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        document.querySelector<HTMLInputElement>('.header-search input')?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const toggleFavorite = (id: string) => setFavorites((current) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id); else next.add(id)
    localStorage.setItem('phudong-favorites', JSON.stringify([...next]))
    return next
  })

  const copyPrompt = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setToast('Đã sao chép prompt')
    window.setTimeout(() => setToast(''), 1800)
  }

  const featured = prompts.find((item) => item.featured) ?? prompts[0]
  const navigate = (view: AppView) => {
    setActiveView(view)
    setSidebarOpen(false)
    if (view !== 'library') setShowFavorites(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const closeWelcome = () => {
    sessionStorage.setItem('ai-architecture-welcomed', '1')
    setWelcomeOpen(false)
  }

  return (
    <div className="app-shell">
      {welcomeOpen && <WelcomeScreen onClose={closeWelcome} />}
      <Header query={query} setQuery={(value) => { setQuery(value); if (value) setActiveView('library') }} favoriteCount={favorites.size} showFavorites={showFavorites} setShowFavorites={setShowFavorites} onMenu={() => { setActiveView('library'); setSidebarOpen(true) }} activeView={activeView} onNavigate={navigate} />
      {activeView === 'library' && <Sidebar categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
      <main className={`main-content ${activeView !== 'library' ? 'focused-layout' : ''}`}>
        {activeView === 'home' && <>
          <Hero featured={featured} onOpen={setSelected} onNavigate={navigate} />
          <section className="about-banner" id="about">
            <div><span className="section-kicker">Bắt đầu thật đơn giản</span><h2>Chọn đúng việc cần làm. Studio lo phần còn lại.</h2>
              <p>Người mới chỉ cần chọn tạo phối cảnh, trích xuất bối cảnh–ánh sáng hoặc khám phá prompt. Các thiết lập nâng cao chỉ xuất hiện khi bạn cần.</p>
            </div>
            <button onClick={() => navigate('tools')} className="primary-button">Bắt đầu làm việc <ArrowRight size={17} /></button>
          </section>
        </>}
        <div className={`view-panel ${activeView === 'tools' ? 'active' : ''}`} aria-hidden={activeView !== 'tools'}><ToolWorkspace active={activeTool} setActive={setActiveTool} onCopy={copyPrompt} /></div>
        <div className={`view-panel ${activeView === 'library' ? 'active' : ''}`} aria-hidden={activeView !== 'library'}><section className="gallery-section view-gallery" id="gallery">
          <div className="gallery-heading">
            <div>
              <span className="section-kicker">Bộ sưu tập tuyển chọn</span>
              <h2>{showFavorites ? 'Prompt đã lưu' : selectedCategory === 'Tất cả' ? 'Khám phá prompt' : selectedCategory}</h2>
              <p>{filtered.length} kết quả phù hợp với lựa chọn của bạn</p>
            </div>
            <label className="sort-select"><span>Sắp xếp:</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Nổi bật trước</option><option value="newest">Mới nhất</option><option value="name">Tên A–Z</option>
              </select><ChevronDown size={15} />
            </label>
          </div>

          {filtered.length > 0 ? <>
            <div className="prompt-grid">
              {filtered.slice(0, visibleCount).map((item) => (
                <PromptCard key={item.id} item={item} favorite={favorites.has(item.id)} onFavorite={toggleFavorite} onOpen={setSelected} onCopy={copyPrompt} />
              ))}
            </div>
            {visibleCount < filtered.length && <button className="load-more" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Xem thêm prompt <ArrowRight size={16} /></button>}
          </> : (
            <div className="empty-state"><Search size={28} /><h3>Chưa tìm thấy prompt phù hợp</h3><p>Thử từ khóa khác hoặc xóa bộ lọc hiện tại.</p>
              <button onClick={() => { setQuery(''); setSelectedCategory('Tất cả'); setShowFavorites(false) }}>Xóa bộ lọc</button>
            </div>
          )}
        </section></div>
      </main>

      <footer className={activeView !== 'library' ? 'focused-layout' : ''}>
        <div className="footer-brand"><BrandMark /><span><strong>AI Architecture Studio</strong><small>Made for Vietnamese creators.</small></span></div>
        <p className="footer-links"><a href="https://phudong-appstore.vercel.app/" target="_blank" rel="noreferrer"><Library size={13} /> Thư viện AI</a><a href="https://zalo.me/g/kodwgn037" target="_blank" rel="noreferrer"><Users size={13} /> Nhóm Zalo</a><button onClick={() => setWelcomeOpen(true)}><Sparkles size={13} /> Giới thiệu</button></p>
        <span>© 2026 AI Architecture Studio</span>
      </footer>

      {activeView === 'home' && <section className="support-developer focused-layout" aria-label="Ủng hộ nhà phát triển">
        <div className="support-copy"><span><QrCode size={18} /> Ủng hộ nhà phát triển</span><h2>Đồng hành cùng PhuDong AI</h2><p>Sự ủng hộ của bạn giúp chúng tôi tiếp tục phát triển các công cụ AI hữu ích cho cộng đồng kiến trúc Việt Nam.</p>
          <div><small>Techcombank</small><strong>150919769999</strong><span>Đồng Minh Phú</span></div>
        </div>
        <div className="support-qr"><img src="https://img.vietqr.io/image/TCB-150919769999-compact2.png?accountName=DONG%20MINH%20PHU" alt="Mã QR chuyển khoản Techcombank cho Đồng Minh Phú" /><small>Quét mã bằng ứng dụng ngân hàng</small></div>
      </section>}

      {selected && <PromptDialog item={selected} favorite={favorites.has(selected.id)} onFavorite={toggleFavorite} onClose={() => setSelected(null)} onCopy={copyPrompt} />}
      <div className={`toast ${toast ? 'visible' : ''}`} role="status"><Check size={16} /> {toast}</div>
    </div>
  )
}

export default App
