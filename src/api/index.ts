import { Router } from "express";

import { router as accountRouter } from "./account/route";

import { handleError } from "./middlewares";

export const router = Router();

// NEW-PROGRAM: Create a new folder; and add necessary files to support REST call to the particular deployed program
router.use("/account", accountRouter);

router.use(handleError);
