# 🧩 Inventory Management System (IMS)

A full-stack **Inventory Management System** built with **React (frontend)** and **Node.js + Express + SQLite (backend)**.  
This system enables admin users to efficiently manage products, import/export CSV data, and track product history.

Login Credentials for Demo Test:

Username: saichandan

Password: sai123

**Live Demo:** [Frontend](https://inventory-management-system-122t.vercel.app/) | [Backend API](https://inventory-management-system-nzhf.onrender.com/)  
**GitHub Repository:** [https://github.com/Saichandanyadav/inventory-management-system](https://github.com/Saichandanyadav/inventory-management-system)

---

## 📁 Project Directory Layout

```

project-root/
│
├── backend/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── db/                  # Database initialization
│   │   ├── models/              # Database models (User, Product)
│   │   ├── routes/              # Express routes (authRoutes, productRoutes)
│   │   ├── controllers/         # Controller logic for routes
│   │   └── middleware/          # Middleware for authentication & validation
│   │
│   ├── server.js                # Main backend entry point
│   ├── .env                     # Environment variables
│   ├── package.json             # Backend dependencies & scripts
│   └── .gitignore               # Ignored files for backend
│
├── frontend/                    # Frontend (React + Tailwind)
│   ├── src/
│   │   ├── api/                 # Axios instance setup
│   │   ├── components/          # Reusable React components
│   │   ├── pages/               # Page-level components
│   │   ├── App.js               # Main React component
│   │   └── index.js             # Entry point
│   │
│   ├── public/
│   ├── package.json             # Frontend dependencies & scripts
│   ├── tailwind.config.js       # Tailwind configuration
│   └── postcss.config.js        # PostCSS setup
│
├── README.md                    # Project documentation (this file)
└── package-lock.json

````

---

## ⚙️ Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the backend server:

```bash
npm start
```

The backend runs at: [https://inventory-management-system-nzhf.onrender.com/](https://inventory-management-system-nzhf.onrender.com/)

---

## 💻 Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
REACT_APP_API_BASE_URL=https://inventory-management-system-nzhf.onrender.com/api
```

4. Start the React app:

```bash
npm start
```

The frontend runs at: [https://inventory-management-system-122t.vercel.app/](https://inventory-management-system-122t.vercel.app/)

---

## 🔐 Authentication

* Default Admin credentials are initialized automatically on first run.
* Admin can log in via the login page to access the dashboard.

---

## 📦 Import & Export

* **Import:** Upload a `.csv` file with product details.
* **Export:** Download all product records as a CSV file.

---

## 🧰 Tech Stack

**Frontend:** React, Tailwind CSS, Axios
**Backend:** Node.js, Express, SQLite, JWT, Multer
**Database:** SQLite (file-based, auto-created on startup)

---

## 🧑‍💻 Developer

**Sai Chandan Gundaboina**
Full Stack Developer | [LinkedIn](https://www.linkedin.com/in/saichandanyadav/)
GitHub: [https://github.com/Saichandanyadav/inventory-management-system](https://github.com/Saichandanyadav/inventory-management-system)
