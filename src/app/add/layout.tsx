import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function page({ children }: Props) {
  return (
    <div className="container py-4">
      <div>{children}</div>
    </div>
  )
}
