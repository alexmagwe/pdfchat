'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import React from 'react'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { useForm } from 'react-hook-form'
import { Output, minLength, object, string } from 'valibot'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import FileUpload from '@/app/FileUpload'
import { Assistant } from '@/lib/db/schema'

type Props = {
  data: Assistant
}
const updateAssistantSchema = object({
  title: string('title required', [
    minLength(3, 'Title must be at least 3 characters'),
  ]),
  systemMessage: string('system message is required', [
    minLength(10, 'System message must be at least 10 characters'),
  ]),
})
export default function UpdateAssistantForm({ data }: Props) {
  const form = useForm({
    resolver: valibotResolver(updateAssistantSchema),
    defaultValues: {
      title: data.title ?? '',
      systemMessage: data.systemMessage,
    },
  })
  const updateAssistant = async (
    data: Output<typeof updateAssistantSchema>,
  ) => {
    console.log('data', data)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col max-w-fit gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(updateAssistant)}>
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
            <FormField
              control={form.control}
              name="systemMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Prompt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FileUpload />
            <Button type="submit" className="my-4">
              Update Assistant
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
