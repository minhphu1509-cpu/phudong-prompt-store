type ProviderId = 'openai' | 'gemini' | 'anthropic'
type AnalysisMode = 'full' | 'context' | 'lighting'

type ProviderRequest = {
  provider: ProviderId
  model: string
  apiKey: string
}

type RequestBody = {
  imageData?: string
  mode?: AnalysisMode
  providers?: ProviderRequest[]
}

type VercelRequestLike = { method?: string; body?: RequestBody | string }
type VercelResponseLike = {
  status: (statusCode: number) => VercelResponseLike
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
}

type ProviderResult = { text: string; model: string }

const MAX_IMAGE_LENGTH = 3_100_000
const PROVIDERS = new Set<ProviderId>(['openai', 'gemini', 'anthropic'])
const MODES = new Set<AnalysisMode>(['full', 'context', 'lighting'])
const MODEL_PATTERN = /^[a-zA-Z0-9._:/-]{1,120}$/

const field = (value: unknown, fallback = 'Không xác định') => typeof value === 'string' && value.trim() ? value.trim() : fallback

function normalizeResult(value: unknown) {
  const root = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const context = root.context && typeof root.context === 'object' ? root.context as Record<string, unknown> : {}
  const lighting = root.lighting && typeof root.lighting === 'object' ? root.lighting as Record<string, unknown> : {}
  const settings = root.recommendedSettings && typeof root.recommendedSettings === 'object' ? root.recommendedSettings as Record<string, unknown> : {}
  return {
    summary: field(root.summary, 'Phân tích bối cảnh và ánh sáng từ ảnh tham chiếu'),
    context: {
      spaceType: field(context.spaceType),
      locationStyle: field(context.locationStyle),
      architecture: field(context.architecture),
      materials: field(context.materials),
      landscape: field(context.landscape),
      weather: field(context.weather),
      timeOfDay: field(context.timeOfDay),
      camera: field(context.camera),
    },
    lighting: {
      primarySource: field(lighting.primarySource),
      direction: field(lighting.direction),
      quality: field(lighting.quality),
      colorTemperature: field(lighting.colorTemperature),
      contrast: field(lighting.contrast),
      shadows: field(lighting.shadows),
      atmosphere: field(lighting.atmosphere),
    },
    promptVi: field(root.promptVi, 'Không thể tạo prompt tiếng Việt.'),
    promptEn: field(root.promptEn, 'Unable to generate an English prompt.'),
    negativePrompt: field(root.negativePrompt, 'low quality, distorted perspective, inconsistent lighting, overexposed, underexposed'),
    recommendedSettings: {
      aspectRatio: field(settings.aspectRatio, '16:9'),
      lens: field(settings.lens, '35mm'),
      mood: field(settings.mood, 'cinematic'),
    },
  }
}

function extractJson(text: string) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  try { return JSON.parse(cleaned) as unknown } catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start < 0 || end <= start) throw new Error('invalid_output')
    return JSON.parse(cleaned.slice(start, end + 1)) as unknown
  }
}

function buildInstruction(mode: AnalysisMode) {
  const focus = mode === 'context'
    ? 'Ưu tiên phân tích bối cảnh, không gian, vật liệu, kiến trúc và góc máy.'
    : mode === 'lighting'
      ? 'Ưu tiên phân tích nguồn sáng, hướng sáng, độ mềm, màu sắc, tương phản, bóng đổ và không khí.'
      : 'Phân tích cân bằng cả bối cảnh lẫn hệ ánh sáng.'

  return `Bạn là chuyên gia art direction, nhiếp ảnh và diễn họa kiến trúc. Hãy đọc ảnh tham chiếu một cách khách quan và tạo prompt tái dựng bối cảnh cùng ánh sáng. ${focus}

Quy tắc:
- Chỉ mô tả những gì nhìn thấy hoặc có thể suy luận hợp lý; ghi "Không xác định" nếu thiếu bằng chứng.
- Không nhận diện danh tính, không suy đoán thuộc tính nhạy cảm của bất kỳ người nào trong ảnh.
- Prompt phải tập trung vào không gian, vật liệu, môi trường, bố cục, góc máy và ánh sáng; đủ chi tiết để dùng với công cụ tạo ảnh.
- promptVi viết tiếng Việt tự nhiên; promptEn là bản tiếng Anh tối ưu cho image generation, không phải bản dịch máy từng chữ.
- Chỉ trả về một JSON hợp lệ, không markdown, không giải thích ngoài JSON.

JSON schema bắt buộc:
{
  "summary": "một câu tóm tắt",
  "context": {
    "spaceType": "loại không gian",
    "locationStyle": "phong cách/địa điểm",
    "architecture": "đặc điểm kiến trúc",
    "materials": "vật liệu và bề mặt",
    "landscape": "cảnh quan và vật thể nền",
    "weather": "thời tiết",
    "timeOfDay": "thời điểm trong ngày",
    "camera": "bố cục, góc máy, tiêu cự ước lượng"
  },
  "lighting": {
    "primarySource": "nguồn sáng chính và phụ",
    "direction": "hướng sáng",
    "quality": "ánh sáng cứng/mềm/khuếch tán",
    "colorTemperature": "nhiệt độ và sắc màu",
    "contrast": "mức tương phản",
    "shadows": "hình thái bóng đổ",
    "atmosphere": "sương, bụi, glow, volumetric hoặc không khí"
  },
  "promptVi": "prompt tiếng Việt hoàn chỉnh",
  "promptEn": "English production-ready image prompt",
  "negativePrompt": "negative prompt bằng tiếng Anh",
  "recommendedSettings": {
    "aspectRatio": "tỷ lệ khung hình",
    "lens": "ống kính gợi ý",
    "mood": "mood ngắn gọn"
  }
}`
}

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 48_000)
  try { return await fetch(url, { ...init, signal: controller.signal }) }
  finally { clearTimeout(timeout) }
}

function splitImageData(imageData: string) {
  const match = imageData.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/)
  if (!match) throw new Error('invalid_image')
  return { mimeType: match[1], base64: match[2] }
}

async function callOpenAI(item: ProviderRequest, imageData: string, instruction: string): Promise<ProviderResult> {
  const response = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${item.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: item.model,
      messages: [{ role: 'user', content: [
        { type: 'text', text: instruction },
        { type: 'image_url', image_url: { url: imageData, detail: 'high' } },
      ] }],
      response_format: { type: 'json_object' },
      max_completion_tokens: 2200,
    }),
  })
  if (!response.ok) throw new Error(`provider_${response.status}`)
  const payload = await response.json() as { model?: string; choices?: Array<{ message?: { content?: string } }> }
  const text = payload.choices?.[0]?.message?.content
  if (!text) throw new Error('invalid_output')
  return { text, model: payload.model || item.model }
}

async function callGemini(item: ProviderRequest, imageData: string, instruction: string): Promise<ProviderResult> {
  const { mimeType, base64 } = splitImageData(imageData)
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(item.model)}:generateContent`
  const response = await fetchWithTimeout(endpoint, {
    method: 'POST',
    headers: { 'x-goog-api-key': item.apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ inline_data: { mime_type: mimeType, data: base64 } }, { text: instruction }] }],
      generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 2200, temperature: 0.25 },
    }),
  })
  if (!response.ok) throw new Error(`provider_${response.status}`)
  const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; modelVersion?: string }
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('')
  if (!text) throw new Error('invalid_output')
  return { text, model: payload.modelVersion || item.model }
}

async function callAnthropic(item: ProviderRequest, imageData: string, instruction: string): Promise<ProviderResult> {
  const { mimeType, base64 } = splitImageData(imageData)
  const response = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': item.apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: item.model,
      max_tokens: 2200,
      temperature: 0.25,
      messages: [{ role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
        { type: 'text', text: instruction },
      ] }],
    }),
  })
  if (!response.ok) throw new Error(`provider_${response.status}`)
  const payload = await response.json() as { model?: string; content?: Array<{ type?: string; text?: string }> }
  const text = payload.content?.filter((block) => block.type === 'text').map((block) => block.text ?? '').join('')
  if (!text) throw new Error('invalid_output')
  return { text, model: payload.model || item.model }
}

async function callProvider(item: ProviderRequest, imageData: string, instruction: string) {
  if (item.provider === 'openai') return callOpenAI(item, imageData, instruction)
  if (item.provider === 'gemini') return callGemini(item, imageData, instruction)
  return callAnthropic(item, imageData, instruction)
}

export const config = { maxDuration: 60 }

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  response.setHeader('Cache-Control', 'no-store, max-age=0')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  if (request.method !== 'POST') return response.status(405).json({ error: 'Chỉ hỗ trợ phương thức POST.' })

  let body: RequestBody
  try { body = typeof request.body === 'string' ? JSON.parse(request.body) as RequestBody : request.body ?? {} }
  catch { return response.status(400).json({ error: 'Dữ liệu gửi lên không hợp lệ.' }) }

  if (!body.imageData || body.imageData.length > MAX_IMAGE_LENGTH) return response.status(413).json({ error: 'Ảnh không hợp lệ hoặc vượt quá giới hạn.' })
  try { splitImageData(body.imageData) } catch { return response.status(400).json({ error: 'Định dạng ảnh không được hỗ trợ.' }) }
  const mode = body.mode && MODES.has(body.mode) ? body.mode : 'full'
  const queue = Array.isArray(body.providers) ? body.providers.slice(0, 3) : []
  const validQueue = queue.filter((item): item is ProviderRequest => Boolean(
    item && PROVIDERS.has(item.provider) && MODEL_PATTERN.test(item.model) && typeof item.apiKey === 'string' && item.apiKey.length >= 8 && item.apiKey.length <= 512,
  ))
  if (!validQueue.length) return response.status(400).json({ error: 'Chưa có cấu hình API key hợp lệ.' })

  const attempts: Array<{ provider: ProviderId; status: 'failed' | 'success' }> = []
  const instruction = buildInstruction(mode)
  for (const item of validQueue) {
    try {
      const providerResult = await callProvider(item, body.imageData, instruction)
      const result = normalizeResult(extractJson(providerResult.text))
      attempts.push({ provider: item.provider, status: 'success' })
      return response.status(200).json({ result, providerUsed: item.provider, modelUsed: providerResult.model, attempts })
    } catch {
      attempts.push({ provider: item.provider, status: 'failed' })
    }
  }

  return response.status(502).json({
    error: 'Tất cả mô hình đã thử đều chưa phản hồi. Hãy kiểm tra API key, tên model hoặc hạn mức tài khoản.',
    attempts,
  })
}
