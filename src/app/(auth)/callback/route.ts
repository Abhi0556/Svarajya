import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const type = requestUrl.searchParams.get('type')

  // Password reset flow → redirect to reset-password page
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
  }

  // Email verification / signup confirmation → redirect to login with success message
  // No session exchange - user must manually log in
  if (type === 'signup' || type === 'email_change') {
    return NextResponse.redirect(new URL('/login?verification_success=true', requestUrl.origin))
  }

  // Default: redirect to login page
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}