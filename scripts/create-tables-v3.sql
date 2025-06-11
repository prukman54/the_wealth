-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

-- Create income table
CREATE TABLE IF NOT EXISTS income (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL
);

-- Create savings_goals table
CREATE TABLE IF NOT EXISTS savings_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  target_date DATE NOT NULL
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  purchase_date DATE NOT NULL,
  current_value DECIMAL(10,2) NOT NULL
);

-- Create wealth_quotes table
CREATE TABLE IF NOT EXISTS wealth_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wealth_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DO $$
BEGIN
  -- Users can view own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
  END IF;

  -- Users can update own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
  END IF;

  -- Users can insert own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;

  -- Admins can view all users
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Admins can view all users'
  ) THEN
    CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create policies for income table
DO $$
BEGIN
  -- Users can view own income
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'income' AND policyname = 'Users can view own income'
  ) THEN
    CREATE POLICY "Users can view own income" ON income FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- Users can insert own income
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'income' AND policyname = 'Users can insert own income'
  ) THEN
    CREATE POLICY "Users can insert own income" ON income FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Users can update own income
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'income' AND policyname = 'Users can update own income'
  ) THEN
    CREATE POLICY "Users can update own income" ON income FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Users can delete own income
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'income' AND policyname = 'Users can delete own income'
  ) THEN
    CREATE POLICY "Users can delete own income" ON income FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- Admins can view all income
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'income' AND policyname = 'Admins can view all income'
  ) THEN
    CREATE POLICY "Admins can view all income" ON income FOR SELECT USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create policies for expenses table
DO $$
BEGIN
  -- Users can view own expenses
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'expenses' AND policyname = 'Users can view own expenses'
  ) THEN
    CREATE POLICY "Users can view own expenses" ON expenses FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- Users can insert own expenses
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'expenses' AND policyname = 'Users can insert own expenses'
  ) THEN
    CREATE POLICY "Users can insert own expenses" ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Users can update own expenses
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'expenses' AND policyname = 'Users can update own expenses'
  ) THEN
    CREATE POLICY "Users can update own expenses" ON expenses FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Users can delete own expenses
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'expenses' AND policyname = 'Users can delete own expenses'
  ) THEN
    CREATE POLICY "Users can delete own expenses" ON expenses FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- Admins can view all expenses
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'expenses' AND policyname = 'Admins can view all expenses'
  ) THEN
    CREATE POLICY "Admins can view all expenses" ON expenses FOR SELECT USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create policies for savings_goals table
DO $$
BEGIN
  -- Users can view own savings goals
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'savings_goals' AND policyname = 'Users can view own savings goals'
  ) THEN
    CREATE POLICY "Users can view own savings goals" ON savings_goals FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- Users can insert own savings goals
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'savings_goals' AND policyname = 'Users can insert own savings goals'
  ) THEN
    CREATE POLICY "Users can insert own savings goals" ON savings_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Users can update own savings goals
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'savings_goals' AND policyname = 'Users can update own savings goals'
  ) THEN
    CREATE POLICY "Users can update own savings goals" ON savings_goals FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Users can delete own savings goals
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'savings_goals' AND policyname = 'Users can delete own savings goals'
  ) THEN
    CREATE POLICY "Users can delete own savings goals" ON savings_goals FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- Admins can view all savings goals
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'savings_goals' AND policyname = 'Admins can view all savings goals'
  ) THEN
    CREATE POLICY "Admins can view all savings goals" ON savings_goals FOR SELECT USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create policies for investments table
DO $$
BEGIN
  -- Users can view own investments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'investments' AND policyname = 'Users can view own investments'
  ) THEN
    CREATE POLICY "Users can view own investments" ON investments FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- Users can insert own investments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'investments' AND policyname = 'Users can insert own investments'
  ) THEN
    CREATE POLICY "Users can insert own investments" ON investments FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Users can update own investments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'investments' AND policyname = 'Users can update own investments'
  ) THEN
    CREATE POLICY "Users can update own investments" ON investments FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Users can delete own investments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'investments' AND policyname = 'Users can delete own investments'
  ) THEN
    CREATE POLICY "Users can delete own investments" ON investments FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- Admins can view all investments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'investments' AND policyname = 'Admins can view all investments'
  ) THEN
    CREATE POLICY "Admins can view all investments" ON investments FOR SELECT USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create policies for wealth_quotes table
DO $$
BEGIN
  -- Everyone can view active quotes
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'wealth_quotes' AND policyname = 'Everyone can view active quotes'
  ) THEN
    CREATE POLICY "Everyone can view active quotes" ON wealth_quotes FOR SELECT USING (active = true);
  END IF;

  -- Admins can manage quotes
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'wealth_quotes' AND policyname = 'Admins can manage quotes'
  ) THEN
    CREATE POLICY "Admins can manage quotes" ON wealth_quotes FOR ALL USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;
