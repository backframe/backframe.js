import loadConfig from "@backframe/core";
import request from "supertest";
import { describe, it } from "vitest";
import server from "../src/server.js";

await server.$init(await loadConfig());
const app = server.$app;

describe("test routing functionality", () => {
  it("should respond with 200", async () => {
    await request(app).get("/hello").expect(200).expect("Hello World!!!");
  });

  it("should respond with 404", async () => {
    await request(app).get("/fiction").expect(404).expect({
      statusCode: 404,
      message: "Not found",
      description: "The requested resource was not found",
    });
  });

  it("should respond with method not allowed", async () => {
    await request(app).post("/hello").expect(405).expect({
      statusCode: 405,
      message: "Method Not Allowed",
      description: "The `POST` method is not allowed on this resource",
    });
  });

  // Test route patterns
  it("should receive 200 from `/`", async () => {
    await request(app).get("/").expect(200);
  });

  it("should receive 200 from `/a/b`", async () => {
    await request(app).get("/a/b").expect(200);
  });

  it("should receive 200 from `/x/`", async () => {
    await request(app).get("/x").expect(200);
  });

  it("should receive 200 from `/auth/local`", async () => {
    await request(app).get("/auth/local").expect(200);
  });

  it("should receive 200 and hello as response", async () => {
    await request(app).get("/a/hello").expect(200).expect("hello");
  });

  describe("test catchAll routing", () => {
    it("should receive `catchAll works` as response", async () => {
      await request(app).get("/admin/").expect(200).expect("Catchall works");
    });

    it("should receive `catchAll works` as response", async () => {
      await request(app)
        .get("/admin/jiberish")
        .expect(200)
        .expect("Catchall works");
    });
  });

  // Test route `sorting` functionality
  // When two routes match the same path, and one is a named route while the other is a dynamic route,
  // the named route should be matched first
  describe("test route sorting", () => {
    it("should receive 200 and `google` as response", async () => {
      await request(app).get("/auth/google").expect(200).expect("google");
    });

    it("should receive 200 and `dynamic` as response", async () => {
      await request(app).get("/auth/dynamic").expect(200).expect("dynamic");
    });
  });
});
