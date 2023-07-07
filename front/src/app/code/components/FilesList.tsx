'use client'

import {Input} from '@/components/ui/input'

export default function FilesList({
  onSubmit,
  isAdmin,
  selectedFile,
  onFileSelect,
  code,
}: {
  isAdmin: boolean
  onFileSelect: (i: number) => void
  onSubmit: (fileName: string) => void
  selectedFile: number
  code: {file: string; value: string}[]
}) {
  return (
    <>
      <h3 className="text-xl m-1">Files</h3>
      <br />
      <ul className="space-y-1 text-gray-500 list-disc list-inside">
        {code.map((e, i) => (
          <li
            className={`hover:cursor-pointer ${
              selectedFile === i && 'text-gray-300'
            }`}
            key={i}
            onClick={() => onFileSelect(i)}
          >
            {e.file}
          </li>
        ))}
      </ul>
      <div className="m-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const fileInput = document.getElementById('fileName')
            // @ts-expect-error
            const fileName = fileInput.value
            // @ts-expect-error
            fileInput.value = ''
            onSubmit(fileName)
          }}
        >
          <Input
            placeholder={isAdmin ? 'Create New File' : 'NOT ALLOWED'}
            id="fileName"
            disabled={!isAdmin}
          />
        </form>
      </div>
    </>
  )
}
