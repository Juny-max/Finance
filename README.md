# Aura Wealth Portal

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: SEC Ghana Compliant Prototype](https://img.shields.io/badge/Regulated-SEC_Ghana_Compliant-0B192C?style=flat-square)](https://sec.gov.gh/)

**Aura Wealth Portal** is an institutional-grade client portal and investment management platform engineered for **Aura Asset Management Limited**, a licensed investment adviser and fund manager operating in Accra, Ghana.

Designed with a private banking aesthetic, the platform communicates **Trust, Precision, Security, and Institutional Intelligence**—moving away from generic SaaS dashboard patterns to deliver a calm, restrained wealth management experience tailored to both private high-net-worth clients and institutional pension schemes.

---

## Brand & Visual Philosophy

- **Corporate Navy Palette**: Primary surfaces in deep corporate midnight navy (`#0B192C`, `bg-navy-900`) and pristine slate borders (`border-slate-200/60`).
- **Refined Gold Accents**: Warm gold (`#C4960A`, `bg-gold-50`) accents denoting institutional pedigree.
- **Tabular Figures & Currency**: Monospaced financial numbers (`tabular-nums`, `financial-figure`) formatted in Ghanaian Cedi (`GH₵`).
- **Iconography**: Exclusively powered by `@phosphor-icons/react` utilizing bold, fill, and duotone weights.
- **Micro-interactions**: Subtle, physics-based transitions using `framer-motion` for modals, drawers, and tab switches.

---

## Core Features & Modules

### 1. Overview Dashboard (`/`)
- Open greeting header displaying live portfolio value and day change metrics.
- Multi-timeframe performance chart (1M, 3M, 6M, 1Y, 3Y, ALL) comparing portfolio trajectory against the **Aura Benchmark** and **GoG 91-Day T-Bill**.
- Dynamic asset allocation donut chart.
- Scannable recent transaction ledger and relationship manager details.

### 2. Portfolio Deep-Dive (`/portfolio`)
- Comprehensive breakdown of invested capital, accumulated gains, and YTD return.
- Detailed holdings table displaying unit count, average cost, current Net Asset Value (NAV), market value, and percentage weighting per fund.

### 3. Fund Marketplace & Fund Detail (`/funds`, `/funds/[id]`)
- **Aura Fixed Income Fund**: Capital preservation via GoG Treasury securities, corporate bonds, and fixed deposits.
- **Aura Balanced Fund**: Long-term capital growth through GSE-listed equities and debt instruments.
- **Aura Global Balanced Trust**: Hard-currency diversification with pan-African sovereign debt and international equities.
- Fund detail pages featuring historical NAV progression, asset composition breakdowns, statutory terms, and downloadable prospectuses/factsheets.

### 4. Financial Transaction Ledger (`/transactions`)
- Multi-category audit trail (*Investments, Withdrawals, Switches, Dividends, Fees*).
- Real-time search by transaction reference or fund name.
- Slide-in transaction audit drawer showing timestamp, NAV at settlement, and settlement status.

### 5. Document & Statement Center (`/statements`)
- Filterable archive of monthly, quarterly, annual reports, and investment confirmations.
- Interactive statement preview modal styled with official **Aura Asset Management** letterhead, client address block, valuation tables, and instant print/export support.

### 6. Compound Wealth Calculator (`/calculator`)
- Interactive projection engine with sliders for initial deposit, monthly contribution, and investment horizon (1–20 years).
- Risk-profile presets (*Conservative 14%, Balanced 18%, Growth 22%*).
- Stacked contributions vs. capital growth visualization with year-by-year amortization schedule.

### 7. Performance & Attribution Insights (`/insights`)
- Portfolio return attribution analysis (*"What's driving your portfolio"*).
- Asset class performance contribution breakdown and benchmark comparisons.

### 8. Client Profile & Security (`/profile`, `/security`)
- KYC verification badge, primary Stanbic Bank mandates, and MTN Mobile Money mandates.
- Beneficiary allocation schedule.
- Security controls: Two-Factor Authentication (2FA) configuration, recent login audit log, and active session monitors.

### 9. Dedicated Advisor & Support (`/support`)
- Direct relationship manager contact, callback requests, and consultation bookings.
- Expandable FAQ accordions addressing fund deposits, redemption timelines (T+2), statutory custodial protections, and management fees.

---

## Interactive Transaction Flows

Built with accessible modal flows and multi-step validation:

1. **Invest Flow (`InvestFlow.tsx`)**:
   - Fund selection with real-time NAV and risk ratings.
   - Dynamic unit calculation based on deposit amount.
   - Funding channels: Bank Wire Transfer or Mobile Money (MTN / Telecel).
   - T+1 settlement timeline disclosure and instant ledger update.

2. **Withdrawal Flow (`WithdrawFlow.tsx`)**:
   - Full or partial redemption options against active holdings.
   - Statutory T+2 settlement disclosure adhering to SEC Ghana guidelines.
   - Destination mandate selection.

3. **Fund Switching (`SwitchFlow.tsx`)**:
   - Reallocate capital between Aura funds with automatic unit conversion at prevailing NAV.

---

## Demo Personas

The portal includes pre-configured demo accounts for presentation purposes:

| Persona | Account Type | Account ID | Default Valuation | Login Credentials |
|---|---|---|---|---|
| **Kwame Mensah** | Individual Private Client | `AM-20491` | `GH₵ 148,650.00` | `kwame@example.com` / `demo1234` |
| **GCB Staff Provident Scheme** | Institutional Pension Mandate | `AM-88102` | `GH₵ 14,850,000.00` | `trustees@gcbprovident.com` / `demo1234` |

> Quick 1-click login buttons are accessible directly from the bottom of the `/login` screen.

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom navy/gold typography scales
- **Charts**: [Recharts](https://recharts.org/) (Responsive Area Charts, Donut Charts, and Stacked Bar Charts)
- **Icons**: [@phosphor-icons/react](https://phosphoricons.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Persistence**: Browser-local storage layer with namespaced schemas (`lib/persistence.ts`)

---

## Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm 9+ or pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Juny-max/Finance.git
cd Finance

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build

```bash
# Compile and optimize for production
npm run build

# Start the production server
npm start
```

---

## Project Structure

```
├── app/
│   ├── (auth)/                # Authentication route group
│   │   ├── layout.tsx         # Split-screen institutional branding layout
│   │   ├── login/             # Sign-in with 1-click persona quick-logins
│   │   ├── signup/            # Client registration
│   │   ├── forgot-password/   # Password reset workflow
│   │   └── onboarding/        # 6-step client KYC onboarding flow
│   ├── (portal)/              # Authenticated wealth management shell
│   │   ├── layout.tsx         # Responsive layout (Sidebar + TopBar + MobileNav)
│   │   ├── page.tsx           # Dashboard overview
│   │   ├── portfolio/         # Asset allocation & holdings ledger
│   │   ├── funds/             # Fund directory & marketplace
│   │   │   └── [id]/          # Fund deep-dive with historical performance & docs
│   │   ├── transactions/      # Transaction audit ledger & detail drawer
│   │   ├── statements/        # Document center & printable statement preview
│   │   ├── calculator/        # Investment projection engine
│   │   ├── insights/          # Return attribution & benchmark analytics
│   │   ├── profile/           # Personal profile, KYC & beneficiary mandates
│   │   ├── security/          # Password, 2FA & active session monitoring
│   │   └── support/           # Help center & advisor consultation booking
│   ├── globals.css            # Global CSS, typography & print stylesheets
│   ├── layout.tsx             # Root layout with font optimization
│   └── providers.tsx          # Client-side Auth & Store providers
├── components/
│   ├── flows/                 # Multi-step transactional modals (Invest, Withdraw, Switch)
│   ├── layout/                # Sidebar, TopBar, MobileNav navigation components
│   └── ui/                    # Shared UI controls (Toast, badges)
├── data/                      # Seed mock data (users, funds, transactions, statements, notifications)
├── lib/
│   ├── auth.tsx               # Session management & persona switching context
│   ├── formatters.ts          # GH₵ currency, NAV, percentage, and date utilities
│   ├── persistence.ts         # LocalStorage persistence adapter
│   ├── store.tsx              # Reactive state container for funds, portfolio & mutations
│   └── types.ts               # TypeScript interfaces & domain models
└── tailwind.config.ts         # Institutional color palette & typography tokens
```

---

## Regulatory Disclaimer

*Aura Asset Management Limited is licensed and regulated by the Securities and Exchange Commission (SEC) of Ghana. All illustrative data, fund performance calculations, and projections presented in this prototype are for demonstration and product evaluation purposes.*