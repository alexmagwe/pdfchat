import { getContext } from '@/lib/context'
import { db } from '@/lib/db'
import { message } from '@/lib/db/schema'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Message } from 'ai/react'
import { NextRequest } from 'next/server'
import { Configuration, OpenAIApi } from 'openai-edge'

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: NextRequest) {
  // Extract the `messages` from the body of the request
  const { messages, chatId } = await req.json()
  // const _chat = await db.select().from(chat).where(eq(chat.id, chatId))
  // if (!_chat) {
  //   return NextResponse.json({ error: 'chat not found' }, { status: 404 })
  // }

  console.log('messages', messages)
  const lastMessage = messages[messages.length - 1] as Message
  const context = await getContext(
    (messages[messages.length - 1] as Message).content,
  )
  const prompt = {
    role: 'system',
    content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant will return responses in markdown format.
      START CONTEXT BLOCK
      ${context ? context : ''}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
     
      `,
  }
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,

    messages: [
      prompt,
      ...messages.filter((message: Message) => message.role === 'user'),
    ],
  })
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onStart: async () => {
      await db.insert(message).values({
        chatId: chatId,
        content: lastMessage.content,
        role: 'user',
      })
    },
    onCompletion: async (response: string) => {
      await db.insert(message).values({
        chatId: chatId,
        content: response,
        role: 'assistant',
      })
    },
  })
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
