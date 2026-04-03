# Assumptions and design decisions

This document explains every decision made where the assignment
left room for interpretation, and the reasoning behind each choice.

---

## Database — PostgreSQL over SQLite or MongoDB

PostgreSQL was chosen because this is a relational problem. Users
own transactions, transactions belong to users — that relationship
needs referential integrity enforced at the database level. In a
fintech system you cannot have orphaned transactions or inconsistent
user-role states.

The assignment allows SQLite for simplicity, but PostgreSQL was
chosen intentionally because this type of system grows in complexity
over time — more entities, more relationships, more constraints.
Starting with a proper relational database is the right foundation
for that growth. PostgreSQL is also the industry standard for
fintech systems specifically because of its reliability and
support for complex queries.

---

## ORM — Prisma over raw SQL

Prisma was chosen for three reasons. First, `schema.prisma` acts as
a single source of truth for the entire data model — one file
describes the schema, generates migrations, and generates the
type-safe client. Second, it works exceptionally well with
PostgreSQL and speeds up development without sacrificing control.
Third, Prisma's `groupBy` and `_sum` aggregate APIs made the
dashboard endpoints clean to write and easy to reason about.

---

## Framework — Express over alternatives

Express was chosen for its middleware architecture specifically.
The core design of this system is a layered chain where every
request flows through `authMiddleware` → `requireRole()` →
`validate()` → controller in order. Express makes this pattern
clean and explicit — each layer has one job and can be reasoned
about independently. A more opinionated framework would constrain
how this chain is structured.

Express was also the right choice for rapid development — routing,
middleware, and JSON responses in minimal boilerplate. The
ecosystem of packages like `helmet`, `cors`, and `morgan` meant
production-grade security and logging with zero custom code.

---

## RBAC — middleware factory over inline checks

Role enforcement is implemented as a `requireRole(['ADMIN'])`
factory function that returns middleware. This means access control
is declared at the route level, not buried inside controller logic.
Any developer reading the route file can immediately see who is
allowed to call it without opening the controller. This is a
deliberate separation of concerns — the controller should only
care about business logic, not about who is allowed to run it.

---

## Transactions — system-wide, not per-user scoped

Transactions are visible to all authenticated users with the
appropriate role. This was a conscious architectural decision:
this system is a shared finance dashboard, not a personal finance
tracker. An ADMIN manages the organisation's financial records,
not just their own entries. VIEWER and ANALYST roles can read
those records based on their access level. The role system itself
provides the control layer over who can do what with that data.

---

## JWT logout — client-side responsibility

JWT is stateless by design. The server issues tokens but never
stores them. Logout is a client-side responsibility — the
application discards the token on logout and the next login
replaces it. This is standard JWT behavior. The `/auth/logout`
endpoint exists as a signal for the client to clear its stored
token, but the server itself has no session to destroy.

A server-side token blacklist using Redis would be the production
approach for immediate token invalidation — issued tokens would
be stored and checked on every request after logout. This was
not implemented as it falls outside the scope of this assessment,
but it is the known tradeoff of stateless JWT authentication.

---

## Soft delete on transactions

Transactions are never permanently deleted. The `isDeleted` flag
hides them from all queries while preserving the underlying data.
In a financial system, permanent deletion of records is a bad
practice — audit trails matter. Soft delete gives the system a
path to data recovery and future audit functionality without
adding a separate audit table.

---

## Roles as strings, not database enums

Roles (`VIEWER`, `ANALYST`, `ADMIN`) are stored as plain strings
rather than a PostgreSQL enum. The same protection is achieved at
the application layer via Zod validation — any invalid role value
is rejected with a 400 before it reaches the database. This avoids
the migration overhead of altering a database enum every time a
role changes, which is common early in a system's life.