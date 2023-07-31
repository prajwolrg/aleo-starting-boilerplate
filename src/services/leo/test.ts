import { join } from "path";

import { FEE, programNames } from "../../constants";
import { LeoPrivateKey, LeoU32, LeoViewKey } from "../../types";
import { contractsPath, zkRun } from "./util";

const gangwarPath = join(contractsPath, "gangwar_engine");

const sum = async (
  privateKey: LeoPrivateKey,
  viewKey: LeoViewKey,
  a: LeoU32,
  b: LeoU32
  // TODO: verify return type
): Promise<any> => {
  const transition = "main";
  const params = [a, b];

  await zkRun({
    privateKey,
    viewKey,
    appName: programNames.TEST_PROGRAM,
    contractPath: gangwarPath,
    transition,
    params,
    fee: FEE,
  });
};

export const test = { sum };
