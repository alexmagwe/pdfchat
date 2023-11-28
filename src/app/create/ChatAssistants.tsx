import React from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const assistants = [
  {
    title: 'Nyansapo Marketing Assistant',
    description: '',
    id: 1,
  },
  {
    title: 'Grant Application Assistant',
    description: '',
    id: 2,
  },
  {
    title: 'Nyansapo Customer Service Assistant',
    description: '',
    id: 3,
  },
  {
    title: 'Nyansapo Sales Assistant',
    description: '',
    id: 4,
  },
  {
    title: 'Nyansapo Legal Assistant',
    description: '',
    id: 5,
  },
  {
    title: 'Nyansapo HR Assistant',
    description: '',
    id: 6,
  },

  {
    title: 'Nyansapo Research Assistant',
    description: '',
    id: 7,
  },
  {
    title: 'Nyansapo Data Science Assistant',
    description: '',
    id: 8,
  },
]
export const ChatAssistants = () => {
  return (
    <div className="max-w-fit py-4">
      <div className="flex justify-between">
        <h2 className="text-2xl mb-4 font-bold">Assistants</h2>
        <Link href="/admin" className={buttonVariants({ variant: 'default' })}>
          <Plus />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1   mt-4 gap-4">
        {assistants.map((assistant, i) => {
          return (
            <Link
              href={`/admin/assistants/${assistant.id}`}
              key={i}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'max-h-fit py-8 ',
              )}
            >
              <p className="text-lg font-bold w-full">{assistant.title}</p>
              <p className="text-sm">{assistant.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
