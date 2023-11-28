'use client'
import React from 'react'

type Props = {
  error: Error
}

const error = (props: Props) => {
  return <div>{props.error.message}</div>
}
export default error
