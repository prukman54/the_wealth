-- This script adds admin access policies to all tables

-- First, let's disable RLS temporarily to make changes
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE income DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE wealth_quotes DISABLE ROW LEVEL SECURITY;

-- Drop any existing admin policies to avoid conflicts
DROP POLICY IF EXISTS "admin_access_all_users" ON users;
DROP POLICY IF EXISTS "admin_access_all_income" ON income;
DROP POLICY IF EXISTS "admin_access_all_expenses" ON expenses;
DROP POLICY IF EXISTS "admin_access_all_quotes" ON wealth_quotes;

-- Create admin policies for each table
CREATE POLICY "admin_access_all_users" ON users
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "admin_access_all_income" ON income
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "admin_access_all_expenses" ON expenses
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "admin_access_all_quotes" ON wealth_quotes
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wealth_quotes ENABLE ROW LEVEL SECURITY;

-- Ensure admin role has proper permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON income TO authenticated;
GRANT ALL ON expenses TO authenticated;
GRANT ALL ON wealth_quotes TO authenticated;
