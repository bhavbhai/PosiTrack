# PosiTrack Setup Guide

## Environment Variables Required

To fix the issue where user information is not showing in the settings page, you need to set up the following environment variables:

### 1. Create a `.env.local` file in the root directory with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Optional: Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. How to get these values:

1. **Go to your Supabase project dashboard**
2. **Navigate to Settings > API**
3. **Copy the following values:**
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

4. **For DATABASE_URL:**
   - Go to Settings > Database
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password
   - Replace `[YOUR-PROJECT-REF]` with your project reference

### 3. Database Setup

Make sure your database is properly set up:

1. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

### 4. Restart the Development Server

After setting up the environment variables:

```bash
npm run dev
```

## Row Level Security (RLS) Setup

After setting up the environment variables, you also need to configure Row Level Security policies in your Supabase database:

### 1. Run the RLS Policies

In your Supabase dashboard:
1. Go to **SQL Editor**
2. Copy and paste the contents of `prisma/migrations/add_rls_policies.sql`
3. Run the SQL commands

This will:
- Enable RLS on all tables
- Create policies allowing users to access only their own data
- Allow users to read, insert, update, and delete their own records

### 2. Alternative: Disable RLS (for development only)

If you want to disable RLS for development (not recommended for production):

```sql
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Entry" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatMessage" DISABLE ROW LEVEL SECURITY;
```

## Why This Fixes the Issue

The problem was likely caused by Row Level Security (RLS) policies in Supabase. By default, Supabase enables RLS on all tables, which means:

1. Users cannot access any data unless explicit policies allow it
2. The application was trying to read/write user data but getting permission denied
3. This caused user information not to be saved or retrieved properly

With proper RLS policies, the application will be able to:
- Connect to Supabase Auth
- Connect to the database
- Save user information when they sign up
- Retrieve user information in the settings page
- Allow users to access only their own data (security best practice) 