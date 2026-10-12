import { Link } from 'react-router-dom'
import menImage from '../../assets/hero/unboxstorehero2.png'
import womenImage from '../../assets/hero/unboxstorehero3.png'
const panels=[{label:'MEN',to:'/shop?gender=men',image:menImage},{label:'WOMEN',to:'/shop?gender=women',image:womenImage}]
export default function GenderSplit(){return <section aria-label="Shop by collection" className="grid grid-cols-1 sm:grid-cols-2">{panels.map(p=><Link key={p.label} to={p.to} className="group relative block aspect-[4/3] overflow-hidden bg-neutral-900 sm:aspect-[4/5]"><img src={p.image} alt={`${p.label} collection artwork`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/><span className="absolute bottom-6 left-6 border-b border-white pb-2 text-3xl font-black text-white sm:bottom-10 sm:left-10 sm:text-5xl">SHOP {p.label} ↗</span></Link>)}</section>}
