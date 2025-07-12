export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Test API",
    version: "1.0.0",
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
  },
};
