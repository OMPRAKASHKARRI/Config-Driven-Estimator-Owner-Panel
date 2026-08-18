# Northline Roofing Estimator

A full-stack, configuration-driven roofing estimate application built for the Wantace SDE Intern take-home assignment.

The project includes a mobile-friendly public estimator for homeowners and a protected owner dashboard for managing configuration and reviewing leads. Questions, labels, options, validation limits, and pricing values are stored in MongoDB and fetched at runtime; the browser does not calculate pricing.

## Highlights

- Dynamic multi-step public estimator
- Server-side validation, pricing calculation, and lead persistence
- MongoDB-backed configuration and leads
- JWT-protected owner dashboard
- Live configuration publishing through immutable version snapshots
- Lead table with submitted answers and estimate ranges
- Responsive React and Tailwind CSS interface
- Seeded Version 3 configuration and supplied historical leads

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express, ES Modules |
| Database | MongoDB, Mongoose |
| Authentication | JWT bearer tokens |

## Architecture

```text
Public Estimator (React) -- GET /api/config --> Express API --> MongoDB
Public Estimator (React) -- POST /api/estimate --> Validate -> Calculate -> Save Lead
Owner Dashboard (React) -- JWT-protected admin API --> MongoDB
```

### Configuration and pricing

Configuration updates publish a new immutable version instead of overwriting the active document. A public estimator session submits the version it loaded, so the server can calculate against the correct snapshot even if an owner changes pricing mid-session.

Pricing rates, multipliers, and calculation logic stay on the server. The public configuration response includes only data needed to render the form, while the browser submits answers and receives only the estimate range.

## Project Structure

```text
wantace/
├── client/                         # React frontend
│   └── src/
│       ├── components/             # Dynamic form, estimator, and owner UI
│       ├── pages/                  # Public and admin routes
│       └── services/api.js         # API client
├── server/                         # Express API
│   └── src/
│       ├── controllers/            # HTTP handlers
│       ├── middleware/             # Auth and error handling
│       ├── models/                 # Mongoose schemas
│       ├── routes/                 # API routes
│       ├── seed/                   # Seed configuration and leads
│       ├── services/               # Pricing and versioning services
│       └── utils/                  # Validation helpers
├── DECISIONS.md                    # Engineering decisions
├── AI_LOG.md                       # AI usage disclosure
└── package.json                    # Convenience scripts
```

## Prerequisites

- Node.js 18 or later
- npm
- MongoDB 6 or later (local MongoDB or MongoDB Atlas)

## Installation

```bash
git clone <your-repository-url>
cd wantace-roofing-estimator
npm run install:all
```

## Environment Variables

Copy the example files before starting the application.

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

On Windows PowerShell:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```


## Database Setup and Seeding

Ensure MongoDB is running and `MONGODB_URI` is set, then seed the database:

```bash
npm run seed
```

This clears and recreates the `Config` and `Lead` collections with the supplied Version 3 Northline Roofing configuration and three historical leads, including the legacy Version 1 lead.

## Run Locally

Start the backend and frontend in separate terminals.

```bash
# Terminal 1
npm run dev:server

# Terminal 2
npm run dev:client
```

| Surface | URL |
|---|---|
| Public estimator | `https://config-driven-estimator-owner-panel.vercel.app` |
| Owner login | `https://config-driven-estimator-owner-panel.vercel.app/admin/login` |

## Owner Test Credentials

The default local credentials are defined in `server/.env.example`:

```text
Username: admin
Password: roofing2026!
```


## API Reference

### Public

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/config` | Returns the active public configuration and validation metadata. |
| `POST` | `/api/estimate` | Validates details and answers, calculates the estimate server-side, and saves the lead. |

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Validates owner credentials and returns a JWT. |

### Protected Admin API

All admin routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/config` | Returns the current configuration, including pricing fields. |
| `PUT` | `/api/admin/config` | Validates and publishes a new configuration version. |
| `GET` | `/api/admin/leads` | Returns leads ordered by most recent submission. |

## Testing

Run the server-side checks:

```bash
npm run test --prefix server
```

The included tests verify the pricing formula, numeric-string normalization for legacy configuration values, and the guard against disabling a pricing-critical question.

For a full local verification, seed MongoDB, complete a public estimate, sign in to the owner dashboard, and confirm the new lead appears in the leads table.

## Production Build

```bash
npm run build:client
```

The frontend bundle is created in `client/dist/`.

## Deployment

1. Deploy `server/` to a Node.js host such as Render, Railway, or Fly.io.
2. Configure the server environment variables, including production MongoDB and `CLIENT_ORIGIN`.
3. Deploy `client/` to Vercel, Netlify, or another static host.
4. Set `VITE_API_BASE_URL` at build time to the deployed backend API URL, for example `https://api.example.com/api`.
5. Run the seed command once against the production database.

Replace these placeholders before submission:



## Additional Documentation

- `DECISIONS.md` covers technical decisions, assumptions, calculation details, scope, and next steps.
- `AI_LOG.md` documents the use of AI assistance during the assignment.
