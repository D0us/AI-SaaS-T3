import { z } from "zod";
import { getGptChain } from "~/server/helpers/getGptResponse";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";
import { getWebAgentResonse } from "~/server/helpers/webAgent";

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 s"),
  analytics: true,
});

export const messagesRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }),
  add: privateProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { success } = await ratelimit.limit(ctx.userId);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });
      }

      const messageFromDb = await ctx.prisma.message.create({
        data: {
          content: input.content,
          isAgent: false,
          authorId: ctx.userId,
        },
      });

      try {
        // const gptResponse = await getGptChain(input.content);
        const gptResponse = await getWebAgentResonse(input.content);

        if (gptResponse) {
          await ctx.prisma.message.create({
            data: {
              content: gptResponse,
              isAgent: true,
              previousMessageId: messageFromDb.id,
            },
          });

          return gptResponse;
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `GPT Error - ${error}`,
        });
      }
    }),
});
