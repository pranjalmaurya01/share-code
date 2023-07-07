import {Server} from 'socket.io';
const io = new Server({cors: {origin: '*'}});

// {room_id: {users:[]},admins:[]}
let roomData = {};

const events = {
	CONNECTION: 'connection',
	ON_CODE_CHANGE: 'on-code-change',
	GET_CHANGED_CODE: 'get-changed-code',
	JOIN_ROOM: 'join-room',
	FILE_UPLOAD: 'file-upload',
	GET_FILE: 'get-file',
	GET_USERS: 'get-users',
	GENERATE_AND_JOIN_ROOM: 'GENERATE_AND_JOIN_ROOM',
	ROOM_JOINED: 'ROOM_JOINED',
	MAKE_ADMIN: 'MAKE_ADMIN',
};

const generateRandomId = () => (Math.random() + 1).toString(36).substring(2);

io.on(events.CONNECTION, (socket) => {
	socket.on(events.GENERATE_AND_JOIN_ROOM, (room_id) => {
		let isAdmin = true;
		let currentRoom = '';
		if (!room_id || !roomData[room_id]) {
			currentRoom = generateRandomId();
			roomData[currentRoom] = {admins: [socket.id], users: []};
		} else {
			currentRoom = room_id;
			if (roomData[currentRoom].admins.length === 0) {
				roomData[currentRoom].admins.push(socket.id);
			} else if (
				!roomData[currentRoom].users.includes(socket.id) &&
				!roomData[currentRoom].admins.includes(socket.id)
			) {
				roomData[currentRoom].users.push(socket.id);
			}
			isAdmin = roomData[room_id].admins.includes(socket.id);
		}
		socket.join(currentRoom);
		io.to(socket.id).emit(
			events.ROOM_JOINED,
			currentRoom,
			roomData[currentRoom],
			isAdmin
		);
		socket.to(currentRoom).emit(events.GET_USERS, roomData[currentRoom]);
	});

	socket.on(events.MAKE_ADMIN, (room_id, client_id) => {
		console.log(room_id, client_id);
		if (
			!roomData[room_id].admins.includes(client_id) &&
			roomData[room_id].users.includes(client_id)
		) {
			roomData[room_id].admins.push(client_id);
			roomData[room_id].users = roomData[room_id].users.filter(
				(e) => e !== client_id
			);
			io.to(client_id).emit(
				events.ROOM_JOINED,
				room_id,
				roomData[room_id],
				true
			);
			io.sockets.in(room_id).emit(events.GET_USERS, roomData[room_id]);
		}
	});

	socket.on(events.ON_CODE_CHANGE, (e, room) => {
		if (room) {
			socket.to(room).emit(events.GET_CHANGED_CODE, e);
		}
	});

	socket.on(events.JOIN_ROOM, (room) => {
		if (room) {
			roomData[room] = roomData[room]
				? {
						admins: roomData[room].admins,
						users: [socket.id],
				  }
				: {admins: [socket.id], users: []};

			socket.join(room);
			socket.to(room).emit(events.GET_USERS, roomData[room]);
			io.to(socket.id).emit(
				events.ROOM_JOINED,
				room,
				roomData[room]
				// isAdmin
			);
		}
	});

	socket.on(events.FILE_UPLOAD, (files, room) => {
		console.log(files, room);
		socket.to(room).emit(events.GET_FILE, files);
	});

	socket.conn.on('close', () => {
		Object.keys(roomData).forEach((room) => {
			roomData[room].users = roomData[room].users.filter(
				(user) => user !== socket.id
			);
			roomData[room].admins = roomData[room].admins.filter(
				(user) => user !== socket.id
			);
			socket.to(room).emit(events.GET_USERS, roomData[room]);
		});
	});
});

io.listen(3333);
