import { array, number, object, optional, string } from 'valibot'

export const TrainAssistantSchema = object({
  files: array(
    object({
      name: string(),
      size: number(),
      key: optional(string()),
      url: string(),
    }),
  ),
})
