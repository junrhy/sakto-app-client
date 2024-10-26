'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import NavigationBar from '@/components/NavigationBar'
import { NavigationProvider, useNavigation } from '@/contexts/NavigationContext'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NavigationProvider>
      <LayoutContent>{children}</LayoutContent>
    </NavigationProvider>
  )
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { theme } = useNavigation()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationBar />
        {children}
      </body>
    </html>
  )
}
