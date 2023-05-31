import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { PAYMENT_TYPES } from "../../../config";
import { auth } from "@clerk/nextjs";

// import Stripe from "stripe";

import { CURRENCY, MIN_AMOUNT, MAX_AMOUNT } from "../../../config";
import { formatAmountForStripe } from "../../../utils/stripe-helpers";
import getStripe from "~/utils/get-stripejs";

// const stripe = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
//   // https://github.com/stripe/stripe-node#configuration
//   apiVersion: "2020-08-27",
// });

import Stripe from "stripe";
import { findOrCreateCustomerId } from "~/utils/findOrCreateCustomerId";
import { getAuth } from "@clerk/nextjs/server";
// const stripe = await getStripe();
const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

if (!stripe) {
  throw new Error("Stripe must be initialized!");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Make sure there is a stripe customer associated with the clerk user.
    const { userId } = getAuth(req);
    if (!userId) {
      throw new Error("User must be signed in");
    }
    const stripeCustomerId = await findOrCreateCustomerId({
      clerkUserId: userId,
    });

    const amount: number = req.body.amount;
    const paymentTypeName = req.body.paymentType;
    try {
      if (!paymentTypeName || !PAYMENT_TYPES[paymentTypeName]) {
        throw new Error("Invalid payment type.");
      }
      const paymentType = PAYMENT_TYPES[paymentTypeName];
      // Validate the amount that was passed from the client.
      if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
        throw new Error("Invalid amount.");
      }
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        // submit_type: "donate",
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        mode: paymentType!.type,
        line_items: [
          {
            price: paymentType!.id,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
      };

      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
