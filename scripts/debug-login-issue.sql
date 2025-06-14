-- Check if user exists in auth.users (Supabase Auth)
SELECT 
  'AUTH USERS' as table_name,
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users 
WHERE email ILIKE '%@%'  -- Replace with your email
ORDER BY created_at DESC
LIMIT 5;

-- Check if user exists in public.users (our app table)
SELECT 
  'PUBLIC USERS' as table_name,
  id,
  email,
  full_name,
  phone_number,
  region,
  role,
  created_at
FROM public.users 
ORDER BY created_at DESC
LIMIT 5;

-- Check for any users with incomplete profiles
SELECT 
  'INCOMPLETE PROFILES' as table_name,
  id,
  email,
  full_name,
  phone_number,
  region,
  CASE 
    WHEN phone_number IS NULL OR phone_number = '' THEN 'Missing Phone'
    WHEN region IS NULL OR region = '' THEN 'Missing Region'
    ELSE 'Complete'
  END as profile_status
FROM public.users 
WHERE phone_number IS NULL OR phone_number = '' OR region IS NULL OR region = '';
