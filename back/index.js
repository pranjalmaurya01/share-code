import {Server} from 'socket.io';

const io = new Server({cors: {origin: '*'}});

// {room_id: {users:[]},admins:[]}
let users = {};

const events = {
	CONNECTION: 'connection',
	ON_CODE_CHANGE: 'on-code-change',
	GET_CHANGED_CODE: 'get-changed-code',
	JOIN_ROOM: 'join-room',
	FILE_UPLOAD: 'file-upload',
	GET_FILE: 'get-file',
	GET_USERS: 'get-users',
};

const generateRandomId = () => (Math.random() + 1).toString(36).substring(2);

io.on(events.CONNECTION, (socket) => {
	socket.on(events.ON_CODE_CHANGE, (e, room) => {
		if (room) {
			socket.to(room).emit(events.GET_CHANGED_CODE, e);
		}
	});

	socket.on(events.JOIN_ROOM, (room) => {
		if (room) {
			users[room] = users[room]
				? {...users[room], users: [...users[room].users, socket.id]}
				: {admins: [socket.id], users: []};
			socket.join(room);
			socket.to(room).emit(events.GET_USERS, users[room]);
		}
	});

	socket.on(events.FILE_UPLOAD, (files, room) => {
		socket.to(room).emit(events.GET_FILE, files);
	});

	socket.conn.on('close', () => {
		console.log(socket.id);
		Object.keys(users).forEach((room) => {
			users[room].users = users[room].users.filter(
				(user) => user !== socket.id
			);
			users[room].admins = users[room].admins.filter(
				(user) => user !== socket.id
			);
			socket.to(room).emit(events.GET_USERS, users[room]);
		});
	});
});

io.listen(3333);
