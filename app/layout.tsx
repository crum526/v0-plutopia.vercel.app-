import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plutopia - Gaming Community',
  description: 'Experience gaming content like never before',
  generator: 'v0.app',
  applicationName: 'Plutopia',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Plutopia',
  },
  icons: {
    icon: [
      { url: '/plutopia-icon.svg', type: 'image/svg+xml' },
      { url: '/plutopia-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/plutopia-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Plutopia - Gaming Community',
    description: 'Experience gaming content like never before',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plutopia',
    description: 'Experience gaming content like never before',
  },
}

export const viewport: Viewport = {
  themeColor: '#1f2937',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} bg-plutopia-darker`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
