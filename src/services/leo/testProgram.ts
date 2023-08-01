import { join } from "path";

import { FEE, programNames } from "../../constants";
import { LeoPrivateKey, LeoU32, leoU32Schema, LeoViewKey } from "../../types";
import { leoParse } from "../../utils";
import { contractsPath, parseOutput, zkRun } from "./util";

const testProgramPath = join(contractsPath, "test");

const sum = async (
  privateKey: LeoPrivateKey,
  viewKey: LeoViewKey,
  // TODO: Take input as JS object
  a: number,
  b: number
  // TODO: verify return type
): Promise<any> => {
  const transition = "main";

  // Convert to Leo Object
  const leoNumA = leoParse.u32(a);
  const leoNumB = leoParse.u32(b);

  const params = [leoNumA, leoNumB];

  const sum = await zkRun({
    privateKey,
    viewKey,
    appName: programNames.TEST_PROGRAM,
    contractPath: testProgramPath,
    transition,
    params,
    fee: FEE,
  });

  // TODO: Convert back to JS Object
  return sum;
};

export const test = { sum };
