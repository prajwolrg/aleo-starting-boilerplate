import { RequestHandler } from "express";
import { Signature, Address } from "../../aleo-sdk";

import { leo } from "../../services";

interface TestController {
  sum: RequestHandler;
}

export const testController: TestController = {
  sum: async (req, res) => {
    const { privateKey, viewKey, a, b } = req.body;
    const c = await leo.test.sum(privateKey, viewKey, a, b);
    res.send({ c });
  },
};
