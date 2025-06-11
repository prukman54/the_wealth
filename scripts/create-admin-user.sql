-- Update the user role to admin for the specified email
UPDATE users 
SET role = 'admin' 
WHERE email = 'prukman54@gmail.com';

-- Verify the admin user was created
SELECT id, full_name, email, role, created_at 
FROM users 
WHERE email = 'prukman54@gmail.com';
