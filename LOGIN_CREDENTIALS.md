# 🔐 Login Credentials (Development & Deployment)

These hardcoded credentials work in both development and production (Vercel) environments:

## Available Accounts

### 🔴 Admin Account
- **Email:** `admin`
- **Password:** `admin`
- **Role:** Administrator
- **Access:** Full admin dashboard, user management, all features

### 👤 Regular User Account  
- **Email:** `user`
- **Password:** `user`
- **Role:** User
- **Access:** Standard user features, goal tracking, opportunities

### ⚡ Moderator Account
- **Email:** `mod` 
- **Password:** `mod`
- **Role:** Moderator
- **Access:** Content moderation, user support features

## Login URL
- **Local:** http://localhost:3000/auth/signin
- **Vercel:** https://your-app.vercel.app/auth/signin

## Notes
- These credentials are hardcoded in `src/lib/auth.ts`
- They work regardless of MongoDB connection status
- Perfect for demo, testing, and quick deployment
- Database users (if connected) will also work alongside these

## Security
⚠️ **Remember to change these in production!** These are for development/demo purposes only.