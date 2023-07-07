'use client'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import constants from '@/constants'
import {generateRandomId} from '@/lib/utils'
import {Editor} from '@monaco-editor/react'
import {useEffect, useState} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {io} from 'socket.io-client'

const roomId = generateRandomId()
let socket: any

export default function CodeEditor({
  isSender,
  room_id,
}: {
  isSender: boolean
  room_id?: string
}) {
  const [state, setState] = useState<{
    copied: boolean
    code: {file: string; value: string}[]
    selectedFile: number
  }>({
    code: [{file: 'default.js', value: ''}],
    copied: false,
    selectedFile: 0,
  })

  useEffect(() => {
    ;(async () => {
      socket = io(constants.baseUrl)

      socket.on(constants.EVENTS.CONNECTION, () => {
        console.log('connected')
      })
      socket.on(constants.EVENTS.GET_CHANGED_CODE, (e: any) => {
        if (e) {
          setState((prev) => ({...prev, code: e}))
        }
      })
      if (room_id) {
        socket.emit(constants.EVENTS.JOIN_ROOM, room_id)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (state.copied) {
      timeout = setTimeout(() => {
        setState((prev) => ({...prev, copied: false}))
      }, 2000)
    }
    return () => timeout && clearTimeout(timeout)
  }, [state.copied])

  const onCodeChange = (e: string | undefined) => {
    if (e) {
      setState((prev) => {
        prev.code[prev.selectedFile].value = e
        socket.emit(constants.EVENTS.ON_CODE_CHANGE, prev.code, roomId)
        return {...prev}
      })
    }
  }

  const selectedCode = state.code[state.selectedFile].value

  return (
    <div className="flex m-2 flex-col">
      {isSender ? (
        <div className="flex justify-end mb-2">
          {state.copied ? (
            <p className="py-2 px-1 text-green-500">Room Id Copied</p>
          ) : (
            <CopyToClipboard
              text={roomId}
              onCopy={() => setState((prev) => ({...prev, copied: true}))}
            >
              <Button variant="outline">Copy Room ID</Button>
            </CopyToClipboard>
          )}
        </div>
      ) : (
        <div className="flex justify-end mb-2">
          {state.copied ? (
            <p className="py-2 px-1 text-green-500">copied to clipboard</p>
          ) : (
            <CopyToClipboard
              text={selectedCode}
              onCopy={() => setState((prev) => ({...prev, copied: true}))}
            >
              <Button variant="outline">Copy Code</Button>
            </CopyToClipboard>
          )}
        </div>
      )}

      <div className="flex">
        <div>
          <h3 className="text-xl m-1">Files</h3>
          <br />
          <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
            {state.code.map((e, i) => (
              <li
                className={`hover:cursor-pointer ${
                  state.selectedFile === i && 'text-gray-300'
                }`}
                key={i}
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    selectedFile: i,
                  }))
                }
              >
                {e.file}
              </li>
            ))}
          </ul>
          <div className="m-2">
            <form
              name="fileForm"
              onSubmit={(e) => {
                e.preventDefault()
                // @ts-expect-error
                const fileName = document.forms.fileForm?.fileName
                  .value as unknown as string
                // @ts-expect-error
                document.getElementById('fileName').value = ''
                setState((prev) => {
                  prev.code = [...prev.code, {file: fileName, value: ''}]
                  socket.emit(
                    constants.EVENTS.ON_CODE_CHANGE,
                    prev.code,
                    roomId
                  )
                  return {
                    ...prev,
                  }
                })
              }}
            >
              <Input
                placeholder="Create New File"
                name="fileName"
                id="fileName"
              />
            </form>
          </div>
        </div>
        <Editor
          value={selectedCode}
          theme="vs-dark"
          height="90vh"
          onChange={(e) => onCodeChange(e)}
          defaultLanguage="javascript"
        />
      </div>
    </div>
  )
}
