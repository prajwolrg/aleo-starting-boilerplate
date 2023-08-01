import { Person } from "../../types/helloLeo";
import { helloLeo } from "./helloLeo";

jest.setTimeout(600000);

describe("Test Hello Leo Greet", () => {
  const keys = {
    owner: "aleo1z9rkh2xecmpnx9jxkvnyq08mfeddrsrccny0j2hgw4yfhnxpxyqqp42329",
    privateKey: "APrivateKey1zkp3WTnfDxUchbLeHqwGrgdkTNieykUP72UPNmv4uQngjwf",
    viewKey: "AViewKey1fvqnzQ9nYfFMAkhjdcz5UEtDD1JjpbtG8kMXBLJKAHbd",
  };

  // Person is represented as number
  const person: Person = {
    firstName: 1,
    secondName: 2,
  };

  it("fullName is the sum", async () => {
    const { owner, privateKey, viewKey } = keys;

    const res = await helloLeo.greet(privateKey, viewKey, person);

    console.log(res);
  });
});
