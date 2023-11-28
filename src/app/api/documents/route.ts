import { db } from '@/lib/db'
import { documents } from '@/lib/db/schema'
import { pinecone } from '@/lib/pinecone'
import { utapi } from 'uploadthing/server'

import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { object, parse, string } from 'valibot'
import { deleteAssistantSchema } from '@/lib/schemas/deleteAssistantSchema'
import { CreateDocumentSchema } from './CreateDocumentSchema'
const contextSchema = object({
  id: string(),
})
export const DELETE = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const searchParams = { id: params.get('id') }

  try {
    const payload = parse(contextSchema, searchParams)
    const index = pinecone.Index(process.env.PINECONE_INDEX!)
    const file = await db
      .select()
      .from(documents)
      .where(eq(documents.id, parseInt(payload.id)))
      .limit(1)

    await index.deleteAll()
    await utapi.deleteFiles(file[0].name)
    await db.delete(documents).where(eq(documents.id, parseInt(payload.id)))

    console.log('delete file', file)
    return NextResponse.json({
      mesage: 'Delete successfully',
    })
  } catch (err) {
    console.error(err)
    NextResponse.error()
  }
}
export const POST = async (req: NextRequest) => {
  const data = await req.json()
  try {
    const payload = parse(CreateDocumentSchema, data)
    await db.insert(documents).values(payload.files)
    return NextResponse.json({
      mesage: 'Create successfully',
    })
  } catch (err) {
    console.error(err)
    NextResponse.error()
  }
}
