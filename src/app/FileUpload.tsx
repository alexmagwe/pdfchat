'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Inbox } from 'lucide-react'
import React from 'react'
import '@uploadthing/react/styles.css'
import { UploadButton } from '@/utils/uploadthing'
import { UploadFileResponse } from 'uploadthing/client'
import { toast } from 'sonner'

type Props = {
  callback?: (files: UploadFileResponse[]) => void
}

export default function FileUpload({ callback }: Props) {
  return (
    <div className="flex gap-4 flex-col items-center cursor-pointer rounded-md  border-dashed p-6 px-12">
      <Inbox />
      <UploadButton
        endpoint="fileUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          if (res && res.length > 0) {
            callback && callback(res)
          }
        }}
        onUploadError={(error: Error) => {
          console.log(error.message)
          toast.error(error.message)
          // Do something with the error.
          //   alert(`ERROR! ${error.message}`)
        }}
      />
    </div>
  )
}
