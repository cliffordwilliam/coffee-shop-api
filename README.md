# ☕ Coffee Shop API

## 📘 Description

The Coffee Shop API is a backend project built with TypeScript and Express.js, developed for my portfolio. It demonstrates my understanding of building modern backend applications using a relational database, Docker, and code-first ORM practices. This project serves as a solid foundation for scaling into more complex systems.

---

## ⚙️ Technology Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma
- **DevOps**: Docker & Docker Compose
- **Package Manager**: npm

---

## 🚀 Getting Started

### 📋 Prerequisites

- [Node.js](https://nodejs.org/en/) v20.x (install via [nvm](https://github.com/nvm-sh/nvm))
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Git

> ⚠️ **Important:**
> This app uses Docker containers named:
>
> - `coffee_shop_postgres` (PostgreSQL)
> - `coffee_shop_api` (App container — only in full Docker mode)
>
> If containers with these names already exist (even stopped), the setup will fail.
> Please remove or rename them before running either setup script.

---

### 👤 Docker Group Access (Linux users)

> 🐧 **Heads up:**
> This project assumes your user is in the `docker` group.

The setup scripts (`./local-start-dev.sh` and `./local-start-dev-full.sh`) interact with Docker **without `sudo`**. However:

- Running the script with `sudo` will break `nvm` (Node Version Manager)
- Running Docker commands without being in the `docker` group may fail or prompt repeatedly

To fix this:

👉 [Follow Docker’s official post-install guide](https://docs.docker.com/engine/install/linux-postinstall/) to add your user to the `docker` group and restart your session.

> ⚠️ **Security Note:** Adding a user to the `docker` group grants root-level access to your system. This is common in local dev environments, but use caution on shared or production machines.

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

2. **Choose your development mode:**

---

#### 🧪 Option 1: Run Locally (Node + Docker PostgreSQL)

```bash
./local-start-dev.sh
```

This script will:

- Warn if a Docker container named `coffee_shop_postgres` already exists (even if stopped)

- Validate all prerequisites:
  - Docker and Docker Compose
  - Node.js v20 (via NVM)
  - Internet connectivity

- Auto-copy `.env.example` to `.env` if missing

- Install Node.js dependencies via `npm install`

- Start **PostgreSQL** using `docker-compose.dev.yaml`

- Wait until PostgreSQL is ready to accept connections

- Run Prisma commands:
  - Push schema: `npx prisma db push`
  - Generate client: `npx prisma generate`
  - Seed data: `npx prisma db seed`

- Start the dev server in the background: `npm run dev`

> 🌐 Your API will be live at: [http://localhost:3000](http://localhost:3000)

> 🛑 Press `Ctrl + C` to stop the server and trigger automatic cleanup

---

#### 🐳 Option 2: Run Fully in Docker (App + PostgreSQL)

```bash
./local-start-dev-full.sh
```

This script will:

- Warn if containers `coffee_shop_postgres` or `coffee_shop_api` already exist (even stopped)

- Validate all prerequisites:
  - Docker and Docker Compose

- Auto-copy `.env.example` to `.env` if missing

- Start **both** the app and database using `docker-compose.dev.full.yaml`

- Wait until PostgreSQL is ready to accept connections

- Run Prisma commands _inside the app container_:
  - Push schema
  - Generate client
  - Seed data

- Attach to container logs for live output

> 🌐 Your API will be live at: [http://localhost:3000](http://localhost:3000)

> 🛑 Press `Ctrl + C` to stop containers and clean up resources

---

## 🛢 Database Access

If you want to inspect the database manually (e.g. via a GUI like TablePlus, pgAdmin, or Postico), you can connect using:

- **Host**: `localhost`
- **Port**: `5432` (or your configured port)
- **Username**: `postgres`
- **Password**: (check your `.env` file)
- **Database**: `coffee-shop-api`

---

## 🔀 Git Workflow

1. Create a new branch from `main`.
2. Use descriptive branch names, prefixed by the type of work:
   - `feat/`: New features
   - `fix/`: Bug fixes
   - `chore/`: Tooling or config changes
   - `docs/`: Documentation updates
3. Open pull requests to `main`.
4. Ensure all tests and checks pass.
5. Use **Squash Merge** for a clean commit history.

---

## 📁 Project Structure

```
src/                         # Main Express.js (TypeScript) application
├── config/                  # Environment variable handling (dotenv validator, etc.)
│   └── env.ts
├── lib/                     # Shared service instances (e.g. Prisma, Redis, etc.)
│   └── prisma.ts
├── middlewares/             # Global/reusable Express middleware
│   ├── errorHandler.ts          # Centralized error-handling middleware
│   └── validate.ts              # Zod validation middleware
├── modules/                 # Domain-driven feature modules (1 folder per domain/resource)
│   ├── {module}/                # Replace with actual domain (e.g. coffee, user, order)
│   │   ├── {module}.route.ts       # HTTP route definitions
│   │   ├── {module}.controller.ts  # Request/response logic
│   │   ├── {module}.service.ts     # Low-level DB logic (calls Prisma or other data sources)
│   │   ├── {module}.model.ts       # Zod schemas, DTOs, and types
│   │   └── useCases/               # Application logic coordinating services (business use cases)
│   │       └── *.ts
│   └── api/                     # Shared API concerns (errors, response types, etc.)
│       ├── ApiError.ts             # Base custom error class
│       ├── InvalidStatusError.ts   # Specific error: 400 Bad Request
│       ├── NotFoundError.ts        # Specific error: 404 Not Found
│       ├── errorCodes.ts           # Centralized error code constants
│       └── types.ts                # API response types (SuccessResponse, ErrorResponse)
└── index.ts                 # Application entry point (Express setup)
```

### Top-level Files

```
prisma/                      # Prisma schema, migrations, and seed scripts
├── schema.prisma
└── seed.ts

generated/                   # Auto-generated Prisma client files

.env.example                 # Sample env config for dev onboarding
Dockerfile.dev               # Dockerfile for local dev environment
docker-compose.dev.yaml      # PostgreSQL container only
docker-compose.dev.full.yaml # Full stack: App + DB

local-start-dev.sh           # Starts local app with Dockerized DB
local-start-dev-full.sh      # Starts app + DB in Docker
README.md                    # Project documentation
package.json                 # NPM metadata and scripts
tsconfig.json                # TypeScript config
```

---

## 📚 API Documentation

Interactive API documentation is available at:

📄 Docs URL: http://localhost:3000/api-docs  
🔗 Base URL: http://localhost:3000

> The documentation is powered by Swagger UI and generated from an OpenAPI specification located in `docs/openapi.yaml`.

---

## 📄 License

[MIT](./LICENSE)
