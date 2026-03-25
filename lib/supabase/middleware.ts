import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr/dist/module'

export async function updateSession(request: NextRequest) {
  type CookieToSet = {
    name: string
    value: string
    options?: Record<string, unknown>
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as never)
          )
        },
      },
    }
  )

  // This refreshes a user's session and lets us enforce route protection.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const protectedPrefixes = ['/dashboard', '/products', '/sales', '/reports', '/settings']
  const authRoutes = ['/login', '/signup']
  const onboardingRoute = '/onboarding'

  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  const isAuthRoute = authRoutes.includes(pathname)
  const isOnboardingRoute = pathname === onboardingRoute

  if (!user && (isProtectedRoute || isOnboardingRoute)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && isAuthRoute) {
    // Check if user has completed onboarding (has a profile)
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()

    const redirectUrl = request.nextUrl.clone()
    // If no profile, redirect to onboarding, otherwise to dashboard
    redirectUrl.pathname = profile ? '/dashboard' : '/onboarding'
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated but on dashboard without a profile, redirect to onboarding
  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!profile) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/onboarding'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}
