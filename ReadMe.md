# 🚂 ChuppaChup Train Booking System

Welcome to the **ChuppaChup Train** repository! This is a full-stack web application designed for booking eco-friendly train tickets across Poland. It features a modern, responsive user interface and a robust backend API.

## 🛠 Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS (Styling)
* React Router DOM (Navigation)
* Axios (API requests)
* Lucide React (Icons)

**Backend:**
* Node.js & Express.js
* MongoDB (Atlas) & Mongoose
* JSON Web Token (JWT) for Authentication
* bcryptjs for password hashing

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16.x or higher)
* [Git](https://git-scm.com/)
* A MongoDB Atlas account (or local MongoDB server)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd chuppachup-train

2. Backend Setup
Open a terminal and navigate to the backend folder:

Bash
cd backend
npm install

3. Frontend Setup
Open a new terminal window and navigate to the frontend folder:

Bash
cd frontend
npm install

🏃‍♂️ Running the Application
To run the application, you need to start both the backend server and the frontend development server simultaneously.

Terminal 1 (Backend):

Bash
cd backend
npm run dev
# Server will run on http://localhost:5000
Terminal 2 (Frontend):

Bash
cd frontend
npm run dev
# App will run on http://localhost:5173

👑 Admin Access
If you have run the seedAdmin.js script, you can access the Admin Dashboard by navigating to http://localhost:5173/admin after logging in with the following credentials:

Email: admin@gmail.com

Password: 123456

(Please remember to change this password in a production environment!)

📁 Project Structure
Plaintext
chuppachup-train/
├── backend/               # Express server & APIs
│   ├── config/            # Database configuration
│   ├── middleware/        # JWT & Admin protection
│   ├── models/            # Mongoose schemas (User, Train, Station)
│   ├── routes/            # API endpoints
│   ├── server.js          # Entry point
│   └── seed*.js           # Database population scripts
│
└── frontend/              # React client
    ├── src/
    │   ├── components/    # Reusable UI components (Admin, Buttons, Inputs)
    │   ├── pages/         # Main views (Home, Login, SearchResults, Checkout)
    │   ├── App.jsx        # Routing configuration
    │   └── main.jsx       # React entry point
    └── tailwind.config.js # Tailwind CSS configuration