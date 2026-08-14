import type {Metadata} from 'next'; import './globals.css';
export const metadata:Metadata={title:'Chasma | ELYSIAN NEPAL',description:'Premium oversized fashion sunglasses. Cash on Delivery across Nepal.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
