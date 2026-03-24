# Supabase Integration Guide

## 📋 Overview

This directory contains a complete, production-ready Supabase integration for ShopStockBD following **2026 Next.js best practices**.

### Architecture

```
lib/supabase/
├── client.ts       → Browser client (Client Components)
├── server.ts       → Server client (Server Components, Route Handlers)
├── middleware.ts   → Auth session refresh on every request
├── auth.ts         → Authentication helpers (signup, login, profiles)
├── queries.ts      → Common database queries (products, sales, etc.)
└── index.ts        → Main export file
```

## 🔑 Key Features

### ✅ SSR-Compatible Authentication
- **Cookies-based sessions** for server-side rendering
- **Automatic session refresh** via middleware on every request
- **PKCE flow** for enhanced security
- Works seamlessly with Next.js App Router

### ✅ Type Safety
- Full TypeScript support with `Database` interface
- Typed database queries via `types/supabase.ts`
- Intellisense for all Supabase operations

### ✅ Cookie Management
- Secure cookie handling for JWT tokens
- Automatic token refresh before expiration
- Works across client and server contexts

### ✅ Error Handling
- Graceful fallbacks for hydration edge cases
- Detailed error messages for debugging
- Proper error propagation to UI

## 🚀 Quick Start

### 1. Environment Variables

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from your Supabase project:
1. Go to [supabase.com](https://supabase.com)
2. Create new project or use existing
3. Copy URL from Settings → API
4. Copy `anon` key from Settings → API

### 2. Browser Client (Client Components)

```tsx
'use client'

import { createClient } from '@/lib/supabase'

export function ProductList() {
  const supabase = createClient()
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from('products')
        .select()
        .eq('is_active', true)
      
      setProducts(data || [])
    }

    loadProducts()
  }, [])

  return <div>{/* render products */}</div>
}
```

### 3. Server Client (Server Components)

```tsx
import { createClient } from '@/lib/supabase'

export default async function Dashboard() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select()
    .eq('is_active', true)

  return <div>{/* render products */}</div>
}
```

### 4. Authentication

#### Sign Up (Client Component)

```tsx
'use client'

import { signUpClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shopName, setShopName] = useState('')

  async function handleSignup() {
    const result = await signUpClient({
      email,
      password,
      shopName,
    })

    if (result.success) {
      // Redirect to onboarding
      router.push('/onboarding')
    } else {
      console.error(result.error)
    }
  }

  return (
    <form onSubmit={handleSignup}>
      {/* form fields */}
    </form>
  )
}
```

#### Login (Client Component)

```tsx
'use client'

import { loginClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()

  async function handleLogin(email: string, password: string) {
    const result = await loginClient({ email, password })

    if (result.success) {
      router.push('/dashboard')
    } else {
      console.error(result.error)
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      // call handleLogin
    }}>
      {/* form fields */}
    </form>
  )
}
```

#### Get Current User (Both contexts)

```tsx
// Client Component
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export function UserProfile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  return <div>{user?.email}</div>
}
```

```tsx
// Server Component
import { getCurrentUser } from '@/lib/supabase'

export default async function Profile() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return <div>{user.email}</div>
}
```

## 📊 Database Queries

Common queries are available in `queries.ts`:

```tsx
import {
  getUserProducts,
  getProductsByCategory,
  getLowStockProducts,
  searchProducts,
  getUserTransactions,
  getSalesStats,
  getTodaysSales,
} from '@/lib/supabase'

// Get all products for a user
const products = await getUserProducts(userId)

// Get products by category
const electronics = await getProductsByCategory(userId, 'Electronics')

// Get low stock products
const lowStock = await getLowStockProducts(userId)

// Search products
const results = await searchProducts(userId, 'laptop')

// Get recent transactions
const transactions = await getUserTransactions(userId, 50)

// Get sales data for last 30 days
const stats = await getSalesStats(userId)

// Get today's sales
const today = await getTodaysSales(userId)
// Returns: { count, total, vat }
```

## 🔐 Middleware - Session Refresh

The `middleware.ts` runs on **every request** to:
1. Refresh expired auth sessions
2. Update cookies with new tokens
3. Keep users logged in across page reloads

Located at `middleware.ts` in your app root.

## 🛡️ Row Level Security (RLS)

All tables enforce RLS policies:

```sql
-- Only users can see their own data
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

-- Only users can insert their own products
CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Your Supabase account handles this automatically** — queries automatically filter by `auth.uid()`.

## 🧪 Testing

```tsx
// Test sign up
const signup = await signUpClient({
  email: 'test@example.com',
  password: 'password123',
  shopName: 'My Shop',
})

if (signup.success) {
  console.log('User created:', signup.user.id)
}

// Test queries
const products = await getUserProducts('user-id-123')
console.log('Products:', products)

// Test search
const results = await searchProducts('user-id-123', 'laptop')
console.log('Search results:', results)
```

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` exists in project root
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart dev server: `npm run dev`

### "Failed to set cookie in Server Component"
- This is normal during static rendering
- Middleware will refresh the session on next request
- Check browser DevTools → Application → Cookies

### "User session is null"
- Middleware needs to run first to set cookies
- Try refreshing the page
- Check if user is actually authenticated in Supabase dashboard

### "RLS policy violation"
- Ensure you're querying with correct user_id
- Check RLS policies in Supabase dashboard
- Verify row ownership (user_id matches auth user)

## 📚 References

- [Supabase SSR Auth](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Middleware in Next.js](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## 📝 Notes

- **Free tier limits**: 500MB DB, 50k MAUs, 1GB storage
- **Pauses after inactivity**: Visit dashboard weekly to keep project active
- **JWT tokens expire in 1 hour** by default (refreshable)
- **All data is encrypted in transit** via HTTPS
- **Backups are daily** on free tier (7-day retention)

## ✨ Next Steps

1. **Create login/signup pages**: Use `signUpClient` and `loginClient`
2. **Protect routes**: Use middleware + `getCurrentUser()` checks
3. **Add TanStack Query**: Wrap queries with `useQuery()` for caching
4. **Set up i18n**: Add Bengali strings in queries/forms
5. **Add error boundaries**: Gracefully handle Supabase errors
