import { NextResponse } from 'next/server'

export function middleware(request) {
  // Get the current path
  const path = request.nextUrl.pathname

  // Check if it's trying to access a "main" route, and rewrite it
  if (path.startsWith('/main/')) {
    return NextResponse.rewrite(new URL(path.replace('/main/', '/'), request.url))
  }

  return NextResponse.next()
}

// Configure the matcher to only run on specific paths
export const config = {
  matcher: '/main/:path*',
}