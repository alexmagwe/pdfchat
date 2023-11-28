import { number, object, string } from 'valibot'

export const deleteAssistantSchema = object({
  id: number(),
  name: string(),
})
