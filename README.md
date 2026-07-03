# ✨ Prisma Press Blog API ✨

A feature-rich, high-performance, and secure backend RESTful API built for a modern blogging platform. It supports subscription monetization, automated comment moderation, role-based access control (RBAC), analytical dashboards, and persistent action logging.

---

## 🚀 Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **ORM:** [Prisma ORM](https://www.prisma.io/) (PostgreSQL Database)
- **Payment Gateway:** [Stripe API](https://stripe.com/) (Subscription Billing + Webhooks)
- **Authentication:** JWT (JSON Web Tokens) with Secure HttpOnly Cookies
- **Security:** BcryptJS (Password hashing), CORS, and Global Error Middleware

---

## ✨ Key Features

- 👤 **Role-Based Authentication (RBAC):** Supports `USER`, `AUTHOR`, and `ADMIN` roles. Custom authentication middleware protects endpoints based on these system-wide privileges.
- 📝 **Rich Content Management:** Full CRUD operations for blog posts supporting featured flags, post-view increments, and statuses (`DRAFT`, `PUBLISHED`, `ARCHIVED`).
- 💎 **Premium Paywall:** Exclusive `isPremium` posts that are visible only to active Stripe subscribers. Non-premium users are restricted from reading or publishing premium content.
- 💳 **Stripe Subscription Billing:** Streamlined Stripe checkout session creation. Fully integrated Stripe Webhooks seamlessly handle automated subscription status changes (`ACTIVE`, `CANCELED`, `EXPIRED`).
- 💬 **Interactive Comment Section:** Create comments on posts. Admins can moderate comment status (`APPROVED`, `REJECT`) to protect against inappropriate behavior.
- 📊 **Analytical Stats Dashboard:** Admin-only statistics tracking total/published/draft/archived post counts, comment approval ratios, and post view metrics (total, maximum, and average views) using high-integrity database transactions.
- 🪵 **Deleted User Archive Logs:** Custom tabular log generation (`logs/deleted-users.txt`) tracking deleted user data, auto-incrementing serial IDs, and execution timestamps for secure administrative auditing.
- 🛠️ **Robust Architecture:** Complete database transactional safety, modular routes, global error boundary handler, and precise TS typing.

---

## 💾 Database Schema Design

This project uses **Prisma's Multi-Schema** feature to divide models into logical blocks (`prisma/schema/`):

```
prisma/schema/
├── schema.prisma         # Base Database Configuration
├── user.prisma           # User Model Definition
├── profile.prisma        # User Profile Model Definition
├── post.prisma           # Post Model Definition
├── comment.prisma        # Comment Model Definition
├── subscription.prisma   # Stripe Subscription Model Definition
└── enum.prisma           # Global Enums (Role, PostStatus, SubscriptionStatus, etc.)
```

### 📊 Relationships Map

```
  ┌──────────────┐                 ┌──────────────┐
  │     User     │◄─ 1 : 1 (Cas) ─►│   Profile    │
  └──────┬───────┘                 └──────────────┘
         │
         ├─ 1 : 1 (Cas) ─► [ Subscription ] (Stripe status details)
         │
         ├─ 1 : N (Cas) ─► [ Post ] ── 1 : N (Cas) ─► [ Comment ]
         │                                                 ▲
         └───────── 1 : N (Cascade deletion) ──────────────┘
```

---

## 📍 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Logs in a user, returning a JWT access token in the body and a refresh token in secure cookies. |
| `POST` | `/api/auth/refresh-token` | Public | Exchanges a valid cookie-bound refresh token for a new short-lived access token. |

---

### 👤 User Profiles (`/api/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Public | Registers a new user and automatically spins up their connected `Profile`. |
| `GET` | `/api/users/me` | `ADMIN`, `AUTHOR`, `USER` | Retrieves the currently authenticated user's own profile and subscription state. |
| `GET` | `/api/users` | `ADMIN` | Fetches all registered users (supports query filtering by `emails`, `role`, and `year`). |
| `PATCH` | `/api/users/my-profile` | `ADMIN`, `AUTHOR`, `USER` | Updates the logged-in user's name, profile photo, and bio. |
| `PATCH` | `/api/users/:id` | `ADMIN` | Admin endpoint to edit user attributes (e.g. `role`, `activeStatus`). |
| `DELETE` | `/api/users/delete-many` | `ADMIN` | Deletes a batch of users by IDs, archiving details into `deleted-users.txt`. |
| `DELETE` | `/api/users/:id` | `ADMIN` | Deletes a single user by ID, appending details to `deleted-users.txt`. |

---

### 📝 Posts (`/api/posts`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/posts` | `ADMIN`, `AUTHOR`, `USER` | Creates a new blog post. Requires an active Subscription if `isPremium` is set to `true`. |
| `GET` | `/api/posts` | Public | Retrieves all non-premium posts with advanced filtering (`searchTerm`, `title`, `authorId`, `tags`, `status`, `isFeatured`), paging, and sorting. |
| `GET` | `/api/posts/stats` | `ADMIN` | Aggregates database-wide post counts and view statistics using transaction guarantees. |
| `GET` | `/api/posts/my-posts` | `ADMIN`, `AUTHOR`, `USER` | Retrieves posts authored by the logged-in user. |
| `GET` | `/api/posts/:postId` | Public | Retrieves a non-premium post by its ID and increments its view count atomically. Includes its approved comments. |
| `PATCH` | `/api/posts/:postId` | `ADMIN`, `AUTHOR`, `USER` | Updates an existing post. Only the post author or an Admin can execute. |
| `DELETE` | `/api/posts/:postId` | `ADMIN`, `AUTHOR`, `USER` | Deletes a post. Only the post author or an Admin can execute. |

---

### 💬 Comments (`/api/comments`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/comments` | `ADMIN`, `AUTHOR`, `USER` | Creates a new comment under a specific blog post. |
| `GET` | `/api/comments/author/:authorId`| Public | Fetches all comments authored by a specific user. |
| `GET` | `/api/comments/:commentId` | Public | Retrieves a single comment by its unique ID. |
| `PATCH` | `/api/comments/:commentId` | `ADMIN`, `AUTHOR`, `USER` | Updates comment content. Restricted to the comment author or Admins. |
| `DELETE` | `/api/comments/:commentId` | `ADMIN`, `AUTHOR`, `USER` | Removes a comment. Restricted to the comment author or Admins. |
| `PATCH`| `/api/comments/:commentId/moderate` | `ADMIN` | Allows moderators to change comment status (`APPROVED`, `REJECT`). |

---

### 💳 Stripe Subscription Billing (`/api/subscription`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/subscription/checkout` | `ADMIN`, `AUTHOR`, `USER` | Spins up a Stripe Checkout Session and returns a secure payment URL. |
| `POST` | `/api/subscription/webhook` | Stripe Webhook | Receives events from Stripe (`checkout.session.completed`, `customer.subscription.updated`, etc.) to update local database states. |
| `GET` | `/api/subscription/status` | `ADMIN`, `AUTHOR`, `USER` | Returns current subscription status and subscription end date. |

---

### 💎 Premium Access (`/api/premium`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/premium/posts` | `ADMIN`, `AUTHOR`, `USER` | Fetches all premium-only blog posts. Protected by `premiumGuard` (only active subscribers). |

---

## 🪵 Custom Archive Logging

When users are deleted (individually or in batches), the application appends details to `logs/deleted-users.txt` using a beautifully structured tabular layout:

```
SL  | Name                 | Email                     | Role    | Deleted Time
----|----------------------|---------------------------|---------|--------------------------
1   | John Doe             | john@example.com          | USER    | 7/3/2026, 2:30:15 PM
2   | Jane Author          | jane@domain.com           | AUTHOR  | 7/3/2026, 3:45:02 PM
```

---

## 💻 Local Installation & Setup

Follow these steps to run the Prisma Press Blog API locally:

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd prisma_press_blog
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5420/prisma_press_blog?schema=public"

PORT=5000
APP_URL="http://localhost:5000"

BCRYPT_SALT_ROUNDS=12

JWT_ACCESS_SECRET="your_jwt_access_secret_key"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="30d"

STRIPE_PRODUCT_PRICE_ID="price_xxxxxx"
STRIPE_SECRET_KEY="sk_test_xxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxx"
```

### 3. Database Migration & Client Generation
Ensure your PostgreSQL database is running, then apply migrations and generate the client:
```bash
# Push database changes and apply migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### 4. Running the Server

#### Development Mode (Fast watch with TSX)
```bash
npm run dev
```

#### Production Build & Run
```bash
npm run build
npm run start
```

---

## 💳 Stripe Webhook Configuration

To receive subscription lifecycle updates from Stripe locally, use the Stripe CLI:

1. **Install Stripe CLI** and login:
   ```bash
   stripe login
   ```
2. **Forward Webhook Events** to your local server:
   ```bash
   npm run stripe:webhook
   ```
3. Copy the webhook signing secret displayed by the Stripe CLI (it starts with `whsec_`) and set it as your `STRIPE_WEBHOOK_SECRET` in your `.env` file.

---

## 📄 License

This project is licensed under the **ISC License**. Feel free to use and adapt it for your own blogging platforms!
