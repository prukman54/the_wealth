-- Create profiles for all auth users who don't have them yet
INSERT INTO users (id, email, full_name, phone_number, region, role, created_at)
SELECT 
    au.id,
    au.email,
    COALESCE(
        au.raw_user_meta_data->>'full_name',
        au.raw_user_meta_data->>'name', 
        SPLIT_PART(au.email, '@', 1)
    ) as full_name,
    '' as phone_number,  -- Empty, will need to be completed
    '' as region,        -- Empty, will need to be completed
    CASE 
        WHEN au.email = 'prukman54@gmail.com' THEN 'admin'
        ELSE 'user'
    END as role,
    au.created_at
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL  -- Only users who don't have profiles yet
AND au.email_confirmed_at IS NOT NULL;  -- Only confirmed users

-- Show what we just created
SELECT 
    email,
    full_name,
    phone_number,
    region,
    role,
    CASE 
        WHEN phone_number = '' OR region = '' THEN 'Needs Completion ⚠️'
        ELSE 'Complete ✅'
    END as status
FROM users
ORDER BY created_at DESC;
