# Ecommerce API - Project Documentation

## Project Overview
This is a modern, scalable E-commerce backend built using the **NestJS** framework. It provides a comprehensive set of features for managing products, categories, shopping carts, orders, and secure payments.

## Tech Stack
- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Authentication:** JWT (JSON Web Tokens) with `bcryptjs` for password hashing.
- **Payment Processing:** [Stripe API](https://stripe.com/)
- **Validation:** `class-validator` & `class-transformer`
- **Utilities:** Cookie-parser, Express-session, RxJS

---

## Folder Structure
The project follows a modular architecture as recommended by NestJS:

- `src/`
  - `modules/`: Contains all the domain-independent modules.
    - `Auth/`: User authentication, registration, and JWT guards.
    - `Category/`: Management of product categories.
    - `Product/`: Core catalog features (CRUD).
    - `Cart/`: Shopping cart management for users.
    - `Order/`: Processing of orders and transaction history.
    - `Payment/`: Stripe integration and webhook handling.
    - `User/`: User profile management.
  - `common/`: Shared decorators, filters, guards, and interceptors.
  - `types/`: Global TypeScript interfaces and types.
  - `main.ts`: Entry point of the application.
  - `app.module.ts`: Root module that aggregates all features.

---

## Key Features

### 1. Authentication & Security
- Secure registration and login using JWT.
- Password encryption using `bcryptjs`.
- Protected routes using NestJS Guards.
- Cookie-based authentication support.

### 2. Product & Category Management
- Categorized product catalog.
- Product details including price, descriptions, and stock management.

### 3. Shopping Cart & Orders
- Persistence of user carts.
- Transition from cart to order.
- Order status tracking.

### 4. Payments Integration
- Secure checkout process via Stripe.
- Webhook support for handling asynchronous payment events (e.g., payment success/failure).

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL
- Stripe Account (for payment features)

### Installation
```bash
$ npm install
```

### Environment Setup
Create a `.env` file in the root directory and populate it with the following variables:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASS=your_password
DB_NAME=ecommerce_db
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
```

### Running the App
```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

---

## API Endpoints Reference

### 🔐 Authentication (`/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user account |
| `POST` | `/auth/login` | Authenticate and get JWT tokens |
| `POST` | `/auth/refresh-token` | Refresh access token via cookie |

### 🛒 Shopping Cart (`/cart`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/cart` | Retrieve current user's cart |
| `POST` | `/cart/items` | Add product to cart |
| `PATCH` | `/cart/items/:productId` | Update item quantity |
| `DELETE` | `/cart/items/:productId` | Remove item from cart |

### 📦 Products & Categories
**Products (`/products`)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/products` | List products (filterable) |
| `GET` | `/products/:id` | Get product details |
| `POST` | `/products` | Create a new product |

**Categories (`/categories`)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/categories` | List all categories |
| `POST` | `/categories` | Create a new category |

### 🧾 Orders & Payments
**Orders (`/orders`)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/orders` | Create order from cart |
| `GET` | `/orders` | List user orders |
| `GET` | `/orders/:id` | Get specific order info |

**Payments (`/payments`)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/payments/my` | List user payments |
| `GET` | `/payments/:id` | Get payment details |
| `POST` | `/payments/checkout` | Create Stripe session |

**Webhooks**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/stripe-webhooks` | Handle Stripe events |

### 👤 User Profile (`/users`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/users/me` | Get current user's profile |
| `PATCH` | `/users/me` | Update profile info |

---

## Development Standards
- **Linting:** Standard NestJS ESLint configuration.
- **Formatting:** Prettier for consistent code style.
- **Validation:** All inputs are validated at the entry point using `ValidationPipe`.
