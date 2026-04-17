# Svarajya — Application Route Map

> **Share-ready reference for all public and authenticated routes.**
> Every URL, its file location, and auth requirement — in one place.

---

## 🌐 Public Marketing Routes (`(landing)` group)

| URL | File | Description |
|---|---|---|
| `/` | `src/app/(landing)/page.tsx` | Homepage / Landing page |
| `/about` | `src/app/(landing)/about/page.tsx` | About Us |
| `/pricing` | `src/app/(landing)/pricing/page.tsx` | Pricing |
| `/blog` | `src/app/(landing)/blog/page.tsx` | Blog |
| `/careers` | `src/app/(landing)/careers/page.tsx` | Careers |
| `/contact` | `src/app/(landing)/contact/page.tsx` | Contact Us |
| `/privacy` | `src/app/(landing)/privacy/page.tsx` | Privacy Policy |
| `/terms` | `src/app/(landing)/terms/page.tsx` | Terms of Service |
| `/security` | `src/app/(landing)/security/page.tsx` | Security |
| `/customers-reviews` | `src/app/(landing)/customers-reviews/page.tsx` | Customer Reviews |
| `/partner-with-us` | `src/app/(landing)/partner-with-us/page.tsx` | Partner With Us |
| `/features` | `src/app/(landing)/features/page.tsx` | Features |
| `/map` | `src/app/(landing)/map/page.tsx` | Svarajya Map |
| `/roadmap` | `src/app/(landing)/roadmap/page.tsx` | Roadmap |

---

## 🔐 Authentication Routes (`(auth)` group)

| URL | File | Description |
|---|---|---|
| `/login` | `src/app/(auth)/login/page.tsx` | Login page |
| `/register` | `src/app/(auth)/register/page.tsx` | Register / Sign up |
| `/callback` | `src/app/(auth)/callback/page.tsx` | OAuth callback (Google) |
| `/intro-cinematic` | `src/app/(auth)/intro-cinematic/page.tsx` | Cinematic intro after first login |
| `/start` | `src/app/(auth)/start/page.tsx` | App start / splash |
| `/forget-password` | `src/app/(landing)/forget-password/page.tsx` | Forgot password |

---

## 🧭 Onboarding Routes (`(onboarding)` group)
> Requires auth. Shown to new users after registration.

| URL | File | Description |
|---|---|---|
| `/onboarding/intro` | `src/app/(onboarding)/intro/page.tsx` | Intro step |
| `/onboarding/name` | `src/app/(onboarding)/name/page.tsx` | Name step |
| `/onboarding/dob` | `src/app/(onboarding)/dob/page.tsx` | Date of birth |
| `/onboarding/occupation` | `src/app/(onboarding)/occupation/page.tsx` | Occupation |
| `/onboarding/status` | `src/app/(onboarding)/status/page.tsx` | Marital/family status |
| `/onboarding/family` | `src/app/(onboarding)/family/page.tsx` | Family members |
| `/onboarding/contact-info` | `src/app/(onboarding)/contact-info/page.tsx` | Contact info |
| `/onboarding/profile` | `src/app/(onboarding)/profile/page.tsx` | Profile picture |
| `/onboarding/vault-setup` | `src/app/(onboarding)/vault-setup/page.tsx` | Vault setup |
| `/onboarding/firstwin` | `src/app/(onboarding)/firstwin/page.tsx` | First win celebration |

---

## 🏛️ Dashboard Routes (`(dashboard)` group)
> Requires auth + completed onboarding.

| URL | File | Zone |
|---|---|---|
| `/rajya` | `src/app/(dashboard)/rajya/page.tsx` | Main dashboard / Rajya map |
| `/dwaar` | `src/app/(dashboard)/dwaar/page.tsx` | Welcome / Dashboard home |
| `/suchak` | `src/app/(dashboard)/suchak/page.tsx` | Indicators / Overview |
| `/pehchaan` | `src/app/(dashboard)/pehchaan/page.tsx` | Identity / Profile |
| `/raksha` | `src/app/(dashboard)/raksha/page.tsx` | 🛡️ Insurance & protection |
| `/vyaya` | `src/app/(dashboard)/vyaya/page.tsx` | 💧 Expense tracking |
| `/rin` | `src/app/(dashboard)/rin/page.tsx` | ⚔️ Loans & debt |
| `/kosh` | `src/app/(dashboard)/kosh/page.tsx` | 🏦 Treasury / Savings |
| `/khate` | `src/app/(dashboard)/khate/page.tsx` | 📒 Accounts |
| `/lakshya` | `src/app/(dashboard)/lakshya/page.tsx` | 🎯 Goals |
| `/leakage` | `src/app/(dashboard)/leakage/page.tsx` | 💸 Expense leakage |
| `/sampatti` | `src/app/(dashboard)/sampatti/page.tsx` | 🏠 Assets & property |
| `/granthagaar` | `src/app/(dashboard)/granthagaar/page.tsx` | 📚 Document vault |
| `/kar` | `src/app/(dashboard)/kar/page.tsx` | 📊 Tax management |
| `/mitra` | `src/app/(dashboard)/mitra/page.tsx` | 👨‍👩‍👧 Family management |
| `/bhoomi` | `src/app/(dashboard)/bhoomi/page.tsx` | 🌏 Property |
| `/beej` | `src/app/(dashboard)/beej/page.tsx` | 🌱 Investments |
| `/suraksha` | `src/app/(dashboard)/suraksha/page.tsx` | 🔒 Security settings |
| `/foundation` | `src/app/(dashboard)/foundation/page.tsx` | ⚙️ Foundation setup |
| `/mantri` | `src/app/(dashboard)/mantri/page.tsx` | 🤝 Advisor / Mantri |
| `/raj-mantri` | `src/app/(dashboard)/raj-mantri/page.tsx` | 👑 AI Raj Mantri |
| `/doot` | `src/app/(dashboard)/doot/page.tsx` | 📬 Notifications |

---

## 🔌 API Routes

| Endpoint | File | Method(s) |
|---|---|---|
| `/api/auth/...` | `src/app/api/auth/[...nextauth]/` | Auth endpoints (Supabase) |
| `/api/profile` | `src/app/api/profile/route.ts` | GET, PUT |
| `/api/income` | `src/app/api/income/route.ts` | GET, POST |
| `/api/expenses` | `src/app/api/expenses/route.ts` | GET, POST, DELETE |
| `/api/loans` | `src/app/api/loans/route.ts` | GET, POST, PATCH |
| `/api/assets` | `src/app/api/assets/route.ts` | GET, POST |
| `/api/insurance` | `src/app/api/insurance/route.ts` | GET, POST |
| `/api/investments` | `src/app/api/investments/route.ts` | GET, POST |
| `/api/goals` | `src/app/api/goals/route.ts` | GET, POST, PATCH |
| `/api/documents` | `src/app/api/documents/route.ts` | GET, POST, DELETE |
| `/api/family` | `src/app/api/family/route.ts` | GET, POST, DELETE |
| `/api/subscriptions` | `src/app/api/subscriptions/route.ts` | GET, POST |
| `/api/tax` | `src/app/api/tax/route.ts` | GET, POST |
| `/api/identity` | `src/app/api/identity/route.ts` | GET, PUT |
| `/api/nominees` | `src/app/api/nominees/route.ts` | GET, POST |
| `/api/reminders` | `src/app/api/reminders/route.ts` | GET, POST |
| `/api/analytics` | `src/app/api/analytics/route.ts` | GET |
| `/api/ai` | `src/app/api/ai/route.ts` | POST (AI advisor) |
| `/api/bank` | `src/app/api/bank/route.ts` | GET, POST |

---

## 🗂️ Project Structure Summary

```
LifeBalance/
├── src/
│   ├── app/
│   │   ├── (landing)/          ← Public marketing pages
│   │   ├── (auth)/             ← Login, register, callback
│   │   ├── (onboarding)/       ← New user setup flow
│   │   ├── (dashboard)/        ← Authenticated app
│   │   ├── api/                ← REST API routes
│   │   ├── layout.tsx          ← Root HTML layout
│   │   └── globals.css         ← Global styles
│   ├── components/
│   │   ├── landing/            ← Landing page components
│   │   ├── providers/          ← React context providers
│   │   └── ui/                 ← Shared UI components
│   ├── context/
│   │   └── landing/            ← LanguageContext (canonical)
│   ├── lib/
│   │   ├── prisma.ts           ← Prisma client singleton
│   │   └── supabase/           ← Supabase middleware & clients
│   ├── locales/
│   │   └── landing/            ← i18n JSON files (en, hi_mix, mr_mix)
│   └── middleware.ts            ← Auth session refresh middleware
├── prisma/
│   └── schema.prisma           ← Database schema
├── .env.example                ← Required environment variables
├── ROUTES.md                   ← This file
└── package.json
```

---

## ⚙️ Environment Variables Required

Copy `.env.example` to `.env` and fill in all values before running locally or deploying.

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL` — Supabase PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — Server-side only service role key
- `NEXTAUTH_SECRET` — Random string for session encryption
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — For Google OAuth

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type check
npx tsc --noEmit

# Production build
npm run build
npm start
```
