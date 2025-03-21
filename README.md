# Ecommerce Platform

## 🛒 Overview
This is a full-featured eCommerce platform built using the **MERN stack** (MongoDB, Express.js, React, and Node.js). It supports product management, user authentication, shopping cart functionality, and secure checkout.

## 🚀 Features
- **User Authentication** (JWT-based login/register, Google & Facebook OAuth)
- **Product Management** (Upload, edit, delete, search, filter, paginate)
- **Shopping Cart** (Add, remove, update quantities, apply discounts)
- **Checkout Process** (Billing details, simulated payments)
- **Order Management** (Track orders, manage shipments)
- **Cloud Storage** (Product images stored on Cloudinary)

## 🏗️ Tech Stack
- **Frontend:** React.js, Redux Toolkit, Material UI
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, Google OAuth, Facebook OAuth
- **Storage:** Cloudinary for images
- **State Management:** Redux Toolkit

## 📂 Project Structure
```
/ecommerce
│── /backend
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env (ignored)
│   ├── .gitignore
│
│── /frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── App.js
│   ├── .env (ignored)
│
│── .gitignore
│── package.json
│── README.md
```

## 📦 Installation
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/ecommerce.git
cd ecommerce
```

### 2️⃣ Backend Setup
```sh
cd backend
npm install
```
Create a **.env** file in `backend/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```
Start the backend:
```sh
npm run dev
```

### 3️⃣ Frontend Setup
```sh
cd ../frontend
npm install
npm start
```

## ⚡ API Endpoints
### **Authentication**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/facebook` - Facebook OAuth login

### **Products**
- `GET /api/products` - Get all products
- `POST /api/products` - Add a new product (Admin only)
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### **Cart & Orders**
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get user's cart
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/orders` - Place an order
- `GET /api/orders/:userId` - Get user orders

## 🛠️ Development & Contribution
Want to contribute? Follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to your fork: `git push origin feature-branch-name`
5. Open a Pull Request.

## 📜 License
This project is open-source under the **MIT License**.

now 