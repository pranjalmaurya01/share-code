'use client'
import {Badge} from '@/components/ui/badge'
import constants from '@/constants'
import {roomDataI} from '@/constants/types'
import {useEffect, useState} from 'react'
import CopyButton from './CopyButton'
import UserAdminList from './UserAdminList'

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

export default function DownloadFiles({
  socket,
  room_id,
  roomData,
}: {
  room_id: string
  socket: any
  roomData: roomDataI
}) {
  const [state, setState] = useState<{
    files: HTMLInputElement[]
  }>({
    files: [],
  })

  useEffect(() => {
    ;(async () => {
      socket.on(constants.EVENTS.GET_FILE, (files: any) => {
        console.log(files)
        setState((prev) => ({...prev, files}))
      })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative h-screen">
      <div className="flex justify-around items-center h-full">
        <div>
          <h3 className="text-xl text-center">Uploaded Files</h3>
          <br />
          <ul className="space-y-1 text-gray-500 list-disc list-inside">
            {state.files.length > 0 ? (
              state.files.map((e, i) => (
                <li
                  className="hover:cursor-pointer hover:text-gray-300"
                  key={i}
                  onClick={() => {
                    recreateFileAndDownload(e)
                  }}
                >
                  {e.name}{' '}
                  <Badge variant="outline" className="font-light text-gray-500">
                    {socket.id}
                  </Badge>
                </li>
              ))
            ) : (
              <p className="text-red-500">No Files Uploaded</p>
            )}
          </ul>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 m-2">
        <UserAdminList
          admins={roomData.admins}
          users={roomData.users}
          socket={socket}
          room_id={room_id}
        />
        <div className="flex justify-center mt-5 mb-2">
          <CopyButton />
        </div>
      </div>
    </div>
  )
}
