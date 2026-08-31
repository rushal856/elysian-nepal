'use client';
import { useRouter } from 'next/navigation';
import { PRODUCT } from '@/lib/product';
export function BuyButton({quantity=1,children='Order Now',className='btn gold'}:{quantity?:number;children?:React.ReactNode;className?:string}){const router=useRouter();return <button className={className} onClick={()=>{window.fbq?.('track','AddToCart',{content_name:PRODUCT.name,value:PRODUCT.price*quantity,currency:'NPR'});router.push(`/checkout?quantity=${quantity}&price=${PRODUCT.price}`)}}>{children}</button>}
