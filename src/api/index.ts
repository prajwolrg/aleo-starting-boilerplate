import { Router } from "express";

import { router as accountRouter } from "./account/route";

import { handleError } from "./middlewares";

export const router = Router();

router.use("/account", accountRouter);

router.use(handleError);
