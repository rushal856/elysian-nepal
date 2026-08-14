'use client';
import {useState} from 'react'; import {PRODUCT} from '@/lib/product';
export function ProductGallery(){const [active,setActive]=useState(0);return <div><div className="gallery-main"><img src={PRODUCT.images[active]} alt={`${PRODUCT.name} view ${active+1}`}/></div><div className="thumbs">{PRODUCT.images.map((image,i)=><button key={image} className={i===active?'active':''} onClick={()=>setActive(i)} aria-label={`Show image ${i+1}`}><img src={image} alt=""/></button>)}</div></div>}
