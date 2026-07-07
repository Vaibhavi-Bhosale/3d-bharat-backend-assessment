# 3D Bharat Backend Assessment

Backend assessment developed using **Node.js**, **Express.js**, and **MySQL**.

## Features

### POST /api/orders

- Validates incoming request data
- Reuses existing users instead of creating duplicates
- Prevents duplicate products within the same order
- Calculates total order amount on the server
- Uses MySQL transactions
- Rolls back all changes if any operation fails

### GET /api/orders/:id

- Fetches order details using SQL JOINs
- Returns nested JSON response containing:
  - User details
  - Order details
  - Order items

### POST /api/users/validate

- Validates email format
- Validates mobile number
- Checks user status
- Returns meaningful error messages and HTTP status codes

---

## Tech Stack

- Node.js
- Express.js
- MySQL
- mysql2
- Postman

---

## Project Structure

```text
src
├── config
│   └── db.js
│
├── controllers
│   ├── orderController.js
│   └── userController.js
│
├── routes
│   ├── orderRoutes.js
│   └── userRoutes.js
│
├── app.js
└── server.js
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Vaibhavi-Bhosale/3d-bharat-backend-assessment.git
cd 3d-bharat-backend-assessment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bharat3d
PORT=5000
```

### 4. Create Database

Create a MySQL database named:

```sql
CREATE DATABASE bharat3d;
```

Import or create the required tables:

- users
- orders
- order_items

(Database schema is available in `database.sql`)

### 5. Start the Server

```bash
npm run dev
```

Server will start on:

```text
http://localhost:5000
```

---

## API Endpoints

| Method | Endpoint | Description |
|----------|----------|----------|
| POST | /api/orders | Create a new order |
| GET | /api/orders/:id | Get order details |
| POST | /api/users/validate | Validate user |

---

## Author

**Vaibhavi Bhosale**
