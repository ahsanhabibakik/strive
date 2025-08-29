import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/config";
import { STRIPE_CONFIG } from "@/lib/stripe/config";
import connectToDatabase from "@/lib/mongoose";
import { User } from "@/lib/models/User";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      if (!stripe) {
        throw new Error("Stripe not initialized");
      }
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_CONFIG.webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await connectToDatabase();

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId || !planId) {
      console.error("Missing metadata in checkout session");
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return;
    }

    // Update user with customer ID and subscription info
    user.subscription = {
      ...user.subscription,
      customerId: session.customer as string,
      plan: planId as any,
      status: "active",
      startDate: new Date(),
    };

    await user.save();

    console.warn(`Checkout completed for user ${userId}, plan ${planId}`);
  } catch (error) {
    console.error("Error handling checkout completed:", error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;

    const user = await User.findOne({ "subscription.customerId": customerId });
    if (!user) {
      console.error("User not found for customer:", customerId);
      return;
    }

    user.subscription = {
      ...user.subscription,
      subscriptionId: subscription.id,
      status: subscription.status as any,
      startDate: new Date((subscription as any).current_period_start * 1000),
      endDate: new Date((subscription as any).current_period_end * 1000),
    };

    await user.save();

    console.warn(`Subscription created for user ${user._id}`);
  } catch (error) {
    console.error("Error handling subscription created:", error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;

    const user = await User.findOne({ "subscription.customerId": customerId });
    if (!user) {
      console.error("User not found for customer:", customerId);
      return;
    }

    // Determine plan based on price ID
    let planId = "free";
    if (subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0].price.id;
      if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
        planId = "pro";
      } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
        planId = "enterprise";
      }
    }

    user.subscription = {
      ...user.subscription,
      plan: planId as any,
      status: subscription.status as any,
      endDate: new Date((subscription as any).current_period_end * 1000),
    };

    await user.save();

    console.warn(`Subscription updated for user ${user._id}, new plan: ${planId}`);
  } catch (error) {
    console.error("Error handling subscription updated:", error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;

    const user = await User.findOne({ "subscription.customerId": customerId });
    if (!user) {
      console.error("User not found for customer:", customerId);
      return;
    }

    // Downgrade to free plan
    user.subscription = {
      ...user.subscription,
      plan: "free",
      status: "cancelled",
      endDate: new Date(),
      subscriptionId: null,
    };

    await user.save();

    console.warn(`Subscription cancelled for user ${user._id}, downgraded to free`);
  } catch (error) {
    console.error("Error handling subscription deleted:", error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;

    const user = await User.findOne({ "subscription.customerId": customerId });
    if (!user) {
      console.error("User not found for customer:", customerId);
      return;
    }

    // Update last payment date
    if (user.subscription) {
      user.subscription.lastPaymentDate = new Date();
      await user.save();
    }

    console.warn(`Payment succeeded for user ${user._id}`);
  } catch (error) {
    console.error("Error handling payment succeeded:", error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;

    const user = await User.findOne({ "subscription.customerId": customerId });
    if (!user) {
      console.error("User not found for customer:", customerId);
      return;
    }

    // Could implement email notifications here
    console.warn(`Payment failed for user ${user._id}`);

    // You might want to send an email notification to the user here
    // or update their account status
  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
}
