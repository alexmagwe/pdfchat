'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import React, { useState } from 'react'
import axios from 'axios'
import { Output, parse } from 'valibot'
import FileUpload from '../FileUpload'
import { UploadFileResponse } from 'uploadthing/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Spinner from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CreateDocumentSchema } from '../api/documents/CreateDocumentSchema'
type Props = {}

export default function FilesForm({}: Props) {
  const router = useRouter()
  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: Output<typeof CreateDocumentSchema>) => {
      const resp = await axios.post('/api/documents', data)
      return resp.data
    },
    onSuccess: () => {
      toast.success('Files added successfully')
      router.refresh()
    },
    onError: (error) => {
      console.log('error', error)
      toast.error('Error uploading files')
    },
  })

  const handleSave = async (files: UploadFileResponse[]) => {
    if (files.length === 0) {
      toast.error('Please upload a file')
      return
    }
    let payload = {
      files: [
        {
          name: files[0].name,
          size: files[0].size,
          url: files[0].url,
          assistantId: 1,
        },
      ],
    }
    try {
      console.log('payload', payload)
      const data = parse(CreateDocumentSchema, payload)

      mutate(data)
    } catch (error) {
      console.log('error', error)
    }
  }
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-xl">Upload Training Documents</CardTitle>
        <CardDescription>
          Upload content that the Assistant can be trained with
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center  gap-6">
        {isLoading ? <Spinner /> : <FileUpload callback={handleSave} />}
      </CardContent>
    </Card>
  )
}
