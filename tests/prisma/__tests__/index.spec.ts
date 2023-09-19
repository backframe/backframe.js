import loadConfig from "@backframe/core";
import { Post } from "@bf/database";
import request from "supertest";
import { describe, expect, it } from "vitest";
import server from "../src/server.js";

await server.$init(await loadConfig());
const app = server.$app;

describe("test prisma adapter functionality", () => {
  let post: Post;

  it("POST /posts", async () => {
    const ts = Date.now();
    const title = `hello there world ${ts}`;

    const data = await request(app)
      .post("/posts")
      .send({ title, body: "world" })
      .expect(201);

    expect(data.body.id).toBeDefined();
    expect(data.body.createdAt).toBeDefined();
    expect(data.body.updatedAt).toBeDefined();
    expect(data.body.title).toBe(title);

    // unleaked fields
    expect(data.body.description).toBeUndefined();

    post = data.body;
  });

  it("GET /posts/:id", async () => {
    const res = await request(app).get(`/posts/${post.id}`).expect(200);
    expect(res.body.id).toBe(post.id);
  });

  it("PUT /posts/:id", async () => {
    const ts = Date.now();
    const newTitle = `hello updated world ${ts}`;

    const updated = await request(app)
      .put(`/posts/${post.id}`)
      .send({ title: newTitle })
      .expect(200);

    expect(updated.body.id).toBe(post.id);
    expect(updated.body.title).toBe(newTitle);
  });

  it("DELETE /posts/:id", async () => {
    const allPosts = await request(app).get("/posts").expect(200);
    const allPostsIds = allPosts.body.data.map((p: Post) => p.id);
    expect(allPostsIds).toContain(post.id);

    await request(app).delete(`/posts/${post.id}`).expect(200);
    const allPosts2 = await request(app).get("/posts").expect(200);
    const allPostsIds2 = allPosts2.body.data.map((p: Post) => p.id);
    expect(allPostsIds2).not.toContain(post.id);
  });
});
