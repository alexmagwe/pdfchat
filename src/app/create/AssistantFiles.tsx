'use client'
import React from 'react'
import { UploadFileResponse } from 'uploadthing/client'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ExternalLink } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/card'

type AssistantFileProps = {
  files: UploadFileResponse[]
}
export const AssistantFiles = ({ files }: AssistantFileProps) => {
  return (
    <Card className=" w-full">
      <CardHeader>
        <h2 className="text-2xl font-bold ">Assistant Training Material</h2>
      </CardHeader>
      <Table>
        <TableCaption>
          A list of source material for the assistant.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Url</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.url}>
              <TableCell className="font-medium">{file.name}</TableCell>
              <TableCell>
                {(file.size / (1024 * 1024)).toFixed(1)}&nbsp;MB{' '}
              </TableCell>
              <TableCell>
                <a
                  href={file.url}
                  className="text-accent"
                  target="_blank"
                  rel="no-referer"
                >
                  <ExternalLink />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
