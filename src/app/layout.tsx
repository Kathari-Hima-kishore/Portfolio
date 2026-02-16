import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

import { MobileWarning } from '@/components/ui/MobileWarning'

export const metadata: Metadata = {
  title: 'Portfolio | Hima Kishore ',
  description: 'Explore every dimension of design and development',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" href="/mething_copy.spline" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-bg text-text overflow-x-hidden`}>
        <MobileWarning />
        {children}
      </body>
    </html>
  )
}