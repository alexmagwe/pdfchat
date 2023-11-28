'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import Spinner from '@/components/ui/spinner'

type Props = { isProUser: boolean }
export const SubscribeButton = ({ isProUser }: Props) => {
  const { isPending, mutate } = useMutation({
    mutationFn: () => axios.get('http://localhost:3000/api/stripe'),
    onSuccess: ({ data }) => {
      console.log(data)
      if (data.url) {
        window.location.href = data.url
      }
    },
    onError: (error) => {
      console.log(error)
      toast.error(error.message)
    },
  })
  return (
    <div>
      <Button disabled={isPending} onClick={() => mutate()}>
        {isPending ? (
          <Spinner />
        ) : isProUser ? (
          'Manage Subscription'
        ) : (
          ' Upgrade to Pro'
        )}
      </Button>
    </div>
  )
}
