# MASAB System

A small full‑stack web app that behaves like a simple bank for one organisation.  
One Finance Manager logs in, sees the account balance, records payments, records deposits, and can download a PDF receipt for any transaction.

## 1. What this app does

- **Login and Logout** for a single user
- **Dashboard** with current balance, total transactions, and pending count
- **Manage Payees** (employees, suppliers, pension funds) with add, edit, delete
- **Manage Customers** with add, edit, delete
- **Create Transactions** in a three step wizard
  - pick Payee or Customer
  - enter amount and note
  - confirm and save
- **Mark Transaction as DONE** from the details page
- **Deposit Money** into the organisation account
- **Download PDF Receipt** for any transaction

> Important: In the current server code, creating a transaction sets its status to **DONE** and **subtracts** the amount from the organisation balance right away.  
> Use the **Deposit** screen to add money to the balance.

## 2. Technology stack

**Front end**
- React 18
- React Router
- Bootstrap 5 (CSS and basic JS)
- react-data-table-component
- react-hook-form
- Axios
- Redux Toolkit + RTK Query

**Back end**
- Node.js 18
- Express 4
- Mongoose (MongoDB)
- jsonwebtoken, cookie-parser
- bcrypt
- pdfkit
- cors, dotenv

**Database**
- MongoDB (Atlas or local)

## 3. Project structure (high level)

```
masab/
├─ backend/
│  ├─ models/ (User, Payee, Customer, Transaction, OrgAccount)
│  ├─ routes/ (auth, users, payees, customers, transactions, orgAccounts)
│  ├─ utils/middleware.js (verify JWT)
│  ├─ config/db.js (Mongo connection)
│  └─ server.js (Express app + seeding)
└─ frontend/
   ├─ src/
   │  ├─ pages/ (Login, Home, Payees, Customers, Transactions, Transfer, Deposit, etc.)
   │  ├─ redux/ (RTK Query APIs and store)
   │  ├─ components/ (Notif, Logo)
   │  └─ utils/
   └─ index.html + vite config
```

## 4. How to run locally

### 4.1 Prerequisites
- Node.js 18 or newer
- npm 9 or newer
- MongoDB (local or a MongoDB Atlas connection string)

### 4.2 Back end

1) Enter the backend folder and install packages
```bash
cd backend
npm install
```

2) Start the server
```bash
npm start
```
or
```bash
node server.js
```

When the server starts it seeds:
- Admin user: **support@masab.com** with password **support123**
- One organisation account with balance **1,000,000**

The API runs on **http://localhost:3005** by default.

### 4.3 Front end

1) Open a new terminal, go to the frontend folder and install packages
```bash
cd frontend
npm install
```

2) Start the front end
```bash
npm run dev
```
Vite uses port **5170** by default. The back end CORS is already configured for `http://localhost:5170`.

3) Login with
```
Email:    support@masab.com
Password: support123
```

## 5. Useful API routes (quick view)

**Auth**
- `POST /api/auth/login`

**Users**
- `GET /api/users/personal/me` (requires JWT)
- `GET /api/users/logout`

**Org account**
- `GET /api/orgAccounts` (requires JWT)
- `POST /api/orgAccounts/deposit` with `{ "amount": Number }`

**Payees**
- `GET /api/payees`
- `GET /api/payees/getOne/:id`
- `POST /api/payees/create`
- `PUT /api/payees/update/:id`
- `DELETE /api/payees/delete/:id`

**Customers**
- `GET /api/customers`
- `GET /api/customers/getOne/:id`
- `POST /api/customers/create`
- `PUT /api/customers/update/:id`
- `DELETE /api/customers/delete/:id`

**Transactions**
- `GET /api/transactions`
- `GET /api/transactions/getOne/:id`
- `POST /api/transactions/create`
- `PATCH /api/transactions/updateStatus/:id`
- `GET /api/transactions/:id/receipt`  
