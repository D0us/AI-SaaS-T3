import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";

import Stripe from "stripe";
import { findOrCreateCustomerId } from "~/utils/findOrCreateCustomerId";
import { customerHasFeature } from "use-stripe-subscription";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});
export const customerRouter = createTRPCRouter({
  isActive: privateProcedure.query(async ({ input, ctx }) => {
    const customerId = await findOrCreateCustomerId({
      clerkUserId: ctx.userId,
    });
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  }),

  can: privateProcedure
    .input(
      z.object({
        feature: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const customerId = await findOrCreateCustomerId({
        clerkUserId: ctx.userId,
      });

      const hasFeature =
        (await customerHasFeature({
          customerId,
          feature: input.feature,
        })) || false;

      return hasFeature;

      // if (!(await customerHasFeature({ customerId, feature: input.feature }))) {
      //   throw new TRPCError({
      //     code: "FORBIDDEN",
      //     message: "You do not have access to this feature.",
      //   });
      // }
    }),
});
