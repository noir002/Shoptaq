# Sage AI 🚀

> An AI-powered ecommerce admin dashboard built with React, Node.js, MongoDB, and Google Gemini.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node.js-20-green) ![MongoDB](https://img.shields.io/badge/MongoDB-8-green) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## ✨ Features

- 🔐 **JWT Authentication** — Secure login/signup with bcrypt password hashing
- 📦 **Product Management** — Full CRUD with search, filters, pagination
- 🤖 **AI Content Tools** — 5 AI-powered generators (descriptions, tags, captions, pricing, trends)
- 📊 **Analytics Dashboard** — Revenue charts, sales trends, inventory insights
- 🚨 **Low Stock Alerts** — Real-time inventory warnings
- 🎨 **Dark SaaS UI** — Shopify/Vercel-inspired design with glassmorphism
- 📱 **Fully Responsive** — Works on all screen sizes

---

## 🗂️ Project Structure

```
sage/
├── backend/              # Node.js + Express API
│   ├── config/           # DB connection
│   ├── controllers/      # Route handlers
│   ├── middleware/        # JWT auth middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── utils/            # AI prompt builders
│   ├── seed.js           # Sample data seeder
│   └── server.js         # Entry point
│
└── frontend/             # React + Vite
    └── src/
        ├── api/          # Axios instance
        ├── components/   # Layout, UI, Charts
        ├── context/      # Auth context
        ├── pages/        # All pages
        └── routes/       # Protected routes
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Install backend dependencies
cd sage/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Copy the template
cp backend/.env.example backend/.env

# Edit backend/.env:
PORT=5000
MONGO_URI=mongodb://localhost:27017/sage
JWT_SECRET=your_super_secret_key_here
GEMINI_API_KEY=AIzaSy...   # Optional — mock data used if omitted
NODE_ENV=development
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates 20 sample products, sales history, and an admin account:
- **Email:** `admin@sage.com`
- **Password:** `password123`

### 4. Start Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev    # or: node server.js
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** 🎉

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all (search/filter/paginate) |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/products/categories` | Get all categories |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | Revenue, orders, products summary |
| GET | `/api/analytics/monthly` | 12-month revenue/orders data |
| GET | `/api/analytics/top-products` | Top 5 by revenue |
| GET | `/api/analytics/inventory` | Stock by category |
| GET | `/api/analytics/growth` | Product additions over time |

### AI (all require auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/description` | Generate product description |
| POST | `/api/ai/tags` | Generate SEO tags |
| POST | `/api/ai/caption` | Generate social captions |
| POST | `/api/ai/pricing` | Price recommendations |
| POST | `/api/ai/trending` | Trending product ideas |

---

## 🤖 AI Integration

Sage AI uses **Google Gemini**. All 5 AI tools include graceful fallback mock data, so the app works perfectly without an API key during development.

To enable real AI: add your key to `backend/.env`:
```
GEMINI_API_KEY=AIzaSy...
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| HTTP | Axios |
| Charts | Chart.js + react-chartjs-2 |
| Icons | React Icons |
| Toast | react-hot-toast |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | Google Gemini SDK |

---

## 📄 License

MIT — free to use and modify.
