import { assistant } from '@/lib/db/schema'
import React from 'react'
import { db } from '@/lib/db'
import UpdateAssistantForm from './updateAssistantForm'
import { eq } from 'drizzle-orm'

type Props = {
  params: {
    id: string
  }
}

export default async function UpdateAssistant({ params: { id } }: Props) {
  const assistants = await db
    .select()
    .from(assistant)
    .where(eq(assistant.id, parseInt(id)))

  return assistants[0] ? (
    <UpdateAssistantForm data={assistants[0]} />
  ) : (
    <p className="p-4 text-destructive text-lg">
      Assistant with that id not found
    </p>
  )
}
