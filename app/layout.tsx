import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sanal Nayyar — Full-Stack Engineer & 3D Interactive Systems',
  description: 'Portfolio of Sanal Nayyar — Full-Stack Software Engineer specializing in real-time WebGL experiences, distributed web architectures, and high-performance interactive interfaces.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-[#090a0f] text-[#f1f3f9] antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
