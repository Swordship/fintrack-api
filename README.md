# fintrack-api

Backend API for a finance dashboard system. Built with Node.js, Express, Prisma, and PostgreSQL as a screening assessment for Zorvyn FinTech.

---

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express v5 |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JSON Web Tokens (JWT) |
| Validation | Zod |
| Password hashing | bcryptjs |
| Security | Helmet, CORS |
| Logging | Morgan |

---

## Architecture overview
```
Request
  → authMiddleware (verify JWT, attach req.user)
  → requireRole() (check role, allow or 403)
  → validate() (Zod schema check, 400 on failure)
  → Controller (business logic)
  → Prisma (database query)
  → Response
```

Three-tier RBAC — **VIEWER**, **ANALYST**, **ADMIN** — enforced at the route level via a middleware factory. Role is embedded in the JWT payload at login so every request is self-contained with no extra DB lookup for auth.

---

## Setup

**1. Clone and install**
```bash
git clone https://github.com/Swordship/fintrack-api
cd fintrack-api
npm install
```

**2. Configure environment**
```bash
cp .env.example .env
```

Fill in `.env`:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/fintrack"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV=development
```

**3. Run database migration**
```bash
npx prisma migrate dev
```

**4. Seed test users**
```bash
npm run seed
```

| Email | Password | Role |
|---|---|---|
| admin@fintrack.com | admin123 | ADMIN |
| analyst@fintrack.com | analyst123 | ANALYST |
| viewer@fintrack.com | viewer123 | VIEWER |

**5. Start the server**
```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## API reference

### Health
```
GET /health
```
Returns server and database status.

---

### Auth

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | /auth/register | No | Register new user (default role: VIEWER) |
| POST | /auth/login | No | Login, receive JWT token |
| POST | /auth/logout | Yes | Logout (client must discard token) |

---

### Users — ADMIN only

| Method | Endpoint | Description |
|---|---|---|
| GET | /users | List all users |
| GET | /users/:id | Get user by ID |
| PATCH | /users/:id/role | Update user role |
| PATCH | /users/:id/status | Activate or deactivate user |

---

### Transactions

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | /transactions | ALL | List transactions |
| GET | /transactions/:id | ALL | Get transaction by ID |
| POST | /transactions | ADMIN | Create transaction |
| PATCH | /transactions/:id | ADMIN | Update transaction |
| DELETE | /transactions/:id | ADMIN | Soft delete transaction |

**Available query filters:**
```
?type=INCOME|EXPENSE
?category=rent
?from=2026-01-01T00:00:00.000Z
?to=2026-12-31T00:00:00.000Z
?page=1&limit=10
```

---

### Dashboard

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | /dashboard/summary | ALL | Total income, expenses, net balance |
| GET | /dashboard/by-category | ANALYST, ADMIN | Totals grouped by category and type |
| GET | /dashboard/trends | ANALYST, ADMIN | Monthly income vs expenses |
| GET | /dashboard/recent | ANALYST, ADMIN | Last 10 transactions by date |

---

## Role permission matrix

| Action | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| View transactions | ✓ | ✓ | ✓ |
| Create / update / delete transactions | ✗ | ✗ | ✓ |
| View dashboard summary | ✓ | ✓ | ✓ |
| View category breakdown / trends / recent | ✗ | ✓ | ✓ |
| Manage users | ✗ | ✗ | ✓ |

---

## Project structure
```
fintrack-api/
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── transactionController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoute.js
│   │   ├── userRoute.js
│   │   ├── transactionRoute.js
│   │   └── dashboardRoute.js
│   ├── schema/
│   │   ├── authSchema.js
│   │   ├── userSchema.js
│   │   └── transactionSchema.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Data model
```
User
  id, email, password, role, isActive, createdAt

Transaction
  id, amount, type (INCOME|EXPENSE), category,
  date, notes, isDeleted, userId (FK), createdAt, updatedAt
```

---

## Error responses

All errors return consistent JSON:
```json
{ "error": "message describing what went wrong" }
```

| Status | Meaning |
|---|---|
| 400 | Bad request / validation failed |
| 401 | No token provided |
| 403 | Token invalid or role not permitted |
| 404 | Resource not found |
| 409 | Conflict (e.g. email already in use) |
| 500 | Internal server error |