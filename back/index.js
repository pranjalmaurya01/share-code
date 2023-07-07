import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

const io = new Server({ cors: { origin: '*' } });
dotenv.config();

const redis = new Redis({
	url: 'https://apn1-wise-kit-33801.upstash.io',
	token: "" + process.env.REDIS_TOKEN,
});


// {room_id: {users:[]},admins:[]}
let roomData = {};

(async () => {
	try {
		const rd = await redis.get('roomData');
		if (rd) {
			roomData = rd;
			console.log('Redis data loaded')
		}
	} catch (e) {
		console.log("unable to connect to redis")
	}
})();

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
	LEAVE_ROOM: 'LEAVE_ROOM',
	INVALID_ROOM: 'INVALID_ROOM'
};

const generateRandomId = () => (Math.random() + 1).toString(36).substring(2);

io.on(events.CONNECTION, async (socket) => {
	socket.on(events.GENERATE_AND_JOIN_ROOM, async (room_id, isRequest) => {

		if ((!room_id || !roomData[room_id]) && isRequest) {
			io.to(socket.id).emit(events.INVALID_ROOM)
			return
		}

		let isAdmin = true;
		let currentRoom = '';
		if ((!room_id || !roomData[room_id]) && !isRequest) {
			currentRoom = generateRandomId();
			roomData[currentRoom] = { admins: [socket.id], users: [] };
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
		io.sockets.in(currentRoom).emit(events.GET_USERS, roomData[currentRoom]);
		await redis.set('roomData', roomData);
	});

	socket.on(events.LEAVE_ROOM, () => {
		socket.leaveAll();
	});

	socket.on(events.MAKE_ADMIN, async (room_id, client_id) => {
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
		await redis.set('roomData', roomData);
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
				: { admins: [socket.id], users: [] };

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
		socket.to(room).emit(events.GET_FILE, files);
	});

	socket.conn.on('close', async () => {
		Object.keys(roomData).forEach((room) => {
			roomData[room].users = roomData[room].users.filter(
				(user) => user !== socket.id
			);
			roomData[room].admins = roomData[room].admins.filter(
				(user) => user !== socket.id
			);
			if (roomData[room].users.length === 0 && roomData[room].admins.length === 0) {
				delete roomData[room]
			} else {
				io.sockets.in(room).emit(events.GET_USERS, roomData[room]);
			}
		});
		await redis.set('roomData', roomData);
	});
});

io.listen(3333);
