import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const type = requestUrl.searchParams.get('type')
  const error = requestUrl.searchParams.get('error')

  // If token is expired or invalid, redirect to verify-email with expired flag
  if (error === 'link_expired') {
    return NextResponse.redirect(
      new URL('/verify-email?error=link_expired', requestUrl.origin)
    )
  }

  // Password reset flow → redirect to reset-password page
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
  }

  // Email verification / signup confirmation → redirect to login page
  // No session exchange - user must login manually
  if (type === 'signup' || type === 'email_change') {
    return NextResponse.redirect(new URL('/login?verification_success=true', requestUrl.origin))
  }

  // Default redirect to login page
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}