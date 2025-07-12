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
./local-start.sh
```

This script will:

- Warn if a Docker container named `coffee_shop_postgres` already exists (even if stopped)

- Validate all prerequisites:
  - Docker and Docker Compose
  - Node.js v20 (via NVM)
  - Internet connectivity

- Auto-copy `.env.example` to `.env` if missing

- Install Node.js dependencies via `npm install`

- Start **PostgreSQL** using `docker-compose.yaml`

- Wait until PostgreSQL is ready to accept connections

- Run Prisma commands:
  - Push schema: `npx prisma db push`
  - Generate client: `npx prisma generate`
  - Seed data: `npx prisma db seed`

- Start the dev server in the background: `npm run dev`

> 🌐 Script will print to terminal where your API will be live at

> 🛑 Press `Ctrl + C` to stop the server and trigger automatic cleanup

---

#### 🐳 Option 2: Run Fully in Docker (App + PostgreSQL)

```bash
./local-start-full.sh
```

This script will:

- Warn if containers `coffee_shop_postgres` or `coffee_shop_api` already exist (even stopped)

- Validate all prerequisites:
  - Docker and Docker Compose

- Auto-copy `.env.example` to `.env` if missing

- Start **both** the app and database using `docker-compose.full.yaml`

- Wait until PostgreSQL is ready to accept connections

- Run Prisma commands _inside the app container_:
  - Push schema
  - Generate client
  - Seed data

- Attach to container logs for live output

> 🌐 Script will print to terminal where your API will be live at

> 🛑 Press `Ctrl + C` to stop containers and clean up resources

---

### 🧪 Unit Test

Run unit tests with coverage:

```sh
npm test
```

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
project-root/
├── docker-compose.yaml         # Basic Docker Compose setup (DB Container)
├── docker-compose.full.yaml    # Full Docker Compose setup (API BE App and DB Container)
├── Dockerfile                  # Docker image definition for the API BE App
│
├── local-start.sh              # Script to start the DB Container
├── local-start-full.sh         # Script to start the DB Container and the BE App Container
│
├── package.json                # NPM project configuration and scripts
├── package-lock.json           # Exact dependency versions for reproducible installs
├── tsconfig.json               # TypeScript compiler configuration
├── README.md                   # Project documentation
│
├── prisma/                     # Prisma schema and seed data
│   ├── schema.prisma           # Prisma database schema
│   └── seed.ts                 # Seed script for populating initial data
│
├── generated/                  # Auto-generated code
│   └── prisma/                 # Prisma client code (after `prisma generate`)
│
├── src/                        # Application source code
│   ├── index.ts                # Application entry point
│
│   ├── config/                 # Configuration-related files
│   │   └── env.ts              # Loads and validates environment variables
│
│   ├── lib/                    # Shared libraries
│   │   └── prisma.ts           # Singleton Prisma client instance
│
│   ├── middlewares/            # Express middlewares
│   │   ├── errorHandler.ts     # Global error handler for API BE App
│   │   └── validate.ts         # Input payload request validation middleware using Zod
│
│   ├── modules/                # Feature modules (grouped by domain)
│   │   ├── api/                    # Shared API logic and errors
│   │   │   ├── ApiError.ts             # Error base class (throw these class instances as error)
│   │   │   ├── errorCodes.ts           # Error codes for error class
│   │   │   ├── InvalidStatusError.ts   # Error class for invalid status
│   │   │   ├── NotFoundError.ts        # Error class for 404 responses
│   │   │   └── schema.ts               # Types and Zods for success and error response
│   │   └── {module}/               # Feature-specific module (e.g., coffee)
│   │       ├── {module}.controller.ts  # Route handlers, validates output
│   │       ├── {module}.route.ts       # Route definitions, validates input payload
│   │       ├── {module}.schema.ts      # Types and Zods for response and request
│   │       └── {module}.service.ts     # Business logic and DB interaction
│
│   └── utils/                  # Utility functions
│       └── validateResponse.ts # Validates outgoing API responses using Zod
│
├── postman/                    # Postman collections & envs
│   ├── coffee-shop-api.postman_collection.json      # Exported API collection (v2.1 format)
│   └── dev.postman_environment.json                 # Environment vars (e.g., base_url)
```

---

## 📚 API Documentation

Interactive API documentation is available at:

📄 Docs URL: http://localhost:3000/api-docs  
🔗 Base URL: http://localhost:3000

> The documentation is powered by Swagger UI and generated from an OpenAPI specification located in `docs/openapi.yaml`.

---

## 🧪 Postman API Collection

You can test this API using the included Postman collection:

### Newman E2E Test

1. Install newman globally `npm i -g newman`
2. Run testing inside `postman` directory

```bash
newman run ./postman_collection.json \
--folder "Coffees" \
--environment ./postman_environment.json
```

Or this to run all

```bash
newman run ./postman_collection.json --environment ./postman_environment.json
```

### 📂 Files

- `postman/coffee-shop-api.postman_collection.json`: Contains all endpoint definitions
- `postman/dev.postman_environment.json`: Contains environment variables like `base_url`

### 🚀 Getting Started

1. Open Postman and import the collection file.
2. Import the environment file and select it as active.
3. Start the backend server using one of the setup scripts.
4. Run or test individual requests.

> The `{{base_url}}` variable is set to `http://localhost:3000/api/v1`

---

## 📄 License

[MIT](./LICENSE)
