import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Traviax - Premium Travel Experience',
  description: 'Discover the world with cinematic beauty. Black & gold premium travel platform.',
  keywords: 'travel, luxury, cinematic, reels, AI concierge, bookings',
  authors: [{ name: 'Traviax Team' }],
  themeColor: '#D4AF37',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-primary text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  )
}
