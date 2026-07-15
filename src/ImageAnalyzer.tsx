import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle, ArrowRight, CheckCircle2, ChevronDown, Copy, ImagePlus,
  KeyRound, LoaderCircle, LockKeyhole, RefreshCw, Settings2, Sparkles, Trash2,
} from 'lucide-react'
import type {
  AnalysisMode, AnalysisResponse, ProviderId, ProviderRequest, SceneAnalysis,
} from './analyzer-types'

type ProviderState = Record<ProviderId, { apiKey: string; model: string; enabled: boolean }>

const SESSION_KEY = 'phudong-ai-providers'
const CURSOR_KEY = 'phudong-ai-provider-cursor'
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const MAX_DATA_URL_LENGTH = 3_000_000

const PROVIDERS: Array<{ id: ProviderId; name: string; accent: string; defaultModel: string; keyHint: string }> = [
  { id: 'openai', name: 'OpenAI', accent: 'OA', defaultModel: 'gpt-4o-mini', keyHint: 'sk-…' },
  { id: 'gemini', name: 'Google Gemini', accent: 'G', defaultModel: 'gemini-2.5-flash', keyHint: 'AIza…' },
  { id: 'anthropic', name: 'Anthropic Claude', accent: 'C', defaultModel: 'claude-haiku-4-5', keyHint: 'sk-ant-…' },
]

const MODEL_SUGGESTIONS: Record<ProviderId, string[]> = {
  openai: ['gpt-5.6', 'gpt-5.6-terra', 'gpt-5.6-luna', 'gpt-4o-mini'],
  gemini: ['gemini-3.5-flash', 'gemini-2.5-flash'],
  anthropic: ['claude-sonnet-5', 'claude-opus-4-8', 'claude-haiku-4-5'],
}

const EMPTY_PROVIDERS: ProviderState = {
  openai: { apiKey: '', model: 'gpt-4o-mini', enabled: true },
  gemini: { apiKey: '', model: 'gemini-2.5-flash', enabled: true },
  anthropic: { apiKey: '', model: 'claude-haiku-4-5', enabled: true },
}

const MODE_LABELS: Record<AnalysisMode, string> = {
  full: 'Bối cảnh & ánh sáng',
  context: 'Chỉ bối cảnh',
  lighting: 'Chỉ ánh sáng',
}

const readProviders = (): ProviderState => {
  try {
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '{}') as Partial<ProviderState>
    return Object.fromEntries(PROVIDERS.map(({ id }) => [id, { ...EMPTY_PROVIDERS[id], ...stored[id] }])) as ProviderState
  } catch {
    return EMPTY_PROVIDERS
  }
}

const loadImage = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve(image)
  image.onerror = () => reject(new Error('Không thể đọc tệp ảnh này.'))
  image.src = url
})

async function compressImage(file: File) {
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await loadImage(objectUrl)
    let scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight))
    let quality = 0.86
    let dataUrl = ''

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Trình duyệt không hỗ trợ xử lý ảnh.')
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      dataUrl = canvas.toDataURL('image/webp', quality)
      if (dataUrl.length <= MAX_DATA_URL_LENGTH) break
      if (quality > 0.62) quality -= 0.08
      else scale *= 0.82
    }

    if (!dataUrl || dataUrl.length > MAX_DATA_URL_LENGTH) {
      throw new Error('Ảnh vẫn quá lớn sau khi nén. Hãy chọn ảnh có độ phân giải thấp hơn.')
    }
    return dataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function ResultBlock({ title, text, onCopy, highlighted = false }: { title: string; text: string; onCopy: (text: string) => void; highlighted?: boolean }) {
  return (
    <article className={`analysis-result-block ${highlighted ? 'highlighted' : ''}`}>
      <div><strong>{title}</strong><button onClick={() => onCopy(text)} aria-label={`Sao chép ${title}`}><Copy size={15} /> Sao chép</button></div>
      <p>{text || 'Không có dữ liệu.'}</p>
    </article>
  )
}

function DetailGrid({ analysis }: { analysis: SceneAnalysis }) {
  const details = [
    ['Loại bối cảnh', analysis.context.sceneType],
    ['Địa điểm / môi trường', analysis.context.setting],
    ['Thành phần hậu cảnh', analysis.context.backgroundElements],
    ['Mặt nền', analysis.context.groundCondition],
    ['Cây xanh', analysis.context.vegetation],
    ['Thời tiết', analysis.context.weather],
    ['Thời điểm', analysis.context.timeOfDay],
    ['Không khí bối cảnh', analysis.context.atmosphere],
    ['Nguồn sáng', analysis.lighting.primarySource],
    ['Hướng sáng', analysis.lighting.direction],
    ['Độ mềm', analysis.lighting.quality],
    ['Nhiệt độ màu', analysis.lighting.colorTemperature],
    ['Tương phản', analysis.lighting.contrast],
    ['Bóng đổ', analysis.lighting.shadows],
    ['Không khí', analysis.lighting.atmosphere],
  ]
  return <div className="analysis-detail-grid">{details.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value || 'Không xác định'}</strong></div>)}</div>
}

export default function ImageAnalyzer({ onCopy }: { onCopy: (text: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [providers, setProviders] = useState<ProviderState>(readProviders)
  const [strategy, setStrategy] = useState<'auto' | ProviderId>('auto')
  const [mode, setMode] = useState<AnalysisMode>('full')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState('')
  const [imageData, setImageData] = useState('')
  const [fileName, setFileName] = useState('')
  const [processingImage, setProcessingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [response, setResponse] = useState<AnalysisResponse | null>(null)
  const [providerTests, setProviderTests] = useState<Partial<Record<ProviderId, { loading: boolean; ok?: boolean; message?: string; suggestedModel?: string }>>>({})

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(providers))
  }, [providers])

  const configured = useMemo(() => PROVIDERS.filter(({ id }) => providers[id].enabled && providers[id].apiKey.trim()), [providers])

  const updateProvider = (id: ProviderId, patch: Partial<ProviderState[ProviderId]>) => {
    setProviders((current) => ({ ...current, [id]: { ...current[id], ...patch } }))
  }

  const testProvider = async (id: ProviderId) => {
    const current = providers[id]
    if (!current.apiKey.trim()) {
      setProviderTests((tests) => ({ ...tests, [id]: { loading: false, ok: false, message: 'Hãy nhập API key trước' } }))
      return
    }
    setProviderTests((tests) => ({ ...tests, [id]: { loading: true } }))
    try {
      const request = await fetch('/api/test-provider', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: id, model: current.model.trim(), apiKey: current.apiKey.trim() }) })
      const payload = await request.json() as { ok?: boolean; message?: string; error?: string; suggestedModel?: string }
      setProviderTests((tests) => ({ ...tests, [id]: { loading: false, ok: request.ok && payload.ok, message: payload.message || payload.error || 'Không thể kiểm tra kết nối', suggestedModel: payload.suggestedModel } }))
    } catch {
      setProviderTests((tests) => ({ ...tests, [id]: { loading: false, ok: false, message: 'Không gọi được API kiểm tra trên Vercel' } }))
    }
  }

  const handleFile = async (file?: File) => {
    if (!file) return
    setError('')
    setResponse(null)
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('Ảnh vượt quá 10 MB. Hãy chọn tệp nhỏ hơn.')
      return
    }
    setProcessingImage(true)
    try {
      const compressed = await compressImage(file)
      setPreview(compressed)
      setImageData(compressed)
      setFileName(file.name)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Không thể xử lý ảnh.')
    } finally {
      setProcessingImage(false)
    }
  }

  const clearImage = () => {
    setPreview('')
    setImageData('')
    setFileName('')
    setResponse(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const providerQueue = (): ProviderRequest[] => {
    const available = configured.map(({ id }) => ({
      provider: id,
      model: providers[id].model.trim() || EMPTY_PROVIDERS[id].model,
      apiKey: providers[id].apiKey.trim(),
    }))
    if (strategy !== 'auto') return available.filter((item) => item.provider === strategy)
    if (available.length < 2) return available
    const cursor = Number(sessionStorage.getItem(CURSOR_KEY) ?? '0') % available.length
    return [...available.slice(cursor), ...available.slice(0, cursor)]
  }

  const analyze = async () => {
    setError('')
    setResponse(null)
    const queue = providerQueue()
    if (!imageData) return setError('Hãy tải một ảnh lên trước khi phân tích.')
    if (!queue.length) {
      setSettingsOpen(true)
      return setError(strategy === 'auto' ? 'Hãy nhập ít nhất một API key.' : `Hãy nhập API key cho ${PROVIDERS.find((item) => item.id === strategy)?.name}.`)
    }

    setLoading(true)
    try {
      const request = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData, mode, providers: queue }),
      })
      const payload = await request.json() as AnalysisResponse & { error?: string }
      if (!request.ok) throw new Error(payload.error || 'Không thể phân tích ảnh lúc này.')
      setResponse(payload)
      if (strategy === 'auto' && configured.length > 1) {
        const cursor = Number(sessionStorage.getItem(CURSOR_KEY) ?? '0')
        sessionStorage.setItem(CURSOR_KEY, String((cursor + 1) % configured.length))
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Đã có lỗi khi phân tích ảnh.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="analyzer-section" id="analyzer">
      <div className="analyzer-heading">
        <div><span className="section-kicker"><Sparkles size={14} /> Context & Lighting Studio</span><h2>Trích xuất bối cảnh và ánh sáng</h2>
          <p>Tải bất kỳ ảnh tham chiếu nào. AI chỉ đọc môi trường và hệ ánh sáng — không phân tích công trình, nội thất, vật liệu hay hình khối trong ảnh.</p></div>
        <div className="privacy-pill"><LockKeyhole size={15} /><span><strong>BYOK riêng tư</strong>Key chỉ lưu trong phiên này</span></div>
      </div>

      <div className="analyzer-workspace">
        <div className="analyzer-controls">
          <div className="analyzer-toolbar">
            <label><span>Chế độ phân tích</span><div className="analyzer-select"><select value={mode} onChange={(event) => setMode(event.target.value as AnalysisMode)}>
              {Object.entries(MODE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select><ChevronDown size={15} /></div></label>
            <label><span>Mô hình</span><div className="analyzer-select"><select value={strategy} onChange={(event) => setStrategy(event.target.value as 'auto' | ProviderId)}>
              <option value="auto">Tự động xoay tua</option>{PROVIDERS.map((provider) => <option key={provider.id} value={provider.id}>{provider.name}</option>)}
            </select><ChevronDown size={15} /></div></label>
            <button className={`settings-toggle ${settingsOpen ? 'active' : ''}`} onClick={() => setSettingsOpen(!settingsOpen)}><Settings2 size={17} /> API key <b>{configured.length}</b></button>
          </div>

          {settingsOpen && <div className="provider-settings">
            <div className="provider-settings-head"><div><KeyRound size={17} /><span><strong>Kết nối mô hình của bạn</strong><small>Khóa được gửi trực tiếp qua backend bảo mật và không ghi vào cơ sở dữ liệu.</small></span></div><button onClick={() => setProviders(EMPTY_PROVIDERS)}>Xóa toàn bộ key</button></div>
            <div className="provider-list">{PROVIDERS.map((provider) => <article key={provider.id} className={providers[provider.id].apiKey ? 'configured' : ''}>
              <label className="provider-switch"><input type="checkbox" checked={providers[provider.id].enabled} onChange={(event) => updateProvider(provider.id, { enabled: event.target.checked })} /><span /><b>{provider.accent}</b><strong>{provider.name}</strong>{providers[provider.id].apiKey && <CheckCircle2 size={15} />}</label>
              <label><span>API key</span><input type="password" autoComplete="off" spellCheck={false} placeholder={provider.keyHint} value={providers[provider.id].apiKey} onChange={(event) => updateProvider(provider.id, { apiKey: event.target.value })} /></label>
              <label><span>Model</span><input type="text" list={`models-${provider.id}`} spellCheck={false} value={providers[provider.id].model} onChange={(event) => updateProvider(provider.id, { model: event.target.value })} /><datalist id={`models-${provider.id}`}>{MODEL_SUGGESTIONS[provider.id].map((model) => <option key={model} value={model} />)}</datalist></label>
              <div className={`provider-test ${providerTests[provider.id]?.ok === true ? 'success' : providerTests[provider.id]?.ok === false ? 'failed' : ''}`}>
                <button onClick={() => void testProvider(provider.id)} disabled={providerTests[provider.id]?.loading}>{providerTests[provider.id]?.loading ? <LoaderCircle className="spinning" size={13} /> : <RefreshCw size={13} />} Kiểm tra API</button>
                {providerTests[provider.id]?.message && <span>{providerTests[provider.id]?.message}</span>}
                {providerTests[provider.id]?.suggestedModel && <button className="model-suggestion" onClick={() => { updateProvider(provider.id, { model: providerTests[provider.id]?.suggestedModel ?? provider.defaultModel }); setProviderTests((tests) => ({ ...tests, [provider.id]: undefined })) }}>Dùng {providerTests[provider.id]?.suggestedModel}</button>}
              </div>
            </article>)}</div>
            <p className="provider-note"><LockKeyhole size={14} /> Không lưu key vào GitHub, Vercel hay localStorage. Đóng tab sẽ xóa cấu hình phiên.</p>
          </div>}

          <div
            className={`image-dropzone ${dragging ? 'dragging' : ''} ${preview ? 'has-image' : ''}`}
            onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => { event.preventDefault(); setDragging(false); void handleFile(event.dataTransfer.files[0]) }}
          >
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void handleFile(event.target.files?.[0])} />
            {preview ? <>
              <img src={preview} alt="Ảnh tham chiếu đã tải lên" />
              <div className="image-file-meta"><span><CheckCircle2 size={16} /><strong>{fileName}</strong><small>Đã tối ưu để phân tích</small></span><button onClick={clearImage} aria-label="Xóa ảnh"><Trash2 size={16} /></button></div>
            </> : <button onClick={() => inputRef.current?.click()} disabled={processingImage}>
              {processingImage ? <LoaderCircle className="spinning" size={34} /> : <ImagePlus size={34} />}
              <strong>{processingImage ? 'Đang tối ưu ảnh…' : 'Thả ảnh vào đây hoặc chọn từ thiết bị'}</strong>
              <span>Mọi loại ảnh · chỉ dùng để tham chiếu bối cảnh và ánh sáng</span>
            </button>}
          </div>

          {error && <div className="analyzer-error" role="alert"><AlertCircle size={17} /><span>{error}</span></div>}
          <button className="analyze-button" onClick={() => void analyze()} disabled={loading || processingImage}>
            {loading ? <><LoaderCircle className="spinning" size={18} /> Đang đọc bối cảnh & ánh sáng…</> : <><Sparkles size={18} /> Phân tích và tạo prompt <ArrowRight size={17} /></>}
          </button>
        </div>

        <div className={`analyzer-output ${response ? 'has-result' : ''}`}>
          {!response ? <div className="output-placeholder"><span><Sparkles size={27} /></span><h3>Dùng ảnh như mẫu môi trường</h3><p>Công trình hoặc chủ thể trong ảnh sẽ được bỏ qua. Kết quả chỉ chuyển bối cảnh và ánh sáng sang prompt render.</p><div><i /> Đọc môi trường<i /> Trích xuất ánh sáng<i /> Bảo vệ thiết kế nguồn</div></div> : <>
            <div className="output-heading"><div><span>Kết quả phân tích</span><h3>{response.result.summary}</h3></div><div className="model-used"><CheckCircle2 size={15} /><span><strong>{PROVIDERS.find((item) => item.id === response.providerUsed)?.name}</strong>{response.modelUsed}</span></div></div>
            {response.attempts.length > 1 && <div className="fallback-trace"><RefreshCw size={14} /> Đã chuyển mô hình tự động: {response.attempts.map((attempt) => `${PROVIDERS.find((item) => item.id === attempt.provider)?.name}${attempt.error ? ` (${attempt.error})` : ''}`).join(' → ')}</div>}
            <DetailGrid analysis={response.result} />
            <ResultBlock title="Prompt tiếng Việt" text={response.result.promptVi} onCopy={onCopy} highlighted />
            <ResultBlock title="Prompt tiếng Anh" text={response.result.promptEn} onCopy={onCopy} />
            <ResultBlock title="Negative prompt" text={response.result.negativePrompt} onCopy={onCopy} />
            <div className="recommended-settings"><span>Tỷ lệ tham khảo <strong>{response.result.recommendedSettings.aspectRatio}</strong></span><span>Mood <strong>{response.result.recommendedSettings.mood}</strong></span></div>
          </>}
        </div>
      </div>
    </section>
  )
}
