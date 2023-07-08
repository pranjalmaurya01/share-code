'use client'

import {Button} from '@/components/ui/button'
import constants from '@/constants'
import useSocket from '@/stores/useSocket'
import Link from 'next/link'
import {useEffect} from 'react'

export default function Home() {
  const socket = useSocket((state) => state.socket)

  useEffect(() => {
    if (socket)
      socket.on(constants.EVENTS.CONNECTION, () => {
        console.log('connected')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  if (!socket) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl">Trying to connect to backend</p>
      </div>
    )
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <Button asChild variant="link" className="text-4xl">
        <Link href="/file">FILE</Link>
      </Button>
      <span className="text-5xl">&nbsp;/&nbsp;</span>
      <Button asChild variant="link" className="text-4xl">
        <Link href="/code">CODE</Link>
      </Button>
    </div>
  )
}
