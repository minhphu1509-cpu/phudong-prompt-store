type ProviderId = 'openai' | 'gemini' | 'anthropic'
type Body = { provider?: ProviderId; model?: string; apiKey?: string }
type Request = { method?: string; body?: Body | string }
type Response = { status: (code: number) => Response; json: (body: unknown) => void; setHeader: (name: string, value: string) => void }

const MODEL_PATTERN = /^[a-zA-Z0-9._:/-]{1,120}$/
const messageFor = (status: number) => {
  if (status === 400) return 'Yêu cầu hoặc tên model không hợp lệ'
  if (status === 401) return 'API key không hợp lệ hoặc đã hết hiệu lực'
  if (status === 403) return 'API key chưa có quyền truy cập model hoặc khu vực bị hạn chế'
  if (status === 404) return 'Không tìm thấy model trong tài khoản này'
  if (status === 429) return 'Tài khoản đã hết hạn mức hoặc đang bị giới hạn tốc độ'
  if (status >= 500) return 'Máy chủ nhà cung cấp đang tạm thời gián đoạn'
  return `Nhà cung cấp phản hồi mã ${status}`
}

async function check(provider: ProviderId, model: string, apiKey: string) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)
  try {
    const config = provider === 'openai'
      ? { url: `https://api.openai.com/v1/models/${encodeURIComponent(model)}`, headers: { Authorization: `Bearer ${apiKey}` } }
      : provider === 'gemini'
        ? { url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}`, headers: { 'x-goog-api-key': apiKey } }
        : { url: `https://api.anthropic.com/v1/models/${encodeURIComponent(model)}`, headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' } }
    const response = await fetch(config.url, { headers: config.headers, signal: controller.signal })
    if (!response.ok) return { ok: false, status: response.status, message: messageFor(response.status) }
    return { ok: true, status: response.status, message: `Kết nối thành công với ${model}` }
  } catch (error) {
    const timeoutError = error instanceof Error && error.name === 'AbortError'
    return { ok: false, status: 0, message: timeoutError ? 'Kết nối quá thời gian 15 giây' : 'Vercel không kết nối được tới máy chủ nhà cung cấp' }
  } finally { clearTimeout(timeout) }
}

export const config = { maxDuration: 30 }
export default async function handler(request: Request, response: Response) {
  response.setHeader('Cache-Control', 'no-store, max-age=0')
  if (request.method !== 'POST') return response.status(405).json({ error: 'Chỉ hỗ trợ POST.' })
  let body: Body
  try { body = typeof request.body === 'string' ? JSON.parse(request.body) as Body : request.body ?? {} }
  catch { return response.status(400).json({ error: 'Dữ liệu không hợp lệ.' }) }
  if (!body.provider || !['openai','gemini','anthropic'].includes(body.provider)) return response.status(400).json({ error: 'Nhà cung cấp không hợp lệ.' })
  if (!body.model || !MODEL_PATTERN.test(body.model)) return response.status(400).json({ error: 'Tên model không hợp lệ.' })
  if (!body.apiKey || body.apiKey.length < 8 || body.apiKey.length > 512) return response.status(400).json({ error: 'API key không hợp lệ.' })
  const result = await check(body.provider, body.model, body.apiKey)
  return response.status(result.ok ? 200 : 502).json(result)
}
