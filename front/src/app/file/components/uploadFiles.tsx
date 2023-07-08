'use client'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {Badge} from '@/components/ui/badge'
import constants from '@/constants'
import {roomDataI} from '@/constants/types'
import {Terminal} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import CopyButton from './CopyButton'
import FilesList from './FilesList'
import UserAdminList from './UserAdminList'

export default function UploadFiles({
  socket,
  room_id,
  roomData,
}: {
  socket: any
  room_id: string
  roomData: roomDataI
}) {
  const router = useRouter()
  const [state, setState] = useState<{
    files: HTMLInputElement[]
    copied: boolean
    showAlert: boolean
  }>({
    files: [],
    copied: false,
    showAlert: false,
  })

  const getPhoto = () => {
    // @ts-expect-error
    const files = document.getElementById('upload_doc').files

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!constants.ALLOWED_FILE_FORMATS.includes(file.type)) {
        setState((prev) => ({...prev, showAlert: true}))
        return
      }

      // Validate file size
      if (file.size > constants.MAX_FILE_SIZE) {
        setState((prev) => ({...prev, showAlert: true}))
        return
      }
    }

    const filesData = [] as any

    const readerPromises = Object.keys(files).map((e) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          filesData.push({
            name: files[e].name,
            data: reader.result,
            from: socket.id,
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
    let timeout: ReturnType<typeof setTimeout>
    if (state.copied) {
      timeout = setTimeout(() => {
        setState((prev) => ({...prev, copied: false}))
      }, 2000)
    }
    return () => timeout && clearTimeout(timeout)
  }, [state.copied])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (state.showAlert) {
      timeout = setTimeout(() => {
        setState((prev) => ({...prev, showAlert: false}))
      }, 5000)
    }
    return () => timeout && clearTimeout(timeout)
  }, [state.showAlert])

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
          <br />
          <Badge variant="outline" className="px-4 py-1">
            ADMIN ({socket.id})
          </Badge>
        </div>
        <input
          accept={constants.ALLOWED_FILE_FORMATS_HTML}
          multiple
          id="upload_doc"
          type="file"
          className="hidden"
          onChange={getPhoto}
        />
        <div className="absolute left-0 top-0 m-1">
          <FilesList socket={socket} files={state.files} />
        </div>
        <div className="absolute bottom-0 left-0">
          <div>
            <UserAdminList
              room_id={room_id}
              isAdmin
              admins={roomData.admins}
              users={roomData.users}
              socket={socket}
            />
            <div className="flex justify-center mt-5 mb-2">
              <CopyButton />
            </div>
          </div>
        </div>
      </div>
      {state.showAlert && (
        <Alert className="absolute top-1">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Alert</AlertTitle>
          <AlertDescription>
            Allowed File Formats are
            <span className="text-red-500 text-base">
              {constants.ALLOWED_FILE_FORMATS_HTML}
            </span>{' '}
            only with max size of{' '}
            <span className="text-red-500 text-base">1MB</span>
          </AlertDescription>
        </Alert>
      )}
    </label>
  )
}
