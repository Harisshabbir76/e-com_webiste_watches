# iWrist - Premium Luxury Watches

## 🚀 Overview
iWrist is a full-stack e-commerce platform for premium men's luxury watches. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Node.js/Express backend with MongoDB.

## ✨ Features
- Luxury watch catalog with categories & filtering
- Shopping cart & checkout (Stripe integration)
- Admin dashboard for orders, products, categories, subscribers
- WhatsApp integration for order notifications
- Responsive design with glassmorphism UI
- Cloudinary image upload
- SEO optimized metadata

## 🛠 Tech Stack
### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React icons
- Zustand for state (Auth/Cart)

### Backend
- Node.js / Express
- MongoDB/Mongoose
- Stripe Payments
- Cloudinary CDN
- Nodemailer
- JWT Auth

## 📦 Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas or local
- Stripe account
- Cloudinary account
- Gmail for emails (optional)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill .env with DB_URI, JWT_SECRET, STRIPE_KEY, CLOUDINARY_CREDENTIALS
npm start
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Fill NEXT_PUBLIC_API_URL, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
npm run dev
```

## 🔐 Admin Access
- Email: `admin@iwrist.pk`
- Dashboard: `/dashboard`
- Admin email: `harisshabbir17@gmail.com`

## 📱 WhatsApp Integration
- Orders auto-trigger WhatsApp messages
- Admin can contact customers directly

## 🚀 Production Deploy
```
Frontend: Vercel (Next.js)
Backend: Railway/Heroku (Node.js)
DB: MongoDB Atlas
Images: Cloudinary
Payments: Stripe
```

## 🤝 Contributing
1. Fork repo
2. Create feature branch
3. Commit changes
4. Push & PR

## 📄 License
MIT
