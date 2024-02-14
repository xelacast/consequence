import { createTRPCRouter, publicProcedure } from "../trpc";

export const daysRouter = createTRPCRouter({
  // day: protectedProcedure.query(({ ctx }) => {
  //   console.log("User ID:", ctx.auth.userId);
  //   return {
  //     secret: `${ctx.auth.userId} is using a protected procedure!`,
  //   };
  // }),
  get: publicProcedure.query(({}) => {
    // console.log(ctx.user.userId);
    return { message: "Hello from the server!" };
  }),
});
