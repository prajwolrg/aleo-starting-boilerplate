import { z } from "zod";
import { leoAddressSchema, leoPrivateKeySchema, leoViewKeySchema, uuidSchema } from "../../types";
export const schemas = {
  body: {
    sum: z.object({
      // Values made require by the framework
      privateKey: leoPrivateKeySchema,
      viewKey: leoViewKeySchema,
      owner: leoAddressSchema,

      // Input parameters to the transition
      a: z.string(),
      b: z.string(),
    }),
  },
};
