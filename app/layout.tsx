import type {Metadata} from 'next'; import './globals.css'; import {MetaPixel} from '@/components/MetaPixel';
export const metadata:Metadata={title:'Chasma | ELYSIAN NEPAL',description:'Premium oversized fashion sunglasses. Cash on Delivery across Nepal.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><MetaPixel/>{children}</body></html>}
