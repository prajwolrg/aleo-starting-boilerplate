import { z } from "zod";

import { leoPrivateKeySchema } from "./types";

const transformVersion = (version?: string): string => (version && version !== "0" ? `_${version}` : "");
const transformBool = (value: string) => (value === "true" ? true : false);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "staging"]).default("development"),
  NODE_PATH: z.string(),
  PORT: z.string().optional().default("5001"),
  CORS_ORIGINS: z
    .string()
    .optional()
    .default("http://localhost:3000,http://localhost:3001,http://frontend.localhost,http://api.localhost,http://backend.localhost")
    .transform((val) => val.split(",")),

  ZK_MODE: z.enum(["leo", "testnet_public", "testnet_local"]).optional().default("testnet_local"),
  DEVELOPMENT_SERVER_URL: z.string().default("http://0.0.0.0:4040"),

  DEPLOY_PROGRAMS: z.string().default("false").transform(transformBool),
  DEPLOY_PRIVATE_KEY: leoPrivateKeySchema.optional(),

  // NEW-PROGRAM: Add the version of the new program here
  TEST_PROGRAM_VERSION: z.string().optional().transform(transformVersion),
});

export const env = envSchema.parse(process.env);

export const BASE_URL = `localhost:${env.PORT}`;

export const DELETE_PAYLOAD = { message: "deleted" };

export const programNames = {
  // NEW-PROGRAM: Add the name of the new program here
  TEST_PROGRAM: "test" + env.TEST_PROGRAM_VERSION,
};

export const HASH_MAX_RANGE = 999999;
export const HASH_CHAIN_LENGTH = 32;

export const FEE = 1;

export const LOCAL_NETWORK_PRIVATE_KEY = "APrivateKey1zkp8CZNn3yeCseEtxuVPbDCwSyhGW6yZKUYKfgXmcpoGPWH";
export const LOCAL_NETWORK_VIEW_KEY = "AViewKey1mSnpFFC8Mj4fXbK5YiWgZ3mjiV8CxA79bYNa8ymUpTrw";
export const LOCAL_NETWORK_ADDRESS = "aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px";
