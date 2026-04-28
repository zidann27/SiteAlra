# SiteAlra Backend (Express + MySQL)

## Setup

1. Install deps

```bash
cd backend
npm install
```

2. Create `.env`

Copy from `.env.example` and set your MySQL connection string:

```bash
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/sitealra"
PORT=4000
CORS_ORIGIN=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

3. Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Run API

```bash
npm run dev
```

## Endpoints

- `POST /api/generate-website`
- `POST /api/sites`
- `GET /api/sites?limit=6`
- `GET /api/sites/:slug`
- `GET /api/sites/:siteId/products`
- `POST /api/sites/:siteId/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
