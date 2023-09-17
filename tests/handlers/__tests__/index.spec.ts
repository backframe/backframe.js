import loadConfig from "@backframe/core";
import request from "supertest";
import { describe, it } from "vitest";
import server from "../src/server.js";

await server.$init(await loadConfig());
const app = server.$app;

describe("test named exports handlers", () => {
  it("should return 'name' validation errors", async () => {
    await request(app).post("/named").expect(400).expect({
      statusCode: 400,
      message: "Invalid request body",
      description: "Error on field 'name': required",
    });
  });

  it("should return 'email' validation errors", async () => {
    await request(app)
      .post("/named")
      .send({
        name: "John Doe",
        email: "john.doe",
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: "Invalid request body",
        description: "Error on field 'email': invalid email",
      });
  });

  it("should return output validation errors", async () => {
    await request(app).get("/named").expect(500).expect({
      statusCode: 500,
      message: "Invalid response body",
      description:
        "output validation failed for route: `/named` with method: `get`. Error on field 'msg': required",
    });
  });

  it("should respond with 200", async () => {
    await request(app)
      .post("/named")
      .send({
        name: "John Doe",
        email: "john.doe@gmail.com",
        password: "12345678",
      })
      .expect(200)
      .expect({
        status: "SUCCESS",
        msg: "Model created successfully",
        user: {
          name: "John Doe",
          email: "john.doe@gmail.com",
        },
      });
  });
});
