'use client'
import { cn } from '@/lib/utils'
import { Message, useChat } from 'ai/react'
import { Shell, User } from 'lucide-react'
import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
type Props = {
  messages: Message[]
}

export default function Messages({ messages }: Props) {
  React.useEffect(() => {
    const messageContainer = document.getElementById('message-container')
    if (messageContainer) {
      console.log('scrolling', messageContainer.scrollHeight)
      window.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])
  return (
    <div
      id="message-container"
      className="flex-1 px-8 lg:px-36 py-12 2xl:py-16  w-full m-auto flex flex-col gap-4 "
    >
      {messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              message.role == 'assistant' ? ' bg-slate-900' : ' ',
              'flex flex-col rounded-md p-4',
            )}
          >
            <div className="flex gap-4">
              <p className="text-muted-foreground">
                {message.role == 'assistant' ? <Shell /> : <User />}
              </p>
              <p>{message.content}</p>
              <p>{message.name}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="block mx-auto py-16">No History</p>
      )}
    </div>
  )
}
