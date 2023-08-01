import { join } from "path";

import { FEE, programNames } from "../../constants";
import { LeoPrivateKey, LeoU32, leoU32Schema, LeoViewKey } from "../../types";
import { Person } from "../../types/helloLeo";
import { leoParse } from "../../utils";
import { contractsPath, parseOutput, zkRun } from "./util";

const testProgramPath = join(contractsPath, "hello_leo");

const greet = async (
  privateKey: LeoPrivateKey,
  viewKey: LeoViewKey,
  p: Person
  // TODO: verify return type
): Promise<any> => {
  const transition = "greet";

  // Convert to Leo Object
  const leoPerson = leoParse.person(p);
  const leoPersonParam = leoParse.stringifyLeoCmdParam(leoPerson);

  const params = [leoPersonParam];

  const record = await zkRun({
    privateKey,
    viewKey,
    appName: programNames.HELLO_LEO,
    contractPath: testProgramPath,
    transition,
    params,
    fee: FEE,
  });

  // TODO: Convert back to JS Object
  return parseOutput.greeting(record);
};

export const helloLeo = { greet };
