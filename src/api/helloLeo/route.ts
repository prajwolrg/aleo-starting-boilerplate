import { Router } from "express";
import asyncHandler from "express-async-handler";

import { schemas } from "./schemas";
import { validate } from "../middlewares";
import { testController } from "./controller";

export const router = Router();

router.post("/sum", validate({ body: schemas.body.sum }), asyncHandler(testController.hello));
