import { RequestHandler } from "express";

import { leo } from "../../services";

interface HelloLeoController {
  hello: RequestHandler;
}

export const testController: HelloLeoController = {
  hello: async (req, res) => {
    const { privateKey, viewKey, a, b } = req.body;
    const c = await leo.helloLeo.hello(privateKey, viewKey, a, b);
    res.send({ c });
  },
};
