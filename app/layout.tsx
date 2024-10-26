'use client'

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { RouterProvider } from 'react-router-dom'
import router from './router'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationProvider>
          <RouterProvider router={router} />
        </NavigationProvider>
      </body>
    </html>
  )
}
