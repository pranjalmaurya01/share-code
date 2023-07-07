'use client'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {generateRandomId} from '@/lib/utils'
import {useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'
import FileUpload from './components/fileUpload'

const id = generateRandomId()

export default function ShareFile() {
  const router = useRouter()
  const params = useSearchParams()
  const [state, setState] = useState<{
    isSender: null | boolean
    roomId: null | string
  }>({
    isSender: null,
    roomId: null,
  })

  useEffect(() => {
    let type = params.get('type')
    let room_id = params.get('room_id')
    if (!type && !room_id) {
      setState((prev) => ({
        ...prev,
        isSender: null,
      }))
    }
    if (type) {
      setState((prev) => ({
        ...prev,
        isSender: type === 'sender',
      }))
    }
    if (type && type === 'receiver' && room_id !== undefined) {
      setState((prev) => ({
        ...prev,
        roomId: room_id,
      }))
    }
    if (type && type === 'sender') {
      setState((prev) => ({
        ...prev,
        roomId: room_id,
      }))
    }
  }, [params])

  return (
    <>
      {state.isSender === null ? (
        <div className="flex justify-center items-center h-screen">
          <Button
            variant="link"
            className="text-4xl"
            onClick={() => {
              router.push(`/file?type=sender&room_id=${id}`)
              setState((prev) => ({...prev, isSender: true}))
            }}
          >
            Sender
          </Button>
          <span className="text-5xl">&nbsp;/&nbsp;</span>
          <Button
            variant="link"
            className="text-4xl"
            onClick={() => {
              router.push('/file?type=receiver')
              setState((prev) => ({...prev, isSender: false}))
            }}
          >
            Receiver
          </Button>
        </div>
      ) : state.roomId ? (
        <FileUpload isSender={state.isSender} room_id={state.roomId} />
      ) : (
        <form
          className="flex justify-center items-center h-screen"
          name="room_form"
          onSubmit={(e) => {
            e.preventDefault()
            // @ts-expect-error
            const roomId = document.forms.room_form?.room_id
              .value as unknown as string
            setState((prev) => ({
              ...prev,
              roomId,
            }))
            router.push(`/file?type=receiver&room_id=${roomId}`)
          }}
        >
          <Input
            placeholder="Room ID"
            className="mx-2 md:w-1/5"
            name="room_id"
          />
        </form>
      )}
    </>
  )
}
