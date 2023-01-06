import { createHandler, z } from "@backframe/rest";

export const GET = createHandler({
  action() {
    return "Hello World!!!";
  },
});

export const POST = createHandler({
  input: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  }),
  action(ctx) {
    const { email, name } = ctx.input;
    // store used somewhere
    ctx.json({
      status: "SUCCESS",
      msg: "Model created successfully",
      user: {
        email,
        name,
      },
    });
  },
});
