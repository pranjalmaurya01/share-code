'use client'

import {Button} from '@/components/ui/button'
import constants from '@/constants'
import {useEffect, useState} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {io} from 'socket.io-client'

let socket: any

const recreateFileAndDownload = (fileData: any) => {
  const dataUrl = fileData.data
  const base64Data = dataUrl.split(',')[1]
  const fileType = dataUrl.split(':')[1].split(';')[0]
  const byteCharacters = atob(base64Data)
  const byteArrays = []

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i))
  }

  const blob = new Blob([new Uint8Array(byteArrays)], {type: fileType})
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = fileData.name
  link.click()

  URL.revokeObjectURL(url)
}

export default function FileUpload({
  isSender,
  room_id,
}: {
  isSender: boolean
  room_id: string
}) {
  const [state, setState] = useState<{
    files: HTMLInputElement[]
    copied: boolean
    users: {users: string[]; admins: string[]}
  }>({
    files: [],
    copied: false,
    users: {users: [], admins: []},
  })
  const getPhoto = () => {
    // @ts-expect-error
    const files = document.getElementById('upload_doc').files

    const filesData = [] as any

    const readerPromises = Object.keys(files).map((e) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          filesData.push({
            name: files[e].name,
            data: reader.result,
          })
          resolve('')
        }
        reader.readAsDataURL(files[e])
      })
    })

    Promise.all(readerPromises).then(() => {
      socket.emit(
        constants.EVENTS.FILE_UPLOAD,
        [...state.files, ...filesData],
        room_id
      )
      setState((prev) => ({...prev, files: [...prev.files, ...filesData]}))
    })
  }

  useEffect(() => {
    ;(async () => {
      socket = io(constants.baseUrl)

      socket.on(constants.EVENTS.CONNECTION, () => {
        console.log('connected')
      })
      if (room_id) {
        socket.emit(constants.EVENTS.JOIN_ROOM, room_id)
      }
      socket.on(constants.EVENTS.GET_FILE, (files: any) => {
        setState((prev) => ({...prev, files}))
      })
      socket.on(
        constants.EVENTS.GET_USERS,
        (users: {admins: string[]; users: string[]}) => {
          setState((prev) => ({...prev, users}))
        }
      )
      socket.on(constants.EVENTS.GET_FILE, (files: any) => {
        console.log(files)
        setState((prev) => ({...prev, files}))
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

  const userAdmin = () => (
    <div className="ml-5 m-1">
      <h3 className="text-xl">ADMINS</h3>
      <br />
      <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
        {state.users.admins.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
      <h3 className="text-xl">USERS</h3>
      <br />
      <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
        {state.users.users.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  )

  if (isSender)
    return (
      <label htmlFor="upload_doc">
        <div className="flex w-full min-h-screen">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full relative">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload Any File Format
            </p>
          </div>
          <input
            accept={constants.ALLOWED_FILE_FORMATS}
            multiple
            id="upload_doc"
            type="file"
            className="hidden"
            onChange={getPhoto}
          />
          <div className="absolute left-0 top-0 m-1">
            <h3 className="text-xl">Uploaded Files</h3>
            <br />
            <ul className="ml-5 max-w-md space-y-1 text-gray-500 list-disc list-inside">
              {state.files.map((e, i) => (
                <li key={i}>{e.name}</li>
              ))}
            </ul>
          </div>
          <div className="absolute top-0 right-0 m-1">
            <div className="flex">
              {isSender && (
                <div className="flex justify-end mb-2">
                  {state.copied ? (
                    <p className="py-2 px-1 text-green-500">Room Id Copied</p>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CopyToClipboard
                        text={room_id}
                        onCopy={() => {
                          setTimeout(() => {
                            setState((prev) => ({...prev, copied: true}))
                          })
                        }}
                      >
                        <p>Copy Room ID</p>
                      </CopyToClipboard>
                    </Button>
                  )}
                </div>
              )}
              {userAdmin()}
            </div>
          </div>
        </div>
      </label>
    )
  return (
    <div className="flex justify-between">
      <div className="m-1 mr-1">
        <h3 className="text-xl">Uploaded Files</h3>
        <br />
        <ul className="ml-5 max-w-md space-y-1 text-gray-500 list-disc list-inside">
          {state.files.map((e, i) => (
            <li
              className="hover:cursor-pointer hover:text-gray-300"
              key={i}
              onClick={() => {
                recreateFileAndDownload(e)
              }}
            >
              {e.name}
            </li>
          ))}
        </ul>
      </div>
      {userAdmin()}
    </div>
  )
}
