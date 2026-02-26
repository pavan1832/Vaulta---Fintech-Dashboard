# ⬡ Vaulta Banking Dashboard

> Production-ready fintech dashboard — Send Money, Add Funds, Currency Exchange, Analytics, Admin Panel

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# Opens at http://localhost:3000
```

---

## 🔐 Demo Credentials

| Role  | Email                | Password    |
|-------|----------------------|-------------|
| User  | lokpavan@vaulta.io   | demo1234    |
| User  | arjun@vaulta.io      | demo1234    |
| Admin | admin@vaulta.io      | admin1234   |

> **Try sending money:** Login as Arjun → Payments → Send Money → recipient: `priya@aspora.io`

---

## ✨ Features

### 💸 Transactional
- **Send Money** — 2-step transfer flow with review screen, live balance update
- **Add Funds** — Deposit via Bank Transfer, UPI, Card, NEFT. Balance updates instantly
- **Currency Exchange** — 8 currencies, live FX rates, 0.5% transparent fee
- **Request Money** — Generate shareable payment links

### 📊 Dashboard
- Balance hero card with quick action buttons
- Area chart — monthly cash flow (credit vs debit)
- Stat cards with trend indicators
- Recent transactions feed

### 🗃️ Transaction History
- Paginated table (10/page)
- Filters: search, type, amount range, date range
- Skeleton loaders, empty state, error state

### 📈 Analytics
- Bar chart — monthly volume
- Pie chart — spending by category
- Category breakdown with progress bars

### 🛡️ Admin Panel
- Platform metrics (users, volume, transactions)
- System health bars
- User management — drill into any user's transactions

---

## 🗂️ Project Structure

```
src/
├── App.jsx                    # Root component + routing
├── index.js                   # Entry point
│
├── styles/
│   ├── tokens.js              # Design token system (colours, fonts)
│   └── global.css             # Global resets + animations
│
├── utils/
│   └── formatters.js          # Currency, date, number formatters
│
├── services/
│   ├── mockDb.js              # In-memory database + FX rates
│   └── apiService.js          # All API calls — never imported by components directly
│
├── context/
│   ├── AuthContext.js         # Auth state (user, login, logout, refreshUser)
│   └── AppContext.js          # App state (transactions, charts, filters, pagination)
│
├── hooks/
│   └── useAdminData.js        # Admin data fetching hook
│
├── components/                # Reusable UI primitives
│   ├── index.js               # Barrel export
│   ├── Skeleton.jsx
│   ├── Spinner.jsx
│   ├── Card.jsx
│   ├── Btn.jsx
│   ├── FieldInput.jsx
│   ├── FieldSelect.jsx
│   ├── Badge.jsx
│   ├── Avatar.jsx
│   ├── StatCard.jsx
│   ├── AlertBox.jsx
│   ├── Modal.jsx
│   ├── Sidebar.jsx
│   └── TopBar.jsx
│
└── pages/
    ├── LoginPage.jsx
    ├── SignupPage.jsx
    ├── DashboardPage.jsx
    ├── PaymentsPage.jsx
    ├── TransactionsPage.jsx
    ├── AnalyticsPage.jsx
    ├── AdminOverviewPage.jsx
    ├── AdminUsersPage.jsx
    └── modals/
        ├── SendMoneyModal.jsx
        ├── AddFundsModal.jsx
        ├── ExchangeModal.jsx
        └── RequestMoneyModal.jsx
```

---

## 🧱 Tech Stack

| Layer           | Choice              | Why                                              |
|-----------------|---------------------|--------------------------------------------------|
| UI              | React 18            | Functional components + hooks                    |
| State           | Context API         | Right-sized — no Redux overhead needed           |
| Charts          | Recharts            | Declarative, responsive, React-native            |
| Styling         | Inline + CSS tokens | Zero build config, full design system control    |
| Auth            | JWT simulation      | Production pattern, sessionStorage persistence   |
| API Layer       | Mock service layer  | Isolated from components, real async behaviour   |

---

## ⚙️ Architecture Decisions

**Context API over Redux** — Two contexts cleanly separate auth and data concerns. No complex async middleware, entity normalization, or cross-slice communication required at this scale.

**Service layer isolation** — `apiService.js` is the only file that touches `mockDb.js`. Components never call APIs directly — they go through context actions or custom hooks.

**Optimistic UI** — After a payment succeeds, `refreshUser()` patches the local balance immediately without a full refetch. `prependTransaction()` inserts the new txn at the top of the list.
