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

-- Function to create policy if it doesn't exist
CREATE OR REPLACE FUNCTION create_policy_if_not_exists(
  policy_name TEXT,
  table_name TEXT,
  policy_type TEXT,
  policy_condition TEXT
) RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = table_name 
    AND policyname = policy_name
  ) THEN
    EXECUTE format('CREATE POLICY %I ON %I FOR %s USING (%s)', 
      policy_name, table_name, policy_type, policy_condition);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create policies for users table
SELECT create_policy_if_not_exists(
  'Users can view own profile',
  'users',
  'SELECT',
  'auth.uid() = id'
);

SELECT create_policy_if_not_exists(
  'Users can update own profile',
  'users',
  'UPDATE',
  'auth.uid() = id'
);

SELECT create_policy_if_not_exists(
  'Users can insert own profile',
  'users',
  'INSERT',
  'auth.uid() = id'
);

SELECT create_policy_if_not_exists(
  'Admins can view all users',
  'users',
  'SELECT',
  'EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = ''admin'')'
);

-- Create policies for income table
SELECT create_policy_if_not_exists(
  'Users can view own income',
  'income',
  'SELECT',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can insert own income',
  'income',
  'INSERT',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can update own income',
  'income',
  'UPDATE',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can delete own income',
  'income',
  'DELETE',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Admins can view all income',
  'income',
  'SELECT',
  'EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = ''admin'')'
);

-- Create policies for expenses table
SELECT create_policy_if_not_exists(
  'Users can view own expenses',
  'expenses',
  'SELECT',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can insert own expenses',
  'expenses',
  'INSERT',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can update own expenses',
  'expenses',
  'UPDATE',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can delete own expenses',
  'expenses',
  'DELETE',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Admins can view all expenses',
  'expenses',
  'SELECT',
  'EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = ''admin'')'
);

-- Create policies for savings_goals table
SELECT create_policy_if_not_exists(
  'Users can view own savings goals',
  'savings_goals',
  'SELECT',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can insert own savings goals',
  'savings_goals',
  'INSERT',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can update own savings goals',
  'savings_goals',
  'UPDATE',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can delete own savings goals',
  'savings_goals',
  'DELETE',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Admins can view all savings goals',
  'savings_goals',
  'SELECT',
  'EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = ''admin'')'
);

-- Create policies for investments table
SELECT create_policy_if_not_exists(
  'Users can view own investments',
  'investments',
  'SELECT',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can insert own investments',
  'investments',
  'INSERT',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can update own investments',
  'investments',
  'UPDATE',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can delete own investments',
  'investments',
  'DELETE',
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Admins can view all investments',
  'investments',
  'SELECT',
  'EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = ''admin'')'
);

-- Create policies for wealth_quotes table
SELECT create_policy_if_not_exists(
  'Everyone can view active quotes',
  'wealth_quotes',
  'SELECT',
  'active = true'
);

-- For wealth_quotes admin policy, we need a different approach since it's for ALL operations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'wealth_quotes' 
    AND policyname = 'Admins can manage quotes'
  ) THEN
    CREATE POLICY "Admins can manage quotes" ON wealth_quotes FOR ALL USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Clean up the helper function
DROP FUNCTION IF EXISTS create_policy_if_not_exists;
