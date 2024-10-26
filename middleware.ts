import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Remove Next-Auth related checks
  // Add your custom middleware logic here if needed
  
  // For now, we'll just pass through all requests
  return NextResponse.next()
}

// Update or remove the config object as needed
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
