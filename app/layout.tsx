'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { NavigationProvider } from '@/contexts/NavigationContext'
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ['latin'] })

const LayoutContent = dynamic(() => import('./LayoutContent'), { ssr: false })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NavigationProvider>
          <LayoutContent>{children}</LayoutContent>
        </NavigationProvider>
      </body>
    </html>
  )
}
