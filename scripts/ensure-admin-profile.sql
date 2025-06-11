-- Ensure Admin Profile Script
-- This script creates or updates the admin user profile in the database
-- Run this if you need to manually set up the admin account

-- Admin credentials (for reference)
-- Email: prukman54@gmail.com
-- Password: $$1M_BTC$$

-- First, let's check if the admin user exists in auth.users
DO $admin_setup$
DECLARE
    admin_user_id UUID;
    admin_exists BOOLEAN := FALSE;
BEGIN
    -- Check if admin exists in auth.users table
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'prukman54@gmail.com'
    LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        admin_exists := TRUE;
        RAISE NOTICE 'Admin user found in auth.users with ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user NOT found in auth.users table';
        RAISE NOTICE 'Please create the admin account in Supabase Authentication first:';
        RAISE NOTICE '1. Go to Supabase Dashboard > Authentication > Users';
        RAISE NOTICE '2. Click "Add user"';
        RAISE NOTICE '3. Email: prukman54@gmail.com';
        RAISE NOTICE '4. Password: %', '$$1M_BTC$$';
        RAISE NOTICE '5. Then run this script again';
        RETURN;
    END IF;
    
    -- If admin exists in auth, ensure profile exists in users table
    IF admin_exists THEN
        -- Check if profile exists in users table
        IF EXISTS (SELECT 1 FROM users WHERE id = admin_user_id) THEN
            -- Update existing profile to ensure admin role and complete data
            UPDATE users 
            SET 
                role = 'admin',
                full_name = 'Admin User',
                phone_number = '+977-9846965033',
                region = 'np',
                email = 'prukman54@gmail.com'
            WHERE id = admin_user_id;
            
            RAISE NOTICE 'Admin profile updated successfully';
        ELSE
            -- Create new profile in users table
            INSERT INTO users (
                id,
                full_name,
                phone_number,
                email,
                region,
                role,
                created_at
            ) VALUES (
                admin_user_id,
                'Admin User',
                '+977-9846965033',
                'prukman54@gmail.com',
                'np',
                'admin',
                NOW()
            );
            
            RAISE NOTICE 'Admin profile created successfully';
        END IF;
        
        -- Verify the admin profile
        DECLARE
            admin_profile RECORD;
        BEGIN
            SELECT * INTO admin_profile 
            FROM users 
            WHERE id = admin_user_id;
            
            RAISE NOTICE 'Admin Profile Details:';
            RAISE NOTICE '- ID: %', admin_profile.id;
            RAISE NOTICE '- Name: %', admin_profile.full_name;
            RAISE NOTICE '- Email: %', admin_profile.email;
            RAISE NOTICE '- Phone: %', admin_profile.phone_number;
            RAISE NOTICE '- Region: %', admin_profile.region;
            RAISE NOTICE '- Role: %', admin_profile.role;
            RAISE NOTICE '- Created: %', admin_profile.created_at;
        END;
    END IF;
END $admin_setup$;

-- Grant admin user access to all tables (if needed)
-- This ensures the admin can access all data
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Final verification query
SELECT 
    u.id,
    u.full_name,
    u.email,
    u.phone_number,
    u.region,
    u.role,
    u.created_at,
    CASE 
        WHEN au.email IS NOT NULL THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as auth_status
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.email = 'prukman54@gmail.com'
ORDER BY u.created_at DESC;
