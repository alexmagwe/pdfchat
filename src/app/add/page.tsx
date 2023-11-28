import React from 'react'
import FilesForm from './filesForm'
import { AssistantFiles } from './AssistantFiles'
import { db } from '@/lib/db'
import { documents } from '@/lib/db/schema'
import { Card, CardContent } from '@/components/ui/card'

type Props = {}
export const revalidate = 0
export default async function page({}: Props) {
  const files = await db.select().from(documents)
  return (
    <Card className="my-2 border-none ">
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-6">
          <FilesForm />
          {files.length > 0 ? (
            <AssistantFiles files={files} />
          ) : (
            <div className="text-center border rounded-md flex items-center justify-center">
              No documents added
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
