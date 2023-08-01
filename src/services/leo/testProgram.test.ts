import { test } from "./testProgram";

jest.setTimeout(600000);

describe("Test Test Contract Transitions", () => {
  const keys = {
    owner: "aleo1z9rkh2xecmpnx9jxkvnyq08mfeddrsrccny0j2hgw4yfhnxpxyqqp42329",
    privateKey: "APrivateKey1zkp3WTnfDxUchbLeHqwGrgdkTNieykUP72UPNmv4uQngjwf",
    viewKey: "AViewKey1fvqnzQ9nYfFMAkhjdcz5UEtDD1JjpbtG8kMXBLJKAHbd",
  };

  // TODO: take JS object as input
  const a = 1;
  const b = 2;

  it("Returns the sum", async () => {
    const { owner, privateKey, viewKey } = keys;

    const res = await test.sum(privateKey, viewKey, a, b);

    console.log(res);
  });
});
