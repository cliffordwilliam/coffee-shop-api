// This file defines node env vals for in app use to avoid spamming raw numbers everywhere

export const NODE_ENVS = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
  CI: "ci",
} as const;

export type NodeEnv = (typeof NODE_ENVS)[keyof typeof NODE_ENVS];
