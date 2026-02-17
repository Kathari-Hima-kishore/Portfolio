import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

import { MobileWarning } from '@/components/ui/MobileWarning'
import { ScaleWrapper } from '@/components/ui/ScaleWrapper'

const SITE_URL = 'https://kathari-hima-kishore.tech'

export const metadata: Metadata = {
  title: 'Kathari Hima Kishore | Full Stack Developer & Designer',
  description:
    'Portfolio of Kathari Hima Kishore — Full Stack Developer & Designer specializing in interactive web experiences, 3D design, and modern web technologies.',
  keywords: [
    'Kathari Hima Kishore',
    'Hima Kishore',
    'portfolio',
    'full stack developer',
    'web developer',
    'designer',
    'Next.js',
    'React',
    'Spline',
    '3D web',
  ],
  authors: [{ name: 'Kathari Hima Kishore', url: SITE_URL }],
  creator: 'Kathari Hima Kishore',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Kathari Hima Kishore — Portfolio',
    title: 'Kathari Hima Kishore | Full Stack Developer & Designer',
    description:
      'Explore every dimension of design and development. Interactive portfolio featuring 3D experiences, projects, and skills.',
  },
  icons: {
    icon: '/favicon.ico?v=2',
  },
  verification: {
    google: 'IH_kb7SV0TwGIPepllI6UuR65658mPz7cvv70ypVsCo',
  },
}

// JSON-LD Person structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Kathari Hima Kishore',
  url: SITE_URL,
  jobTitle: 'Full Stack Developer & Designer',
  sameAs: [
    'https://www.linkedin.com/in/kathari-hima-kishore/',
    'https://github.com/Kathari-Hima-kishore',
  ],
  description:
    'Full Stack Developer & Designer specializing in interactive web experiences, 3D design, and modern web technologies.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window._audioContexts = [];
              const originalCreate = window.AudioContext || window.webkitAudioContext;
              if (originalCreate) {
                  window.AudioContext = function(...args) {
                    const ctx = new originalCreate(...args);
                    window._audioContexts.push(ctx);
                    return ctx;
                  };
                  window.webkitAudioContext = window.AudioContext;
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-bg text-text overflow-x-hidden`}>
        <MobileWarning />
        <ScaleWrapper>
          {children}
        </ScaleWrapper>
      </body>
    </html>
  )
}
