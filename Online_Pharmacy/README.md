# Online Pharmacy Frontend

A modern React application for an online pharmacy platform that allows users to browse products, manage their cart, and complete pharmaceutical purchases.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [File Structure](#file-structure)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Routes & Components](#routes--components)
- [Context API](#context-api)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [License](#license)

## 🔍 Project Overview

This is the frontend application for an Online Pharmacy system that provides a user-friendly interface for customers to browse medications, add items to cart, manage their orders, and complete checkout processes with integrated payment solutions.

## 📁 File Structure

```
src/
├── assets/               # Static assets like images
├── components/
│   └── Route/            # Route components
│       ├── AdminDashboard.jsx
│       ├── AI_Bot.jsx
│       ├── Cart.jsx
│       ├── CheckoutPage.jsx
│       ├── Dashboard.jsx
│       ├── Footer.jsx
│       ├── Home.jsx
│       ├── Login.jsx
│       ├── Navbar.jsx
│       ├── NotAdmin.jsx
│       ├── OrderStatus.jsx
│       ├── ProtectedRoutes.jsx
│       ├── Signup.jsx
│       └── UUpload.jsx
│   └── context/          # React Context API
│       ├── CartContext.jsx
│       └── UserContext.jsx
├── Admin.txt             # Admin documentation
├── App.css               # Global styles
├── App.jsx               # Main application component
├── DATA.json             # Mock/sample data
├── index.css             # Entry point styles
├── main.jsx              # Entry point
├── .gitignore            # Git ignore file
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── package-lock.json     # Dependency lock file
├── package.json          # Project dependencies and scripts
├── README.md             # Project documentation
└── vite.config.js        # Vite configuration
```

## ✨ Features

- User authentication (signup, login)
- Product browsing and search
- Shopping cart management
- Order processing and tracking
- Admin dashboard for inventory management
- Responsive design for mobile and desktop
- Secure payment processing with Razorpay
- AI-powered chatbot for customer assistance

## 🛠️ Technologies

- **Framework**: React.js
- **Build Tool**: Vite
- **UI Library**: Chakra UI
- **State Management**: Context API
- **Routing**: React Router
- **HTTP Client**: Axios
- **Payment Gateway**: Razorpay
- **Deployment**: Netlify

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HimanshuRajputt/Online-Pharmacy
   cd online-pharmacy-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables file (see [Environment Variables](#environment-variables))

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=https://onlin-pharmacy-backend.onrender.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 🧩 Routes & Components

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home.jsx` | Landing page with featured products |
| `/login` | `Login.jsx` | User authentication |
| `/signup` | `Signup.jsx` | New user registration |
| `/dashboard` | `Dashboard.jsx` | User dashboard (protected) |
| `/cart` | `Cart.jsx` | Shopping cart management |
| `/checkout` | `CheckoutPage.jsx` | Checkout process |
| `/order-status` | `OrderStatus.jsx` | Order tracking |
| `/admin` | `AdminDashboard.jsx` | Admin panel (admin only) |
| `/upload` | `UUpload.jsx` | Product Priscription |

## 🔄 Context API

The application uses React Context API for state management:

- **UserContext**: Manages user authentication state, login/logout functionality
- **CartContext**: Handles shopping cart operations (add, remove, update items)

## 🔒 Authentication

Authentication is implemented using JWT (JSON Web Tokens):

1. Tokens are stored in localStorage upon successful login
2. Protected routes check for valid tokens before rendering
3. Admin routes have additional role verification
4. Automatic logout on token expiration

## 🌐 Deployment

The frontend application is deployed on Netlify:
- Live URL: [Online Pharmacy](https://symphonious-paletas-1640f0.netlify.app/)


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔗 Related Projects

- [Online Pharmacy Backend](https://onlin-pharmacy-backend.onrender.com) - Backend API for this application
