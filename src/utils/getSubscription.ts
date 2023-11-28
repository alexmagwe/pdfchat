import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
const DAY_IN_MS = 1000 * 60 * 60 * 24
export const isPro = async () => {
  const { userId } = await auth()
  if (!userId) return false

  try {
    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1)
    const userSubscription = userSubscriptions[0]
    if (!userSubscription) return false
    const isValid =
      userSubscription.stripePriceId &&
      userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
        Date.now()
    return !!isValid
  } catch (error) {
    console.log(error)
    return false
  }
}
