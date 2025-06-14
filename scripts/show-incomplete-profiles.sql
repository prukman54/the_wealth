-- Show users with incomplete profiles
SELECT 
  id,
  full_name,
  email,
  phone_number,
  region,
  role,
  created_at,
  CASE 
    WHEN phone_number IS NULL OR phone_number = '' THEN 'Missing Phone'
    WHEN region IS NULL OR region = '' THEN 'Missing Region'
    ELSE 'Complete'
  END as profile_status
FROM users
WHERE 
  phone_number IS NULL OR phone_number = '' OR
  region IS NULL OR region = ''
ORDER BY created_at DESC;
