# Research Management System (Publication System)

A web-based academic publication and research management platform built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, and **MySQL**. The system streamlines the workflow of submitting, reviewing, approving, and tracking academic research papers with role-based access control (RBAC).

---

## Tech Stack & Architecture

- **Frontend & Server Framework:** [Next.js 15.5.3](https://nextjs.org/) (App Router), [React 19.1.0](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss`
- **Database:** MySQL / MariaDB via [`mysql2/promise`](https://github.com/sidorares/node-mysql2)
- **Authentication & Security:** HTTP-only JWT cookies (`jsonwebtoken`), Password hashing with `bcrypt`

---

## User Roles & Permissions

| Role | Role Code (`user_type`) | Description & Permissions |
| :--- | :---: | :--- |
| **Guest / Public** | `N/A` | Browse approved articles, search and filter publications by title/type/category, read role-based manuals. |
| **Teacher** | `1` | Submit new research articles, edit/delete own draft articles, track status (`Pending`, `Revision`, `Approved`, `Rejected`), and view revision history & feedback. |
| **Staff** | `2` | Review submitted articles, update article review status, submit feedback/comments, and view statistical conclusion reports. |
| **Admin** | `3` | Full administrative access: Manage users (create, edit, delete, role assignment) and view system-wide user sign-in audit logs (`userlog`). |

---

## Test Accounts & Sample Credentials

The database seed (`database/research.sql`) includes pre-configured test accounts (hashed with bcrypt):

| Role | Email / Username | Password | Role Code (`user_type`) |
| :--- | :--- | :--- | :---: |
| **Teacher** | `Teacher@Teacher` | `123456` | `1` |
| **Staff** | `Staff@Staff` | `123456` | `2` |
| **Admin** | `Admin@Admin` | `123456` | `3` |

---

### Table Definitions

1. **`user`** — User account credentials and role assignments.
   - `user_id` (INT, Primary Key, Auto Increment)
   - `user_name` (VARCHAR 50, Not Null)
   - `user_password` (VARCHAR 500, Not Null, bcrypt hash)
   - `user_email` (VARCHAR 50, Unique)
   - `user_type` (ENUM: `'1'`, `'2'`, `'3'`, Not Null)

2. **`article`** — Research articles and their publication status.
   - `article_id` (INT, Primary Key, Auto Increment)
   - `article_title` (VARCHAR 100, Not Null)
   - `article_category` (ENUM: `'Computer Science'`, `'Engineering'`, Not Null)
   - `article_link` (VARCHAR 100, Not Null)
   - `article_type` (ENUM: `'Research'`, `'Review'`, `'อื่นๆ'`, Not Null)
   - `article_date` (DATE, Not Null)
   - `article__status` (ENUM: `'Pending'`, `'Revision'`, `'Approved'`, `'Rejected'`, Not Null)

3. **`user_article`** — Junction table mapping articles to user ownership.
   - `user_id` (INT, Foreign Key -> `user.user_id`)
   - `article` (INT, Foreign Key -> `article.article_id`)
   - `is_owner` (ENUM: `'1'`, `'0'`, Not Null)

4. **`articlehistory`** — Audit history of article revisions and feedback records.
   - `A_id` (INT, Primary Key, Auto Increment)
   - `A_date` (DATETIME, Not Null)
   - `A_comment` (VARCHAR 300, Not Null)
   - `article_id` (INT, Foreign Key -> `article.article_id`)

5. **`notification`** — Reviewer comments and notifications linked to articles.
   - `n_id` (INT, Primary Key, Auto Increment)
   - `n_dare` (DATETIME, Not Null)
   - `n_comment` (VARCHAR 300, Not Null)
   - `user_id` (INT, Foreign Key -> `user.user_id`)
   - `article_id` (INT, Foreign Key -> `article.article_id`)

6. **`userlog`** — User sign-in timestamp logs.
   - `u_id` (INT, Primary Key, Auto Increment)
   - `u_date` (DATETIME, Not Null)
   - `user_id` (INT, Foreign Key -> `user.user_id`)

---

## Directory & File Structure

```text
├── .github/
│   └── copilot-instructions.md      # GitHub Copilot instructions & architectural notes
├── app/                             # Next.js App Router (UI Pages & API Handlers)
│   ├── api/                         # Backend REST API Handlers
│   │   ├── articles/                # Public approved articles endpoint (GET)
│   │   ├── conclusion/              # Staff conclusion & aggregate summary API (GET)
│   │   ├── history/                 # Admin user sign-in audit logs API (GET)
│   │   ├── login/                   # User authentication & JWT issuance (POST)
│   │   ├── logout/                  # User session logout & cookie removal (POST)
│   │   ├── me/                      # Current authenticated user session API (GET)
│   │   ├── myarticle/               # Teacher research articles API (GET)
│   │   │   ├── [id]/                # Article detail, update & delete API (GET, PUT, DELETE)
│   │   │   │   └── history/         # Article revision & feedback history API (GET)
│   │   │   ├── add/                 # Submit new research article API (POST)
│   │   │   └── enum/                # Categories and article type options API (GET)
│   │   ├── notification/            # Staff review articles list API (GET)
│   │   │   ├── [id]/                # Article review feedback & comment API (GET, POST)
│   │   │   └── status/              # Article status transition API (PUT)
│   │   ├── profile/                 # User profile info & update API (GET, PUT)
│   │   ├── register/                # Account registration API (POST)
│   │   ├── resetpassword/           # Password recovery API (POST)
│   │   └── useredit/                # Admin user CRUD API (GET, POST, PUT, DELETE)
│   ├── articles/                    # Public approved publications search & filter page
│   ├── category/                    # Category & publication type explorer page
│   ├── conclusion/                  # Staff statistical summary & reports dashboard page
│   ├── editUser/                    # Admin user management & RBAC configuration page
│   ├── history/                     # Admin system login audit log timeline page
│   ├── login/                       # User authentication & sign-in page
│   ├── manual/                      # Role-based system documentation viewer page
│   ├── myarticle/                   # Teacher submission & status tracking dashboard page
│   │   ├── [id]/
│   │   │   ├── edit/                # Article modification & re-submission page
│   │   │   └── history/             # Revision history & reviewer feedback timeline page
│   │   └── add/                     # New research article submission form page
│   ├── notification/                # Staff pending submissions review dashboard page
│   │   └── detail/
│   │       └── [id]/                # Individual submission review & feedback page
│   ├── register/                    # User account registration page
│   ├── resetpassword/               # Account password reset page
│   ├── users/                       # Current user profile management page
│   ├── favicon.ico                  # Application browser favicon
│   ├── globals.css                  # Global Tailwind CSS styles and theme variables
│   └── layout.js                    # Root application layout with responsive navigation
├── components/                      # Reusable React UI Components
│   ├── AddArticle.jsx               # Article creation form
│   ├── ArticleList.jsx              # Searchable & filterable public article list
│   ├── ConclusionList.jsx           # Staff summary & statistical reports view
│   ├── EditArticle.jsx              # Article editing form
│   ├── HistoryArticle.jsx           # Article revision history timeline
│   ├── HistoryTable.jsx             # Admin login audit log table
│   ├── LoginForm.jsx                # User login form
│   ├── ManageUser.jsx               # Admin user CRUD management interface
│   ├── Manual.jsx                   # Role-based manual viewer
│   ├── MyarticleList.jsx            # Teacher article management dashboard
│   ├── Navbar.jsx                   # Role-aware responsive navigation bar
│   ├── NotificationDetail.jsx       # Staff review submission & status change UI
│   ├── NotificationList.jsx         # Staff review overview list
│   ├── Profile.jsx                  # User profile update form
│   ├── RegisterForm.jsx             # New account registration form
│   └── ResetPasswordForm.jsx        # Password reset form
├── database/
│   └── research.sql                 # MySQL schema, relational constraints & seed data
├── lib/
│   ├── auth.js                      # JWT decoding & role-based route guard helpers
│   └── db.js                        # MySQL connection pool helper
├── public/                          # Static assets & user manuals
│   ├── manual/
│   │   └── instructions/            # Text manual guides loaded dynamically by role
│   │       ├── admin_history.txt    # Admin login history guide
│   │       ├── admin_useredit.txt   # Admin user management guide
│   │       ├── articles.txt         # General public articles guide
│   │       ├── staff_conclusion.txt # Staff conclusion reports guide
│   │       ├── staff_notification.txt# Staff review & feedback guide
│   │       └── teacher.txt          # Teacher submission guide
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── .env.local                       # Local environment variables (JWT_SECRET, APP_URL)
├── .gitignore                       # Git ignore patterns
├── eslint.config.mjs                # ESLint configuration
├── jsconfig.json                    # Path alias (`@/*`) and JS configuration
├── next.config.mjs                  # Next.js configuration
├── package.json                     # Project dependencies, scripts & metadata
├── package-lock.json                # npm dependency lockfile
└── postcss.config.mjs               # PostCSS / Tailwind CSS configuration
```

---

## Setup & Getting Started

### 1. Prerequisites
- **Node.js:** v18.18.0 or higher
- **MySQL / MariaDB:** Local instance or Docker container running on port `3306`

### 2. Database Setup
1. Create a MySQL database named `research`:
   ```sql
   CREATE DATABASE research;
   ```
2. Import the schema and seed data from [`database/research.sql`](database/research.sql):
   ```bash
   mysql -u root -p research < database/research.sql
   ```
3. Ensure database connection settings in [`lib/db.js`](lib/db.js) match your MySQL credentials:
   ```javascript
   export async function connect() {
     return await mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: '',
       database: 'research',
       port: 3306
     });
   }
   ```

### 3. Environment Variables
Create or verify `.env.local` in the project root:
```env
JWT_SECRET=your_super_secret_jwt_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Install Dependencies & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run ESLint check
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the application.
