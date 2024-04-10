require('dotenv').config();

import net from 'net';
import { processMOMessage } from './mo/parse-mo-message';

let directIPServer: net.Server | null = null;

const socketPort = process.env.SOCKET_PORT
	? parseInt(process.env.SOCKET_PORT)
	: 10800;

directIPServer = net.createServer((socket: net.Socket) => {
	console.log('✅ Client Connected');

	socket.on('data', async (buffer: Buffer) => {
		console.log(`buffer: ${buffer}`);

		await processMOMessage(buffer);
	});

	socket.on('error', (error) => {
		console.error('🟥 Socket Error: ', error);
	});

	socket.on('close', () => {
		console.log('⬜ Client Disconnected');
	});
});

directIPServer.listen(socketPort, () => {
	console.log(`✅ Server Listening On Port ${socketPort}`);
});
