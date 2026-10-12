export const BASE=(import.meta.env.VITE_API_URL || 'http://localhost:5050/api').replace(/\/$/,'')
export async function api(path,options={}) {
 const response=await fetch(`${BASE}${path}`,{credentials:'include',...options,headers:{...(options.body?{'Content-Type':'application/json'}:{}),...options.headers}})
 const data=await response.json().catch(()=>({}))
 if(!response.ok || data.success===false) throw new Error(data.message || `Request failed (${response.status})`)
 return data
}
