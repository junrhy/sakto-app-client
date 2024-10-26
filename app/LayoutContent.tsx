'use client'

import { useApp } from '@/contexts/AppContext'
import { useEffect } from 'react'
import NavigationBar from '@/components/NavigationBar'

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { theme } = useApp()

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
    <>
      <NavigationBar />
      <main>{children}</main>
    </>
  )
}
