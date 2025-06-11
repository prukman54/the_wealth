-- Insert sample wealth quotes
INSERT INTO wealth_quotes (quote, author, active) VALUES
('The real measure of your wealth is how much you''d be worth if you lost all your money.', 'Anonymous', true),
('It''s not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.', 'Robert Kiyosaki', true),
('The stock market is filled with individuals who know the price of everything, but the value of nothing.', 'Philip Fisher', true),
('An investment in knowledge pays the best interest.', 'Benjamin Franklin', true),
('The best time to plant a tree was 20 years ago. The second best time is now.', 'Chinese Proverb', true),
('Don''t save what is left after spending; spend what is left after saving.', 'Warren Buffett', true),
('The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, trains to forethought, and so broadens the mind.', 'T.T. Munger', true),
('Wealth consists not in having great possessions, but in having few wants.', 'Epictetus', true),
('The most important investment you can make is in yourself.', 'Warren Buffett', true),
('Time is more valuable than money. You can get more money, but you cannot get more time.', 'Jim Rohn', true);

-- Insert sample expense categories
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'expense_categories') THEN
        CREATE TABLE expense_categories (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );
        
        INSERT INTO expense_categories (name) VALUES
        ('Housing'),
        ('Transportation'),
        ('Food'),
        ('Utilities'),
        ('Insurance'),
        ('Healthcare'),
        ('Debt Payments'),
        ('Personal'),
        ('Entertainment'),
        ('Education'),
        ('Clothing'),
        ('Gifts/Donations'),
        ('Travel'),
        ('Miscellaneous');
    END IF;
END
$$;

-- Insert sample income categories
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'income_categories') THEN
        CREATE TABLE income_categories (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );
        
        INSERT INTO income_categories (name) VALUES
        ('Salary'),
        ('Business'),
        ('Freelance'),
        ('Investments'),
        ('Rental'),
        ('Dividends'),
        ('Interest'),
        ('Gifts'),
        ('Other');
    END IF;
END
$$;

-- Insert sample investment types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'investment_types') THEN
        CREATE TABLE investment_types (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );
        
        INSERT INTO investment_types (name) VALUES
        ('Stocks'),
        ('Bonds'),
        ('Mutual Funds'),
        ('ETFs'),
        ('Real Estate'),
        ('Cryptocurrency'),
        ('Gold'),
        ('Fixed Deposit'),
        ('Retirement Fund'),
        ('Other');
    END IF;
END
$$;

-- Create a sample admin user (you'll need to update the ID after creating the user)
-- This is just a placeholder - you'll need to create the admin user through the auth system first
-- INSERT INTO users (id, full_name, phone_number, email, region, role) VALUES
-- ('admin-user-id-here', 'Admin User', '+1234567890', 'admin@thewealth.com', 'us', 'admin');
