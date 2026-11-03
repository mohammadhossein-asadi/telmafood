# TelmaFood (تلما فود)

<div align="center">

![TelmaFood Logo](public/logo.png)

**Iranian Food Delivery & Restaurant Discovery Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-Latest-FF6F61?logo=nextauth&logoColor=white)](https://next-auth.js.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[🇬🇧 English](#-telmafood-تلما-فود) • [🇮🇷 فارسی](README.fa.md) • [📖 Documentation](#-documentation) • [🚀 Quick Start](#-quick-start) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

**TelmaFood** is a **Persian-first food delivery and restaurant discovery platform** tailored for the **Iranian market**. Connect hungry customers with local restaurants, enable **real-time order tracking**, **smart recommendations**, **cash-on-delivery + Iranian gateways** (Zarinpal, Zibal, Mellat), and **restaurant management tools** — all with **full RTL, Jalali, and Persian numeral support**.

### 🎯 Why TelmaFood?

| Problem | TelmaFood Solution |
|---------|-------------------|
| International apps don't support Iran | **Built for Iran** — RTL, Jalali, Toman, Iranian payments |
| No local restaurant discovery | **Neighborhood-based** — Tehran districts, major cities |
| Cash-on-delivery not supported | **Native COD** + Zarinpal, Zibal, Mellat, Saman |
| Restaurant tools in English | **Persian dashboard** — orders, menu, analytics, riders |
| No rider app | **Dedicated rider app** — navigation, earnings, schedule |

---

## ✨ Features

### 🍽️ **Customer App**
- **Restaurant discovery** — Map, list, filters (cuisine, rating, price, delivery time)
- **Smart search** — Persian/Arabic script, voice, "near me", dietary tags
- **Menu browsing** — Categories, photos, descriptions, allergens, spice level
- **Cart & checkout** — COD, Zarinpal, Zibal, wallet, promo codes
- **Real-time tracking** — Rider location, ETA, order status timeline
- **Reviews & ratings** — Photos, Persian text, response from restaurant
- **Favorites & history** — Reorder, dietary preferences, budget alerts

### 🏪 **Restaurant Dashboard**
- **Order management** — New, preparing, ready, picked up, delivered
- **Menu management** — Categories, items, modifiers, photos, availability
- **Analytics** — Revenue, orders, peak hours, popular items, customer retention
- **Rider coordination** — Assign, track, communicate, payout
- **Promotions** — Discounts, combos, loyalty, flash deals
- **Settings** — Hours, delivery zone, fees, printer integration

### 🛵 **Rider App (Mobile)**
- **Order assignment** — Accept/reject, auto-assign by proximity
- **Navigation** — Neshan/Balad maps, turn-by-turn, traffic
- **Earnings** — Per order, tips, bonuses, weekly summary
- **Schedule** — Shifts, availability, time-off requests
- **Support** — Emergency button, chat support, rating

### 💳 **Payments (Iranian Market)**
| Method | Support |
|--------|---------|
| **Cash on Delivery** | Native, default, change calculation |
| **Zarinpal** | Redirect, verify, refund |
| **Zibal** | Redirect, verify, refund |
| **Mellat Bank** | Sep, Sadad, IPG |
| **Saman Bank** | Sep, IPG |
| **Wallet** | In-app balance, top-up, cashback |

### 🗺️ **Maps & Logistics**
- **Iranian maps** — Neshan, Balad, OpenStreetMap (Iran tiles)
- **Address system** — Persian neighborhoods, alleys (کوچه), plaques (پلاک)
- **Delivery zones** — Polygon drawing, radius, time-based
- **Route optimization** — Multiple orders, rider efficiency
- **Traffic awareness** — Real-time (Neshan API), ETA adjustment

### 🌍 **Persian-First Experience**
| Feature | Implementation |
|---------|----------------|
| **RTL Layouts** | Tailwind RTL + CSS logical properties |
| **Typography** | Vazirmatn for Persian |
| **Calendar** | Jalali with Gregorian sync |
| **Numerals** | Persian digits (۱۲۳) |
| **Currency** | Toman/Rial (۱۰,۰۰۰ separator) |
| **Addresses** | Persian format (استان، شهر، خیابان، کوچه، پلاک) |
| **Voice** | Persian STT/TTS for search, rider |

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js (App Router) |
| **Runtime** | React 19 |
| **Language** | TypeScript 5 (Strict) |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | NextAuth.js |
| **Payments** | Zarinpal, Zibal, Mellat, Saman |
| **Maps** | Neshan, Balad, Leaflet |
| **Real-time** | Pusher / Supabase Realtime |
| **Mobile** | React Native + Expo (Rider app) |
| **Deployment** | Vercel + PostgreSQL |

### Project Structure

```
telmafood/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (customer)/
│   │   │   ├── restaurants/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   └── profile/
│   │   ├── (restaurant)/
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── menu/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── (rider)/
│   │   │   ├── orders/
│   │   │   ├── earnings/
│   │   │   └── schedule/
│   │   ├── api/
│   │   │   ├── orders/
│   │   │   ├── restaurants/
│   │   │   ├── payments/
│   │   │   ├── riders/
│   │   │   └── webhooks/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── customer/
│   │   ├── restaurant/
│   │   ├── rider/
│   │   └── maps/
│   ├── hooks/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── payments/
│   │   ├── maps/
│   │   └── utils.ts
│   ├── store/
│   └── types/
├── rider-app/                    # React Native + Expo
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** 15+
- **Payment gateway** credentials (Zarinpal, Zibal, etc.)
- **Neshan/Balad** API key for maps

### Installation

```bash
git clone https://github.com/mohammadhossein-asadi/telmafood.git
cd telmafood
npm install
cp .env.example .env.local
# Edit .env.local
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Payments
ZARINPAL_MERCHANT_ID=...
ZIBAL_MERCHANT_ID=...
MELLAT_TERMINAL_ID=...
MELLAT_USERNAME=...
MELLAT_PASSWORD=...

# Maps
NESHAN_API_KEY=...
BALAD_API_KEY=...

# Real-time
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...
```

---

## 🛠️ Development

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run start        # Production server
npm run db:studio    # Prisma Studio
npm run lint         # ESLint
npm test             # Vitest
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System design |
| [Payments](docs/PAYMENTS.md) | Iranian gateways integration |
| [Maps](docs/MAPS.md) | Neshan/Balad integration |
| [Rider App](docs/RIDER_APP.md) | React Native app |
| [Deployment](docs/DEPLOYMENT.md) | Vercel guide |

---

## 🚀 Deployment

### Vercel + Neon

```bash
vercel --prod
# Add env vars
# Connect Neon PostgreSQL
```

---

## 🔒 Security

- **NextAuth.js** sessions
- **Prisma** SQL injection prevention
- **Zod** validation
- **Rate limiting** on payments
- **CSP** headers
- **PCI DSS** awareness for payments

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📋 Roadmap

- [x] Customer app + restaurant dashboard
- [x] COD + Iranian payments
- [x] Real-time tracking
- [x] Persian RTL + Jalali
- [ ] Rider mobile app (React Native)
- [ ] AI recommendations
- [ ] Loyalty program
- [ ] Dark kitchen support
- [ ] Franchise management
- [ ] White-label for cities

---

## 📄 License

**MIT License** — See [LICENSE](LICENSE)

---

## 🙏 Acknowledgments

- **Next.js**, **Prisma**, **NextAuth.js**, **Tailwind CSS**
- **Zarinpal**, **Zibal**, **Mellat**, **Saman** — Payment gateways
- **Neshan**, **Balad** — Iranian maps
- **Vazirmatn Font** — Persian typography

---

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/mohammadhossein-asadi/telmafood/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mohammadhossein-asadi/telmafood/discussions)

---

<div align="center">

**Built with ❤️ for Iranian food lovers & restaurants**

[🇬🇧 English](README.md) • [🇮🇷 فارسی](README.fa.md) • [⭐ Star us on GitHub](https://github.com/mohammadhossein-asadi/telmafood)

</div>