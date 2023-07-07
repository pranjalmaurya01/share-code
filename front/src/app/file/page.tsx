'use client'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import constants from '@/constants'
import {useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'
import {io} from 'socket.io-client'
import DownloadFiles from './components/DownloadFiles'
import UploadFiles from './components/uploadFiles'

let socket: any
export type roomDataI = {users: string[]; admins: string[]}

export default function ShareFile() {
  const [state, setState] = useState<{
    isAdmin: null | boolean
    isLoading: boolean
    roomData: roomDataI
  }>({
    isAdmin: null,
    isLoading: false,
    roomData: {users: [], admins: []},
  })
  const router = useRouter()
  const params = useSearchParams()

  const updateState = (newValues: any) => {
    setState((prev) => ({...prev, ...newValues}))
  }

  const roomId = params.get('room_id')

  useEffect(() => {
    if (!roomId) {
      updateState({isAdmin: null})
    }
  }, [roomId])

  useEffect(() => {
    ;(async () => {
      if (!socket) {
        socket = io(constants.baseUrl)
        socket.on(constants.EVENTS.CONNECTION, () => {
          console.log('connected')
        })
        socket.on(
          constants.EVENTS.ROOM_JOINED,
          (room_id: string, roomData: any, isAdmin: boolean) => {
            router.push(`?room_id=${room_id}`)
            console.log(roomData)
            updateState({isAdmin, roomData})
          }
        )
        socket.on(
          constants.EVENTS.GET_USERS,
          (roomData: {admins: string[]; users: string[]}) => {
            updateState({roomData})
            console.log(roomData)
          }
        )
        socket.on(constants.EVENTS.GET_FILE, (files: any) => {
          console.log(files)
          setState((prev) => ({...prev, files}))
        })
      }
      if (roomId) {
        socket.emit(constants.EVENTS.GENERATE_AND_JOIN_ROOM, roomId)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Generating New Room And Making You Admin</p>
      </div>
    )
  }

  if (state.isAdmin === null)
    return (
      <div className="flex justify-center items-center h-screen">
        <Button
          variant="link"
          className="text-4xl"
          onClick={() => {
            // setState((prev) => ({...prev, isAdmin: true}))
            if (socket) socket.emit(constants.EVENTS.GENERATE_AND_JOIN_ROOM)
          }}
        >
          Send
        </Button>
        <span className="text-5xl">&nbsp;/&nbsp;</span>
        <Button
          variant="link"
          className="text-4xl"
          onClick={() => {
            updateState({isAdmin: false})
          }}
        >
          Receive
        </Button>
      </div>
    )

  if (!state.isAdmin && !roomId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <form
          name="roomForm"
          onSubmit={(e) => {
            e.preventDefault()
            // @ts-expect-error
            const room = document.forms.roomForm?.room
              .value as unknown as string
            if (socket)
              socket.emit(constants.EVENTS.GENERATE_AND_JOIN_ROOM, room)
          }}
        >
          <Input placeholder="Join Room" name="room" />
        </form>
      </div>
    )
  }

  if (state.isAdmin && roomId) {
    return (
      <UploadFiles socket={socket} room_id={roomId} roomData={state.roomData} />
    )
  }

  if (!state.isAdmin && roomId) {
    return (
      <DownloadFiles
        socket={socket}
        room_id={roomId}
        roomData={state.roomData}
      />
    )
  }

  return null
}
