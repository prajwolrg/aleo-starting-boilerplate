import { join } from "path";

import { FEE, programNames } from "../../constants";
import { LeoPrivateKey, LeoU32, LeoViewKey } from "../../types";
import { contractsPath, zkRun } from "./util";

const testProgramPath = join(contractsPath, "test");

const sum = async (
  privateKey: LeoPrivateKey,
  viewKey: LeoViewKey,
  // TODO: Take input as JS object
  a: LeoU32,
  b: LeoU32
  // TODO: verify return type
): Promise<any> => {
  const transition = "main";

  // TODO: Convert JS object to Leo

  const params = [a, b];

  await zkRun({
    privateKey,
    viewKey,
    appName: programNames.TEST_PROGRAM,
    contractPath: testProgramPath,
    transition,
    params,
    fee: FEE,
  });

  // TODO: Convert back to JS Object
};

export const test = { sum };
