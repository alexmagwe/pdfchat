import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import md5 from 'md5'
export async function getContext(query: string) {
  const queryEmbedding = await getEmbeddings(query)
  const contextDocs = await getMatchingEmbeddings(queryEmbedding.values)
  const bestMatches = contextDocs?.filter((doc) => doc.score && doc.score > 0.7)

  const context = bestMatches
    ?.map((d) => d.metadata && d?.metadata.text)
    .join('\n')
    .substring(0, 3000)
  return context
}
export async function getMatchingEmbeddings(vector: number[]) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  })
  try {
    const index = pinecone.index(process.env.PINECONE_INDEX!)
    const result = await index.query({
      vector: vector,
      topK: 5,
      includeMetadata: true,
    })
    return result.matches
  } catch (err) {
    console.error('error querying embeddings', err)
    throw err
  }
}
export const getEmbeddings = async (text: string, fileName?: string) => {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  })
  const res = await embeddings.embedQuery(text)
  return {
    id: md5(text),
    values: res,
    metadata: {
      text: text,
      fileName: fileName ?? '',
    },
  }
}
