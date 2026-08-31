'use client';
import {useEffect} from 'react';
import {PRODUCT} from '@/lib/product';
export function FunnelEvent({event,value=PRODUCT.price}:{event:'InitiateCheckout'|'Purchase';value?:number}){useEffect(()=>{window.fbq?.('track',event,{content_name:PRODUCT.name,content_ids:[PRODUCT.name],content_type:'product',value,currency:'NPR'});},[event,value]);return null}
