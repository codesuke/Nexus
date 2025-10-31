<div align="center">

# 🎓 Nexus LMS

### A Modern, Full-Stack Learning Management System

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://nexus-beta-two.vercel.app/)
[![Backend](https://img.shields.io/badge/api-deployed-blue?style=for-the-badge)](https://nexus-server-0pm2.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)](LICENSE)

**Built for students, teachers, and lifelong learners**

[✨ Features](#-features) • [🚀 Live Demo](#-live-demo) • [💻 Tech Stack](#-tech-stack) • [📦 Getting Started](#-getting-started)

</div>

---

## 🌟 Overview

Nexus is a production-ready Learning Management System built with modern web technologies. It enables students to browse and enroll in courses, track their progress, and learn at their own pace, while empowering teachers to create engaging educational content with video lessons.

**🎯 Perfect for:**
- Educational institutions
- Online course creators
- Corporate training programs
- Portfolio projects

---

## 🚀 Live Demo

| Platform | URL | Status |
|----------|-----|--------|
| **Frontend** | [nexus-beta-two.vercel.app](https://nexus-beta-two.vercel.app/) | 🟢 Live |
| **Backend API** | [nexus-server-0pm2.onrender.com](https://nexus-server-0pm2.onrender.com) | 🟢 Live |

> **Note:** Backend on free tier spins down after 15 minutes of inactivity (30s cold start)

---

## ✨ Features

### 👨‍🎓 For Students
- 📚 **Course Discovery** - Browse extensive course catalog with search and filters
- 🎥 **Video Learning** - High-quality video lessons powered by Cloudinary
- � **Progress Tracking** - Monitor completion status across chapters and sections
- 💳 **Easy Enrollment** - Seamless course registration with demo payment system
- 🔖 **Learning Dashboard** - Personalized view of enrolled courses and progress

### 👨‍🏫 For Teachers
- � **Course Creation** - Rich course builder with chapters and sections
- 🎬 **Video Upload** - Direct integration with Cloudinary for video hosting
- � **Student Management** - View enrollments and track student progress
- 💰 **Revenue Tracking** - Monitor course sales and transaction history
- ✏️ **Content Updates** - Edit and refine course materials anytime

### 🔐 For Everyone
- 🚀 **Fast & Responsive** - Optimized performance with Next.js 15
- 🔒 **Secure Authentication** - Powered by Clerk with OAuth support
- 📱 **Mobile Friendly** - Fully responsive design works on all devices
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS + shadcn/ui

---

## 💻 Tech Stack

### **Frontend** ([Vercel](https://vercel.com))
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | `15.0.4` | React framework with App Router |
| **TypeScript** | `^5` | Type-safe development |
| **Tailwind CSS** | `^3.4.1` | Utility-first styling |
| **shadcn/ui** | Latest | Beautiful UI components |
| **Redux Toolkit** | `^2.5.0` | State management + RTK Query |
| **Clerk** | `^6.11.0` | Authentication & user management |

### **Backend** ([Render](https://render.com))
| Technology | Version | Purpose |
|------------|---------|---------|
| **Express** | `^5.1.0` | Node.js web framework |
| **TypeScript** | `^5.9.3` | Type safety |
| **MongoDB Atlas** | Cloud | NoSQL database (512MB free tier) |
| **Mongoose** | `^8.19.2` | MongoDB ODM |
| **Cloudinary** | `^2.5.1` | Video & image hosting |
| **Clerk/Express** | `^1.7.43` | Server-side auth middleware |

### **Infrastructure**
- **Hosting:** Vercel (Frontend) + Render (Backend)
- **Database:** MongoDB Atlas M0 (Free Cluster)
- **Storage:** Cloudinary (25GB free)
- **Auth:** Clerk (10K MAU free)
- **Cost:** **$0/month** 🎉

---

## 📦 Project Architecture

```
Nexus/
├── nexus_client/              # Frontend Application (Vercel)
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   │   ├── (auth)/       # Authentication pages
│   │   │   ├── (dashboard)/  # Student & Teacher dashboards
│   │   │   └── (nondashboard)/ # Public pages
│   │   ├── components/       # Reusable React components
│   │   │   ├── ui/          # shadcn/ui primitives
│   │   │   └── *.tsx        # Custom components
│   │   ├── state/           # Redux store & API slices
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities & helpers
│   │   └── types/           # TypeScript type definitions
│   └── package.json
│
├── nexus_server/              # Backend API (Render)
│   ├── src/
│   │   ├── controllers/      # Route handlers & business logic
│   │   ├── models/          # Mongoose schemas (MongoDB)
│   │   │   ├── courseModel.mongoose.ts
│   │   │   ├── transactionModel.mongoose.ts
│   │   │   └── userCourseProgressModel.mongoose.ts
│   │   ├── routes/          # Express route definitions
│   │   ├── config/          # Database & service configs
│   │   ├── seed/            # Database seeding scripts
│   │   └── index.ts         # Server entry point
│   ├── Dockerfile           # Docker containerization
│   └── package.json
│
└── Guides/                    # Documentation & deployment guides
```

---

## 📦 Getting Started

### Prerequisites
- **Node.js** 20+ and npm
- **MongoDB Atlas** account (free)
- **Clerk** account for authentication
- **Cloudinary** account for video storage

### 🔧 Local Development Setup

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/codesuke/Nexus.git
cd Nexus
```

#### 2️⃣ Backend Setup

```bash
cd nexus_server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env` with your credentials:**
```env
PORT=8001
NODE_ENV=development

# MongoDB Atlas (create free cluster at mongodb.com/cloud/atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexus

# Clerk (get from dashboard.clerk.com)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

**Start the server:**
```bash
# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

Server runs at: `http://localhost:8001`

#### 3️⃣ Frontend Setup

```bash
cd nexus_client

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

**Configure `.env.local`:**
```env
# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Start the development server:**
```bash
npm run dev
```

Frontend runs at: `http://localhost:3000` 🎉

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

**Automatic deployment is already configured!** Every push to `main` branch auto-deploys.

**Manual deployment:**
```bash
cd nexus_client

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment variables to set in Vercel dashboard:**
- `NEXT_PUBLIC_API_BASE_URL` → Your Render backend URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Backend Deployment (Render)

1. **Create Render Account** at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repository
   - Root Directory: `nexus_server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Configure Environment Variables** (in Render dashboard):
   ```
   PORT=8001
   NODE_ENV=production
   MONGODB_URI=<your_mongodb_atlas_connection_string>
   CLERK_PUBLISHABLE_KEY=<your_clerk_key>
   CLERK_SECRET_KEY=<your_clerk_secret>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
   CLOUDINARY_API_KEY=<your_cloudinary_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_secret>
   FRONTEND_URL=https://nexus-beta-two.vercel.app
   ```

4. **MongoDB Atlas Network Access**
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - Required for Render to connect

5. **Deploy!** Render auto-deploys from GitHub on every push.

---

## 💰 Cost Breakdown (Free Tier)

| Service | Plan | Limits | Cost |
|---------|------|--------|------|
| **Vercel** | Hobby | Unlimited deployments, 100GB bandwidth | **$0** |
| **Render** | Free | 750 hours/month, sleeps after 15min idle | **$0** |
| **MongoDB Atlas** | M0 Cluster | 512MB storage, shared CPU | **$0** |
| **Cloudinary** | Free | 25GB storage, 25GB bandwidth/month | **$0** |
| **Clerk** | Free | 10,000 monthly active users | **$0** |
| **Total Monthly Cost** | | | **$0** 🎉 |

> **Upgrade Path:** Scale to paid tiers as your user base grows (Render $7/mo, MongoDB $9/mo, Cloudinary $89/mo)

---

## 🎯 Key Highlights

### ✅ Production-Ready Features
- 🔐 **Secure Authentication** - Industry-standard OAuth with Clerk
- 🎥 **Video Streaming** - CDN-powered video delivery via Cloudinary
- 📊 **Real-time Progress** - Track learning across chapters and sections
- 💳 **Payment System** - Demo transactions (ready for Stripe integration)
- 🔍 **Search & Filter** - Find courses by category, level, and instructor
- 📱 **Responsive Design** - Seamless experience on mobile, tablet, and desktop

### 🚀 Developer Experience
- 📝 **Full TypeScript** - Type safety across frontend and backend
- 🧪 **Seeding Scripts** - Populate database with sample data
- 🔄 **Auto-Deploy** - CI/CD with GitHub integration
- 📚 **Comprehensive Docs** - Setup guides and API documentation
- 🎨 **Component Library** - shadcn/ui for consistent UI
- ⚡ **Fast Reload** - HMR with Next.js dev server

### 📈 Scalability
- 🗄️ **MongoDB Atlas** - Horizontal scaling ready
- 🌐 **CDN Caching** - Fast global content delivery
- 🔌 **RESTful API** - Clean separation of concerns
- 🐳 **Dockerized** - Container-ready for any platform
- 🔧 **Environment Configs** - Easy multi-environment setup

---

## 📚 API Documentation

### Base URL
- **Production:** `https://nexus-server-0pm2.onrender.com`
- **Local:** `http://localhost:8001`

### Core Endpoints

#### Courses
```http
GET    /courses              # List all courses
GET    /courses/:courseId    # Get course details
POST   /courses              # Create course (teacher only)
PUT    /courses/:courseId    # Update course (teacher only)
DELETE /courses/:courseId    # Delete course (teacher only)
```

#### Transactions
```http
GET    /transactions         # List all transactions
POST   /transactions         # Create enrollment transaction
GET    /transactions/user/:userId  # User's transactions
```

#### User Progress
```http
GET    /user-course-progress/:userId              # User's all progress
GET    /user-course-progress/:userId/:courseId    # Course-specific progress
PUT    /user-course-progress/:userId/:courseId    # Update progress
```

#### User Management (Clerk Integration)
```http
POST   /users/clerk          # Sync Clerk user to database
PUT    /users/clerk/:userId  # Update user profile
```

---

## �️ Available Scripts

### Backend (nexus_server)
```bash
npm run dev           # Start development server with hot reload
npm run build         # Compile TypeScript to JavaScript
npm start             # Run production server
npm run seed          # Seed database with sample data
npm run check-accounts # Verify user accounts in database
npm run setup-accounts # Configure test accounts
```

### Frontend (nexus_client)
```bash
npm run dev           # Start Next.js development server
npm run build         # Build for production
npm start             # Run production build locally
npm run lint          # Run ESLint
```

---

## 🔒 Security Features

- ✅ **Clerk Authentication** - Secure OAuth & JWT handling
- ✅ **Environment Variables** - Secrets never committed to Git
- ✅ **CORS Protection** - Whitelisted origins only
- ✅ **Helmet.js** - Security headers for Express
- ✅ **MongoDB Atlas** - Encrypted connections & access control
- ✅ **Rate Limiting** - Coming soon (DDoS protection)

---

## 🎨 UI Components

Built with **shadcn/ui** - a collection of beautiful, accessible components:

- **Cards** - Course cards, teacher cards, preview cards
- **Forms** - Custom form fields with validation
- **Modals** - Custom modal component for overlays
- **Navigation** - Sidebar, navbar, toolbar components
- **Loading States** - Skeletons and spinners
- **Accordions** - Collapsible sections for course content
- **Buttons, Inputs, Selects** - Full form element library

---

## 🧪 Database Schema

### Course
```typescript
{
  courseId: string        // Unique identifier
  teacherId: string       // Instructor's user ID
  teacherName: string     // Instructor display name
  title: string           // Course title
  description: string     // Course description
  category: string        // e.g., "Web Development"
  image: string           // Thumbnail URL
  price: number           // Price in cents
  level: string           // "Beginner" | "Intermediate" | "Advanced"
  status: string          // "Draft" | "Published"
  sections: Section[]     // Array of sections
  enrollments: Enrollment[] // Students enrolled
}
```

### Transaction
```typescript
{
  transactionId: string   // Unique ID
  userId: string          // Student's user ID
  courseId: string        // Purchased course ID
  paymentProvider: string // "demo" | "stripe"
  amount: number          // Amount paid (cents)
  dateTime: Date          // Purchase timestamp
}
```

### UserCourseProgress
```typescript
{
  userId: string          // Student's user ID
  courseId: string        // Course being tracked
  enrollmentDate: Date    // When enrolled
  overallProgress: number // 0-100 percentage
  sections: {             // Per-section progress
    sectionId: string
    chapters: {
      chapterId: string
      completed: boolean
    }[]
  }[]
  lastAccessedTimestamp: Date
}
```

---

## 🤝 Contributing

Contributions are welcome! This project is open for:

- 🐛 Bug fixes
- ✨ Feature requests
- 📝 Documentation improvements
- 🎨 UI/UX enhancements

**To contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] Course management system
- [x] Video hosting integration
- [x] Student progress tracking
- [x] Demo payment system
- [x] Full deployment

### Phase 2 (Planned)
- [ ] Real Stripe payment integration
- [ ] Certificate generation
- [ ] Course reviews & ratings
- [ ] Discussion forums
- [ ] Live classes support

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] AI-powered course recommendations
- [ ] Quiz & assessment system
- [ ] Gamification (badges, leaderboards)
- [ ] Multi-language support

---

## 📖 Documentation

Comprehensive guides available in the `/Guides` folder:

- **`ARCHITECTURE.md`** - System architecture overview
- **`BACKEND_DEPLOYMENT_GUIDE.md`** - Step-by-step backend deployment
- **`BACKEND_QUICKSTART.md`** - Quick backend setup
- **`IMPLEMENTATION_SUMMARY.md`** - Complete feature documentation
- **`AWS_DYNAMODB_SETUP.md`** - (Legacy) DynamoDB setup guide

---

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
- ✅ Check MongoDB Atlas is allowing `0.0.0.0/0` in Network Access
- ✅ Verify `MONGODB_URI` is correct in environment variables
- ✅ Ensure connection string includes database name

### Frontend can't reach backend
- ✅ Check `NEXT_PUBLIC_API_BASE_URL` points to correct backend URL
- ✅ Verify CORS is configured with correct `FRONTEND_URL`
- ✅ On Render free tier, first request takes ~30s (cold start)

### Video upload not working
- ✅ Confirm Cloudinary credentials are correct
- ✅ Check Cloudinary dashboard for upload quota
- ✅ Verify video file size is under limit

### Build fails on Render
- ✅ Ensure all environment variables are set
- ✅ Check Render logs for specific error
- ✅ Verify `package.json` scripts are correct

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 codesuke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👨‍💻 Author

**codesuke**
- 🐙 GitHub: [@codesuke](https://github.com/codesuke)
- 🌐 Portfolio: [Nexus LMS](https://nexus-beta-two.vercel.app/)
- 📧 Contact: Open to collaboration and opportunities

---

## 🙏 Acknowledgments

Special thanks to the amazing open-source community:

- **[Next.js](https://nextjs.org/)** - The React Framework for Production
- **[Clerk](https://clerk.com/)** - Authentication made simple
- **[MongoDB](https://www.mongodb.com/)** - Modern database for modern apps
- **[Cloudinary](https://cloudinary.com/)** - Media management platform
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vercel](https://vercel.com/)** - Frontend hosting platform
- **[Render](https://render.com/)** - Backend deployment platform

---

## � Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/codesuke/Nexus?style=flat-square)
![GitHub language count](https://img.shields.io/github/languages/count/codesuke/Nexus?style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/codesuke/Nexus?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/codesuke/Nexus?style=flat-square)

---

## 💬 Support

Need help? Have questions?

- 📖 Check the [Documentation](Guides/)
- 🐛 Open an [Issue](https://github.com/codesuke/Nexus/issues)
- 💬 Start a [Discussion](https://github.com/codesuke/Nexus/discussions)

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

**Built with ❤️ using Next.js, Express, MongoDB, and Cloudinary**

[🔝 Back to Top](#-nexus-lms)

</div>
