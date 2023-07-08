'use client'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import constants from '@/constants'
import {roomDataI} from '@/constants/types'
import useSocket from '@/stores/useSocket'
import {useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'
import CodeEditor from './components/CodeEditor'

export default function ShareFile() {
  const [state, setState] = useState<{
    isAdmin: null | boolean
    isLoading: boolean
    roomData: roomDataI
    inValidCode: boolean
  }>({
    isAdmin: null,
    isLoading: false,
    roomData: {users: [], admins: []},
    inValidCode: false,
  })
  const router = useRouter()
  const params = useSearchParams()
  const socket = useSocket((state) => state.socket)

  const updateState = (newValues: any) => {
    setState((prev) => ({...prev, ...newValues}))
  }

  const roomId = params.get('room_id')

  useEffect(() => {
    if (socket && !roomId) {
      updateState({isAdmin: null})
      socket.on(constants.EVENTS.LEAVE_ROOM, () => {
        console.log('LEFT ALL ROOMS')
        updateState({inValidCode: true})
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  useEffect(() => {
    ;(async () => {
      socket.on(
        constants.EVENTS.ROOM_JOINED,
        (room_id: string, roomData: any, isAdmin: boolean) => {
          router.push(`?room_id=${room_id}`)
          updateState({isAdmin, roomData})
        }
      )
      socket.on(constants.EVENTS.GET_USERS, (roomData: roomDataI) => {
        updateState({roomData})
      })
      socket.on(constants.EVENTS.INVALID_ROOM, () => {
        updateState({inValidCode: true})
      })
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
              socket.emit(constants.EVENTS.GENERATE_AND_JOIN_ROOM, room, true)
          }}
        >
          <Input
            placeholder="Join Room"
            name="room"
            onChange={() => {
              updateState({inValidCode: false})
            }}
          />
          {state.inValidCode && (
            <p className="mt-1 ml-1 text-slate-400">
              Please Enter Valid Room Code !
            </p>
          )}
        </form>
      </div>
    )
  }

  if (state.isAdmin && roomId) {
    return (
      <CodeEditor
        socket={socket}
        roomId={roomId}
        roomData={state.roomData}
        isAdmin
      />
    )
  }

  if (!state.isAdmin && roomId) {
    return (
      <CodeEditor socket={socket} roomId={roomId} roomData={state.roomData} />
    )
  }

  return null
}
