// NEW-PROGRAM: Create a new file with the program name and import it here
import { account } from "./account";
import { test } from "./test";

export { deployPrograms } from "./util";

// NEW-PROGRAM: Add the new program here
export const leo = { account, test };
