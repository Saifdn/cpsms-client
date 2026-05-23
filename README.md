# CPSMS Client

Frontend for the **Convocation Photography Studio Management System** — a multi-role web app that manages the full lifecycle of graduation photography studio bookings, from package selection and payment through QR-based check-in, live queue tracking, and shipment management.

## Tech Stack

- **React 19** + **Vite 7**
- **React Router v7** — client-side routing with role-based guards
- **TanStack React Query v5** — server state, caching, and mutations
- **Axios** — HTTP client with JWT interceptors and auto-refresh
- **Socket.IO client v4** — real-time queue updates
- **shadcn/ui** (Radix UI + Tailwind CSS v4) — UI component library
- **React Hook Form v7** — form state management
- **TanStack Table v8** — data tables
- **Recharts** — KPI dashboard charts
- **Billplz** — payment gateway integration

## Roles

| Role | Capabilities |
|---|---|
| `graduate` | Browse packages, book sessions, pay via Billplz, view/manage own bookings |
| `staff` | QR check-in at registration and studio counters, view live queue |
| `admin` | Manage studios, packages, sessions, staff, graduates, shipments |
| `superadmin` | All admin capabilities + manage admin accounts |

## Getting Started

### Prerequisites

- Node.js 18+
- The [CPSMS backend](../cpsms-server) running on port 8000

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Configure `.env`:

```
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
```

### Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Project Structure

```
src/
├── api/axios.js          # Axios instance with JWT interceptors
├── components/           # Reusable UI and layout components
│   └── ui/               # shadcn/ui primitives
├── context/              # Auth context (JWT state, login/logout/refresh)
├── hooks/                # React Query hooks per domain
├── pages/                # Route-level page components
├── routes/               # ProtectedRoute (auth guard + RBAC)
├── services/             # Axios API calls per domain (no state)
├── lib/utils.js          # cn() classname helper
└── App.jsx               # All route definitions
```

## Authentication

Auth state is managed in `AuthProvider.jsx` using JWTs. The access token is stored in memory; a refresh token is persisted in an HttpOnly cookie. On every `403` response, the Axios interceptor silently refreshes the token and retries the original request.

## Key Features

- **Multi-step booking flow** — graduates select a studio, package, session, and delivery details before paying via Billplz
- **Payment polling** — `/booking/result` polls the backend every 3 seconds until payment status resolves
- **QR check-in** — staff scan graduate QR codes using the device camera (`html5-qrcode`)
- **Live queue board** — real-time queue updates via Socket.IO, with text-to-speech announcements
- **Shipment management** — integrated with EasyParcel for booking and tracking deliveries
- **Dark/light mode** — class-based theming via `ThemeProvider`
