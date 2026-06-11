# My E-Commerce

E-commerce frontend built with React 19, TypeScript, TanStack Router, TanStack Query, and Tailwind CSS v4.

## Tech Stack

- **React 19** with React Compiler (babel)
- **TypeScript** strict mode
- **Vite** with Rolldown (Vite 6+)
- **TanStack Router** - file-based routing with type-safe search params
- **TanStack Query v5** - server state management with optimistic updates
- **Zustand** - client state (auth, wishlist)
- **Tailwind CSS v4** - utility-first styling with CSS variables
- **shadcn/ui** - accessible component primitives
- **Axios** - API client with interceptors (auth, CSRF, auto-refresh)

## Project Structure

```
src/
├── api/              # API layer (auth, cart, orders, products)
├── app/routes/       # TanStack Router routes (file-based)
├── components/       # Shared UI components (layout, ui/)
├── features/         # Feature-specific components
├── hooks/            # Custom hooks (auth, cart, orders, etc.)
├── lib/              # Utilities, constants, query client
├── store/            # Zustand stores (auth, wishlist)
└── types/            # TypeScript type definitions
```

## Features

- **Authentication**: JWT access/refresh tokens with auto-refresh on 401
- **Cart**: Session-based for anonymous users, merges on login
- **Orders**: List, detail, cancel
- **Products**: Listing, detail, search
- **Wishlist**: Persisted in localStorage
- **Dark mode**: System preference + manual toggle

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Django backend running on `http://localhost:8000`

### Installation

```bash
pnpm install
```

### Development

```bash
# Terminal 1: Start Django backend (required for API)
cd ../backend  # adjust path
python manage.py runserver 8000

# Terminal 2: Start Vite dev server
pnpm dev
```

Open `http://localhost:5173`

### Build

```bash
pnpm build
pnpm preview  # preview production build
```

## Authentication Flow

1. **Login** → stores access + refresh tokens in localStorage
2. **Route guards** (`beforeLoad`) call `authStore.initialize()` synchronously before checking auth state
3. **Token refresh** handled automatically by Axios interceptor on 401 responses
4. **Logout** clears tokens, query cache, redirects to products

## Cart Behavior

| Scenario | Behavior |
|----------|----------|
| Anonymous user adds items | Stored in Django session (cookie-based) |
| User logs in | Cart queries invalidated → refetched with user session |
| User logs out | Cart cache cleared |
| Different browser/login | Cart tied to session (not user account) — **known limitation** |

> **Note**: Cart persistence across browsers requires backend changes to associate cart with user account in database.

## Environment Variables

Create `.env` for local development:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

For production, create `.env.production`:

```env
# Option A: API on different domain (requires CORS in Django)
VITE_API_BASE_URL=https://api.tudominio.com/api/v1

# Option B: Same domain via reverse proxy (nginx)
# VITE_API_BASE_URL=/api/v1
```

> **Important**: Vite only exposes variables prefixed with `VITE_` to the client. The build will use `.env.production` automatically.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript check |

## API Proxy

Vite proxies `/api/*` to `http://localhost:8000` (configured in `vite.config.ts`). Ensure Django runs on port 8000 with CORS allowing `localhost:5173`.
