import {Button} from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
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
