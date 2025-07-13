# ☕ Coffee Shop API

## 📘 Description

The Coffee Shop API is a backend project for an e-commerce coffee store, built using TypeScript and Express.js. Created for my developer portfolio, it demonstrates my ability to build scalable backend systems with modern web technologies.

This project highlights key backend engineering skills, including:

- Designing and implementing RESTful APIs
- Modeling real-world business requirements using PostgreSQL
- Managing data and migrations with Prisma ORM
- Containerizing development and deployment using Docker

It simulates a realistic scenario with products, customers, orders, and payments—laying the groundwork for more complex backend systems in production environments.

---

## ⚙️ Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma
- **DevOps**: Docker & Docker Compose
- **Package Manager**: npm

---

## 🚀 Getting Started

### 📋 Prerequisites

- [Node.js](https://nodejs.org/en/) v20.x (recommended to install via [nvm](https://github.com/nvm-sh/nvm))
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Git

> ⚠️ **Important:**
> This project uses Docker containers named:
>
> - `coffee_shop_postgres` (PostgreSQL)
> - `coffee_shop_api` (API app container — used in full Docker mode)
>
> If containers with these names already exist (even if stopped), the setup will fail. Please remove or rename them before running either setup script.

---

### 👤 Docker Group Access (Linux Users)

> 🛑 **Note for Linux users:**
> This project assumes your user is in the `docker` group.

The `./local-start.sh` script uses Docker and Node.js via `nvm`. Running it with `sudo` will break `nvm` path resolution because it uses the root’s environment instead of your user’s. Also, constantly entering `sudo` for Docker is disruptive.

While adding your user to the `docker` group is a known security tradeoff (it effectively grants root access), it’s a common and accepted practice for local development.

👉 [Docker Post-install Instructions](https://docs.docker.com/engine/install/linux-postinstall/)

---

### 🧠 Managing Node.js Versions

If your system uses an older Node.js version, install and use the correct version via `nvm` to avoid conflicts:

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

2. **Choose a development mode:**

---

#### 🧪 Option 1: Run Locally (Node + Docker PostgreSQL)

```bash
./local-start.sh
```

This script will:

- Warn if a container named `coffee_shop_postgres` already exists
- Validate prerequisites:
  - Docker & Docker Compose
  - Node.js v20 (via NVM)
  - Internet connectivity

- Copy `.env.example` to `.env` if not present
- Install Node.js dependencies via `npm install`
- Start PostgreSQL via `docker-compose.yaml`
- Wait for PostgreSQL to be ready
- Run Prisma commands:
  - `npx prisma db push` — sync schema
  - `npx prisma generate` — generate Prisma client
  - `npx prisma db seed` — seed initial data

- Start the development server with `npm run dev`
- Print the API and Swagger Docs URL to the terminal

> 🛑 Press `Ctrl + C` to stop the server and trigger automatic cleanup

---

#### 🐳 Option 2: Run Fully in Docker (App + PostgreSQL)

```bash
./local-start-full.sh
```

This script will:

- Warn if `coffee_shop_postgres` or `coffee_shop_api` containers already exist
- Validate prerequisites:
  - Docker & Docker Compose

- Copy `.env.example` to `.env` if not present
- Launch both app and database using `docker-compose.full.yaml`
- Wait for PostgreSQL to become available
- Run Prisma commands **inside the app container**:
  - Push schema
  - Generate client
  - Seed database

- Stream logs from containers

> 🛑 Press `Ctrl + C` to stop and clean up containers

---

### 🧪 Unit Tests

Run unit tests with coverage:

```sh
npm test
```

---

## 🛢 Database Access

To inspect the database using a GUI (e.g., TablePlus, pgAdmin, Postico), use:

- **Host**: `localhost`
- **Port**: `5432` (or your custom port)
- **Username**: `postgres`
- **Password**: See your `.env` file
- **Database**: `coffee-shop-api`

---

## 🔀 Git Workflow

1. Create a new branch from `main`.
2. Use descriptive branch names with prefixes:
   - `feat/`: New features
   - `fix/`: Bug fixes
   - `chore/`: Tooling/config changes
   - `docs/`: Documentation updates
   - `ci/`: CI/CD changes

3. Open a pull request into `main`.
4. Ensure all tests pass: `npm test` and `npm run test:api`.
5. Use **Squash Merge** for a clean, linear commit history.

---

## 📁 Project Structure

```
project-root/
├── docker-compose.yaml             # Docker setup for PostgreSQL
├── docker-compose.full.yaml        # Full Docker setup (App + DB)
├── Dockerfile                      # API container definition
│
├── local-start.sh                  # Starts DB container (local dev)
├── local-start-full.sh             # Starts App + DB containers (full Docker)
│
├── package.json                    # Project metadata & scripts
├── package-lock.json               # Package lockfile
├── tsconfig.json                   # TypeScript configuration
├── jest.config.js                  # Jest test configuration
├── eslint.config.mjs              # ESLint configuration
├── README.md
├── LICENSE
├── TODO.md                         # Pending tasks and todos
│
├── prisma/
│   ├── schema.prisma               # Prisma schema definition
│   └── seed.ts                     # Seed data script
│
├── generated/
│   └── prisma/                     # Auto-generated Prisma client (DO NOT EDIT)
│       ├── *.js / *.d.ts          # Generated client files
│       ├── runtime/               # Prisma runtime internals
│       └── schema.prisma          # Copy of schema (auto-linked)
│
├── src/
│   ├── index.ts                    # App entry point
│   ├── config/
│   │   └── env.ts                  # Environment variable validation
│   ├── constants/
│   │   └── http.ts                # HTTP-related constants
│   ├── lib/
│   │   ├── logger.ts              # Logging utility
│   │   └── prisma.ts              # Prisma client singleton
│   ├── middlewares/
│   │   ├── errorHandler.ts        # Global error handler
│   │   └── validate.ts            # Request validation (Zod)
│   ├── modules/
│   │   ├── api/                   # Shared API logic & error handling
│   │   │   ├── ApiError.ts
│   │   │   ├── InvalidStatusError.ts
│   │   │   ├── NotFoundError.ts
│   │   │   ├── errorCodes.ts
│   │   │   └── schema.ts
│   │   ├── coffee/                # Coffee-related endpoints
│   │   │   ├── coffee.controller.ts
│   │   │   ├── coffee.route.ts
│   │   │   ├── coffee.schema.ts
│   │   │   └── coffee.service.ts
│   │   └── common/                # Shared schemas/utilities
│   │       └── common.schema.ts
│   ├── utils/
│   │   └── validateResponse.ts    # Zod response validation
│   └── swagger.ts                 # Swagger/OpenAPI setup
│
├── tests/
│   └── unit/
│       ├── coffee/
│       │   ├── coffee.schema.test.ts
│       │   └── coffee.service.test.ts
│       └── common/
│           └── common.schema.test.ts
│
├── postman/
│   ├── postman_collection.json     # Postman requests
│   └── postman_environment.json    # Postman environment vars
│
└── docs/
    ├── api-response-format.md      # API response contract
    └── erd.md                      # Entity Relationship Diagram
```

---

## 📚 API Documentation

Interactive documentation is available at:

📄 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

> Powered by Swagger UI. The OpenAPI spec is generated in-memory at runtime using `swagger-jsdoc` and `swagger-ui-express`.

---

## 🧪 Postman API Collection

Use the included Postman collection to run tests or manually interact with the API.

### 🧪 Newman CLI E2E Testing

1. Start the app (any mode)
2. Install Newman globally: `npm i -g newman`
3. Enter the postman directory
4. Run tests:

```bash
# Run only "Coffees" folder
newman run ./postman_collection.json \
  --folder "Coffees" \
  --environment ./postman_environment.json

# Or run all tests
newman run ./postman_collection.json \
  --environment ./postman_environment.json

# Or using an NPM script
npm run test:api
```

### 📂 Files

- `postman/coffee-shop-api.postman_collection.json` — All API endpoints and tests
- `postman/dev.postman_environment.json` — Environment config (e.g., `base_url`)

### 🚀 Using Postman

1. Open Postman
2. Import the collection and environment files
3. Set `dev` as the active environment
4. Start the server using a setup script
5. Send requests or run tests

> The `{{base_url}}` is set to `http://localhost:3000/api/v1`

---

## 📄 License

[MIT](./LICENSE)
