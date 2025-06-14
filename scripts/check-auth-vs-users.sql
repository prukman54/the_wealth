-- Check all users in Supabase Auth
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'Confirmed ✅'
        ELSE 'Not Confirmed ❌'
    END as email_status
FROM auth.users
ORDER BY created_at DESC;

-- Check which auth users have profiles in users table
SELECT 
    au.id as auth_id,
    au.email as auth_email,
    au.created_at as auth_created,
    u.id as profile_id,
    u.email as profile_email,
    u.full_name,
    u.phone_number,
    u.region,
    CASE 
        WHEN u.id IS NOT NULL THEN 'Has Profile ✅'
        ELSE 'Missing Profile ❌'
    END as profile_status
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
ORDER BY au.created_at DESC;

-- Specifically look for your email
SELECT 
    'AUTH TABLE' as source,
    id,
    email,
    created_at
FROM auth.users 
WHERE email = 'rpuri6598@gmail.com'

UNION ALL

SELECT 
    'USERS TABLE' as source,
    id,
    email,
    created_at
FROM users 
WHERE email = 'rpuri6598@gmail.com';

-- Count totals
SELECT 
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM users) as total_profile_users,
    (SELECT COUNT(*) FROM auth.users au LEFT JOIN users u ON au.id = u.id WHERE u.id IS NULL) as missing_profiles;
