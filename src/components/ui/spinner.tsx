import { Loader } from 'lucide-react'
import React from 'react'

type Props = {}

export default function Spinner({}: Props) {
    return (
        <span className="animate-spin">
            <Loader size={20} />
        </span>
    )
}
