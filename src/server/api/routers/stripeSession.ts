import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";
import getStripe from "~/utils/get-stripejs";
import { type } from "os";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

export const stripeSessionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const stripeSession = await getStripe();

      // if (!stripeSession || typeof stripeSession === "undefined") {
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "No stripe session initialized.",
      //   });
      // }

      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.retrieve(input.sessionId, {
          expand: ["payment_intent"],
        });

      return checkoutSession;
    }),
});
