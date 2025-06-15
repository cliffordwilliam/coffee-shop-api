# Coffee Shop Backend Development Guide

## Technology Stack

- Node.js v22.16.0
- Express.js (Node.js)
- PostgreSQL
- Prisma ORM

## Development Environment Setup

### Prerequisites

- [Node.js v22.16.0 or higher](https://nodejs.org/en/download/)
- [npm (Node package manager)](https://classic.yarnpkg.com/lang/en/docs/install/)
- [Docker and Docker Compose](https://docs.docker.com/engine/install/)
- [Git](https://github.com/git-guides/install-git)

### Project Structure

```text
./
├── src/
│   ├── app.ts                     # Express app configuration
│   ├── main.ts                    # App entry point
│   ├── prisma/
│   │   └── client.ts              # Prisma client singleton
│   ├── routes/
│   │   └── {module}.routes.ts     # {module} API routes
│   ├── controllers/
│       └── {module}.controller.ts # {module} controller logic
├── .env                           # Environment variables
├── docker-compose.yml             # Docker services (Postgres, etc.)
├── local-start.sh                 # Development startup script
└── ...
```

---

## Development Workflow

### Running the Application

To run the application, you can use the [local-start.sh] script from the root directory.

```bash
./local-start.sh
```

The API will be available at `http://localhost:3000`
API documentation is available at COMING SOON
