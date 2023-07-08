import {events} from './constants.js';

const generateRandomId = () => (Math.random() + 1).toString(36).substring(2);

export async function GENERATE_AND_JOIN_ROOM(
	redis,
	socket,
	io,
	roomData,
	room_id,
	isRequest
) {
	if ((!room_id || !roomData[room_id]) && isRequest) {
		io.to(socket.id).emit(events.INVALID_ROOM);
		return;
	}

	let isAdmin = true;
	let currentRoom = '';
	if ((!room_id || !roomData[room_id]) && !isRequest) {
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
	io.sockets.in(currentRoom).emit(events.GET_USERS, roomData[currentRoom]);
	if (roomData[currentRoom].code) {
		io.to(socket.id).emit(
			events.GET_CHANGED_CODE,
			roomData[currentRoom].code
		);
	}
	await redis.set('roomData', roomData);
}

export async function MAKE_ADMIN(io, redis, roomData, room_id, client_id) {
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
}

export async function CloseConnection(redis, io, socket, roomData) {
	Object.keys(roomData).forEach((room) => {
		roomData[room].users = roomData[room].users.filter(
			(user) => user !== socket.id
		);
		roomData[room].admins = roomData[room].admins.filter(
			(user) => user !== socket.id
		);
		if (
			roomData[room].users.length === 0 &&
			roomData[room].admins.length === 0
		) {
			delete roomData[room];
		} else {
			io.sockets.in(room).emit(events.GET_USERS, roomData[room]);
		}
	});
	await redis.set('roomData', roomData);
}
