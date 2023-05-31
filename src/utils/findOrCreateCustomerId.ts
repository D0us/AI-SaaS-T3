import { clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { env } from "~/env.mjs";

export const findOrCreateCustomerId = async ({
  clerkUserId,
}: {
  clerkUserId: string;
}) => {
  let user = await clerkClient.users.getUser(clerkUserId);
  if (user.publicMetadata.stripeCustomerId) {
    return user.publicMetadata.stripeCustomerId as string;
  }

  // const stripe = await getStripe();
  const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2022-11-15",
  });

  const customerCreate = await stripe.customers.create(
    {
      name: user.firstName + " " + user.lastName,
      email: user.emailAddresses.find(
        (x) => x.id === user.primaryEmailAddressId
      )!.emailAddress,
      metadata: {
        clerkUserId: user.id,
      },
    },
    {
      idempotencyKey: user.id,
    }
  );
  user = await clerkClient.users.updateUser(user.id, {
    publicMetadata: {
      stripeCustomerId: customerCreate.id,
    },
  });
  return user.publicMetadata.stripeCustomerId as string;
};
