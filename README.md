🧩 Inventory Management System (IMS)

The Inventory Management System (IMS) is a full-stack web application designed to simplify and automate product inventory tracking.
It provides a clean dashboard where administrators can manage products, update stock, import/export product data, and maintain a clear product history log.

This project is built using:

React + Tailwind CSS (Frontend)

Node.js + Express + SQLite (Backend)

🔐 Demo Login Credentials

Use the following credentials to test the application:

Username: saichandan
Password: sai123

🚀 Live Demo

Frontend: https://inventory-management-system-122t.vercel.app/

Backend API: https://inventory-management-system-nzhf.onrender.com/

📦 Features
✅ User Authentication

Secure login using JWT

Demo admin user: rishitha

✅ Product Management

Add, update, delete products

View full product list

Track product quantity and price

✅ CSV Import/Export

Upload .csv file to bulk add/update inventory

Export full inventory data as .csv

✅ Product History Tracking

Records all past changes

Helps maintain transparency & audit logs

✅ Responsive UI

Tailwind CSS

Clean, modern, user-friendly dashboard

🧰 Tech Stack
Frontend

React

Tailwind CSS

Axios

Backend

Node.js

Express

SQLite

JWT Authentication

Multer (file upload)

Database

SQLite (auto-created file-based DB)

📁 Project Structure
project-root/
│
├── backend/
│   ├── src/
│   │   ├── db/                  
│   │   ├── models/              
│   │   ├── routes/              
│   │   ├── controllers/         
│   │   └── middleware/          
│   ├── server.js                
│   ├── .env                     
│   └── package.json             
│
├── frontend/
│   ├── src/
│   │   ├── api/                 
│   │   ├── components/          
│   │   ├── pages/               
│   │   ├── App.js               
│   │   └── index.js             
│   ├── public/
│   ├── package.json             
│   ├── tailwind.config.js       
│   └── postcss.config.js        
│
└── README.md

⚙️ Backend Setup
cd backend
npm install


Create a .env file:

JWT_SECRET=your_jwt_secret
PORT=5000


Start backend:

npm start

💻 Frontend Setup
cd frontend
npm install


Create .env file:

REACT_APP_API_BASE_URL=https://inventory-management-system-nzhf.onrender.com/api


Start frontend:

npm start

👩‍💻 Developer

Rishitha
Full Stack Developer

GitHub Repository:https://github.com/prishitha51-ctrl/Inventory-Management-System/tree/main

