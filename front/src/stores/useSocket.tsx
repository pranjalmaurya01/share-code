import constants from '@/constants'
import {io} from 'socket.io-client'
import {create} from 'zustand'

interface useSocketI {
  socket: any
  setSocket: (socket: any) => void
}

const useSocket = create<useSocketI>()((set) => ({
  socket: io(constants.baseUrl),
  setSocket: (socket: any) => set(() => ({socket})),
}))

export default useSocket
