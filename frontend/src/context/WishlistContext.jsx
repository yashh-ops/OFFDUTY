import {createContext,useContext,useEffect,useState} from 'react'
import {useNavigate,useLocation} from 'react-router-dom'
import {useAuth} from './AuthContext'
import {api} from '../services/api'
const Context=createContext(null)
export function WishlistProvider({children}){
 const {user,loading}=useAuth(),navigate=useNavigate(),location=useLocation()
 const [products,setProducts]=useState([]),[busy,setBusy]=useState(false)
 useEffect(()=>{let live=true;setProducts([]);if(user?.role==='customer')api('/wishlist').then(d=>{if(live)setProducts(d.products)}).catch(console.error);return()=>{live=false}},[user?.id,user?._id])
 const productIds=products.map(p=>String(p._id))
 async function toggle(id){if(!user){navigate('/login',{state:{from:location.pathname+location.search}});return}if(busy)return;setBusy(true);try{if(productIds.includes(String(id))){await api(`/wishlist/${id}`,{method:'DELETE'});setProducts(old=>old.filter(p=>String(p._id)!==String(id)))}else{await api(`/wishlist/${id}`,{method:'PUT'});const d=await api('/wishlist');setProducts(d.products)}}catch(e){alert(e.message)}finally{setBusy(false)}}
 return <Context.Provider value={{products,productIds,toggle,isWishlisted:id=>productIds.includes(String(id)),count:productIds.length,loading,busy}}>{children}</Context.Provider>
}
export function useWishlist(){const c=useContext(Context);if(!c)throw new Error('WishlistProvider missing');return c}
