# Store Rating Platform

A full-stack web application where users can rate stores (1–5), built with **NestJS + MySQL (TypeORM)** on the backend and **React (Vite)** on the frontend.

## Roles & Features

| Feature | Admin | Normal User | Store Owner |
|---|---|---|---|
| Dashboard (stats) | ✅ Users/Stores/Ratings totals | – | ✅ Store rating summary |
| Add Store | ✅ | – | – |
| Add Users (Admin/Normal) | ✅ | – | – |
| Sign up | – | ✅ | – |
| Browse/search stores | ✅ (list) | ✅ (search by name/address) | – |
| Submit / modify rating (1–5) | – | ✅ | – |
| View raters of own store | – | – | ✅ |
| Notifications | ✅ | ✅ | ✅ |
| Security (change password) | ✅ | ✅ | ✅ |
| Settings (profile view) | ✅ | ✅ | ✅ |
| Sortable/filterable tables | ✅ | ✅ | ✅ |
| Logout | ✅ | ✅ | ✅ |

### Validation rules (enforced on both frontend & backend)
- **Name:** 20–60 characters
- **Address:** max 400 characters
- **Password:** 8–16 characters, at least 1 uppercase letter + 1 special character
- **Email:** standard email format
- **Rating:** integer 1–5

## Project Structure
```
store-rating-app/
├── backend/     NestJS API (Auth, Users, Stores, Ratings, Notifications, Dashboard)
└── frontend/    React + Vite SPA
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MySQL credentials
```

1. Create the database in MySQL:
   ```sql
   CREATE DATABASE store_rating_db;
   ```
2. Start the server (TypeORM `synchronize: true` will auto-create tables in dev):
   ```bash
   npm run start:dev
   ```
3. Seed the first System Administrator account:
   ```bash
   npx ts-node -r tsconfig-paths/register src/seed.ts
   ```
   Creates: `admin@storerating.com` / `Admin@1234`

API runs on `http://localhost:3000`.

### Key Endpoints
- `POST /auth/register` – normal user signup
- `POST /auth/login` – single login for all roles
- `PATCH /auth/change-password` – security/settings password update
- `GET /dashboard/admin` – admin stats
- `POST /users` (Admin) – add user (any role)
- `GET /users?name=&email=&address=&role=&sortBy=&sortOrder=` (Admin)
- `GET /users/:id` (Admin) – full detail (+rating if store owner)
- `POST /stores` (Admin) – add store
- `GET /stores?name=&address=&email=&sortBy=&sortOrder=` (Admin + Normal User)
- `GET /stores/owner/dashboard` (Store Owner) – raters + average rating
- `POST /ratings` (Normal User) – submit/update rating
- `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# ensure VITE_API_URL points to your backend, e.g. http://localhost:3000
npm run dev
```

App runs on `http://localhost:5173`.

## Notes on Design Decisions
- **Single login system:** one `/auth/login` endpoint returns a JWT with the user's `role` embedded; the frontend routes users to the correct dashboard (`/admin`, `/stores`, `/owner`) based on that role.
- **RolesGuard + JwtAuthGuard:** every protected route enforces both authentication and role-based authorization server-side (not just hidden in the UI).
- **Rating uniqueness:** a DB-level unique constraint on `(userId, storeId)` in the `ratings` table means submitting a rating twice updates the existing one instead of duplicating it — this powers "submit vs modify" in the UI.
- **Notifications:** triggered automatically when — an admin creates a user, a store is linked to an owner, or a rating is submitted/updated on an owned store.
- **Sorting/filtering:** table headers are clickable and toggle ascending/descending; filters use `LIKE` queries server-side (users, stores) for name/email/address, plus role filter for users.
- **Screenshots :**  <img width="790" height="843" alt="Screenshot 2026-07-01 194633" src="https://github.com/user-attachments/assets/10f8a87f-088e-424f-b231-c1929918123a" />

<img width="1905" height="870" alt="Screenshot 2026-07-01 194620" src="https://github.com/user-attachments/assets/80702e65-51a3-4045-bd0e-7447c4380a16" />

<img width="1905" height="870" alt="Screenshot 2026-07-01 194620" src="https://github.com/user-attachments/assets/e2fe440c-be99-445e-a504-b901ea548b31" />


<img width="1898" height="868" alt="Screenshot 2026-07-01 194456" src="https://github.com/user-attachments/assets/b88e048f-d86e-4ab1-9c4a-bb450f4ab444" />

<img width="1900" height="877" alt="Screenshot 2026-07-01 194549" src="https://github.com/user-attachments/assets/055e14fb-800e-46f6-9be0-837f4bf9d71c" />


