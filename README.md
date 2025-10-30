# 🎓 Nexus LMS
An Interactive Learning Management System Platform

> **Live Demo:** [Frontend on Vercel](#) | **Backend:** Ready for Railway deployment  
> **Status:** ✅ Production Ready | **Cost:** $0/month (Free Tier)

---

## 🚀 Features

### For Students:
- 📚 Browse and enroll in courses
- 🎥 Watch video lessons
- 📝 Track learning progress
- 💳 Demo payment system (portfolio-ready)

### For Teachers:
- 📖 Create and manage courses
- 🎬 Upload video content via Cloudinary
- 📊 Track student enrollments
- 💰 View transaction history

---

## 🛠️ Tech Stack

### Frontend (Next.js)
- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **UI:** Tailwind CSS + shadcn/ui components
- **Auth:** Clerk Authentication
- **State:** Redux Toolkit (RTK Query)
- **Deployment:** Vercel

### Backend (Express)
- **Framework:** Express.js 5
- **Language:** TypeScript
- **Database:** DynamoDB (Dynamoose ORM)
- **Storage:** Cloudinary (Video hosting)
- **Payments:** Demo system (upgradeable to Stripe/Razorpay)
- **Deployment:** Railway with Docker

---

## 📦 Project Structure

```
Nexus/
├── nexus_client/          # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── state/            # Redux store & RTK Query
│   └── types/            # TypeScript definitions
│
├── nexus_server/          # Express backend
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # DynamoDB models
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Helpers (Cloudinary, etc.)
│   │   └── seed/         # Database seeding
│   ├── Dockerfile        # Container config
│   ├── docker-compose.yml # Local development
│   └── railway.json      # Railway deployment
│
└── IMPLEMENTATION_SUMMARY.md  # Full implementation details
```

---

## ⚡ Quick Start

### 1️⃣ Clone Repository
```bash
git clone https://github.com/codesuke/Nexus.git
cd Nexus
```

### 2️⃣ Backend Setup
```bash
cd nexus_server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Get Cloudinary credentials (free):
# https://cloudinary.com/users/register/free
# Add to .env

# Start with Docker (includes DynamoDB Local)
npm run docker:up

# Seed database
npm run seed

# Test API
.\test-api.ps1
```

**📖 Full backend guide:** `nexus_server/DEPLOYMENT_GUIDE.md`

### 3️⃣ Frontend Setup
```bash
cd nexus_client

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Add your Clerk keys (from dashboard.clerk.com)
# Add backend URL: http://localhost:8001

# Start development server
npm run dev
```

Open: http://localhost:3000

---

## 🌐 Deployment

### Frontend (Vercel) - Already Deployed ✅
- Connected to GitHub
- Auto-deploys on push
- Environment variables configured

### Backend (Railway) - Ready to Deploy
```bash
# Push to GitHub
git push origin main

# Deploy to Railway:
1. Sign up at railway.app
2. New Project → Deploy from GitHub
3. Select nexus_server folder
4. Add environment variables
5. Deploy!
```

**Detailed deployment guide:** `nexus_server/DEPLOYMENT_GUIDE.md`

---

## 💰 Cost Breakdown

| Service | Free Tier | Usage |
|---------|-----------|-------|
| **Vercel** | Unlimited | Frontend hosting |
| **Railway** | $5 credits/month | Backend hosting |
| **Cloudinary** | 25GB storage + 25GB bandwidth | Video hosting |
| **Clerk** | 10,000 MAU | Authentication |
| **DynamoDB Local** | Unlimited | Database (Docker) |
| **TOTAL** | **$0/month** | 🎉 |

*Can upgrade to real AWS DynamoDB ($1-5/mo) and Stripe payments (2.9% per transaction) later*

---

## 🎯 What Makes This Special

### 1. **Zero Cost MVP**
- Entire stack runs on free tiers
- Perfect for portfolio/demo projects
- No credit card required

### 2. **Production Ready**
- Docker containerization
- Environment-based configuration
- Scalable architecture
- Complete documentation

### 3. **Easy to Upgrade**
- Switch to real Stripe payments
- Migrate to AWS DynamoDB
- Scale horizontally on Railway

### 4. **Modern Stack**
- Latest Next.js 16 with App Router
- TypeScript throughout
- Clerk for auth (no JWT headaches)
- Cloudinary for video (no S3 complexity)

---

## 📚 Documentation

- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md`
- **Backend Deployment:** `nexus_server/DEPLOYMENT_GUIDE.md`
- **Quick Start:** `nexus_server/QUICKSTART.md`
- **Environment Variables:** `nexus_server/.env.example`
- **API Testing:** `nexus_server/test-api.ps1`

---

## 🔑 Environment Variables

### Backend (nexus_server/.env)
```env
# Server
PORT=8001
NODE_ENV=development

# Clerk
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# Cloudinary (free account)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AWS (fake for local DynamoDB)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=fakeKeyForLocal
AWS_SECRET_ACCESS_KEY=fakeSecretForLocal
```

### Frontend (nexus_client/.env.local)
```env
# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Cloudinary (for upload widget)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 🧪 Testing

### Backend API Tests
```powershell
cd nexus_server

# Automated testing
.\test-api.ps1

# Manual testing
# Health check
curl http://localhost:8001

# List courses
curl http://localhost:8001/courses

# Create payment intent
curl -X POST http://localhost:8001/transactions/payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 4999}'
```

---

## 🤝 Contributing

This is a demo/portfolio project. Feel free to:
- Fork and customize
- Use as template for your LMS
- Learn from the implementation
- Suggest improvements

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**codesuke**
- GitHub: [@codesuke](https://github.com/codesuke)
- Project: Nexus LMS

---

## 🙏 Acknowledgments

- **Clerk** - Authentication made easy
- **Cloudinary** - Free video hosting
- **Railway** - Simple deployment
- **shadcn/ui** - Beautiful components
- **DynamoDB Local** - Local development database

---

## 📞 Support

Issues? Questions? Check:
1. `IMPLEMENTATION_SUMMARY.md` - What was built and why
2. `nexus_server/DEPLOYMENT_GUIDE.md` - Step-by-step deployment
3. `nexus_server/QUICKSTART.md` - 5-minute quick start

Or open an issue on GitHub!

---

**⭐ Star this repo if you found it helpful!**

*Built with ❤️ using Next.js, Express, DynamoDB, and Cloudinary*
