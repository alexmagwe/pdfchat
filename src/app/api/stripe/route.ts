import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { stripe } from '@/lib/stripe'
import { auth, currentUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  try {
    const { userId } = auth()
    console.log(userId)
    const user = await currentUser()
    if (!userId) {
      return NextResponse.redirect('http://localhost:3000/login')
    }
    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1)
    if (userSubscriptions[0] && userSubscriptions[0].stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscriptions[0].stripeCustomerId,
        return_url: process.env.NEXT_BASE_URL + '/',
      })
      return NextResponse.json({ url: stripeSession.url })
    }
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: process.env.NEXT_BASE_URL + '/success',
      cancel_url: process.env.NEXT_BASE_URL + '/cancel',
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user?.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: 'Nyansapo AI pro',
              description: 'Unlimited Assitants',
            },
            unit_amount: 1000,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    })
    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
