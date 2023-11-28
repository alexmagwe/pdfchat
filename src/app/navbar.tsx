import React from 'react'
import { UserButton, auth } from '@clerk/nextjs'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SubscribeButton } from './SubscribeButton'
import { isPro } from '@/utils/getSubscription'

type Props = {}

export default async function Navbar({}: Props) {
  const { userId } = auth()
  const isProUser = await isPro()

  return (
    <div className="sticky container top-0 py-4 lg:py-6 flex justify-between">
      <div>
        <Link href="/">Nyansapo GPT</Link>
      </div>
      {userId ? (
        <div className="flex items-center gap-4">
          {isProUser ? <SubscribeButton isProUser={isProUser} /> : null}
          <Link className={buttonVariants({ variant: 'default' })} href="/add">
            <Plus />
            &nbsp; Add documents
          </Link>
          <div className="bg-white max-w-fit rounded-full">
            <UserButton />
          </div>
        </div>
      ) : (
        <Link href="/sign-in">Sign In</Link>
      )}
    </div>
  )
}
