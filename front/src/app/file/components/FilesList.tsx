'use client'

import {Badge} from '@/components/ui/badge'

export default function FilesList({
  files,
  socket,
}: {
  files: HTMLInputElement[]
  socket: any
}) {
  return (
    <>
      <h3 className="text-xl">
        Uploaded Files{' '}
        <Badge variant="outline" className="font-light text-gray-500">
          {socket.id}
        </Badge>
      </h3>
      <br />
      <ul className="ml-5 max-w-md space-y-1 text-gray-500 list-disc list-inside">
        {files.map((e, i) => (
          <li key={i}>{e.name}</li>
        ))}
      </ul>
    </>
  )
}
