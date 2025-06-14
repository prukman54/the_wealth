-- Debug: Show all users in the database
SELECT 
    id,
    full_name,
    email,
    phone_number,
    region,
    role,
    created_at,
    CASE 
        WHEN phone_number IS NOT NULL AND phone_number != '' 
             AND region IS NOT NULL AND region != '' 
        THEN 'Complete ✅'
        ELSE 'Incomplete ❌'
    END as profile_status
FROM users
ORDER BY created_at DESC;

-- Also show total count
SELECT COUNT(*) as total_users FROM users;

-- Show any users with your email specifically
SELECT * FROM users WHERE email ILIKE '%rpuri6598%';
