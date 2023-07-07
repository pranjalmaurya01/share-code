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
  },
  ALLOWED_FILE_FORMATS:
    '.jpg,.jpeg,.png,.gif,.svg,.mp3,.wav,.mp4,.avi,.pdf,.txt,.html,.css,.js,.jsx,.tsx,.py,.json,',
}
export default constants
