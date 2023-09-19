import loadConfig from "@backframe/core";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { Post } from "../src/schema.js";
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

    const newPost = data.body;

    expect(newPost.id).toBeDefined();
    expect(newPost.createdAt).toBeDefined();
    expect(newPost.updatedAt).toBeDefined();
    expect(newPost.title).toBe(title);

    post = newPost;
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

    const updatePost = updated.body;

    expect(updatePost.id).toBe(post.id);
    expect(updatePost.title).toBe(newTitle);
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
