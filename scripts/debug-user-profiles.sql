-- Debug script to check user profiles
SELECT 
  id,
  email,
  full_name,
  phone_number,
  region,
  role,
  created_at,
  updated_at
FROM users
ORDER BY created_at DESC;

-- Check if there are any users without phone_number or region
SELECT 
  email,
  phone_number,
  region,
  CASE 
    WHEN phone_number IS NULL OR phone_number = '' THEN 'Missing Phone'
    WHEN region IS NULL OR region = '' THEN 'Missing Region'
    ELSE 'Complete'
  END as profile_status
FROM users;
