# Sweet Shop Backend 🍬

This is the backend API for the Sweet Shop Management System built using Node.js, Express, TypeScript, Prisma, and PostgreSQL/SQLite.

## Features
- User registration & login (JWT authentication)
- Role-based access (User / Admin)
- Sweet inventory management
- Purchase & restock functionality
- Protected routes using middleware

## Tech Stack
- Node.js
- TypeScript
- Express
- Prisma ORM
- SQLite / PostgreSQL
- JWT Authentication
- Jest (Testing)

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Sweets (Protected)
- POST /api/sweets
- GET /api/sweets
- GET /api/sweets/search
- PUT /api/sweets/:id
- DELETE /api/sweets/:id (Admin only)

### Inventory (Protected)
- POST /api/sweets/:id/purchase
- POST /api/sweets/:id/restock (Admin only)

## Setup Instructions

```bash
npm install
npx prisma migrate dev
npm run dev
