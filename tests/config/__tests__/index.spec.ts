import loadConfig from "@backframe/core";
import request from "supertest";
import { describe, it } from "vitest";
import server from "../server.js";

await server.$init(await loadConfig());
const app = server.$app;

describe("tests config overriding", () => {
  it("should return Hello World!!!", () =>
    request(app).get("/hello").expect(200).expect("Hello World!!!"));
});
