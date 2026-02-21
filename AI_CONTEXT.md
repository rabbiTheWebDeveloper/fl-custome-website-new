# Funnel Liner Custom Domain — AI Agent Context

> Comprehensive project reference for AI agents working on this codebase.
> Last updated: 2026-02-20

---

## 1. Project Overview

**Funnel Liner Custom Domain** is a **multi-theme, multi-tenant e-commerce storefront** built with Next.js (App Router). It serves as the customer-facing frontend for the [Funnel Liner](https://funnelliner.com) SaaS platform — an e-commerce website builder for Bangladeshi merchants.

Each merchant gets a custom domain (e.g., `giftvaly.com`, `bestbabybd.com`) that resolves to this single Next.js application. The app dynamically selects a **theme** and **shop data** based on the incoming domain, rendering a fully branded storefront without per-tenant deployments.

### Core Concepts

| Concept               | Description                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| **Multi-tenancy**     | One deployed app serves many merchants; shop identity comes from the domain cookie / HTTP header    |
| **Multi-theme**       | Three theme variants (`theme_1`, `th_2`, `th_3`) and a landing page renderer; selected per-merchant |
| **Headless frontend** | No database — all data comes from the Funnel Liner REST API (`staging.funnelliner.com/api/v1`)      |
| **Custom domains**    | Merchant domains point to this app via DNS; the middleware resolves domain → theme → shop           |
| **Bilingual**         | English (`en`) and Bengali (`bn`) via `next-intl`                                                   |

---

## 2. Tech Stack

| Layer                | Technology                                       | Version          |
| -------------------- | ------------------------------------------------ | ---------------- |
| **Framework**        | Next.js (App Router, RSC)                        | 16.1.6           |
| **React**            | React                                            | 19.2.1           |
| **Language**         | TypeScript                                       | 5.x              |
| **Styling**          | Tailwind CSS v4 + PostCSS                        | 4.x              |
| **UI Components**    | shadcn/ui (New York style) + Radix UI primitives | latest           |
| **Icons**            | lucide-react                                     | 0.555.0          |
| **State Management** | Zustand (with cookie persistence)                | 5.0.9            |
| **Forms**            | React Hook Form + Zod validation                 | 7.71.1 / 3.25.76 |
| **i18n**             | next-intl                                        | 4.6.1            |
| **Carousel**         | Embla Carousel + autoplay plugin                 | 8.6.0            |
| **Toasts**           | Sonner                                           | 2.0.7            |
| **Dark Mode**        | next-themes                                      | 0.4.6            |
| **Image Zoom**       | react-medium-image-zoom                          | 5.4.0            |
| **Sanitization**     | isomorphic-dompurify                             | 2.35.0           |
| **Package Manager**  | pnpm                                             | —                |
| **Linting**          | ESLint (flat config) + Prettier                  | 9.x / 3.7.3      |
| **Git Hooks**        | Husky + lint-staged                              | 9.x / 16.x       |
| **Compiler**         | React Compiler (babel-plugin-react-compiler)     | 1.0.0            |

---

## 3. Project Structure

```
funnel-liner-custom-domain/
├── .cursor/rules/            # AI agent rules (Codacy integration)
├── .husky/                   # Git hooks (pre-commit, pre-push)
├── messages/                 # i18n translation files
│   ├── en.json               #   English translations
│   └── bn.json               #   Bengali translations
├── public/                   # Static assets (SVG icons, placeholder images)
├── src/
│   ├── app/                  # Next.js App Router (themes & routes)
│   │   ├── theme_1/          #   Theme 1 (standalone route)
│   │   ├── (theme-2)/        #   Theme 2 (route group)
│   │   │   └── th_2/         #     Theme 2 pages & components
│   │   ├── (theme-3-old)/    #   Theme 3 (route group)
│   │   │   └── th_3/         #     Theme 3 pages & components
│   │   └── (landing)/        #   Landing page renderer (route group)
│   │       └── p/[slug]/     #     Dynamic landing pages
│   ├── components/           # Shared components
│   │   ├── ui/               #   shadcn/ui primitives (button, input, dialog, etc.)
│   │   ├── shared/ui/        #   Brand-specific shared UI
│   │   └── checkout-otp.tsx  #   OTP verification component
│   ├── config/               # API endpoint configuration
│   ├── constant/             # Application constants
│   ├── i18n/                 # Internationalization config
│   ├── lib/                  # Core libraries
│   │   ├── api.ts            #   Base ApiClient & TypedApiClient classes
│   │   ├── api-client.ts     #   Pre-configured client/server API instances
│   │   ├── api-types.ts      #   API endpoint type definitions
│   │   ├── utils.ts          #   General utilities (cn, prepareDomain)
│   │   ├── order.ts          #   Order submission data preparation
│   │   ├── cart/             #   Cart management system (framework-agnostic)
│   │   │   ├── store.ts      #     Zustand cart store (579 lines)
│   │   │   ├── types.ts      #     Cart type definitions
│   │   │   ├── validation.ts #     Input validation & XSS prevention
│   │   │   ├── hooks.tsx     #     React hooks for cart access
│   │   │   ├── manager.ts    #     Cart business logic manager
│   │   │   ├── storage.ts    #     Storage adapters (localStorage, session, memory)
│   │   │   ├── errors.ts     #     Custom error classes
│   │   │   └── index.ts      #     Public API barrel export
│   │   ├── domain/           #   Domain resolution utilities
│   │   │   ├── cookies.ts    #     Server-side cookie parsing
│   │   │   └── index.ts      #     Barrel export
│   │   └── products/         #   Product fetching utilities
│   │       ├── index.ts      #     Barrel export
│   │       └── category-products.ts  # Category/search product fetching
│   ├── type/                 # Global TypeScript types
│   │   ├── index.ts          #   Product & data response types
│   │   └── landing.ts        #   Landing page types
│   ├── utils/                # Utility functions
│   │   ├── index.ts          #   Pagination utilities
│   │   └── api-helpers.ts    #   Server-side API data fetchers
│   └── proxy.ts              # Middleware — theme routing & URL rewriting
├── .env                      # Environment variables
├── components.json           # shadcn/ui configuration
├── eslint.config.mjs         # ESLint flat config
├── lint-staged.config.js     # Pre-commit lint configuration
├── next.config.ts            # Next.js config (images, i18n plugin, React Compiler)
├── package.json              # Dependencies & scripts
├── postcss.config.mjs        # PostCSS config (Tailwind v4)
├── tsconfig.json             # TypeScript config
└── pnpm-lock.yaml            # Lock file
```

---

## 4. Architecture & Design Patterns

### 4.1 Multi-Theme Routing (Middleware Pattern)

The central routing mechanism lives in `src/proxy.ts`. It acts as Next.js middleware:

1. **Domain Resolution**: Reads the `domain` cookie (set by Zustand persist to cookie storage)
2. **Theme Selection**: Extracts `theme_name` or `theme_id` from the cookie, maps it via `THEME_MAP` (e.g., `"201"` → `"th_3"`)
3. **URL Rewriting**: Rewrites clean public URLs to internal theme-prefixed routes:
   - `/` → `/{theme}/`
   - `/about` → `/{theme}/about`
   - `/shop` → `/{theme}/shop`
   - `/product/123` → `/{theme}/product/123`
   - `/checkout` → `/{theme}/checkout`
   - `/p/{slug}` → landing page (separate route group)

**Current theme map**:

```
"201" → "th_3"  (Theme 3 is the default for theme ID 201)
```

### 4.2 Route Groups (Theme Isolation)

Each theme is a **Next.js route group** with its own:

- `layout.tsx` — Root layout with theme-specific fonts, providers, metadata
- `globals.css` — Theme-specific CSS variables (OKLCH color space)
- `_components/` — Theme-specific React components
- `store/` — Theme-specific Zustand stores
- `types/` — Theme-specific TypeScript interfaces

| Route Group     | Internal Path | Description                                    |
| --------------- | ------------- | ---------------------------------------------- |
| `theme_1`       | `/theme_1`    | Theme 1 — standalone route (not a route group) |
| `(theme-2)`     | `/th_2`       | Theme 2 — modern e-commerce layout             |
| `(theme-3-old)` | `/th_3`       | Theme 3 — full-featured with dark mode         |
| `(landing)`     | `/p/[slug]`   | Landing page renderer                          |

### 4.3 API Client Architecture

Two-layer API client system in `src/lib/`:

**Layer 1 — `ApiClient` (base class)**:

- Generic HTTP methods: `get`, `post`, `put`, `patch`, `delete`
- Automatic timeout with `AbortController`
- Auth token injection via configurable `tokenProvider`
- FormData detection and handling
- Dynamic header resolution (sync or async)

**Layer 2 — `TypedApiClient` (extends ApiClient)**:

- Type-safe methods: `getTyped`, `postTyped`, `putTyped`, `patchTyped`, `deleteTyped`
- TypeScript generics infer response types from endpoint string literals
- Endpoint types defined in `src/lib/api-types.ts` (`ApiEndpoints` interface)

**Pre-configured instances** (`src/lib/api-client.ts`):

- `clientApi` — Browser-side, reads token from `localStorage`
- `serverApi` — Server-side, no auth token
- `api` — Auto-selects based on `typeof window`

### 4.4 State Management (Zustand)

All global state uses **Zustand** with the **persist middleware**:

| Store           | File                                                   | Persistence       | Purpose                                       |
| --------------- | ------------------------------------------------------ | ----------------- | --------------------------------------------- |
| `useDomain`     | `th_2/store/domain.ts`, `th_3/store/domain.ts`         | Cookie (`domain`) | Shop/domain info, theme settings, brand color |
| `useCartStore`  | `lib/cart/store.ts`                                    | localStorage      | Shopping cart items, totals, operations       |
| `useProducts`   | `th_2/store/products.ts`, `th_3/store/products.ts`     | Cookie            | Product catalog cache                         |
| `useCategories` | `th_2/store/categories.ts`, `th_3/store/categories.ts` | Cookie            | Category list cache                           |
| `useSections`   | `th_2/store/sections.ts`                               | Cookie            | Dynamic homepage sections                     |

**Domain store is critical**: The `domain` cookie is read by both the middleware (`proxy.ts`) and server-side cookie utilities (`lib/domain/cookies.ts`) to extract `shop_id`, `user_id`, theme settings, and brand color.

### 4.5 Cart System

The cart is a **framework-agnostic module** in `src/lib/cart/` with clean separation:

```
cart/
├── types.ts       ← Interfaces (CartItem, CartState, CartTotals, adapters)
├── validation.ts  ← Input validation, XSS prevention, ID generation
├── errors.ts      ← Custom error hierarchy (CartError → subtypes)
├── storage.ts     ← Storage adapters (localStorage, sessionStorage, memory)
├── manager.ts     ← Business logic (add, remove, update, calculate)
├── store.ts       ← Zustand store binding (React integration)
├── hooks.tsx      ← React hooks (useCart, useCartItems, useCartTotal, etc.)
└── index.ts       ← Public API barrel export
```

Key design decisions:

- Variant-aware item identification (product ID + variant hash)
- Pluggable storage (swap localStorage for IndexedDB, API sync, etc.)
- Event system for cart changes (`item_added`, `item_removed`, etc.)
- XSS protection via `isomorphic-dompurify`

### 4.6 Internationalization (i18n)

- **Library**: `next-intl` with server-side config
- **Locale detection**: Cookie (`NEXT_LOCALE`), defaults to `"en"`
- **Supported locales**: `en` (English), `bn` (Bengali)
- **Translation files**: `messages/en.json`, `messages/bn.json`
- **Config**: `src/i18n/request.ts`
- **Usage**: `<NextIntlClientProvider>` wraps each theme layout; components use `useTranslations()` hook

### 4.7 Theming & Styling

- **Tailwind CSS v4** with `@tailwindcss/postcss` plugin
- **OKLCH color space** for all CSS custom properties (better perceptual uniformity)
- **shadcn/ui "new-york" style** with Radix UI primitives
- **Dark mode**: `next-themes` with `.dark` class variant
- **Dynamic brand colors**: `ThemeBrandProvider` reads brand color from domain store and applies it to CSS `--primary` variable at runtime
- **Animations**: `tw-animate-css` + custom keyframes (`float`, `marquee`)

### 4.8 Component Patterns

- **shadcn/ui pattern**: Copy-paste components in `src/components/ui/`, customized locally
- **CVA (class-variance-authority)**: Variant-based component styling (e.g., Button has `default`, `destructive`, `outline`, `secondary`, `ghost`, `link` variants)
- **Composition**: Radix UI primitives composed with Tailwind classes
- **Theme-scoped components**: Each theme has `_components/` with its own header, footer, product cards, checkout forms
- **Server Components by default**: Pages are RSC; client components are explicitly marked with `"use client"`

---

## 5. Data Flow

### 5.1 Initial Page Load

```
Browser request → Next.js middleware (proxy.ts)
  ├─ Read "domain" cookie
  ├─ Resolve theme from cookie (theme_name || theme_id → THEME_MAP)
  ├─ Rewrite URL: "/" → "/{theme}/"
  └─ Pass to App Router

App Router → Theme layout.tsx (server)
  ├─ getDomainMeta() → Read domain cookie for metadata
  ├─ Render <html>, <body>, font, providers
  └─ Render page.tsx (server)

Page.tsx (server)
  ├─ getData(host) → Fetch domain info + slider + banner + categories
  ├─ Parallel API calls with force-cache + ISR (300s revalidate)
  └─ Render sections with fetched data

Client hydration
  ├─ Zustand stores hydrate from cookies
  ├─ Cart store hydrates from localStorage
  ├─ ThemeBrandProvider applies brand color CSS variables
  └─ Interactive components become functional
```

### 5.2 API Request Flow

```
Component → api.getTyped("/endpoint", context)
  ├─ TypedApiClient.getTyped() → ApiClient.get()
  │   ├─ buildUrl() → prepend baseUrl
  │   ├─ buildRequestOptions() → merge headers + auth token
  │   └─ makeRequest() → fetch() with timeout
  ├─ Server context: headers include shop-id, user-id from cookies
  └─ Client context: headers include auth_token from localStorage
```

### 5.3 Checkout Flow

```
Cart page → /checkout
  ├─ Load shipping settings (inside_dhaka / outside_dhaka)
  ├─ User fills form (Zod-validated: name, phone, address)
  ├─ Optional: Incomplete order tracking (POST /customer/incomplete-order)
  ├─ Optional: OTP verification
  ├─ Submit: prepareOrderData() → FormData
  │   ├─ customer_name, customer_phone, customer_address
  │   ├─ product_id[], product_qty[], variant_id[]
  │   ├─ gateway (cod / online payment)
  │   ├─ delivery_location, shipping_cost
  │   └─ visitor_id, order_type, incomplete_order_id
  ├─ POST /customer/order/store
  └─ Redirect: order-success page OR payment gateway URL
```

---

## 6. Environment Variables

| Variable                    | Scope           | Description                                                   |
| --------------------------- | --------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`       | Client + Server | Base API URL (e.g., `https://staging.funnelliner.com/api/v1`) |
| `API_URL`                   | Server only     | Server-side API URL override                                  |
| `NEXT_PUBLIC_DEFAULT_THEME` | Client + Server | Default theme ID (e.g., `201`)                                |
| `NEXT_PUBLIC_HOST_NAME`     | Client + Server | Default host name for development                             |
| `NEXT_HOST_NAME`            | Server only     | Host name for server-side header resolution                   |

---

## 7. API Endpoints

All endpoints are relative to `NEXT_PUBLIC_API_URL`.

| Endpoint                                       | Method | Purpose                                              |
| ---------------------------------------------- | ------ | ---------------------------------------------------- |
| `/shops/domain`                                | GET    | Resolve domain → shop info (shop_id, theme_id, meta) |
| `/shops/info`                                  | GET    | Get shop details                                     |
| `/shops/media/content?type=slider`             | GET    | Fetch slider images                                  |
| `/shops/media/content?type=banner`             | GET    | Fetch banner images                                  |
| `/shops/content?type=about_us`                 | GET    | Fetch about page content                             |
| `/google-tag-manager`                          | GET    | Fetch GTM configuration                              |
| `/customer/categories`                         | GET    | Fetch product categories                             |
| `/customer/products`                           | GET    | Fetch all products (paginated)                       |
| `/customer/products/{id}`                      | GET    | Fetch single product details                         |
| `/customer/category-product/list/{categoryId}` | GET    | Fetch products by category                           |
| `/customer/product-search?search={query}`      | GET    | Search products                                      |
| `/customer/shipping-setting/show`              | GET    | Fetch shipping rates                                 |
| `/customer/order-permission/show`              | GET    | Check if ordering is allowed                         |
| `/customer/order/store`                        | POST   | Submit an order (FormData)                           |
| `/customer/incomplete-order`                   | POST   | Track incomplete orders                              |
| `/incomplete-order/status/{shopId}`            | GET    | Check incomplete order status                        |
| `/customer/sections`                           | GET    | Fetch dynamic homepage sections                      |
| `/customer/section-wise-products/{sectionId}`  | GET    | Fetch products for a section                         |
| `/page/{shopId}/{slug}`                        | GET    | Fetch landing page data                              |
| `/visitors/update`                             | POST   | Track visitor (external reporting API)               |
| `/update-product-visit`                        | POST   | Track product page visit                             |

**Required headers for most endpoints**:

- `shop-id`: Shop identifier (from domain cookie)
- `user-id` / `id`: User/owner identifier
- `domain`: Domain hostname (for `/shops/domain`)
- `X-Requested-With: XMLHttpRequest`

---

## 8. Key Files Reference

### Configuration

| File                 | Purpose                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| `next.config.ts`     | Next.js config — React Compiler, remote image patterns, next-intl plugin  |
| `tsconfig.json`      | TypeScript config — path aliases (`@/*` → `./src/*`)                      |
| `components.json`    | shadcn/ui config — style "new-york", Tailwind CSS vars, component aliases |
| `eslint.config.mjs`  | ESLint flat config — next/core-web-vitals + typescript rules              |
| `.prettierrc`        | Prettier — no semicolons, double quotes, trailing commas                  |
| `postcss.config.mjs` | PostCSS — `@tailwindcss/postcss` plugin only                              |

### Core Application Logic

| File                         | Purpose                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `src/proxy.ts`               | **Middleware** — Domain-to-theme routing and URL rewriting                     |
| `src/lib/api.ts`             | **ApiClient** — Base HTTP client with timeout, auth, FormData support          |
| `src/lib/api-client.ts`      | Pre-configured `clientApi`, `serverApi`, `api` instances                       |
| `src/lib/api-types.ts`       | TypeScript endpoint definitions (`ApiEndpoints` interface map)                 |
| `src/lib/order.ts`           | Order FormData preparation for submission                                      |
| `src/lib/domain/cookies.ts`  | Server-side domain cookie parsing (shop_id, user_id, metadata)                 |
| `src/utils/api-helpers.ts`   | High-level data fetchers (`getData`, `getDomainInfo`, `getProductDetailsData`) |
| `src/config/ApiEndpoints.ts` | API endpoint path constants                                                    |
| `src/constant/index.ts`      | App constants (`headerHostNname`, `themeCode`, `NEXT_REVALIDATE_TIME`)         |
| `src/i18n/request.ts`        | next-intl server config — locale from cookie                                   |

### Cart System

| File                         | Purpose                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `src/lib/cart/store.ts`      | Zustand cart store — add, remove, update, totals calculation                              |
| `src/lib/cart/types.ts`      | Cart interfaces — `CartItem`, `CartState`, `CartTotals`, adapters                         |
| `src/lib/cart/hooks.tsx`     | React hooks — `useCart`, `useCartItems`, `useCartTotal`, etc.                             |
| `src/lib/cart/validation.ts` | Input validation, XSS sanitization, cart item ID generation                               |
| `src/lib/cart/errors.ts`     | Custom error classes — `CartError`, `CartValidationError`, etc.                           |
| `src/lib/cart/storage.ts`    | Storage adapters — `LocalStorageAdapter`, `SessionStorageAdapter`, `MemoryStorageAdapter` |
| `src/lib/cart/manager.ts`    | Business logic manager (framework-agnostic)                                               |

---

## 9. Theme Details

### Theme 1 (`theme_1`)

- **Route**: `/theme_1` (standalone, not a route group)
- **Font**: ABeeZee (400 weight)
- **Styling**: Purple-based OKLCH palette
- **Layout**: Client-side rendered with scroll-to-top
- **Sections**: Header → MainHero → MarkTicker → FeatureProducts → SignupSection → Testimonials → Footer
- **Status**: Simpler theme, likely for landing-style storefronts

### Theme 2 (`th_2`, route group `(theme-2)`)

- **Route**: `/(theme-2)/th_2`
- **Font**: Inter + Geist Mono
- **Styling**: Dynamic brand colors via `ThemeBrandProvider`
- **Layout**: Header + Footer wrapper, toast notifications, i18n
- **Sections**: Banner → CategoriesSection → DynamicSections (API-driven)
- **Pages**: Home, About, Shop, Product Detail, Checkout, Contact, Terms, Privacy
- **Stores**: `domain`, `products`, `categories`, `sections`
- **Status**: Modern, actively developed theme

### Theme 3 (`th_3`, route group `(theme-3-old)`)

- **Route**: `/(theme-3-old)/th_3`
- **Font**: Montserrat (English) / Tiro Bangla (Bengali) — dynamic selection
- **Styling**: Dark mode support via `next-themes`, decorative blob backgrounds
- **Layout**: Google Tag Manager, ThemeProvider, i18n, dynamic metadata
- **Sections**: Banner → Category → MiddleBanner → AllProduct → Scroll
- **Pages**: Home, About, Shop, Product Detail, Checkout, Terms, Privacy, Order Success, Payment Failed
- **Stores**: `domain`, `products`, `categories`
- **Status**: Full-featured but marked as "old" — may be superseded

### Landing Pages (`(landing)`)

- **Route**: `/(landing)/p/[slug]`
- **Purpose**: Render dynamic landing pages built in the Funnel Liner template editor
- **Components**: `LandingRenderer.tsx` (renders HTML from API), `LandingOrder.tsx` (order form)
- **Data**: Fetched via `/page/{shopId}/{slug}` API endpoint

---

## 10. External Integrations

| Integration                      | Purpose                                    | Notes                                                                   |
| -------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------- |
| **Funnel Liner API**             | Core backend — products, orders, shop data | `staging.funnelliner.com/api/v1`                                        |
| **Funnel Liner Report API**      | Visitor analytics tracking                 | `funnelliner-report-api.vercel.app/api/v1/`                             |
| **Funnel Liner Template Editor** | Landing page creation tool                 | `editor.funnelliner.com`                                                |
| **Google Tag Manager**           | Analytics tracking                         | Configured per-shop via API                                             |
| **Facebook Pixel**               | Ad conversion tracking                     | Pixel ID from domain config                                             |
| **AWS S3**                       | Image hosting                              | `cdn-s3.funnelliner.com`, `funnelliner.s3.ap-southeast-1.amazonaws.com` |
| **Payment Gateways**             | Online payments                            | Gateway URL from order API response                                     |

---

## 11. Caching Strategy

| Layer                                      | Strategy                              | TTL           | Location                  |
| ------------------------------------------ | ------------------------------------- | ------------- | ------------------------- |
| **Domain info**                            | ISR (Incremental Static Regeneration) | 600s          | `getDomainInfo()`         |
| **Shop data** (slider, banner, categories) | `force-cache` + ISR                   | 300s          | `getData()`               |
| **Product data**                           | `force-cache` + ISR                   | 300s          | `getProductDetailsData()` |
| **Landing pages**                          | ISR                                   | 300s          | `getLandingPageData()`    |
| **Domain store**                           | Zustand persist → Cookie              | Until cleared | Browser cookie            |
| **Cart state**                             | Zustand persist → localStorage        | Until cleared | Browser localStorage      |
| **Categories/Products stores**             | Zustand persist → Cookie              | Until cleared | Browser cookie            |

---

## 12. Development Conventions

### Code Style

- **No semicolons** (Prettier config)
- **Double quotes** for strings
- **Trailing commas** (`es5`)
- **2-space indentation**
- **Arrow parens**: always
- **Path aliases**: `@/*` → `./src/*`, `@/messages/*` → `./messages/*`

### Component Conventions

- **Server Components** by default; opt into client with `"use client"` directive
- **Theme-scoped components** use `_components/` prefix (Next.js convention to exclude from routing)
- **Shared UI** in `src/components/ui/` (shadcn/ui pattern)
- **Co-located types** in `types/` directory within each theme

### State Management Conventions

- **Zustand stores** use `create()` with `persist()` middleware
- **Cookie storage** for data needed by middleware (domain, theme)
- **localStorage** for client-only data (cart, auth token)
- **No Redux, no Context API** for global state

### Git Workflow

- **Husky pre-commit**: Runs `pnpm lint-staged` (Prettier + ESLint on staged files)
- **Husky pre-push**: Blocks direct pushes to `master` branch
- **Branch naming**: Feature branches (e.g., `feat/theme-2`)

### Import Path Convention

```typescript
// Absolute imports via path alias
import { Button } from "@/components/ui/button"
import { API_ENDPOINTS } from "@/config/ApiEndpoints"
import { useDomain } from "../store/domain"

// Relative imports within theme directories
import { ProductCard } from "./_components/product-card"
```

---

## 13. Common Operations Guide

### Adding a New Page to a Theme

1. Create `src/app/(theme-X)/th_X/new-page/page.tsx`
2. Add URL rewrite in `src/proxy.ts`:
   ```typescript
   if (pathname === "/new-page") {
     return NextResponse.rewrite(new URL(`/${theme}/new-page`, request.url))
   }
   ```
3. Add navigation links in the theme's `_constants/index.ts`

### Adding a New API Endpoint

1. Add the endpoint path to `src/config/ApiEndpoints.ts`
2. Add the type definition to `src/lib/api-types.ts` (`ApiEndpoints` interface)
3. Use via `api.getTyped("/new-endpoint", { headers: ... })`

### Adding a New shadcn/ui Component

```bash
pnpm dlx shadcn@latest add <component-name>
```

Components are installed to `src/components/ui/`.

### Adding a New Zustand Store

1. Create store file in theme's `store/` directory
2. Use `create()` with `persist()` middleware
3. For cookie persistence, use `createCookieStorage()` from the theme's `persistent-middwere.ts`

### Working with Cart

```typescript
import { useCart, useCartItems, useCartTotal } from "@/lib/cart"

// In a component
const { addItem, removeItem, updateQuantity } = useCart()
const items = useCartItems()
const total = useCartTotal()
```

### Working with i18n

```typescript
import { useTranslations } from "next-intl"

function MyComponent() {
  const t = useTranslations("Namespace")
  return <h1>{t("key")}</h1>
}
```

Add translation keys to both `messages/en.json` and `messages/bn.json`.

---

## 14. Known Patterns & Gotchas

1. **Theme ID "201" maps to "th_3"**, not "th_2" — the mapping in `proxy.ts` is intentional
2. **Domain cookie is Zustand-persisted JSON** — it's URL-encoded and nested under `state.domain`
3. **No API routes in this project** — all backend logic is in the external Funnel Liner API
4. **No testing setup** — no test files, frameworks, or `__tests__/` directories exist
5. **`theme_1` is not a route group** — it uses a regular directory, while themes 2 and 3 use `()` route groups
6. **Theme 3 is marked "old"** (`theme-3-old`) but is still the default theme (ID 201)
7. **React Compiler is enabled** (`reactCompiler: true` in `next.config.ts`) — avoid patterns that break compilation (e.g., mutating refs during render)
8. **The API error throw is commented out** in `api.ts` line 93 — non-OK responses currently pass through without throwing
9. **`proxy.ts` exports `proxy` function and `config`** — but the file is named `proxy.ts`, not `middleware.ts`. Check if there's a separate `middleware.ts` at root that imports it
10. **Cookie-based Zustand stores** are accessible from both client and server — this is how the middleware reads theme info without an API call

---

## 15. File Counts & Scale

| Category             | Count         |
| -------------------- | ------------- |
| TypeScript/TSX files | ~149          |
| Shared UI components | 8 (shadcn/ui) |
| Theme 1 components   | ~7            |
| Theme 2 components   | ~25+          |
| Theme 3 components   | ~30+          |
| Zustand stores       | 7             |
| API endpoints typed  | 13            |
| i18n locales         | 2 (en, bn)    |
| Total dependencies   | 26            |
| Dev dependencies     | 11            |
