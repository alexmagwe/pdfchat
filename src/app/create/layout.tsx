import React from 'react'
import FileUpload from '../FileUpload'
import CreateAssitant from './createAssistantForm'
import { ChatAssistants } from './ChatAssistants'

type Props = {
  children: React.ReactNode
}

export default function page({ children }: Props) {
  return (
    <div className="container py-4">
      <div className="grid md:gap-4 lg:gap-8 md:grid-cols-4">
        <ChatAssistants />
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  )
}
