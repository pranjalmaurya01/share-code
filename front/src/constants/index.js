const constants = {
  baseUrl:
    typeof window === 'undefined'
      ? ''
      : `${location.origin.substring(
          0,
          location.origin.lastIndexOf(':')
        )}:3333`,
  EVENTS: {
    CONNECTION: 'connect',
    ON_CODE_CHANGE: 'on-code-change',
    GET_CHANGED_CODE: 'get-changed-code',
    JOIN_ROOM: 'join-room',
    FILE_UPLOAD: 'file-upload',
    GET_FILE: 'get-file',
    GET_USERS: 'get-users',
    GENERATE_AND_JOIN_ROOM: 'GENERATE_AND_JOIN_ROOM',
    GET_ROOM_ID: 'GET_ROOM_ID',
    ROOM_JOINED: 'ROOM_JOINED',
    LEAVE_ROOM: 'LEAVE_ROOM',
    MAKE_ADMIN: 'MAKE_ADMIN',
    INVALID_ROOM: 'INVALID_ROOM',
  },
  ALLOWED_FILE_FORMATS_HTML:
    '.jpg,.jpeg,.png,.gif,.svg,.mp3,.wav,.mp4,.avi,.pdf,.txt,.html,.css,.js,.jsx,.tsx,.py,.json,',
  ALLOWED_FILE_FORMATS: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'audio/mp3',
    'audio/wav',
    'video/mp4',
    'video/avi',
    'application/pdf',
    'text/plain',
    'text/html',
    'text/css',
    'application/javascript',
    'text/javascript',
    'text/jsx',
    'text/typescript',
    'application/x-python',
    'application/json',
  ],
  MAX_FILE_SIZE: 1 * 1024 * 1024,
}
export default constants
