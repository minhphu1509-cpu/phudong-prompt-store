type ProviderId='openai'|'gemini'
type Provider={provider:ProviderId;apiKey:string;model:string}
type Body={imageData?:string;prompt?:string;size?:string;quality?:string;providers?:Provider[]}
type Req={method?:string;body?:Body|string}
type Res={status:(code:number)=>Res;json:(body:unknown)=>void;setHeader:(name:string,value:string)=>void}

const DATA_URL=/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/
const MODELS=/^[a-zA-Z0-9._:/-]{1,120}$/
const SIZES=new Set(['1024x1024','1536x1024','1024x1536'])
const QUALITIES=new Set(['low','medium','high'])

function splitImage(value:string){const match=value.match(DATA_URL);if(!match)throw new Error('invalid_image');return{mime:match[1],base64:match[2]}}
async function timedFetch(url:string,init:RequestInit){const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),110_000);try{return await fetch(url,{...init,signal:controller.signal})}finally{clearTimeout(timeout)}}

async function openai(item:Provider,imageData:string,prompt:string,size:string,quality:string){
  const {mime,base64}=splitImage(imageData)
  const bytes=Uint8Array.from(Buffer.from(base64,'base64'))
  const form=new FormData()
  form.append('model',item.model);form.append('prompt',prompt);form.append('image[]',new Blob([bytes],{type:mime}),'source.webp')
  form.append('size',size);form.append('quality',quality);form.append('output_format','webp');form.append('output_compression','82');form.append('moderation','auto')
  const response=await timedFetch('https://api.openai.com/v1/images/edits',{method:'POST',headers:{Authorization:`Bearer ${item.apiKey}`},body:form})
  if(!response.ok)throw new Error(`provider_${response.status}`)
  const payload=await response.json() as {data?:Array<{b64_json?:string}>;output_format?:string}
  const output=payload.data?.[0]?.b64_json;if(!output)throw new Error('invalid_output')
  return{imageData:`data:image/${payload.output_format||'webp'};base64,${output}`,model:item.model}
}

const ratio=(size:string)=>size==='1024x1024'?'1:1':size==='1024x1536'?'2:3':'3:2'
async function gemini(item:Provider,imageData:string,prompt:string,size:string,quality:string){
  const {mime,base64}=splitImage(imageData)
  const response=await timedFetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(item.model)}:generateContent`,{
    method:'POST',headers:{'x-goog-api-key':item.apiKey,'Content-Type':'application/json'},
    body:JSON.stringify({contents:[{role:'user',parts:[{inline_data:{mime_type:mime,data:base64}},{text:prompt}]}],generationConfig:{responseModalities:['TEXT','IMAGE'],imageConfig:{aspectRatio:ratio(size),imageSize:quality==='high'?'2K':'1K'}}}),
  })
  if(!response.ok)throw new Error(`provider_${response.status}`)
  const payload=await response.json() as {modelVersion?:string;candidates?:Array<{content?:{parts?:Array<{inlineData?:{mimeType?:string;data?:string};inline_data?:{mime_type?:string;data?:string}}>}}>}
  const parts=payload.candidates?.[0]?.content?.parts??[]
  const image=parts.map(part=>part.inlineData??(part.inline_data?{mimeType:part.inline_data.mime_type,data:part.inline_data.data}:undefined)).find(Boolean)
  if(!image?.data)throw new Error('invalid_output')
  return{imageData:`data:${image.mimeType||'image/png'};base64,${image.data}`,model:payload.modelVersion||item.model}
}

export const config={maxDuration:120}
export default async function handler(req:Req,res:Res){
  res.setHeader('Cache-Control','no-store, max-age=0');res.setHeader('X-Content-Type-Options','nosniff')
  if(req.method!=='POST')return res.status(405).json({error:'Chỉ hỗ trợ phương thức POST.'})
  let body:Body
  try{body=typeof req.body==='string'?JSON.parse(req.body) as Body:req.body??{}}catch{return res.status(400).json({error:'Dữ liệu gửi lên không hợp lệ.'})}
  if(!body.imageData||body.imageData.length>3_100_000)return res.status(413).json({error:'Ảnh nguồn không hợp lệ hoặc quá lớn.'})
  try{splitImage(body.imageData)}catch{return res.status(400).json({error:'Định dạng ảnh nguồn không được hỗ trợ.'})}
  if(!body.prompt||body.prompt.length<30||body.prompt.length>12_000)return res.status(400).json({error:'Prompt tạo ảnh không hợp lệ.'})
  const size=SIZES.has(body.size??'')?body.size!:'1536x1024';const quality=QUALITIES.has(body.quality??'')?body.quality!:'medium'
  const queue=(Array.isArray(body.providers)?body.providers:[]).slice(0,2).filter((item):item is Provider=>Boolean(item&&(item.provider==='openai'||item.provider==='gemini')&&MODELS.test(item.model)&&typeof item.apiKey==='string'&&item.apiKey.length>=8&&item.apiKey.length<=512))
  if(!queue.length)return res.status(400).json({error:'Chưa có API key tạo ảnh hợp lệ.'})
  const attempts:Array<{provider:ProviderId;status:'failed'|'success'}>=[]
  for(const item of queue){try{const output=item.provider==='openai'?await openai(item,body.imageData,body.prompt,size,quality):await gemini(item,body.imageData,body.prompt,size,quality);if(output.imageData.length>5_800_000)throw new Error('output_too_large');attempts.push({provider:item.provider,status:'success'});return res.status(200).json({...output,providerUsed:item.provider,modelUsed:output.model,attempts})}catch{attempts.push({provider:item.provider,status:'failed'})}}
  return res.status(502).json({error:'Không mô hình nào tạo được ảnh. Hãy kiểm tra API key, tên model, hạn mức hoặc thử chất lượng thấp hơn.',attempts})
}
