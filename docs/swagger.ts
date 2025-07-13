import { version, name, description } from "../package.json";
import { env } from "@/config/env";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: name,
    version,
    description,
  },
  paths: {
    "/healthz": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
          },
        },
      },
    },
    [`${env.apiPrefix}/coffees`]: {
      get: {
        summary: "Get all coffees",
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1 },
            required: false,
            description: "Page number for pagination",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1 },
            required: false,
            description: "Number of items per page",
          },
        ],
        responses: {
          "200": {
            description: "List of coffees",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: [
                    {
                      id: 1,
                      name: "Espresso",
                      description: "Strong black coffee",
                      price: 25000,
                      createdAt: "2024-01-01T00:00:00.000Z",
                      updatedAt: "2024-01-01T00:00:00.000Z",
                    },
                  ],
                  meta: {
                    pagination: {
                      page: 1,
                      size: 10,
                      total: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new coffee",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                name: "Latte",
                description: "Milk-based coffee",
                price: 30000,
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Coffee created",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    id: 2,
                    name: "Latte",
                    description: "Milk-based coffee",
                    price: 30000,
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                example: {
                  success: false,
                  error: {
                    message: "Validation failed",
                    details: { field: "name", message: "Name is required" },
                  },
                },
              },
            },
          },
        },
      },
    },
    [`${env.apiPrefix}/coffees/{id}`]: {
      get: {
        summary: "Get a single coffee by ID",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Coffee found",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    id: 1,
                    name: "Espresso",
                    description: "Strong black coffee",
                    price: 25000,
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                  },
                },
              },
            },
          },
          "404": {
            description: "Coffee not found",
            content: {
              "application/json": {
                example: {
                  success: false,
                  error: {
                    message: "Coffee with ID 99 not found",
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        summary: "Update a coffee by ID",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                name: "Latte Macchiato",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Coffee updated",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    id: 2,
                    name: "Latte Macchiato",
                    description: "Milk-based coffee",
                    price: 30000,
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-02T00:00:00.000Z",
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a coffee by ID",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Coffee deleted",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    id: 2,
                    name: "Latte Macchiato",
                    description: "Milk-based coffee",
                    price: 30000,
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-02T00:00:00.000Z",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
