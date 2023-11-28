import { NextRequest, NextResponse } from 'next/server'
import { parse, Output } from 'valibot'
import { WebPDFLoader } from 'langchain/document_loaders/web/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import { getEmbeddings } from '@/lib/context'
import { TrainAssistantSchema } from './TrainAssistantSchema'
import { db } from '@/lib/db'
import { documents } from '@/lib/db/schema'
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
    const data = parse(TrainAssistantSchema, resp)
    //1. load files
    const docs = await Promise.all(data.files.map((file) => fileLoader(file)))
    //add correct filename to each page
    docs.forEach((doc, index) => {
      doc.forEach((page) => {
        page.metadata.pdf.info.Title = data.files[index].name
      })
    })
    //2. split documents into smaller chunks
    const chunks = await Promise.all(
      docs.flat().map((doc) => prepareDocument(doc)),
    )
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

    return NextResponse.json({
      message: 'Assistant created successfully',
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}

const fileLoader: (
  file: Output<typeof TrainAssistantSchema>['files'][number],
) => Promise<PDFPage[]> = async (
  file: Output<typeof TrainAssistantSchema>['files'][number],
) => {
  const blob = await fetch(file.url)
    .then((response) => response.blob())
    .then((blob) => {
      return blob
      // do something with the blob object
    })
  const loader = new WebPDFLoader(blob)

  const docs = (await loader.load()) as PDFPage[]
  return docs
}
const prepareDocument = async (page: PDFPage) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1536,
    chunkOverlap: 200,
  })

  const chunks = await splitter.createDocuments(
    [page.pageContent],
    [page.metadata],
    {
      chunkHeader: `DOCUMENT NAME:${page.metadata.pdf.info.Title}\n\n---\n\n`,
      appendChunkOverlapHeader: true,
    },
  )
  return chunks
}
