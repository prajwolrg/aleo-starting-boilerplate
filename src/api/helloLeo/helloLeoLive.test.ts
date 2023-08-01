import request from "supertest";

import { BASE_URL } from "../../constants";

jest.setTimeout(600000);

describe("POST /helloLeo/sum", () => {
  const route = "/helloLeo/sum";

  it("should return 200", async () => {
    // Note: This test works only if the server has started
    // Use `yarn start` to start the server
    const res = await request(BASE_URL).post(route);
    expect(res.statusCode).toBe(200);
    expect(res.body.error).toBeUndefined();
  });
});
