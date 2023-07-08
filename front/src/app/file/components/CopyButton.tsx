'use client'
import {Button} from '@/components/ui/button'
import {useEffect, useState} from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

export default function CopyButton() {
  const [state, setState] = useState<{
    copied: boolean
  }>({
    copied: false,
  })

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (state.copied) {
      timeout = setTimeout(() => {
        setState((prev) => ({...prev, copied: false}))
      }, 2000)
    }
    return () => timeout && clearTimeout(timeout)
  }, [state.copied])

  return (
    <>
      {state.copied ? (
        <p className="py-2 px-1 text-gray-300">Room Link Copied</p>
      ) : (
        <Button variant="outline" onClick={(e) => e.stopPropagation()}>
          <CopyToClipboard
            text={location.href}
            onCopy={() => {
              setTimeout(() => {
                setState((prev) => ({...prev, copied: true}))
              })
            }}
          >
            <p>Copy Room Link</p>
          </CopyToClipboard>
        </Button>
      )}
    </>
  )
}
