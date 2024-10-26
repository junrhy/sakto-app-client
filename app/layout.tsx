import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavigationBar from '@/components/NavigationBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your app description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationBar />
        <main className="container mx-auto mt-4">
          {children}
        </main>
      </body>
    </html>
  )
}
