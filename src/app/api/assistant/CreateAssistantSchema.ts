import { array, number, object, string } from 'valibot'

export const CreateAssistantSchema = object({
  title: string(),
  files: array(
    object({
      name: string(),
      size: number(),
      key: string(),
      url: string(),
    }),
  ),
})
