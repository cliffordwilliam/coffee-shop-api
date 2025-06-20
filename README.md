# ☕ Coffee Shop API

## 📘 Description

The Coffee Shop API is a backend project built with TypeScript and Express.js, developed for my portfolio. It demonstrates my understanding of building modern backend applications using a relational database, Docker, and code-first ORM practices. This project serves as a solid foundation for scaling into more complex systems.

---

## 📄 Documents

### 📝 Product Requirements

* [Coffee Management PRD]()

### 🏗 Architecture, Design, and Implementation

* [Architecture Document]()
* [Design Document]()
* [Implementation Document]()

### 🧠 Master Planning

* [Master Document]()

---

## ⚙️ Technology Stack

* **Language**: TypeScript
* **Framework**: Express.js
* **Database**: PostgreSQL (via Docker)
* **ORM**: Prisma
* **DevOps**: Docker & Docker Compose
* **Package Manager**: npm

---

## 🚀 Getting Started

### 📋 Prerequisites

* [Node.js](https://nodejs.org/en/) v20.x (install via [nvm](https://github.com/nvm-sh/nvm))
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)
* Git

> ⚠️ **Important**:
> This app uses a Docker container named `postgres` for its database.
> If a container with that name already exists (even stopped), the setup will fail.
> Remove or rename any existing `postgres` containers before running the script.

#### 👤 Docker Group Access

> 🛑 **Linux users:**
> This project assumes your user is in the `docker` group.

The `./local-start.sh` script uses Docker and Node.js via `nvm`. Running it with `sudo` breaks `nvm`, and prompting for `sudo` on every Docker call is disruptive.

While adding your user to the `docker` group is a known security risk (it grants root-level access), it’s a common tradeoff most developers accept for convenience in local development.

👉 [Docker Post-install Instructions](https://docs.docker.com/engine/install/linux-postinstall/)

---

### 🧠 Managing Node.js Versions

If your system comes with an older Node.js version, use `nvm` to avoid system conflicts:

```bash
nvm install 20
nvm use 20
```

---

### 🛠 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/cliffordwilliam/coffee-shop-api.git
   cd coffee-shop-api
   git checkout main
   ```

2. **Run the local setup script:**

   ```bash
   ./local-start.sh
   ```

   This script will:

   * Warn if the `postgres` container is already in use

   * Validate all prerequisites (Docker, Node, etc.)

   * Auto-copy `.env.example` to `.env` if missing

   * Start PostgreSQL using Docker Compose

   * Wait until the DB is ready

   * Push the Prisma schema

   * Generate the Prisma client

   * Seed the database

   * Start the development server

   > 🌐 Your API server will be running at: [http://localhost:3000](http://localhost:3000)

---

## 🛢 Database Access

If you want to inspect the database manually (e.g. via a GUI like TablePlus, pgAdmin, or Postico), you can connect using:

* **Host**: `localhost`
* **Port**: `5432` (or your configured port)
* **Username**: `postgres`
* **Password**: (check your `.env` file)
* **Database**: `coffee-shop-api`

---

## 🔀 Git Workflow

1. Create a new branch from `main`.
2. Use descriptive branch names, prefixed by the type of work:

   * `feat/`: New features
   * `fix/`: Bug fixes
   * `chore/`: Tooling or config changes
   * `docs/`: Documentation updates
     (See [contributing.md]() for full details.)
3. Open pull requests to `main`.
4. Ensure all tests and checks pass.
5. Use **Squash Merge** for a clean commit history.

---

## 📁 Project Structure

```
src/                      # Main Express.js TypeScript app
├── routes/               # API route handlers
├── prisma/               # Prisma schema and migrations
├── middlewares/          # Express middleware
├── utils/                # Utility functions
└── index.ts              # Entry point

.env.example              # Sample environment configuration
local-start.sh            # Automated setup script
```

---

## 📚 API Documentation

If using Swagger or similar, link it here.
Otherwise:

```
Base URL: http://localhost:3000
```

> Consider integrating Swagger or Postman collection if you'd like to document endpoints.

---

## 📄 License

[MIT](./LICENSE)

