import { z } from "zod";
import { leoAddressSchema, leoU32Schema } from "./leo";

// Note: Create two types for each object
// 1. For Leo
// 2. For JS
export const personLeoSchema = z.object({
  first_name: leoU32Schema,
  second_name: leoU32Schema,
});
export type PersonLeo = z.infer<typeof personLeoSchema>;

export const personSchema = z.object({
  firstName: z.number(),
  secondName: z.number(),
});
export type Person = z.infer<typeof personSchema>;

export const greetingRecordSchema = z.object({
  owner: leoAddressSchema,
  full_name: leoU32Schema,
});
export type GreetingRecord = z.infer<typeof greetingRecordSchema>;

export const greetingSchema = z.object({
  owner: leoAddressSchema,
  fullName: z.number(),
});
export type Greeting = z.infer<typeof greetingSchema>;
