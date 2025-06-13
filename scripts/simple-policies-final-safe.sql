-- Disable RLS temporarily to clean up
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE income DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE wealth_quotes DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_insert_own" ON users;
DROP POLICY IF EXISTS "admin_select_all_users" ON users;
DROP POLICY IF EXISTS "income_select_own" ON income;
DROP POLICY IF EXISTS "income_insert_own" ON income;
DROP POLICY IF EXISTS "income_update_own" ON income;
DROP POLICY IF EXISTS "income_delete_own" ON income;
DROP POLICY IF EXISTS "admin_select_all_income" ON income;
DROP POLICY IF EXISTS "expenses_select_own" ON expenses;
DROP POLICY IF EXISTS "expenses_insert_own" ON expenses;
DROP POLICY IF EXISTS "expenses_update_own" ON expenses;
DROP POLICY IF EXISTS "expenses_delete_own" ON expenses;
DROP POLICY IF EXISTS "admin_select_all_expenses" ON expenses;
DROP POLICY IF EXISTS "quotes_select_active" ON wealth_quotes;
DROP POLICY IF EXISTS "admin_manage_quotes" ON wealth_quotes;

-- Drop the policies we're about to create (if they exist)
DROP POLICY IF EXISTS "allow_own_user_access" ON users;
DROP POLICY IF EXISTS "allow_own_income_access" ON income;
DROP POLICY IF EXISTS "allow_own_expenses_access" ON expenses;
DROP POLICY IF EXISTS "allow_quotes_read" ON wealth_quotes;
DROP POLICY IF EXISTS "allow_quotes_write" ON wealth_quotes;

-- Also drop any policies from create-tables.sql that might exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can view own income" ON income;
DROP POLICY IF EXISTS "Users can insert own income" ON income;
DROP POLICY IF EXISTS "Users can update own income" ON income;
DROP POLICY IF EXISTS "Users can delete own income" ON income;
DROP POLICY IF EXISTS "Admins can view all income" ON income;
DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON expenses;
DROP POLICY IF EXISTS "Admins can view all expenses" ON expenses;
DROP POLICY IF EXISTS "Everyone can view active quotes" ON wealth_quotes;
DROP POLICY IF EXISTS "Admins can manage quotes" ON wealth_quotes;

-- Create the simplest possible policies for users table
CREATE POLICY "allow_own_user_access" ON users
  FOR ALL USING (auth.uid() = id);

-- Create simple policies for income table
CREATE POLICY "allow_own_income_access" ON income
  FOR ALL USING (auth.uid() = user_id);

-- Create simple policies for expenses table  
CREATE POLICY "allow_own_expenses_access" ON expenses
  FOR ALL USING (auth.uid() = user_id);

-- Create simple policies for quotes table
CREATE POLICY "allow_quotes_read" ON wealth_quotes
  FOR SELECT USING (true);

CREATE POLICY "allow_quotes_write" ON wealth_quotes
  FOR ALL USING (true);

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wealth_quotes ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON income TO authenticated;
GRANT ALL ON expenses TO authenticated;
GRANT ALL ON wealth_quotes TO authenticated;
