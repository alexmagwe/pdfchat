import { array, number, object, optional, string } from 'valibot'

export const CreateDocumentSchema = object({
  files: array(
    object({
      url: string(),
      assistantId: number(),
      size: number(),
      name: string(),
    }),
  ),
})
