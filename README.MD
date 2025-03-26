# 🥗 Meal Planner

Plan smarter. Eat better. This full-stack application allows users to log in, create, edit, save, and delete meals with a clean UI and real-time updates — all powered by GraphQL and JWT authentication.

---

## 🚀 Live Demo

- 🔗 Frontend: [https://meal-plan-frontend-3a3a.onrender.com](https://meal-plan-frontend-3a3a.onrender.com)  
- 🔗 Backend: [https://meal-plan-7bfa.onrender.com/graphql](https://meal-plan-7bfa.onrender.com/graphql)

---

## 📊 Tech Stack

### Frontend
- React (Vite)
- Apollo Client
- React Router DOM
- CSS Modules

### Backend
- Node.js
- Express.js
- Apollo Server (GraphQL)
- MongoDB + Mongoose
- JWT Authentication

---

## 📦 Features

- 🔐 JWT authentication with secure login/signup
- 🍽️ Create, edit, delete meals
- ❤️ Save meals to your personal list
- 🔍 Search and filter meals
- 🌟 Clean pastel UI
- ⚙️ Real-time updates using Apollo cache + refetch
- 🌐 Fully deployed (frontend + backend)
- 📄 Clean GitHub repo with `.env`, `.gitignore`, and organized folders

---

## 📁 Project Structure

```
Develop/
├── client/               # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── graphql/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── _redirects         # Handles client-side routing for deployment
│
├── server/               # Node backend with GraphQL
│   ├── graphql/
│   ├── models/
│   └── server.js
│
├── .env                  # Environment variables (NOT committed)
├── .gitignore
├── package.json          # Backend dependencies
├── package-lock.json
└── README.md
```

---

## 💻 Local Development

To run this project locally, you'll need to start both the **frontend** and the **backend**.

### 📦 Prerequisites

- Node.js v18+
- npm
- MongoDB Atlas account or local MongoDB server
- `.env` file inside the `server/` directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

### 🔧 Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Backend will be running at:

```
http://localhost:5000/graphql
```

---

### 🎨 Frontend Setup

1. Open a new terminal tab/window and navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the Vite development server:

```bash
npm run dev
```

4. Frontend will be running at:

```
http://localhost:5173
```

---

> ⚠️ **Note:** Make sure the backend is running **first** before starting the frontend. The frontend uses Apollo Client to connect to the GraphQL API at `http://localhost:5000/graphql`.

---

## ✅ Requirements Checklist

- [x] Use **React** for frontend
- [x] Use **GraphQL** with **Node.js** and **Express.js**
- [x] Use **MongoDB + Mongoose** for the database
- [x] Queries + mutations for all CRUD operations
- [x] **JWT authentication**
- [x] Polished UI and professional design
- [x] Fully responsive + mobile-friendly
- [x] Deployed using **Render** (frontend + backend)
- [x] One GitHub Action in repo
- [x] Clean repo structure and quality code
- [x] Custom CSS (not using Bootstrap)

---

## 📜 License

This project is licensed for educational use.

---

## 🙌 Author

Developed by **John Garcia** during the UCI Full Stack Coding Boot Camp.
