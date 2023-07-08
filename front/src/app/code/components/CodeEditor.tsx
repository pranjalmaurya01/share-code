'use client'

import UserAdminList from '@/app/file/components/UserAdminList'
import constants from '@/constants'
import {roomDataI} from '@/constants/types'
import {Editor} from '@monaco-editor/react'
import {useEffect, useState} from 'react'
import CopyButton from './CopyButton'
import FilesList from './FilesList'

export default function CodeEditor({
  isAdmin,
  roomId,
  socket,
  roomData,
}: {
  isAdmin?: boolean
  roomId: string
  socket: any
  roomData: roomDataI
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
      socket.on(constants.EVENTS.CONNECTION, () => {
        console.log('connected')
      })
      socket.on(constants.EVENTS.GET_CHANGED_CODE, (e: any) => {
        if (e) {
          setState((prev) => ({...prev, code: e}))
        }
      })
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
    if (e && isAdmin) {
      setState((prev) => {
        prev.code[prev.selectedFile].value = e
        socket.emit(constants.EVENTS.ON_CODE_CHANGE, prev.code, roomId)
        return {...prev}
      })
    }
  }

  const selectedCode = state.code[state.selectedFile].value

  function onBlur() {
    socket.emit(constants.EVENTS.ON_CODE_CHANGE, state.code, roomId, true)
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex">
        <div className="flex flex-col justify-between">
          <div>
            <FilesList
              isAdmin={!!isAdmin}
              selectedFile={state.selectedFile}
              code={state.code}
              onSubmit={(fileName: string) => {
                const updatedCode = [...state.code, {file: fileName, value: ''}]
                setState((prev) => ({
                  ...prev,
                  code: updatedCode,
                }))
                socket.emit(
                  constants.EVENTS.ON_CODE_CHANGE,
                  updatedCode,
                  roomId,
                  true
                )
              }}
              onFileSelect={(i: number) => {
                setState((prev) => ({
                  ...prev,
                  selectedFile: i,
                }))
              }}
            />
          </div>
          <div>
            <UserAdminList
              className="!ml-0 truncate pr-2"
              admins={roomData.admins}
              users={roomData.users}
              room_id={roomId}
              socket={socket}
              isAdmin={isAdmin}
            />
            <div className="mt-5">
              <CopyButton
                isAdmin={!!isAdmin}
                roomId={roomId}
                selectedCode={selectedCode}
                selectedFile={state.code[state.selectedFile].file}
              />
            </div>
          </div>
        </div>
        <div onBlur={onBlur} className="w-full">
          <Editor
            options={{readOnly: !isAdmin}}
            value={selectedCode}
            theme="vs-dark"
            height="100vh"
            onChange={(e) => onCodeChange(e)}
            defaultLanguage="javascript"
          />
        </div>
      </div>
    </div>
  )
}
