import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Chat from './Chat'
import { message } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
export const revalidate = 0
export default async function Home() {
  const history = await db.select().from(message).where(eq(message.chatId, 1))
  return (
    <main className="flex-1  py-8 md:py-16 flex flex-col  container">
      <div className="flex flex-col justify-center  items-center">
        <h2 className="text-4xl font-bold">Chat with the Nyansapo AI </h2>
      </div>
      <div className="flex-1 flex flex-col">
        <Chat
          history={history.map((item) => {
            return {
              ...item,
              id: item.id.toString(),
            }
          })}
        />
      </div>
      {/* <UsefulPrompts /> */}
      <div></div>
    </main>
  )
}
const useFullPrompts = [
  {
    title: 'Nyansapo Marketing Assistant',
    description: '',
  },
  {
    title: 'Grant Application Assistant',
    description: '',
  },
  {
    title: 'Nyansapo Customer Service Assistant',
    description: '',
  },
  {
    title: 'Nyansapo Sales Assistant',
    description: '',
  },
  {
    title: 'Nyansapo Legal Assistant',
    description: '',
  },
  {
    title: 'Nyansapo HR Assistant',
    description: '',
  },

  {
    title: 'Nyansapo Research Assistant',
    description: '',
  },
  {
    title: 'Nyansapo Data Science Assistant',
    description: '',
  },

  {
    title: 'Nyansapo Product Development Assistant',
    description: '',
  },
  {
    title: 'Nyansapo UX/UI Assistant',
    description: '',
  },

  {
    title: 'Nyansapo Web Development Assistant',
    description: '',
  },

  {
    title: 'Nyansapo Game Development Assistant',
    description: '',
  },
  {
    title: 'Nyansapo Social Media Assistant',
    description: '',
  },
  {
    title: 'Nyansapo Digital Marketing Assistant',
    description: '',
  },
  {
    title: 'Nyansapo SEO Assistant',
    description: '',
  },
  {
    title: 'Nyansapo Content Marketing Assistant',
    description: '',
  },
  {
    title: 'Nyansapo Copywriting Assistant',
    description: '',
  },
  {
    title: 'Nyansapo Email Marketing Assistant',
    description: '',
  },
  {
    title: 'Nyansapo Growth Hacking Assistant',
    description: '',
  },
  {
    title: 'Nyansapo Sales Assistant',
    description: '',
  },
  {
    title: 'Nyansapo Business Development Assistant',
    description: '',
  },
]
const UsefulPrompts = () => {
  return (
    <Card className="border-none max-w-fit">
      <CardHeader>
        <CardTitle>Assistants</CardTitle>
      </CardHeader>

      <ul className="flex flex-col gap-4">
        {useFullPrompts.map((prompt) => (
          <li key={prompt.title}>
            <Link
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'w-full text-lg text-center p-8',
              )}
              href={`/assistant/${prompt.title}`}
            >
              {prompt.title}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
