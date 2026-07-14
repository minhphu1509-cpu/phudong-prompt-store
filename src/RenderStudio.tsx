import { useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, ChevronDown, Copy, Download, ExternalLink, ImagePlus, KeyRound, LoaderCircle, LockKeyhole, RotateCcw, Sparkles, Trash2, WandSparkles } from 'lucide-react'
import {
  ASPECTS, CAMERAS, CONTEXTS, DISCIPLINES, LIGHTING, PEOPLE, PRESERVATION, PROJECT_TYPES, QUALITY,
  SOURCE_TYPES, STYLES, TIMES, VEGETATION, WEATHER, buildRenderPrompt,
  type Discipline, type RenderSelection, type ScopedOption,
} from './render-config'

type ProviderId = 'openai' | 'gemini'
type ProviderConfig = Record<ProviderId,{apiKey:string;model:string;enabled:boolean}>
type RenderResponse = { imageData:string; providerUsed:ProviderId; modelUsed:string; attempts:Array<{provider:ProviderId;status:'failed'|'success'}> }

const PROVIDER_KEY = 'phudong-render-providers'
const AI_KEY = 'phudong-ai-providers'
const MAX_FILE = 10 * 1024 * 1024
const defaults: ProviderConfig = {
  openai:{apiKey:'',model:'gpt-image-2',enabled:true},
  gemini:{apiKey:'',model:'gemini-3.1-flash-image',enabled:true},
}
const defaultSelection: RenderSelection = { discipline:'architecture',style:'standard',projectType:'standard',sourceType:'standard',time:'standard',weather:'standard',lighting:'standard',context:'standard',camera:'standard',preservation:'standard',people:'standard',vegetation:'standard',aspect:'1536x1024',quality:'medium',notes:'' }
const IMAGE_MODELS:Record<ProviderId,Array<{value:string;label:string}>>={
  openai:[{value:'gpt-image-2',label:'GPT Image 2 — chất lượng cao (trả phí)'},{value:'gpt-image-1-mini',label:'GPT Image 1 Mini — tiết kiệm (trả phí)'}],
  gemini:[{value:'gemini-3.1-flash-image',label:'Gemini 3.1 Flash Image — nhanh (trả phí)'},{value:'gemini-2.5-flash-image',label:'Gemini 2.5 Flash Image — tiết kiệm (trả phí)'}],
}

function readProviders():ProviderConfig {
  try {
    const prior=JSON.parse(sessionStorage.getItem(AI_KEY)??'{}')
    const saved=JSON.parse(sessionStorage.getItem(PROVIDER_KEY)??'{}')
    return {
      openai:{...defaults.openai,...saved.openai,apiKey:saved.openai?.apiKey||prior.openai?.apiKey||''},
      gemini:{...defaults.gemini,...saved.gemini,apiKey:saved.gemini?.apiKey||prior.gemini?.apiKey||''},
    }
  } catch { return defaults }
}

const loadImage=(url:string)=>new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Không thể đọc ảnh nguồn.'));image.src=url})
async function optimize(file:File){
  const url=URL.createObjectURL(file)
  try {
    const image=await loadImage(url); let scale=Math.min(1,1800/Math.max(image.naturalWidth,image.naturalHeight)); let quality=.9; let output=''
    for(let i=0;i<9;i+=1){const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Trình duyệt không hỗ trợ xử lý ảnh.');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);output=canvas.toDataURL('image/webp',quality);if(output.length<3_000_000)break;if(quality>.62)quality-=.08;else scale*=.82}
    if(!output||output.length>=3_000_000)throw new Error('Ảnh quá lớn sau khi tối ưu. Hãy dùng ảnh độ phân giải thấp hơn.')
    return output
  } finally {URL.revokeObjectURL(url)}
}

function Field({label,value,options,onChange}:{label:string;value:string;options:ScopedOption[];onChange:(value:string)=>void}){
  return <label className="render-field"><span>{label}</span><div><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select><ChevronDown size={14}/></div></label>
}

export default function RenderStudio({onCopy}:{onCopy:(text:string)=>void}){
  const inputRef=useRef<HTMLInputElement>(null)
  const [selection,setSelection]=useState<RenderSelection>(defaultSelection)
  const [providers,setProviders]=useState<ProviderConfig>(readProviders)
  const [strategy,setStrategy]=useState<'auto'|ProviderId>('auto')
  const [usageMode,setUsageMode]=useState<'platform'|'api'>('platform')
  const [apiOpen,setApiOpen]=useState(false)
  const [preview,setPreview]=useState('')
  const [imageData,setImageData]=useState('')
  const [fileName,setFileName]=useState('')
  const [processing,setProcessing]=useState(false)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const [result,setResult]=useState<RenderResponse|null>(null)
  const prompt=useMemo(()=>buildRenderPrompt(selection),[selection])
  const scoped=(items:ScopedOption[])=>items.filter((item,index)=>index===0||!item.scope||item.scope.includes(selection.discipline))
  const configured=(Object.keys(providers) as ProviderId[]).filter(id=>providers[id].enabled&&providers[id].apiKey.trim())
  const set=<K extends keyof RenderSelection>(key:K,value:RenderSelection[K])=>setSelection(current=>({...current,[key]:value}))

  const changeDiscipline=(discipline:Discipline)=>setSelection(current=>({...current,discipline,style:'standard',projectType:'standard',lighting:'standard',camera:'standard'}))
  const updateProvider=(id:ProviderId,patch:Partial<ProviderConfig[ProviderId]>)=>{setProviders(current=>{const next={...current,[id]:{...current[id],...patch}};sessionStorage.setItem(PROVIDER_KEY,JSON.stringify(next));return next})}
  const handleFile=async(file?:File)=>{if(!file)return;setError('');setResult(null);if(!['image/jpeg','image/png','image/webp'].includes(file.type))return setError('Chỉ hỗ trợ JPG, PNG hoặc WebP.');if(file.size>MAX_FILE)return setError('Ảnh vượt quá giới hạn 10 MB.');setProcessing(true);try{const data=await optimize(file);setPreview(data);setImageData(data);setFileName(file.name)}catch(caught){setError(caught instanceof Error?caught.message:'Không thể xử lý ảnh.')}finally{setProcessing(false)}}
  const clear=()=>{setPreview('');setImageData('');setFileName('');setResult(null);if(inputRef.current)inputRef.current.value=''}
  const openPlatform=(url:string)=>{onCopy(prompt);window.open(url,'_blank','noopener,noreferrer')}

  const generate=async()=>{
    setError('');setResult(null)
    if(!imageData)return setError('Hãy tải ảnh phác thảo hoặc screenshot mô hình 3D.')
    const queue=(Object.keys(providers) as ProviderId[]).filter(id=>providers[id].enabled&&providers[id].apiKey.trim()&&(strategy==='auto'||strategy===id)).map(id=>({provider:id,apiKey:providers[id].apiKey.trim(),model:providers[id].model.trim()}))
    if(!queue.length){setApiOpen(true);return setError('Hãy nhập API key OpenAI hoặc Gemini để tạo ảnh.')}
    setLoading(true)
    try{const response=await fetch('/api/generate-render',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imageData,prompt,size:selection.aspect,quality:selection.quality,providers:queue})});const payload=await response.json() as RenderResponse&{error?:string};if(!response.ok)throw new Error(payload.error||'Không thể tạo phối cảnh lúc này.');setResult(payload)}catch(caught){setError(caught instanceof Error?caught.message:'Đã có lỗi khi tạo ảnh.')}finally{setLoading(false)}
  }

  return <section className="render-section" id="render-studio">
    <div className="render-heading"><div><span className="section-kicker"><WandSparkles size={14}/> AI Architectural Render</span><h2>Từ mô hình thô đến phối cảnh thực tế</h2><p>Tải ảnh phác thảo hoặc screenshot phần mềm 3D, khóa thiết kế và điều khiển bối cảnh, phong cách, ánh sáng, camera bằng bộ cấu hình chuyên ngành.</p></div><div className="render-counts"><span><strong>4</strong>chuyên ngành</span><span><strong>120</strong>phong cách</span><span><strong>40</strong>loại hình</span><span><strong>40</strong>bối cảnh</span></div></div>
    <div className="discipline-tabs">{DISCIPLINES.map(item=><button key={item.value} className={selection.discipline===item.value?'active':''} onClick={()=>changeDiscipline(item.value as Discipline)}>{item.label}<small>30 phong cách</small></button>)}</div>
    <div className="render-workspace">
      <div className="render-config-panel">
        <div className="render-source">
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>void handleFile(e.target.files?.[0])}/>
          {preview?<><img src={preview} alt="Ảnh nguồn phối cảnh"/><div><span><CheckCircle2 size={15}/><strong>{fileName}</strong></span><button onClick={clear}><Trash2 size={15}/></button></div></>:<button onClick={()=>inputRef.current?.click()} disabled={processing}>{processing?<LoaderCircle className="spinning" size={30}/>:<ImagePlus size={30}/>}<strong>{processing?'Đang tối ưu ảnh…':'Tải sketch hoặc screenshot 3D'}</strong><span>SketchUp · Revit · 3ds Max · Rhino · phác thảo tay</span></button>}
        </div>
        <div className="render-fields">
          <Field label="Loại ảnh nguồn" value={selection.sourceType} options={SOURCE_TYPES} onChange={v=>set('sourceType',v)}/>
          <Field label="Loại công trình" value={selection.projectType} options={scoped(PROJECT_TYPES)} onChange={v=>set('projectType',v)}/>
          <Field label="Phong cách thiết kế" value={selection.style} options={STYLES[selection.discipline]} onChange={v=>set('style',v)}/>
          <Field label="Mức giữ nguyên thiết kế" value={selection.preservation} options={PRESERVATION} onChange={v=>set('preservation',v)}/>
          <Field label="Bối cảnh" value={selection.context} options={CONTEXTS} onChange={v=>set('context',v)}/>
          <Field label="Góc camera" value={selection.camera} options={scoped(CAMERAS)} onChange={v=>set('camera',v)}/>
          <Field label="Thời điểm" value={selection.time} options={TIMES} onChange={v=>set('time',v)}/>
          <Field label="Thời tiết" value={selection.weather} options={WEATHER} onChange={v=>set('weather',v)}/>
          <Field label="Kịch bản ánh sáng" value={selection.lighting} options={scoped(LIGHTING)} onChange={v=>set('lighting',v)}/>
          <Field label="Con người & hoạt động" value={selection.people} options={PEOPLE} onChange={v=>set('people',v)}/>
          <Field label="Cây xanh" value={selection.vegetation} options={VEGETATION} onChange={v=>set('vegetation',v)}/>
          <Field label="Tỷ lệ ảnh" value={selection.aspect} options={ASPECTS} onChange={v=>set('aspect',v)}/>
          <Field label="Chất lượng" value={selection.quality} options={QUALITY} onChange={v=>set('quality',v)}/>
          <label className="render-field render-notes"><span>Ghi chú bổ sung</span><textarea value={selection.notes} onChange={e=>set('notes',e.target.value)} maxLength={500} placeholder="Ví dụ: giữ nguyên mẫu gạch mặt tiền, bổ sung cây bằng lăng…"/></label>
        </div>
        <div className="render-actions-row"><button onClick={()=>setSelection(defaultSelection)}><RotateCcw size={14}/> Đặt lại tiêu chuẩn</button><button onClick={()=>onCopy(prompt)}><Copy size={14}/> Sao chép prompt</button></div>
        <div className="render-usage-mode" role="tablist" aria-label="Cách sử dụng mô hình tạo ảnh"><button className={usageMode==='platform'?'active':''} onClick={()=>setUsageMode('platform')}><Sparkles size={15}/><span><strong>Dùng quota trên nền tảng</strong><small>Không gọi API từ website</small></span></button><button className={usageMode==='api'?'active':''} onClick={()=>setUsageMode('api')}><KeyRound size={15}/><span><strong>API trực tiếp</strong><small>Có thể phát sinh chi phí</small></span></button></div>
        {usageMode==='platform'&&<div className="free-platform-box"><div><strong>Tạo ảnh bằng quota của tài khoản</strong><p>Website sẽ sao chép prompt và mở nền tảng. Hãy tải lại ảnh nguồn trong cửa sổ mới. Số lượt miễn phí do ChatGPT hoặc Gemini quyết định và có thể thay đổi.</p></div><div className="free-platform-actions"><button onClick={()=>openPlatform('https://chatgpt.com/')}><span className="platform-logo">OA</span><span><strong>Mở ChatGPT</strong><small>Sao chép prompt trước khi mở</small></span><ExternalLink size={14}/></button><button onClick={()=>openPlatform('https://aistudio.google.com/')}><span className="platform-logo google">G</span><span><strong>Mở Gemini AI Studio</strong><small>Sao chép prompt trước khi mở</small></span><ExternalLink size={14}/></button></div><small className="free-disclaimer">Không thể dùng quota web thông qua API key. “Miễn phí” phụ thuộc gói và giới hạn của tài khoản trên từng nền tảng.</small></div>}
        {usageMode==='api'&&<><button className="render-api-toggle" onClick={()=>setApiOpen(!apiOpen)}><KeyRound size={16}/> Cấu hình API tạo ảnh <b>{configured.length}</b><ChevronDown size={15}/></button>
        {apiOpen&&<div className="render-provider-box">
          <div className="render-provider-head"><LockKeyhole size={15}/><span>API key chỉ lưu trong phiên tab hiện tại</span><select value={strategy} onChange={e=>setStrategy(e.target.value as 'auto'|ProviderId)}><option value="auto">Tự động dự phòng</option><option value="openai">OpenAI</option><option value="gemini">Gemini</option></select></div>
          {(['openai','gemini'] as ProviderId[]).map(id=><div className="render-provider" key={id}><label><input type="checkbox" checked={providers[id].enabled} onChange={e=>updateProvider(id,{enabled:e.target.checked})}/><strong>{id==='openai'?'OpenAI':'Google Gemini'}</strong></label><input type="password" autoComplete="off" placeholder="API key" value={providers[id].apiKey} onChange={e=>updateProvider(id,{apiKey:e.target.value})}/><select value={providers[id].model} onChange={e=>updateProvider(id,{model:e.target.value})}>{IMAGE_MODELS[id].map(model=><option key={model.value} value={model.value}>{model.label}</option>)}</select></div>)}
        </div>}
        </>}
        {error&&<div className="analyzer-error"><AlertCircle size={16}/>{error}</div>}
        {usageMode==='api'&&<><button className="render-generate" onClick={()=>void generate()} disabled={loading||processing}>{loading?<><LoaderCircle className="spinning" size={18}/> AI đang dựng phối cảnh…</>:<><Sparkles size={18}/> Tạo phối cảnh qua API</>}</button><p className="render-cost-note">Các API tạo ảnh hiện tại có thể tính phí. Website không thể ép API sử dụng quota miễn phí của ChatGPT hoặc Gemini web.</p></>}
      </div>
      <div className="render-output-panel">
        {result?<><div className="render-result-head"><span><CheckCircle2 size={15}/><strong>Đã tạo bằng {result.providerUsed==='openai'?'OpenAI':'Gemini'}</strong><small>{result.modelUsed}</small></span><a href={result.imageData} download="phudong-architectural-render.webp"><Download size={15}/> Lưu ảnh</a></div><img src={result.imageData} alt="Phối cảnh kiến trúc do AI tạo"/>{result.attempts.length>1&&<p>Đã tự chuyển mô hình dự phòng sau khi lần gọi đầu không thành công.</p>}</>:<div className="render-empty"><span><WandSparkles size={30}/></span><h3>Phối cảnh sẽ xuất hiện tại đây</h3><p>Giá trị “Tiêu chuẩn” giúp AI tự suy luận lựa chọn phù hợp từ ảnh nguồn; bạn chỉ cần thay những thông số muốn kiểm soát.</p><ul><li>Khóa hình khối và camera</li><li>Vật liệu PBR chân thực</li><li>Ánh sáng kiến trúc chuyên nghiệp</li></ul></div>}
      </div>
    </div>
  </section>
}
