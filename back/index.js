import {Redis} from '@upstash/redis';
import dotenv from 'dotenv';
import {Server} from 'socket.io';
import {events} from './constants.js';
import {
	CloseConnection,
	GENERATE_AND_JOIN_ROOM,
	MAKE_ADMIN,
} from './utility.js';

const io = new Server({cors: {origin: '*'}});

dotenv.config();

const redis = new Redis({
	url: 'https://apn1-wise-kit-33801.upstash.io',
	token: '' + process.env.REDIS_TOKEN,
});

// {room_id: {users:[]},admins:[]}
let roomData = {};

(async () => {
	try {
		const rd = await redis.get('roomData');
		if (rd) {
			roomData = rd;
			console.log('Redis data loaded');
		}
	} catch (e) {
		console.log('unable to connect to redis');
	}
})();

io.on(events.CONNECTION, async (socket) => {
	socket.on(events.GENERATE_AND_JOIN_ROOM, async (room_id, isRequest) =>
		GENERATE_AND_JOIN_ROOM(redis, socket, io, roomData, room_id, isRequest)
	);

	socket.on(events.LEAVE_ROOM, () => {
		socket.leaveAll();
	});

	socket.on(events.MAKE_ADMIN, async (room_id, client_id) =>
		MAKE_ADMIN(io, redis, roomData, room_id, client_id)
	);

	socket.on(events.ON_CODE_CHANGE, (e, room) => {
		socket.to(room).emit(events.GET_CHANGED_CODE, e);
	});

	socket.on(events.FILE_UPLOAD, (files, room) => {
		socket.to(room).emit(events.GET_FILE, files);
	});

	socket.on('disconnect', async () =>
		CloseConnection(redis, io, socket, roomData)
	);
});

io.listen(process.env.SERVER_PORT ? +process.env.SERVER_PORT : 3333);
