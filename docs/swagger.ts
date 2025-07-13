import { version, name, description } from "../package.json";
import { env } from "@/config/env";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import {
  CoffeeSchema,
  CreateCoffeeSchema,
  UpdateCoffeeSchema,
} from "@/modules/coffee/coffee.schema";
import {
  IdParamSchema,
  PaginationQuerySchema,
  PaginationMetaSchema,
} from "@/modules/common/common.schema";
import {
  ErrorResponseSchema,
  SuccessResponseSchema,
} from "@/modules/api/api.schema";
import { z } from "zod";
import { METHODS, CONTENT, HTTP_STATUS } from "@/constants/http";

// Get registry to turn zods to docs
const registry = new OpenAPIRegistry();

// Register Coffees schemas
registry.register("Coffee", CoffeeSchema);
registry.register("CreateCoffee", CreateCoffeeSchema);
registry.register("UpdateCoffee", UpdateCoffeeSchema);
// Register Param schema
registry.register("IdParam", IdParamSchema);
// Register Query schema
registry.register("PaginationQuery", PaginationQuerySchema);
// Register Response schema
registry.register("PaginationMeta", PaginationMetaSchema);
registry.register("ErrorResponse", ErrorResponseSchema);

const registerCoffeeEndpoints = () => {
  // This function registers all coffee module endpoints
  const basePath = "/coffees";

  registry.registerPath({
    method: METHODS.GET,
    path: basePath,
    summary: "Get all coffees",
    request: {
      query: PaginationQuerySchema,
    },
    responses: {
      [HTTP_STATUS.OK]: {
        description: "A list of coffees",
        content: {
          [CONTENT.JSON]: {
            schema: SuccessResponseSchema(
              z.array(CoffeeSchema),
              PaginationMetaSchema,
            ),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: METHODS.POST,
    path: basePath,
    summary: "Create a new coffee",
    request: {
      body: {
        content: {
          [CONTENT.JSON]: {
            schema: CreateCoffeeSchema,
          },
        },
      },
    },
    responses: {
      [HTTP_STATUS.CREATED]: {
        description: "Coffee created",
        content: {
          [CONTENT.JSON]: {
            schema: SuccessResponseSchema(CoffeeSchema),
          },
        },
      },
      [HTTP_STATUS.BAD_REQUEST]: {
        description: "Validation error",
        content: {
          [CONTENT.JSON]: {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: METHODS.GET,
    path: `${basePath}/{id}`,
    summary: "Get a single coffee by ID",
    request: {
      params: IdParamSchema,
    },
    responses: {
      [HTTP_STATUS.OK]: {
        description: "Coffee found",
        content: {
          [CONTENT.JSON]: {
            schema: SuccessResponseSchema(CoffeeSchema),
          },
        },
      },
      [HTTP_STATUS.NOT_FOUND]: {
        description: "Coffee not found",
        content: {
          [CONTENT.JSON]: {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: METHODS.PATCH,
    path: `${basePath}/{id}`,
    summary: "Update a coffee by ID",
    request: {
      params: IdParamSchema,
      body: {
        content: {
          [CONTENT.JSON]: {
            schema: UpdateCoffeeSchema,
          },
        },
      },
    },
    responses: {
      [HTTP_STATUS.OK]: {
        description: "Coffee updated",
        content: {
          [CONTENT.JSON]: {
            schema: SuccessResponseSchema(CoffeeSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: METHODS.DELETE,
    path: `${basePath}/{id}`,
    summary: "Delete a coffee by ID",
    request: {
      params: IdParamSchema,
    },
    responses: {
      [HTTP_STATUS.OK]: {
        description: "Coffee deleted",
        content: {
          [CONTENT.JSON]: {
            schema: SuccessResponseSchema(CoffeeSchema),
          },
        },
      },
    },
  });
};

registerCoffeeEndpoints();

const generator = new OpenApiGeneratorV3(registry.definitions);

export const swaggerSpec = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: name,
    version,
    description,
  },
  servers: [
    {
      url: `${env.protocol}://${env.localhost}:${env.port}${env.apiPrefix}`,
    },
  ],
});
