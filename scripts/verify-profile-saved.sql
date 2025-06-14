-- Check if the profile was saved for the specific user
SELECT 
  id,
  full_name,
  email,
  phone_number,
  region,
  role,
  created_at,
  CASE 
    WHEN phone_number IS NOT NULL AND phone_number != '' AND region IS NOT NULL AND region != '' THEN 'Complete ✅'
    WHEN phone_number IS NULL OR phone_number = '' THEN 'Missing Phone ❌'
    WHEN region IS NULL OR region = '' THEN 'Missing Region ❌'
    ELSE 'Unknown Status'
  END as profile_status
FROM users
WHERE email = 'rpuri6598@gmail.com'
ORDER BY created_at DESC;

-- Also show all users to see the current state
SELECT 
  'All Users:' as section,
  COUNT(*) as total_users,
  COUNT(CASE WHEN phone_number IS NOT NULL AND phone_number != '' AND region IS NOT NULL AND region != '' THEN 1 END) as complete_profiles,
  COUNT(CASE WHEN phone_number IS NULL OR phone_number = '' OR region IS NULL OR region = '' THEN 1 END) as incomplete_profiles
FROM users;

-- Show all users with their status
SELECT 
  email,
  full_name,
  phone_number,
  region,
  role,
  CASE 
    WHEN phone_number IS NOT NULL AND phone_number != '' AND region IS NOT NULL AND region != '' THEN 'Complete ✅'
    ELSE 'Incomplete ❌'
  END as status
FROM users
ORDER BY created_at DESC;
