-- Drop existing policies
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
DROP POLICY IF EXISTS "Admins can manage quotes" ON wealth_quotes;

-- Enhanced User policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) AND
    role = COALESCE((SELECT role FROM users WHERE id = auth.uid()), 'user')
  );

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enhanced Income policies
CREATE POLICY "Users can view own income" ON income
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own income" ON income
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    amount > 0 AND
    amount <= 1000000 AND
    date >= CURRENT_DATE - INTERVAL '1 year' AND
    date <= CURRENT_DATE
  );

CREATE POLICY "Users can update own income" ON income
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    amount > 0 AND
    amount <= 1000000 AND
    date >= CURRENT_DATE - INTERVAL '1 year' AND
    date <= CURRENT_DATE
  );

CREATE POLICY "Users can delete own income" ON income
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all income" ON income
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enhanced Expense policies
CREATE POLICY "Users can view own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses" ON expenses
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    amount > 0 AND
    amount <= 1000000 AND
    date >= CURRENT_DATE - INTERVAL '1 year' AND
    date <= CURRENT_DATE
  );

CREATE POLICY "Users can update own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    amount > 0 AND
    amount <= 1000000 AND
    date >= CURRENT_DATE - INTERVAL '1 year' AND
    date <= CURRENT_DATE
  );

CREATE POLICY "Users can delete own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all expenses" ON expenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enhanced Quote policies
CREATE POLICY "Everyone can view active quotes" ON wealth_quotes
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can view all quotes" ON wealth_quotes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage quotes" ON wealth_quotes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    ) AND
    LENGTH(quote) >= 10 AND
    LENGTH(quote) <= 500 AND
    LENGTH(author) >= 2 AND
    LENGTH(author) <= 100
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_income_user_date ON income(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_wealth_quotes_active ON wealth_quotes(active, created_at DESC);
