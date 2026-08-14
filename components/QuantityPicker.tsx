'use client';
export function QuantityPicker({quantity,setQuantity}:{quantity:number;setQuantity:(n:number)=>void}){return <div className="qty"><button type="button" onClick={()=>setQuantity(Math.max(1,quantity-1))} aria-label="Decrease quantity">−</button><span>{quantity}</span><button type="button" onClick={()=>setQuantity(quantity+1)} aria-label="Increase quantity">+</button></div>}
