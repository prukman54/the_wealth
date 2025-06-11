# The Wealth - Personal Finance Management Platform

A comprehensive personal finance management platform built with Next.js, Supabase, and modern web technologies.

## 🚀 Features

### 🔐 Authentication
- **Email/Password Authentication** with validation
- **Google OAuth Integration** for seamless signup/login
- **Admin Panel Access** with role-based permissions
- **Profile Completion Flow** for new users

### 💰 Financial Management
- **Transaction Tracking** (Income & Expenses)
- **Multi-Currency Support** (NPR, USD, EUR, GBP, CAD, AUD, JPY, INR)
- **Savings Goals** with progress tracking
- **Financial Dashboard** with real-time insights

### 📊 Investment Tools
- **Compound Interest Calculator**
- **Rule of 72 Calculator**
- **Starting Early Comparison Tool**
- **Inflation vs Returns Calculator**
- **Asset Allocation Tool**

### 👨‍💼 Admin Features
- **User Management** with financial overview
- **Transaction Monitoring** for all users
- **Wealth Quotes Management** with CRUD operations
- **Real-time Database Updates**

### 🎨 User Experience
- **Responsive Design** for all devices
- **Dark/Light Mode Support**
- **Accessibility Features** (ARIA labels, keyboard navigation)
- **Loading States** and error handling
- **Success Notifications** and user feedback

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth + Google OAuth
- **Deployment**: Vercel
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Cloud Console account (for OAuth)
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone and Install
\`\`\`bash
git clone <repository-url>
cd the-wealth
npm install
\`\`\`

### 2. Environment Setup
Copy `.env.example` to `.env.local` and fill in your credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
\`\`\`

### 3. Database Setup
Run the SQL scripts in order:
1. `scripts/create-tables.sql`
2. `scripts/seed-data.sql`
3. `scripts/create-admin-user.sql`

### 4. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domains to authorized origins and redirect URIs

### 5. Supabase Configuration
1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Enable Google provider with your Client ID/Secret
4. Set Site URL to your domain
5. Add redirect URLs

### 6. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## 🔧 Configuration

### Google OAuth Setup
**Authorized JavaScript Origins:**
- `http://localhost:3000` (development)
- `https://yourdomain.com` (production)

**Authorized Redirect URIs:**
- `http://localhost:3000/auth/callback` (development)
- `https://yourdomain.com/auth/callback` (production)

### Supabase Settings
- **Site URL**: Your production domain
- **Redirect URLs**: `https://yourdomain.com/auth/callback`

## 👨‍💼 Admin Access

**Default Admin Credentials:**
- Email: `prukman54@gmail.com`
- Password: `$$1M_BTC$$`

Access admin panel at `/admin/dashboard` after login.

## 📱 Mobile Support

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Security Features

- **Row Level Security (RLS)** on all database tables
- **Input validation** on client and server
- **CSRF protection** via Supabase
- **Secure authentication** with JWT tokens
- **Admin route protection** via middleware

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Set these in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `full_name` (Text)
- `email` (Text, Unique)
- `phone_number` (Text)
- `region` (Text)
- `role` (Text: 'user' | 'admin')

### Transactions Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `type` (Text: 'income' | 'expense')
- `amount` (Decimal)
- `description` (Text)
- `category` (Text)
- `date` (Date)

### Quotes Table
- `id` (UUID, Primary Key)
- `text` (Text)
- `author` (Text)
- `is_active` (Boolean)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@thewealth.com or create an issue in the repository.

## 🔄 Updates

The application includes automatic updates for:
- Real-time transaction updates
- Live quote rotation
- Instant currency conversion
- Dynamic chart updates

---

Built with ❤️ for better financial management.
