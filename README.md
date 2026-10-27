# גמ"ח שכונתי — Neighborhood Gemach (Client)

A borrow/lend board for neighborhoods in **Bnei Brak**. Residents post items they're willing to lend (tools, baby gear, event supplies, etc.), browse what their neighbors offer, and send borrow requests. Owners approve or reject requests and track the item through its loan lifecycle. Built as the final project for a React course.

This repository is the **React + TypeScript client**. It talks to a separate **Node.js + Express** server for data, auth and stats.

## Live Demo

- **App:** https://react-project-gmach.vercel.app/
- **Server repo:** https://github.com/lea-shtul/Gmach-project-server

## Main Features

- **Auth** — register / login, JWT stored in `localStorage`, protected routes, admin-only route
- **Browse items** — search by text, filter by category and neighborhood, sort, and paginate results
- **Manage my items** — create, edit and view items I posted (public or private), with an "add new item" flow
- **Item details & borrow requests** — view an item's full details and send a borrow request with a date range and an optional message
- **Request lifecycle** — requests move through `PENDING → APPROVED / REJECTED → BORROWED → RETURNED`, with owners able to approve, reject, mark as handed over, and mark as returned
- **My Requests / Received Requests** — two dedicated pages, each split into "pending / active / history" tabs with live counts
- **Personal stats** — charts and counters for items posted, times lent/borrowed, top-requested item, and neighborhood activity
- **Admin dashboard** — site-wide totals, charts by category/status/month, and a full registered-users table (admin-only)

## Tech Stack

- React 19 + TypeScript (Vite)
- React Router (nested routes, protected routes)
- TanStack Query (server state)
- axios (HTTP client)
- React Hook Form + Yup (forms & validation)
- MUI (component library, RTL theme)
- Recharts (charts)

## Libraries and Why I Used Them

| Library | What it does | How it's used in this project |
|---|---|---|
| **React Router** | Client-side routing | `router.tsx` defines nested routes under `App`; `ProtectedRoute` guards all logged-in pages and redirects to `/landing`, `AdminRoute` further restricts `/admin` to `role === 'ADMIN'`. |
| **TanStack Query** | Server-state fetching/caching | `useQuery` loads items, requests, meta and stats (e.g. `useItem`, `useMyStats`); `useMutation` handles create/update/delete/status-change actions and invalidates the relevant query keys (`items`, `myRequests`, `stats`, etc.) on success so the UI refreshes automatically. |
| **axios** | HTTP client | One shared instance in `server/axios.tsx` reads the server URL from `VITE_API_URL` and attaches the JWT from `localStorage` via a request interceptor. Every API call in `server/*.tsx` goes through this instance — no new axios instances, no hardcoded URLs. |
| **React Hook Form** | Form state management | Used with `Controller` in `ItemForm`, `RequestForm` and `register.tsx` to bind MUI fields without manual `onChange` plumbing for every field. |
| **Yup** (+ `@hookform/resolvers`) | Schema validation | Each form defines a Yup schema (e.g. item title length, required category, date range, phone format) wired into `useForm` via `yupResolver`. |
| **MUI** (+ Emotion, `stylis-plugin-rtl`) | Component library & theming | A custom RTL theme (`main.tsx`) sets colors, typography and component defaults for the whole app; `stylis-plugin-rtl` flips MUI's CSS for Hebrew right-to-left layout. |
| **Recharts** | Charts | Bar/Line/Pie charts in `myStats.tsx` and `AdminDashboard.tsx` visualize personal and site-wide lending activity. |

## Client Architecture

- **Routing:** `router.tsx` wraps the app in `SnackbarProvider` and `UserProvider`. Routes under `ProtectedRoute` share a `Header` and layout and redirect to `/landing` if no user is loaded; `AdminRoute` nests inside it to gate `/admin`.
- **Auth & global state:** `userContext` (`context/userContext.tsx`) holds the current user and loading state, exposes `login`/`logout`, and on mount calls `GET /auth/me` with the stored token to restore the session. It's the single source of truth for "who is logged in" across the app — no Redux.
- **Server calls:** every request flows **axios instance → server/*.tsx functions → TanStack Query hook → component**. Components never call axios directly; they call a typed hook (e.g. `useItem`, `useMyStats`) or a mutation that wraps a function from `server/`.
- **Forms:** all non-trivial forms (`ItemForm`, `RequestForm`, `register.tsx`) use React Hook Form + a Yup schema, so validation messages are declared once per field and shown inline via MUI's `error`/`helperText` props.

## Project Structure

```
src/
├── pages/        # Route-level pages (HomePage, MyRequests, ReceivedRequests, myItems, myStats, AdminDashboard, login, register, Landing, ItemDetails)
├── features/     # Larger page sections (ItemsList, header, NotFound)
├── components/   # Reusable UI pieces (ItemCard, requestCard, ReceivedRequestCard, itemForm, requesrForm, PageHeader, EmptyState, StatCard, AuthLayout)
├── hooks/        # Query hooks (useItem, useMeta, useMyStats, useSnackbar)
├── context/      # React Context providers (userContext, SnackbarContext)
├── router/       # Route guards (ProtectedRoute, AdminRoute) and router.tsx
├── server/       # axios instance + one file per API resource (itemApis, requests, authApi, statsApi, metaApi, getUsers)
└── types/        # Shared TypeScript types (itemType, requestType, user, statsType, meta)
```

## Getting Started

```bash
npm install
npm run dev
```

The client needs the server running (separately) at the URL below. Create a `.env` file in the project root with:

```
VITE_API_URL=<הכתובת המקומית של השרת>
```

> Server repo: https://github.com/lea-shtul/Gmach-project-server — start it first so API calls succeed.
