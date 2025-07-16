# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev        # Start development server on port 5173
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # Run TypeScript type checking
```

### Testing
No test commands are currently configured. Consider implementing tests with a framework like Vitest or Jest.

## Architecture Overview

### Tech Stack
- **React 18.2** with **TypeScript** and **Vite** build tool
- **Shadcn/ui** component library (built on Radix UI)
- **Tailwind CSS** for styling
- **React Router DOM v7** for routing
- **Axios** for API calls with interceptors
- **React Hook Form** with **Zod** validation
- **Recharts** for data visualization

### Project Structure
```
/src
├── api/          # API layer with client.ts for API calls
├── components/   # Feature-based component organization (.tsx files)
│   ├── accounts/
│   ├── auth/
│   ├── categories/
│   ├── dashboard/
│   ├── entities/
│   ├── rules/
│   ├── transactions/
│   └── ui/       # Shadcn/ui components
├── hooks/        # Custom hooks (useAuth, useBankData, usePlaidLinkToken) (.ts files)
├── pages/        # Route components (.tsx files)
├── services/     # API configuration (axios instance) (.ts files)
├── types/        # TypeScript type definitions
└── utils/        # Utilities (auth.ts, iframeCommunication.ts)
```

### Key Architectural Patterns

#### 1. Iframe Integration Architecture
This app is designed to run inside an Angular iframe with PostMessage communication:
- Messages use format: `{ source: 'banker-data-iframe', action, data, timestamp }`
- Comprehensive action system for all CRUD operations
- Auto-notifies parent when iframe is ready
- See `src/utils/iframeCommunication.js` for implementation

#### 2. Authentication System
- Token-based auth stored in `sessionStorage` (not localStorage)
- Supports URL parameter authentication: `?token=xxx&baseUrl=xxx`
- Axios interceptor automatically adds Bearer token to requests
- 401 responses redirect to `/unauthorized`
- All routes except `/unauthorized` are protected via `ProtectedRoute` component

#### 3. API Integration Pattern
- Centralized Axios instance in `src/services/api.js`
- Request/response interceptors handle auth
- Uses API client layer in `src/api/client.js`
- Custom hooks pattern for data fetching (e.g., `useBankData`)

#### 4. Component Organization
- Feature-based structure (accounts, transactions, categories, etc.)
- Consistent naming: `CreateXModal`, `XCard`, `XList`
- All UI primitives from Shadcn/ui in `src/components/ui/`
- Form components use React Hook Form + Zod validation

#### 5. Routing Structure
- Layout wrapper at `/src/pages/Layout.jsx` for consistent navigation
- Main routes: Dashboard, Accounts, Transactions, Categories, Rules, etc.
- Protected by authentication except `/unauthorized`

## Important Considerations

### Path Aliases
- `@` is aliased to `/src` directory in Vite config
- Use `@/components/...` instead of relative imports

### State Management
- No global state management library
- Uses React hooks and local component state
- Data fetching via custom hooks pattern

### Mock Data
- API client functions in `src/api/client.js` handle all API operations
- Custom hooks in `src/hooks/api/` provide React-friendly data access
- Replace with real API calls for production

### Deployment
- Configured for Netlify deployment
- SPA routing redirects in `netlify.toml`
- Security headers and caching strategies configured

### Security
- Session-based token storage (more secure than localStorage)
- CORS handling for iframe integration
- Automatic logout on 401 responses
- Protected routes pattern implemented