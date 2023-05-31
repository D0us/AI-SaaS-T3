import { createTRPCRouter } from "~/server/api/trpc";
import { messagesRouter } from "~/server/api/routers/messages";
import { stripeSessionRouter } from "~/server/api/routers/stripeSession";
import { customerRouter } from "~/server/api/routers/customer";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  stripeSession: stripeSessionRouter,
  customer: customerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
