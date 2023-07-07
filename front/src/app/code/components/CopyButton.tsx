'use client'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {useState} from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

export default function CopyButton({
  isAdmin,
  roomId,
  selectedCode,
  selectedFile,
}: {
  isAdmin: boolean
  roomId: string
  selectedCode: string
  selectedFile: string
}) {
  const [state, setState] = useState<{
    copied: boolean
  }>({
    copied: false,
  })

  return (
    <>
      {isAdmin ? (
        <div className="flex justify-center mb-2">
          {state.copied ? (
            <p className="text-gray-400 py-2">Copied to clipboard</p>
          ) : (
            <CopyToClipboard
              text={roomId}
              onCopy={() => setState((prev) => ({...prev, copied: true}))}
            >
              <Button variant="outline">
                Copy Room ID
                <Badge
                  variant="outline"
                  className="font-light text-gray-500 ml-2"
                >
                  {roomId}
                </Badge>
              </Button>
            </CopyToClipboard>
          )}
        </div>
      ) : (
        <div className="flex justify-center mb-2">
          {state.copied ? (
            <p className="text-gray-400 py-2">Copied to clipboard</p>
          ) : (
            <CopyToClipboard
              text={selectedCode}
              onCopy={() => setState((prev) => ({...prev, copied: true}))}
            >
              <Button variant="outline">
                Copy Code
                <Badge
                  variant="outline"
                  className="font-light text-gray-300 ml-2"
                >
                  {selectedFile}
                </Badge>
              </Button>
            </CopyToClipboard>
          )}
        </div>
      )}
    </>
  )
}
