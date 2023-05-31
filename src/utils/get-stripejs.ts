import { Stripe, loadStripe } from "@stripe/stripe-js";
import { env } from "~/env.mjs";

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, {
      apiVersion: "2022-11-15",
    });
  }
  return stripePromise;
};

export default getStripe;
