'use client'
import React from 'react'
import { Message, useChat } from 'ai/react'
import { Input } from '@/components/ui/input'
import { SendHorizonal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Messages from './Messages'

type Props = {
  chatId?: number
  history: Message[]
}

export default function Chat({ chatId, history }: Props) {
  const { input, handleInputChange, messages, handleSubmit } = useChat({
    initialMessages: history,
    api: '/api/chat',
    body: {
      chatId: chatId ?? 1, //1 is the  chat id for the default chat
    },
  })
  return (
    <div className="flex-1 flex flex-col">
      <Messages messages={messages} />
      <form
        className=" fixed bottom-0 backdrop-blur-xl py-8 left-0 w-full z-50 flex gap-4 justify-center items-center"
        onSubmit={handleSubmit}
      >
        <Input
          placeholder="Ask me anything about Nyansapo AI..."
          className="max-w-[750px] "
          value={input}
          onChange={handleInputChange}
        />
        <Button type="submit">
          <SendHorizonal />
        </Button>
      </form>
    </div>
  )
}
