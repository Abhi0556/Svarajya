import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { userService } from '@/lib/services/userService'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    // Sync user with Prisma after successful session creation
    if (data?.user && data.user.email) {
      try {
        const name = data.user.user_metadata?.full_name || '';
        await userService.syncUserWithSupabase(data.user.id, data.user.email, name);
      } catch (syncError) {
        console.error('[Auth Callback] Failed to sync user to Prisma:', syncError);
      }
    }

    // If token is expired or invalid, redirect to verify-email with expired flag
    if (error) {
      return NextResponse.redirect(
        new URL(`/verify-email?error=link_expired`, requestUrl.origin)
      )
    }

    // Password reset flow → redirect to reset-password page
    if (type === 'recovery') {
      return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
    }

    // Email verification / signup confirmation → redirect to onboarding
    if (type === 'signup' || type === 'email_change') {
      return NextResponse.redirect(new URL('/onboarding/intro', requestUrl.origin))
    }
  }

  // Default: redirect to the gateway
  return NextResponse.redirect(new URL('/start', requestUrl.origin))
}