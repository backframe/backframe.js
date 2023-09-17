import { createHandler, z } from "@backframe/rest";

export const GET = createHandler({
  output: z.object({
    msg: z.string(),
    status: z.literal("SUCCESS"),
  }),
  // @ts-expect-error (test for validation error)
  action(_ctx) {
    return {};
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
    return ctx.json({
      status: "SUCCESS",
      msg: "Model created successfully",
      user: {
        email,
        name,
      },
    });
  },
});
