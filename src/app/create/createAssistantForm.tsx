'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { valibotResolver } from '@hookform/resolvers/valibot'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Output, minLength, object, parse, string } from 'valibot'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import FileUpload from '../FileUpload'
import { UploadFileResponse } from 'uploadthing/client'
import { AssistantFiles } from './AssistantFiles'
import { useMutation } from '@tanstack/react-query'
import { CreateAssistantSchema } from '../api/assistant/CreateAssistantSchema'
import { Loader2 } from 'lucide-react'
type Props = {}

const createAssistantSchema = object({
  title: string('title required', [
    minLength(3, 'Title must be at least 3 characters'),
  ]),
})
export default function CreateAssistantForm({}: Props) {
  const [files, setFiles] = useState<UploadFileResponse[]>([])
  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: Output<typeof CreateAssistantSchema>) => {
      const resp = await axios.post('/api/assistant', data)
      return resp.data
    },
    onSuccess: () => {
      setFiles([])
    },
    onError: (error) => {
      console.log('error', error)
    },
  })
  const form = useForm({
    resolver: valibotResolver(createAssistantSchema),
    defaultValues: {
      title: '',
    },
  })
  const handleSubmit = async (data: Output<typeof createAssistantSchema>) => {
    console.log('data', data)
    if (files.length === 0) return alert('Please upload a file')
    let payload = {
      ...data,
      files,
    }
    try {
      const parsedPayload = parse(CreateAssistantSchema, payload)
      mutate(parsedPayload)
    } catch (error) {
      console.log('error', error)
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create AI Assistant</CardTitle>
        <CardDescription>
          Create a specialised assistant to perform specific tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col  gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assistant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FileUpload />
              </div>
              {files.length > 0 && <AssistantFiles files={files} />}
            </div>
            <div className="flex mt-4 justify-center">
              <Button type="submit">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Create Assistant'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
