# Clerk Authentication Setup

To make the login work, you need to set up Clerk.

## 1. Create Clerk Account
1. Go to [clerk.com](https://clerk.com) and sign up.
2. Create a new application (name it "Life OS").
3. Select "Email, Password" and "Google" (optional) as sign-in methods.

## 2. Get API Keys
1. In the Clerk Dashboard, go to **API Keys**.
2. Copy the **Publishable Key** and **Secret Key**.

## 3. Set Environment Variables

### Local Development (.env.local)
Create a `.env.local` file in your project root and add:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
TURSO_DATABASE_URL=file:life-os.db
```

### Vercel Deployment
1. Go to your Vercel Project Settings -> **Environment Variables**.
2. Add:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `TURSO_DATABASE_URL` (your HTTPS or libsql URL)
   - `TURSO_AUTH_TOKEN` (your Turso token)

## 4. Deploy
Redeploy your application on Vercel.
