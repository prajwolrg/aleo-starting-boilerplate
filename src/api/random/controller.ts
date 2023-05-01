import { RequestHandler } from "express";

import { core } from "../../core";
import { leo } from "../../services";
import { logger } from "../../utils";

interface RandomController {
  generateNumber: RequestHandler;
  generateHashChainRecord: RequestHandler;
}

export const randomController: RandomController = {
  generateNumber: async (req, res) => {
    const { seed, min, max, privateKey, viewKey, owner } = req.body;
    const value = await leo.rng.getRandomNumber(privateKey, viewKey, owner, seed, min, max);
    res.send(value);
  },
  generateHashChainRecord: async (req, res) => {
    const { owner, privateKey, viewKey } = req.body;

    const { seed, hashChain } = core.hashChain.generate();

    // TODO: add re-attempt for a few times if it fails
    leo.hashChain
      .createHashChainRecord(privateKey, viewKey, owner, seed, hashChain)
      .then(() => logger.info(`Hash chain record creation succeeded for account ${owner}`))
      .catch(() => logger.error(`Hash chain record creation failed for account ${owner}`));

    res.send({ seed, hashChain });
  },
};
