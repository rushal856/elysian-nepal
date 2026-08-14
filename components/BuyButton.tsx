'use client';
import { useRouter } from 'next/navigation';
import { PRODUCT } from '@/lib/product';
export function BuyButton({quantity=1,children='Order Now',className='btn gold'}:{quantity?:number;children?:React.ReactNode;className?:string}){const router=useRouter();return <button className={className} onClick={()=>router.push(`/checkout?quantity=${quantity}&price=${PRODUCT.price}`)}>{children}</button>}
