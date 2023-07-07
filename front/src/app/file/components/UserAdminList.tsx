import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import constants from '@/constants'

const UserAdminList = ({
  admins,
  users,
  socket,
  room_id,
  isAdmin,
  className,
}: {
  room_id: string
  socket: any
  admins: string[]
  users: string[]
  isAdmin?: boolean
  className?: string
}) => {
  return (
    <div className={`ml-5 m-1 ${className}`}>
      <h3 className="text-xl">ADMINS</h3>
      <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
        {admins.length > 0 ? (
          admins.map((e, i) => (
            <li key={i}>
              {e}{' '}
              {socket.id === e && (
                <Badge variant="outline" className="font-light text-gray-500">
                  YOU
                </Badge>
              )}
            </li>
          ))
        ) : (
          <p className="text-center text-red-500">No Admins</p>
        )}
      </ul>
      <br />
      <h3 className="text-xl">USERS</h3>
      <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
        {users.length > 0 ? (
          users.map((e) => (
            <li key={e}>
              {isAdmin && (
                <Button
                  variant="link"
                  className="text-xs !m-0 !py-0 !h-0"
                  onClick={() => {
                    socket.emit(constants.EVENTS.MAKE_ADMIN, room_id, e)
                  }}
                >
                  Make Admin
                </Button>
              )}
              {e}
              {socket.id === e && (
                <Badge variant="outline" className="font-light text-gray-500">
                  YOU
                </Badge>
              )}
            </li>
          ))
        ) : (
          <p className="text-center text-red-500">No Users</p>
        )}
      </ul>
    </div>
  )
}

export default UserAdminList
