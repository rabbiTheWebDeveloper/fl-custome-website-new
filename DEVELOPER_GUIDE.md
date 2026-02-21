# Developer Guide — Funnel Liner Custom Domain

Welcome to the **Funnel Liner Custom Domain** project. This guide will get you from zero to productive as fast as possible. Read it top-to-bottom on your first day, then use it as a reference going forward.

---

## Table of Contents

1. [What Is This Project?](#1-what-is-this-project)
2. [Prerequisites](#2-prerequisites)
3. [Getting Started](#3-getting-started)
4. [Project Structure Explained](#4-project-structure-explained)
5. [How the Multi-Theme System Works](#5-how-the-multi-theme-system-works)
6. [Key Concepts You Must Understand](#6-key-concepts-you-must-understand)
7. [How to Add a New Page](#7-how-to-add-a-new-page)
8. [How to Add a New Component](#8-how-to-add-a-new-component)
9. [How to Work with the API](#9-how-to-work-with-the-api)
10. [How to Work with the Cart](#10-how-to-work-with-the-cart)
11. [How to Work with State (Zustand Stores)](#11-how-to-work-with-state-zustand-stores)
12. [How to Add Translations (i18n)](#12-how-to-add-translations-i18n)
13. [Styling Guide](#13-styling-guide)
14. [Code Style & Conventions](#14-code-style--conventions)
15. [Git Workflow](#15-git-workflow)
16. [Debugging Tips](#16-debugging-tips)
17. [Frequently Asked Questions](#17-frequently-asked-questions)
18. [Architecture Diagram](#18-architecture-diagram)

---

## 1. What Is This Project?

Funnel Liner is a SaaS e-commerce platform for Bangladeshi merchants. This repository is the **customer-facing storefront** — the website that shoppers see when they visit a merchant's domain.

**The key idea:** One single Next.js app serves _many_ merchants. When a shopper visits `giftvaly.com` or `bestbabybd.com`, they hit this same app. The app figures out _which_ merchant's store to show based on the domain, then picks the right theme and fetches that merchant's data from our backend API.

Think of it as a white-label storefront engine:

- **No database** in this project — all data comes from the Funnel Liner REST API
- **No per-merchant deployment** — one build serves everyone
- **Multiple themes** — merchants can pick different visual designs
- **Bilingual** — English and Bengali

---

## 2. Prerequisites

Before you begin, make sure you have:

| Tool                 | Version | How to Check |
| -------------------- | ------- | ------------ |
| **Node.js**          | 20+     | `node -v`    |
| **pnpm**             | 9+      | `pnpm -v`    |
| **Git**              | 2.30+   | `git -v`     |
| **VS Code / Cursor** | Latest  | —            |

**Recommended VS Code / Cursor extensions:**

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (for `.tsx` auto-imports)

---

## 3. Getting Started

### 3.1 Clone and Install

```bash
git clone <repo-url>
cd funnel-liner-custom-domain
pnpm install
```

### 3.2 Set Up Environment Variables

Create a `.env` file in the project root (or copy the existing one):

```env
NEXT_PUBLIC_API_URL=https://staging.funnelliner.com/api/v1
NEXT_PUBLIC_ANALYZE="false"
NEXT_PUBLIC_HOST_NAME=finlay.funnelliner.store
NEXT_PUBLIC_DEFAULT_THEME=201
```

| Variable                    | What It Does                                                                     |
| --------------------------- | -------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`       | The backend API that this app talks to                                           |
| `NEXT_PUBLIC_HOST_NAME`     | The domain to simulate in local development (the API uses this to find the shop) |
| `NEXT_PUBLIC_DEFAULT_THEME` | Which theme to show by default (`201` maps to Theme 3)                           |

> **Tip:** To test a specific merchant's store locally, change `NEXT_PUBLIC_HOST_NAME` to their domain (e.g., `giftvaly.com`). The API will return that merchant's data.

### 3.3 Run the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You should see a storefront.

### 3.4 Other Commands

| Command      | Purpose                                                    |
| ------------ | ---------------------------------------------------------- |
| `pnpm dev`   | Start dev server with hot reload                           |
| `pnpm build` | Production build (run this before pushing to catch errors) |
| `pnpm start` | Start production server locally                            |
| `pnpm lint`  | Run ESLint                                                 |

---

## 4. Project Structure Explained

Here's the directory layout with plain-English explanations:

```
src/
├── app/                        # All pages live here (Next.js App Router)
│   ├── theme_1/                # Theme 1 — simple marketing-style theme
│   ├── (theme-2)/              # Theme 2 — modern e-commerce theme
│   │   ├── layout.tsx          #   Shared layout (header, footer, providers)
│   │   ├── globals.css         #   Theme colors and CSS variables
│   │   └── th_2/              #   Actual pages and components
│   │       ├── page.tsx        #     Home page
│   │       ├── about/          #     /about page
│   │       ├── shop/           #     /shop page (product listing)
│   │       ├── product/[id]/   #     /product/123 page (product detail)
│   │       ├── checkout/       #     /checkout page
│   │       ├── contact/        #     /contact page
│   │       ├── terms/          #     /terms page
│   │       ├── privacy/        #     /privacy page
│   │       ├── _components/    #     Theme 2 specific components
│   │       ├── _constants/     #     Navigation links, footer config
│   │       ├── store/          #     Zustand stores (domain, products, etc.)
│   │       └── types/          #     TypeScript interfaces
│   ├── (theme-3-old)/          # Theme 3 — full-featured, dark mode support
│   │   └── th_3/              #   Same structure as th_2
│   └── (landing)/              # Landing page renderer
│       └── p/[slug]/           #   Dynamic pages built in template editor
│
├── components/                 # SHARED components (used across all themes)
│   ├── ui/                     #   shadcn/ui components (button, input, dialog...)
│   └── shared/ui/              #   Brand-specific shared components
│
├── lib/                        # Core business logic
│   ├── api.ts                  #   HTTP client (ApiClient class)
│   ├── api-client.ts           #   Pre-configured API instances
│   ├── api-types.ts            #   TypeScript types for API endpoints
│   ├── order.ts                #   Order preparation logic
│   ├── utils.ts                #   cn() helper, domain utilities
│   ├── cart/                   #   Shopping cart system (store, hooks, validation)
│   ├── domain/                 #   Domain cookie parsing
│   └── products/               #   Product fetching utilities
│
├── config/                     # API endpoint paths
├── constant/                   # App-wide constants
├── i18n/                       # Internationalization config
├── type/                       # Global TypeScript types
├── utils/                      # API helper functions
└── proxy.ts                    # MIDDLEWARE — routes URLs to the right theme
```

### What are Route Groups `(parentheses)`?

Folders wrapped in `()` are **Next.js route groups**. They organize files without affecting the URL:

- `(theme-2)/th_2/about/page.tsx` renders at `/th_2/about`, NOT `/theme-2/th_2/about`
- Each route group gets its own `layout.tsx`, so themes have independent layouts

### What are `_underscore` folders?

Folders starting with `_` (like `_components/`) are **private folders** in Next.js. They are NOT treated as routes — they're just for organizing code within a route segment.

---

## 5. How the Multi-Theme System Works

This is the most important concept in the project. Here's how it works step-by-step:

### Step 1: A shopper visits `/`

The request hits our middleware (`src/proxy.ts`).

### Step 2: Middleware reads the domain cookie

The `domain` cookie contains the shop's configuration, including which theme to use. It's a JSON blob stored by Zustand:

```json
{
  "state": {
    "domain": {
      "shop_id": "123",
      "theme_id": "201",
      "theme_settings": {
        "theme_name": "th_3",
        "brand_color": "#4F46E5"
      }
    }
  }
}
```

### Step 3: Middleware rewrites the URL

Based on the theme, the middleware rewrites the URL internally:

- Visitor sees: `https://merchant.com/`
- Internally routed to: `/th_3` (the theme 3 home page)

Similarly:

- `/about` → `/th_3/about`
- `/product/456` → `/th_3/product/456`
- `/checkout` → `/th_3/checkout`

The visitor never sees the theme prefix in their browser URL.

### Step 4: The theme renders with the merchant's data

Each theme's `layout.tsx` reads shop metadata (title, favicon, logo) from the domain cookie. Page components fetch products, categories, and banners from the API using the `shop-id` header.

### Theme Map

Currently, theme IDs map as follows:

| Theme ID  | Internal Route | Description                     |
| --------- | -------------- | ------------------------------- |
| `201`     | `th_3`         | Theme 3 (default)               |
| `th_2`    | `th_2`         | Theme 2 (used directly by name) |
| `theme_1` | `theme_1`      | Theme 1                         |

> **Important:** Theme ID `201` maps to `th_3`, not `th_2`. This is defined in the `THEME_MAP` constant in `proxy.ts`.

---

## 6. Key Concepts You Must Understand

### Server Components vs Client Components

This project uses the Next.js App Router with React Server Components (RSC):

- **Server Components** (default): Run on the server, can `await` data, can't use `useState`/`useEffect`/browser APIs
- **Client Components** (marked with `"use client"`): Run in the browser, can use hooks and interactivity

**Rule of thumb:** Keep components as Server Components unless they need interactivity. Add `"use client"` only when necessary.

### The Domain Cookie

The `domain` cookie is the backbone of multi-tenancy. It contains the shop's full configuration and is:

- **Set by Zustand** (persisted via cookie storage middleware)
- **Read by middleware** (`proxy.ts`) to determine theme
- **Read by server code** (`lib/domain/cookies.ts`) to get `shop-id` for API headers
- **Read by client code** (Zustand stores) for shop info, brand colors, etc.

### API Headers

Most API calls require these headers:

| Header             | Source                       | Purpose                                          |
| ------------------ | ---------------------------- | ------------------------------------------------ |
| `domain`           | Hostname of the request      | Identify the merchant (used by `/shops/domain`)  |
| `shop-id`          | Extracted from domain cookie | Identify the shop for product/category endpoints |
| `user-id` / `id`   | Extracted from domain cookie | Identify the shop owner                          |
| `X-Requested-With` | Hardcoded `"XMLHttpRequest"` | API authentication marker                        |

---

## 7. How to Add a New Page

Let's say you want to add a `/faq` page to Theme 2.

### Step 1: Create the page file

```
src/app/(theme-2)/th_2/faq/page.tsx
```

```tsx
import React from "react"

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      {/* Your content here */}
    </div>
  )
}
```

### Step 2: Register the route in middleware

Open `src/proxy.ts` and add a rewrite rule:

```typescript
if (pathname === "/faq") {
  return NextResponse.rewrite(new URL(`/${theme}/faq`, request.url))
}
```

Place it alongside the other route rewrites (before the catch-all at the bottom).

### Step 3: Add navigation links (optional)

If you want the page in the header/footer, update `src/app/(theme-2)/th_2/_constants/index.ts`:

```typescript
export const linkHrefs = [
  { key: "home", href: "/" },
  { key: "shop", href: "/shop" },
  { key: "category", href: "#" },
  { key: "about", href: "/about" },
  { key: "faq", href: "/faq" }, // <-- add this
]
```

And add the translation key in `messages/en.json` and `messages/bn.json`.

### Step 4: Repeat for other themes (if needed)

If Theme 3 also needs this page, create the same file under `src/app/(theme-3-old)/th_3/faq/page.tsx`. The middleware rewrite you added in Step 2 already handles all themes.

---

## 8. How to Add a New Component

### Shared UI Component (shadcn/ui)

To add a new shadcn/ui component (e.g., a Tooltip):

```bash
pnpm dlx shadcn@latest add tooltip
```

This installs it to `src/components/ui/tooltip.tsx`. You can now import it from any theme:

```tsx
import { Tooltip } from "@/components/ui/tooltip"
```

### Theme-Specific Component

Create it inside the theme's `_components/` folder:

```
src/app/(theme-2)/th_2/_components/reviews/review-card.tsx
```

```tsx
interface ReviewCardProps {
  name: string
  rating: number
  comment: string
}

export function ReviewCard({ name, rating, comment }: ReviewCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">{name}</span>
        <span className="text-yellow-500">{"★".repeat(rating)}</span>
      </div>
      <p className="mt-2 text-muted-foreground">{comment}</p>
    </div>
  )
}
```

Import it in a page or parent component:

```tsx
import { ReviewCard } from "./_components/reviews/review-card"
```

---

## 9. How to Work with the API

### Understanding the API Client

We have a custom API client at `src/lib/api.ts`. There are two pre-configured instances:

| Instance    | When to Use                           | Auth                            |
| ----------- | ------------------------------------- | ------------------------------- |
| `clientApi` | In client components (browser)        | Reads token from `localStorage` |
| `serverApi` | In server components / server actions | No auth token                   |
| `api`       | Auto-selects based on environment     | Depends on context              |

### Making an API Call (Server Component)

```tsx
import { api } from "@/lib/api-client"
import { getDomainHeaders } from "@/lib/domain"

export default async function ProductPage() {
  const headers = await getDomainHeaders()

  const response = await api.get<ProductResponse>(
    "/customer/products",
    undefined,
    {
      headers,
      fetchOptions: {
        cache: "force-cache",
        next: { revalidate: 300 },
      },
    }
  )

  const products = response.data
  return <ProductList products={products} />
}
```

### Making an API Call (Client Component)

```tsx
"use client"
import { clientApi } from "@/lib/api-client"

async function searchProducts(query: string) {
  const response = await clientApi.get<SearchResponse>(
    `/customer/product-search?search=${query}&page=1`
  )
  return response.data
}
```

### Using the Helper Functions

For common data-fetching patterns, use the helpers in `src/utils/api-helpers.ts`:

```tsx
import {
  getData,
  getDomainInfo,
  getProductDetailsData,
} from "@/utils/api-helpers"

// Fetch everything for a home page
const data = await getData("merchant-domain.com")
// Returns: { shop_id, slider, banner, category, ... }

// Fetch a single product with related products
const productData = await getProductDetailsData("merchant-domain.com", "123")
// Returns: { shopInfo, product, relatedProduct, orderPermision }
```

### Adding a New API Endpoint

1. **Add the path** to `src/config/ApiEndpoints.ts`:

   ```typescript
   REVIEW: {
     GET_REVIEWS: "/customer/reviews",
   }
   ```

2. **Add the type** to `src/lib/api-types.ts`:

   ```typescript
   "/customer/reviews": {
     GET: ApiResponse
   }
   ```

3. **Use it**:
   ```typescript
   const response = await api.getTyped<ReviewData[]>("/customer/reviews", {
     headers: { "shop-id": shopId },
   })
   ```

---

## 10. How to Work with the Cart

The cart is a standalone module in `src/lib/cart/`. It uses Zustand for state and persists to `localStorage`.

### Adding an Item

```tsx
"use client"
import { useCart } from "@/lib/cart"

function AddToCartButton({ product }) {
  const { addItem } = useCart()

  const handleAdd = async () => {
    await addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      discountedPrice: product.discount_price,
      quantity: 1,
      variants: selectedVariants,
      metadata: {
        image: product.image,
        slug: product.slug,
      },
    })
  }

  return <button onClick={handleAdd}>Add to Cart</button>
}
```

### Reading Cart State

```tsx
"use client"
import { useCartItems, useCartTotal, useCartItemCount } from "@/lib/cart"

function CartSummary() {
  const items = useCartItems()
  const total = useCartTotal()
  const count = useCartItemCount()

  return (
    <div>
      <span>{count} items</span>
      <span>Total: ৳{total}</span>
    </div>
  )
}
```

### Available Cart Hooks

| Hook                 | Returns                                    | Use Case                          |
| -------------------- | ------------------------------------------ | --------------------------------- |
| `useCart()`          | Full cart context (items, totals, actions) | When you need everything          |
| `useCartItems()`     | `CartItem[]`                               | Listing cart items                |
| `useCartTotal()`     | `number`                                   | Showing total price               |
| `useCartItemCount()` | `number`                                   | Badge on cart icon                |
| `useIsCartEmpty()`   | `boolean`                                  | Show/hide empty state             |
| `useCartItem(id)`    | `CartItem \| undefined`                    | Single item details               |
| `useCartTotals()`    | `CartTotals` object                        | Subtotal, tax, shipping breakdown |

---

## 11. How to Work with State (Zustand Stores)

### Reading from the Domain Store

```tsx
"use client"
import { useDomain } from "../store/domain"

function ShopLogo() {
  const domain = useDomain((state) => state.domain)
  return <img src={domain?.shop_logo} alt={domain?.shop_meta_title} />
}
```

### Creating a New Store

If you need a new piece of global state, create a Zustand store:

```typescript
// src/app/(theme-2)/th_2/store/my-feature.ts
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { createCookieStorage } from "./persistent-middwere"

interface MyFeatureState {
  data: string | null
  setData: (data: string) => void
}

export const useMyFeature = create<MyFeatureState>()(
  persist(
    (set) => ({
      data: null,
      setData: (data) => set({ data }),
    }),
    {
      name: "my-feature",
      storage: createJSONStorage(() =>
        createCookieStorage({ sameSite: "strict" })
      ),
    }
  )
)
```

### When to Use Cookie vs localStorage Persistence

| Storage                            | Use When                                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| **Cookie** (`createCookieStorage`) | Data is needed by the middleware or server-side code (e.g., domain info, theme settings) |
| **localStorage** (default Zustand) | Data is only needed in the browser (e.g., cart, UI preferences)                          |

---

## 12. How to Add Translations (i18n)

### Step 1: Add keys to both translation files

**`messages/en.json`:**

```json
{
  "FaqPage": {
    "title": "Frequently Asked Questions",
    "noResults": "No questions found"
  }
}
```

**`messages/bn.json`:**

```json
{
  "FaqPage": {
    "title": "সচরাচর জিজ্ঞাসা",
    "noResults": "কোনো প্রশ্ন পাওয়া যায়নি"
  }
}
```

### Step 2: Use in your component

```tsx
"use client"
import { useTranslations } from "next-intl"

function FaqPage() {
  const t = useTranslations("FaqPage")

  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  )
}
```

### How Locale is Determined

1. The app reads the `NEXT_LOCALE` cookie (set by the language selector in the UI)
2. Defaults to `"en"` if no cookie is present
3. Supported values: `"en"` (English), `"bn"` (Bengali)

---

## 13. Styling Guide

### Tailwind CSS v4

We use **Tailwind CSS v4** with the `@tailwindcss/postcss` plugin. Key differences from v3:

- Configuration is in CSS (`globals.css`), not `tailwind.config.js`
- Colors use OKLCH color space
- Import with `@import "tailwindcss"` instead of `@tailwind` directives

### CSS Variables (Theming)

Each theme's `globals.css` defines CSS variables that control all colors:

```css
:root {
  --background: oklch(0.98 0.003 247);
  --foreground: oklch(0.28 0.037 260);
  --primary: oklch(0.585 0.204 277);
  --primary-foreground: oklch(1 0 0);
  --muted: oklch(0.967 0.003 264);
  --muted-foreground: oklch(0.551 0.023 264);
  /* ... more variables */
}
```

Use these in your components via Tailwind classes:

```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">Click</button>
  <p className="text-muted-foreground">Secondary text</p>
</div>
```

### Dynamic Brand Colors

Some merchants have a custom brand color. The `ThemeBrandProvider` component reads this from the domain store and overrides the `--primary` CSS variable at runtime. You don't need to do anything special — just use `bg-primary`, `text-primary`, etc. and it works automatically.

### Utility: `cn()` Helper

Use `cn()` from `@/lib/utils` to merge Tailwind classes (handles conflicts correctly):

```tsx
import { cn } from "@/lib/utils"

function MyComponent({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>{/* ... */}</div>
  )
}
```

---

## 14. Code Style & Conventions

### Enforced Automatically

These are enforced by Prettier + ESLint on every commit (via Husky):

| Rule                  | Example                            |
| --------------------- | ---------------------------------- |
| No semicolons         | `const x = 1` (not `const x = 1;`) |
| Double quotes         | `"hello"` (not `'hello'`)          |
| 2-space indent        | Standard                           |
| Trailing commas (ES5) | `{ a: 1, b: 2, }`                  |
| Arrow parens always   | `(x) => x` (not `x => x`)          |

### Naming Conventions

| What               | Convention                            | Example                                 |
| ------------------ | ------------------------------------- | --------------------------------------- |
| Components         | PascalCase                            | `ProductCard`, `CartPopover`            |
| Files (components) | kebab-case                            | `product-card.tsx`, `cart-popover.tsx`  |
| Hooks              | camelCase with `use` prefix           | `useCart`, `useDomain`                  |
| Types/Interfaces   | PascalCase with `I` prefix (optional) | `IShopResponse`, `CartItem`             |
| Constants          | UPPER_SNAKE_CASE                      | `NEXT_REVALIDATE_TIME`, `API_ENDPOINTS` |
| CSS variables      | kebab-case                            | `--primary`, `--background`             |

### Import Order (recommended)

```typescript
// 1. React/Next.js
import React from "react"
import { NextResponse } from "next/server"

// 2. Third-party libraries
import { useTranslations } from "next-intl"
import { create } from "zustand"

// 3. Internal absolute imports (@/)
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"

// 4. Relative imports
import { ProductCard } from "./_components/products/product-card"
import type { IProduct } from "../types/product"
```

### Path Aliases

| Alias          | Maps To        |
| -------------- | -------------- |
| `@/*`          | `./src/*`      |
| `@/messages/*` | `./messages/*` |

Always use `@/` for imports outside the current theme directory. Use relative imports within a theme.

---

## 15. Git Workflow

### Branching

- **`master`** — Production branch. Direct pushes are **blocked** by the pre-push hook.
- **Feature branches** — Create a branch for each feature/fix: `feat/my-feature`, `fix/cart-bug`, etc.

### Commit Process

When you commit, the pre-commit hook automatically:

1. Runs **Prettier** on staged files (formats code)
2. Runs **ESLint** on staged files (fixes lint errors)

If either step fails, the commit is rejected. Fix the issues and try again.

### Pull Request Flow

```bash
# 1. Create a feature branch
git checkout -b feat/my-feature

# 2. Make your changes, commit
git add .
git commit -m "Add FAQ page to theme 2"

# 3. Push and create a PR
git push -u origin feat/my-feature
# Then create a PR on GitHub targeting master
```

---

## 16. Debugging Tips

### "I see the wrong theme"

The theme is determined by the `domain` cookie. Open DevTools → Application → Cookies and look at the `domain` cookie. Check the `theme_id` or `theme_settings.theme_name` value. To reset, delete the cookie and refresh.

### "API calls return empty data"

Check these headers in DevTools → Network:

- Is `shop-id` present? (Required for most endpoints)
- Is `domain` header set correctly? (Required for `/shops/domain`)

In development, the API uses `NEXT_PUBLIC_HOST_NAME` from `.env` to simulate a domain.

### "My styles don't match the theme colors"

Make sure you're using semantic Tailwind classes (`bg-primary`, `text-foreground`) instead of hardcoded colors (`bg-blue-500`). Semantic classes respect the theme's CSS variables.

### "My new page returns 404"

1. Did you add the middleware rewrite in `src/proxy.ts`?
2. Is the file in the correct directory? (e.g., `(theme-2)/th_2/faq/page.tsx`, NOT `(theme-2)/faq/page.tsx`)
3. Restart the dev server — sometimes file system changes need a restart.

### "The domain cookie is too large / malformed"

The domain store persists to a cookie, which has a 4KB limit. If you add too much data to the domain store, the cookie may get truncated. Keep the domain store lean.

### Useful Dev Tools

- **React DevTools** — Inspect component tree and props
- **Next.js DevTools** — Check server component output
- **Application tab (DevTools)** — View cookies, localStorage (cart data is here)
- **Network tab** — Inspect API calls and headers

---

## 17. Frequently Asked Questions

### Q: Where do I find the Figma/design files?

Designs are maintained by the design team. Check with your team lead for access to the Figma workspace.

### Q: How do I test a specific merchant's store locally?

Change `NEXT_PUBLIC_HOST_NAME` in your `.env` file to the merchant's domain (e.g., `giftvaly.com`), then restart the dev server. The API will return that merchant's data.

### Q: How do I add a completely new theme?

1. Create a new route group: `src/app/(theme-4)/th_4/`
2. Add a `layout.tsx`, `globals.css`, and `page.tsx`
3. Add `_components/`, `store/`, `types/` directories
4. Add the theme ID mapping in `src/proxy.ts`:
   ```typescript
   const THEME_MAP: Record<string, string> = {
     "201": "th_3",
     "301": "th_4", // <-- new theme
   }
   ```
5. Set `NEXT_PUBLIC_DEFAULT_THEME=301` in `.env` to test it

### Q: Why are there two domain stores (one in th_2, one in th_3)?

Each theme is isolated — they have their own stores, types, and components. This allows themes to evolve independently without breaking each other. The stores share the same `domain` cookie for persistence, so they stay in sync.

### Q: Can I use `useState` / `useEffect` in a page.tsx?

Not by default. Page files are Server Components. If you need interactivity, either:

- Add `"use client"` at the top of the file, or
- Extract the interactive part into a separate client component and import it

### Q: What's the difference between `src/components/ui/` and `th_2/_components/ui/`?

- `src/components/ui/` — **Global** shadcn/ui components, shared across ALL themes
- `th_2/_components/ui/` — **Theme-specific** UI overrides (e.g., theme 2 has its own Button, Input, Card with different styling)

### Q: How does the checkout know shipping costs?

The checkout page fetches `/customer/shipping-setting/show` from the API, which returns rates for `inside_dhaka` and `outside_dhaka`. The user selects their delivery area, and the cost is applied.

### Q: Where is the `middleware.ts` file?

The middleware logic is in `src/proxy.ts`. There should be a `middleware.ts` at the project root that imports and calls the `proxy()` function. If it's missing, create it:

```typescript
// middleware.ts (project root)
export { proxy as middleware, config } from "./src/proxy"
```

---

## 18. Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Request                       │
│              https://merchant.com/shop                   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  Middleware (proxy.ts)                                    │
│  ┌──────────────────────────────────────────────┐        │
│  │ 1. Read "domain" cookie                       │        │
│  │ 2. Extract theme_name / theme_id              │        │
│  │ 3. Map via THEME_MAP ("201" → "th_3")         │        │
│  │ 4. Rewrite: /shop → /th_3/shop                │        │
│  └──────────────────────────────────────────────┘        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  Theme Layout (layout.tsx)                                │
│  ┌────────────────────────────────────────────────────┐  │
│  │ • Load fonts (Inter, Montserrat, etc.)              │  │
│  │ • Read domain cookie for metadata (title, favicon)  │  │
│  │ • Wrap in NextIntlClientProvider (i18n)             │  │
│  │ • Wrap in ThemeBrandProvider (dynamic colors)       │  │
│  │ • Render Header + children + Footer                 │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  Page Component (page.tsx)                                │
│  ┌────────────────────────────────────────────────────┐  │
│  │ • Fetch data from Funnel Liner API                  │  │
│  │   (products, categories, banners)                   │  │
│  │ • Render server-side HTML                           │  │
│  │ • Hydrate client components                         │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  External API (staging.funnelliner.com/api/v1)           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ • /shops/domain → Shop identity & config            │  │
│  │ • /customer/products → Product catalog              │  │
│  │ • /customer/categories → Category list              │  │
│  │ • /customer/order/store → Place order               │  │
│  │ • /customer/shipping-setting/show → Shipping rates  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### State Architecture

```
┌─────────── Server ──────────┐   ┌─────────── Browser ──────────────┐
│                              │   │                                   │
│  Domain Cookie (HTTP)        │──▶│  Zustand domain store             │
│  ┌────────────────────────┐  │   │  ┌─────────────────────────────┐ │
│  │ shop_id, theme_id,     │  │   │  │ Persists back to cookie     │ │
│  │ theme_settings,        │  │   │  │ Read by ThemeBrandProvider  │ │
│  │ shop_meta_title, etc.  │  │   │  └─────────────────────────────┘ │
│  └────────────────────────┘  │   │                                   │
│                              │   │  Zustand cart store               │
│  getDomainHeaders()          │   │  ┌─────────────────────────────┐ │
│  getDomainMeta()             │   │  │ Persists to localStorage    │ │
│  getDomainFromCookies()      │   │  │ Cart items, totals          │ │
│                              │   │  └─────────────────────────────┘ │
│                              │   │                                   │
│  API calls with shop-id     │◀──│  Client API calls with auth      │
│  header (server-side)        │   │  token from localStorage         │
└──────────────────────────────┘   └───────────────────────────────────┘
```

---

**Happy coding! If something in this guide is outdated or unclear, please update it. This is a living document.**
