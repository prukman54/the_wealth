-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
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
DROP POLICY IF EXISTS "Admins can view all quotes" ON wealth_quotes;
DROP POLICY IF EXISTS "Admins can manage quotes" ON wealth_quotes;

-- Create simple, non-recursive policies for users table
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create admin policies that don't cause recursion
CREATE POLICY "admin_select_all_users" ON users
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin' AND id = auth.uid()
    )
  );

-- Simple income policies
CREATE POLICY "income_select_own" ON income
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "income_insert_own" ON income
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    amount > 0 AND
    amount <= 1000000
  );

CREATE POLICY "income_update_own" ON income
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    amount > 0 AND
    amount <= 1000000
  );

CREATE POLICY "income_delete_own" ON income
  FOR DELETE USING (auth.uid() = user_id);

-- Admin income policy
CREATE POLICY "admin_select_all_income" ON income
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin' AND id = auth.uid()
    )
  );

-- Simple expense policies
CREATE POLICY "expenses_select_own" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "expenses_insert_own" ON expenses
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    amount > 0 AND
    amount <= 1000000
  );

CREATE POLICY "expenses_update_own" ON expenses
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    amount > 0 AND
    amount <= 1000000
  );

CREATE POLICY "expenses_delete_own" ON expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Admin expense policy
CREATE POLICY "admin_select_all_expenses" ON expenses
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin' AND id = auth.uid()
    )
  );

-- Simple quote policies
CREATE POLICY "quotes_select_active" ON wealth_quotes
  FOR SELECT USING (active = true);

CREATE POLICY "admin_manage_quotes" ON wealth_quotes
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin' AND id = auth.uid()
    )
  );

-- Ensure RLS is enabled on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wealth_quotes ENABLE ROW LEVEL SECURITY;
