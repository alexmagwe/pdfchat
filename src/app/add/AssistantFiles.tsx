'use client'
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ExternalLink, Trash } from 'lucide-react'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { Documents } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { Output } from 'valibot'
import { TrainAssistantSchema } from '../api/assistant/train/TrainAssistantSchema'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/ui/spinner'
import { deleteAssistantSchema } from '@/lib/schemas/deleteAssistantSchema'

type AssistantFileProps = {
  files: Documents[]
}
export const AssistantFiles = ({ files }: AssistantFileProps) => {
  const router = useRouter()
  const { isLoading, mutate } = useMutation({
    mutationFn: async (data: Output<typeof deleteAssistantSchema>) => {
      const resp = await axios.delete(`/api/documents?id=${data.id}`)
      return resp.data
    },
    onSuccess: () => {
      router.refresh()

      toast.success('Assistant deleted successfully')
    },
    onError: (error) => {
      console.log('error', error)
      toast.error('Error deleting assistant')
    },
  })
  const { isLoading: Tloading, mutate: trainAssistant } = useMutation({
    mutationFn: async (data: Output<typeof TrainAssistantSchema>) => {
      const resp = await axios.post(`/api/assistant/train`, data)
      return resp.data
    },
    onSuccess: () => {
      toast.success('Assistant trained successfully')
    },
    onError: (error) => {
      console.log('error', error)
      toast.error('Error training assistant')
    },
  })
  const handleDelete = (document: Documents) => {
    mutate({
      id: document.id,
      name: document.name,
    })
  }
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
              <TableCell>
                <Button variant="ghost" onClick={() => handleDelete(file)}>
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <Trash className="text-destructive" size={15} />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CardFooter>
        <div className="flex justify-center w-full">
          <Button
            className="mt-4"
            variant="outline"
            onClick={() =>
              trainAssistant({
                files: files.map((f) => ({
                  name: f.name,
                  url: f.url,
                  size: f.size,
                })),
              })
            }
          >
            {Tloading ? <Spinner /> : 'Train Assistant'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
