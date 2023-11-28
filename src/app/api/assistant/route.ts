import { NextRequest, NextResponse } from 'next/server'
import { parse, Output } from 'valibot'
import { WebPDFLoader } from 'langchain/document_loaders/web/pdf'
import { CreateAssistantSchema } from './CreateAssistantSchema'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { db } from '@/lib/db'
import { assistant } from '@/lib/db/schema'
import { getEmbeddings } from '@/lib/context'
import { pinecone } from '@/lib/pinecone'

type PDFInfo = {
  PDFFormatVersion: string
  IsAcroFormPresent: boolean
  IsXFAPresent: boolean
  Title: string
  Creator: string
  Producer: string
  CreationDate: string
  ModDate: string
}

type PDF = {
  version: string
  info: PDFInfo
  metadata: null
  totalPages: number
}
type PDFPage = {
  pageContent: string
  metadata: {
    pdf: PDF
    loc: {
      pageNumber: number
    }
  }
}

export const POST = async (req: NextRequest) => {
  const resp = await req.json()
  try {
    const data = parse(CreateAssistantSchema, resp)
    //1. load files
    const docs = await Promise.all(data.files.map((file) => fileLoader(file)))

    //2. split documents into smaller chunks
    const chunks = await Promise.all(docs.map((doc) => prepareDocument(doc)))
    console.log('chunks>>>>>>>>>>>')
    console.log(chunks.map((chunk) => chunk.map((c) => c.metadata)))

    //3. get embeddings for each chunk
    const embeddings = await Promise.all(
      chunks
        .flat()
        .map((chunk) =>
          getEmbeddings(chunk.pageContent, chunk.metadata.pdf.info.Title),
        ),
    )

    //4. save vectors to db

    const index = pinecone.Index(process.env.PINECONE_INDEX!)
    // const assistant = index.namespace(data.title)
    // await assistant.upsert(embeddings)
    await index.upsert(embeddings)
    await db
      .insert(assistant)
      .values({
        title: data.title,
      })
      .onConflictDoNothing()
    return NextResponse.json({
      message: 'Assistant created successfully',
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}

const fileLoader: (
  file: Output<typeof CreateAssistantSchema>['files'][number],
) => Promise<PDFPage> = async (
  file: Output<typeof CreateAssistantSchema>['files'][number],
) => {
  const blob = await fetch(file.url)
    .then((response) => response.blob())
    .then((blob) => {
      return blob
      // do something with the blob object
    })
  const loader = new WebPDFLoader(blob)

  const docs = (await loader.load()) as PDFPage[]
  return docs[0]
}
const prepareDocument = async (page: PDFPage) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1536,
    chunkOverlap: 200,
  })

  const chunks = await splitter.createDocuments([page.pageContent], [], {
    chunkHeader: `DOCUMENT NAME:${page.metadata.pdf.info.Title}\n\n---\n\n`,
    appendChunkOverlapHeader: true,
  })
  return chunks
}
