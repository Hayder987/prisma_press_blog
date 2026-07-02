import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";

// convert endtime millisec to date string
export const getPeriodEnd = (payload: Stripe.Subscription) => {
  const getCurrentPeriodEndInmillisec =
    payload.items.data[0]?.current_period_end!;

  const getCurrentPeriodEnd = new Date(getCurrentPeriodEndInmillisec * 1000);
  return getCurrentPeriodEnd;
};


// Occurs when a Checkout Session has been successfully completed. handler
export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const userId = session.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    throw new Error("Webhook Failed!");
  }

  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);
  console.log("sub info", stripeSubscription.items.data[0]);

  const currentPeriodEnd = getPeriodEnd(stripeSubscription);

  await prisma.subscription.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
  });
};


