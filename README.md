# BiteRush – Food Delivery Platform

Welcome to **BiteRush**, a fast and convenient food delivery platform designed for modern businesses and everyday users. BiteRush enables browsing restaurants and menus, adding items to a cart, managing payment methods, placing orders, and canceling orders with proper Role-Based Access Control (RBAC) and Context-Based Access Control (CBAC).

### [Visit the Deployed App](https://bite-rush-client.vercel.app)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Pre-Created Test Accounts](#pre-created-test-accounts)
- [User Creation](#user-creation)
- [Installation & Setup](#installation--setup)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Browse Restaurants & Menus**  
- **Shopping Cart & Orders**  
- **Payment Methods**  
- **Role Based Access Control & Country Based Access Control**  

- **Pre-Created Test Accounts:**  
  - **admin.nick@biterush.com** - ADMIN - GLOBAL  
  - **manager.marvel.india@biterush.com** - MANAGER - INDIA  
  - **manager.captain.america@biterush.com** - MANAGER - AMERICA  
  - **member.travis.america@biterush.com** - MEMBER - AMERICA  
  - **member.thanos.india@biterush.com** - MEMBER - INDIA  
  - **member.thor.india@biterush.com** - MEMBER - INDIA  
  - _Password for all accounts: `password`_

- **User Creation:**  
  New users are created via the backend API. To create a new user, visit the API documentation at your backend URL (e.g. `<BACKEND_URL>/api/docs`) and use the **CREATE USER** endpoint.

---

## Tech Stack

- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Forms & Validation:** React Hook Form, Zod
- **State Management:** React Context
- **Package Manager:** Yarn
- **Deployment:**  Vercel
---

## How It Works

1. **Browsing Restaurants & Menus:**  
   Users can browse restaurants (filtered by their country unless they are an ADMIN who sees GLOBAL listings). Each restaurant page displays detailed information and menu items.

2. **Shopping Cart & Orders:**  
   - Adding an item to the cart creates a new order or updates an existing order in CART status.  
   - Order items can be increased (via the add-item endpoint) or decreased (via the decrease endpoint).  
   - When an order item’s quantity reaches zero, it is removed from the order. If the order becomes empty, it is cleared.  
   - Only orders with status **PLACED** appear in the order history. Orders in CART remain in localStorage until finalized.

3. **Payment Methods:**  
   - Users can add and update their payment methods.  
   - Card numbers are formatted and stripped of spaces before being sent to the backend.  
   - Users can set a payment method as the default option.

4. **RBAC & CBAC:**  
   - Role-based and country-based access control ensure that only authorized users can perform specific actions (e.g., placing orders, updating payment methods, etc.).  
   - Pre-created test accounts allow you to experience the app from different user perspectives.

5. **User Sessions & Authentication:**  
   - Users log in to access the app. Authentication is managed through JWTs with refresh tokens stored in localStorage.  
   - In production, use pre-created accounts for testing and use the backend API to create new users when necessary.

---

## Installation & Setup

### Frontend (Next.js)
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/bite-rush-client.git
   cd bite-rush-client

2. **Install Dependencies:**
   ```bash
      yarn install

3. **Add env variables:**
    ```bash
       NEXT_PUBLIC_API_BASE_URL=<YOUR_API_URL>

4. **Start the development server:**
   ```bash
      yarn dev
