import { exec } from "child_process";
import { readFile } from "fs/promises";
import { join } from "path";
import { promisify } from "util";

import { Address, DevelopmentClient, PrivateKey, ViewKey } from "../../aleo-sdk";
import { env, FEE, LOCAL_NETWORK_PRIVATE_KEY, programNames } from "../../constants";
import { LeoTx, leoTxSchema, LeoRecord, LeoViewKey, leoAddressSchema } from "../../types";
import { Greeting, GreetingRecord, greetingRecordSchema, greetingSchema } from "../../types/helloLeo";
import { apiError, attemptFetch, decodeId, logger, wait } from "../../utils";

const developmentClient = new DevelopmentClient(env.DEVELOPMENT_SERVER_URL);

export const execute = promisify(exec);

export const contractsPath = join(env.NODE_PATH, "contracts");

const PRIVATE = ".private";
const PUBLIC = ".public";

const replaceValue = (value: string, searchValue = "") => value.replace(searchValue, "").replace(PRIVATE, "").replace(PUBLIC, "");

const address = (value: string): string => replaceValue(value);

const field = (value: string): bigint => {
  const parsed = BigInt(replaceValue(value, "field"));
  return parsed;
};

const fieldToString = (value: string): string => {
  const parsed = replaceValue(value, "field");
  return parsed;
};

export const u8 = (value: string): number => {
  const parsed = Number(replaceValue(value, "u8"));
  if (isNaN(parsed)) throw apiError("u8 parsing failed");
  return parsed;
};

const u32 = (value: string): number => {
  const parsed = Number(replaceValue(value, "u32"));
  if (isNaN(parsed)) throw apiError("u32 parsing failed");
  return parsed;
};

const u64 = (value: string): number => {
  const parsed = Number(replaceValue(value, "u64"));
  if (isNaN(parsed)) throw apiError("u64 parsing failed");
  return parsed;
};

const parseRecordString = (recordString: string): Record<string, unknown> => {
  const correctJson = recordString.replace(/(['"])?([a-z0-9A-Z_.]+)(['"])?/g, '"$2" ');
  return JSON.parse(correctJson);
};

const greeting = (record: Record<string, unknown>): Greeting => {
  const parsed = greetingRecordSchema.parse(record);
  const res: Greeting = {
    owner: parsed.owner,
    fullName: u32(parsed.full_name),
  };
  return greetingSchema.parse(res);
};

// NEW-STRUCT: Update parser to support Leo->JS conversion every new struct/record created in program
export const parseOutput = { address, field, u8, u32, u64, greeting };

const parseCmdOutput = (cmdOutput: string): Record<string, unknown> => {
  const lines = cmdOutput.split("\n");

  let res: Record<string, unknown> = {};

  let objectStarted = false;
  let objectFinished = false;
  let done = false;
  let toParse = "";

  lines.forEach((line) => {
    if (done) return;

    if (objectStarted && objectFinished) {
      res = parseRecordString(toParse);
      done = true;
    } else if (objectStarted) {
      if (line.startsWith("}")) {
        objectFinished = true;
      }
      const trimmedLine = line.trim();
      toParse = toParse + trimmedLine;
    } else if (line.includes("• {") || line.startsWith("{")) {
      toParse = toParse + "{";
      objectStarted = true;
    }
  });

  return res;
};

const getTxResult = (tx: LeoTx): string | undefined => {
  return tx.execution.transitions.at(0)?.outputs.at(0)?.value;
};

const decryptRecord = async (encryptedRecord: LeoRecord, viewKey: LeoViewKey): Promise<Record<string, unknown>> => {
  const decrypted = ViewKey.from_string(viewKey).decrypt(encryptedRecord);
  return parseRecordString(decrypted);
};

interface LeoRunParams {
  contractPath: string;
  params?: string[];
  transition?: string;
}

const leoRun = async ({ contractPath, params = [], transition = "main" }: LeoRunParams): Promise<Record<string, unknown>> => {
  const stringedParams = params.join(" ");
  const cmd = `cd ${contractPath} && leo run ${transition} ${stringedParams}`;

  const { stdout } = await execute(cmd);
  // console.log(stdout);

  const parsed = parseCmdOutput(stdout);

  return parsed;
};

interface SnarkOsExecuteParams {
  privateKey: string;
  viewKey: string;
  appName: string;
  params?: string[];
  transition?: string;
  fee: number;
}

const snarkOsExecute = async ({
  privateKey,
  viewKey,
  appName,
  params = [],
  transition = "main",
  fee,
}: SnarkOsExecuteParams): Promise<Record<string, unknown>> => {
  // when running locally, transfer some credits to the account in order to facilitate the developer experience
  if (env.ZK_MODE === "testnet_local") {
    await transferCredits(FEE + 6, Address.from_private_key(PrivateKey.from_string(privateKey)).to_string());
    await wait();
  }

  let txId = "";
  let attemptsLeft = 5;
  let executed = false;

  while (!executed && attemptsLeft > 0) {
    try {
      txId = (await developmentClient.executeProgram(`${appName}.aleo`, transition, fee, params, privateKey)).replaceAll('"', "");
      executed = true;
    } catch (error) {
      attemptsLeft--;
      if (attemptsLeft === 0) {
        throw error;
      }
    }
  }

  const baseRoute = env.ZK_MODE === "testnet_public" ? "https://vm.aleo.org/api" : "http://127.0.0.1:3030";
  const url = `${baseRoute}/testnet3/transaction/${txId}`;
  const res = await attemptFetch(url);

  const tx: Record<string, unknown> = res.data;
  const parsedTx = leoTxSchema.parse(tx);
  const result = getTxResult(parsedTx);

  // I know a ternary would be cool, but it creates some weird concurrency issues sometimes
  let parsed = {};
  if (result) {
    parsed = await decryptRecord(result, viewKey);
  }

  return parsed;
};

type ExecuteZkLogicParams = LeoRunParams & SnarkOsExecuteParams;

export const zkRun = (params: ExecuteZkLogicParams): Promise<Record<string, unknown>> => {
  if (env.ZK_MODE === "leo") {
    return leoRun(params);
  } else {
    return snarkOsExecute(params);
  }
};

/**
 * Deploys programs to the public or local Aleo testnet, using the Aleo TS SDK.
 * Before calling this function, make sure to execute "build_local_programs.sh" from the root directory
 * and make sure your account holds at least the required fee amount (56 credits).
 */
export const deployPrograms = async () => {
  const privateKey = env.DEPLOY_PRIVATE_KEY;
  if (!privateKey) return;

  const fees = {
    // NEW-PROGRAM: Add the fee required to deploy the new program here
    helloLeo: 1,
  };

  const successfulPrograms: string[] = [];

  for (const programName of Object.values(programNames)) {
    logger.info(`Deploying ${programName}`);

    const path = join(contractsPath, programName, "build", "main.aleo");

    const program = await readFile(path, "utf-8");

    let attemptsLeft = 5;
    let deployed = false;

    while (!deployed && attemptsLeft > 0) {
      try {
        await developmentClient.deployProgram(program, fees[programName as keyof typeof fees], privateKey);
        logger.info(`Successfully deployed ${programName}`);
        successfulPrograms.push(programName);
        deployed = true;
      } catch (error) {
        attemptsLeft--;
        if (attemptsLeft === 0) {
          logger.info(`${programName} deployment failed. Check the dev server logs to see if it was already deployed.`);
        }
      }
    }
  }

  logger.info(`Successfully deployed programs: ${successfulPrograms.toString()}`);
};

/**
 * Transfer credits from the account identified by the private key to the account specified as recipient.
 * ! use this function only when the app is connected to a local node
 * @param amount - amount of credits to transfer to the recipient
 * @param recipient - address of the receiver account
 * @param privateKey - private key of the sender account, defaults to the private key of the local chain owner
 * @returns
 */
const transferCredits = async (amount: number, recipient: string, privateKey = LOCAL_NETWORK_PRIVATE_KEY) => {
  let attemptsLeft = 5;
  let transferred = false;

  while (!transferred && attemptsLeft > 0) {
    try {
      await developmentClient.transfer(amount, FEE, recipient, privateKey);
      logger.info(`Successfully transferred ${amount} credits to ${recipient}`);
      transferred = true;
    } catch (error) {
      attemptsLeft--;
      if (attemptsLeft === 0) {
        logger.info(`Transfer of ${amount} credits to ${recipient} failed.`);
      }
    }
  }
};
