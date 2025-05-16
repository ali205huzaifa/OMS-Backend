
# 🏢 Organization Management System (OMS) - Backend

A Node.js + Express + MongoDB-based backend for managing users, attendance, tasks, performance, and leaves with role-based access control (RBAC).

---

## 📦 Tech Stack

- **Node.js & Express**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Role-Based Access Control (RBAC)**
- **Postman for API Testing**

---

## 🚀 Getting Started

### 📁 Clone the Repository

```bash
git clone https://github.com/your-username/organization-management-system.git
cd organization-management-system
```

### 🧩 Install Dependencies

```bash
npm install
```

### 🛠️ Setup Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/oms
JWT_SECRET=your_jwt_secret_here
```

> 🔐 Do NOT share `.env` in public repositories.

### 🏁 Run the Server

```bash
npm run dev
```

The server should now be running on `http://localhost:5000`

---

## 🔑 Authentication

| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | `/auth/register-admin`    | Public route to create first admin |
| POST   | `/auth/login`             | Login with email & password     |
| POST   | `/auth/forgot-password`   | Reset password (simplified)     |
| POST   | `/auth/register`          | Admin-only: register users      |

---

## 👤 User Management

| Method | Endpoint       | Role       | Description                       |
|--------|----------------|------------|-----------------------------------|
| PUT    | `/users/:id`   | Admin      | Update user details               |
| DELETE | `/users/:id`   | Admin      | Soft-delete a user                |
| GET    | `/users`       | Admin      | List users with pagination/filter |

---

## 📅 Attendance Management

| Method | Endpoint           | Role        | Description                                |
|--------|--------------------|-------------|--------------------------------------------|
| POST   | `/attendance/mark` | Employee    | Mark check-in or check-out                 |
| GET    | `/attendance`      | Admin/Manager | View team/all attendance records         |
| GET    | `/attendance/report` | Admin/Manager | Summary report (present, late, etc.)   |

---

## ✅ Task Management

| Method | Endpoint                  | Role        | Description                               |
|--------|---------------------------|-------------|-------------------------------------------|
| POST   | `/tasks`                  | Manager     | Create and assign task                    |
| PUT    | `/tasks/:id/status`       | Employee    | Update task status                        |
| POST   | `/tasks/:id/comment`      | Manager/Employee | Add comment to task                  |
| GET    | `/tasks`                 | Manager/Employee | List assigned or created tasks       |

---

## 📈 Performance Management

| Method | Endpoint               | Role          | Description                                  |
|--------|------------------------|---------------|----------------------------------------------|
| POST   | `/performance`         | Manager       | Add performance review for an employee       |
| GET    | `/performance/my`      | Employee      | View your own performance reviews            |
| GET    | `/performance/:employeeId` | Admin/Manager | View specific employee's reviews         |
| GET    | `/performance`         | Admin/Manager | Performance report (avg rating, count)       |

---

## 🌴 Leave Management

| Method | Endpoint              | Role          | Description                                  |
|--------|-----------------------|---------------|----------------------------------------------|
| POST   | `/leaves`             | Employee      | Apply for leave                              |
| PUT    | `/leaves/:id/status`  | Manager       | Approve/Reject leave                         |
| GET    | `/leaves`             | All Roles     | View your or your team's leave requests      |

---

## 🧪 Testing the API

1. Open [Postman](https://www.postman.com/)
2. Import the file: `OMS_Postman_Collection.json`
3. Set `{{base_url}}` to `http://localhost:5000`
4. Test each module using example requests
5. Use the `/auth/login` endpoint to get a JWT token
6. Set the token in Postman as Bearer Token for protected routes

---

## 📂 Folder Structure

```
├── controllers/
├── routes/
├── models/
├── middlewares/
├── utils/
├── app.js
├── server.js
└── .env
```

---

## 📌 Notes

- Passwords are hashed with **bcrypt**
- JWT tokens expire in 7 days
- Manager-Employee hierarchy managed via `managerId` field
- Use role-based access to control permissions

---

## 💬 Questions?

Feel free to open an issue or contact the maintainer.

---
