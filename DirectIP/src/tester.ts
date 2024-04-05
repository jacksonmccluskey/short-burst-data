require('dotenv').config();

import net from 'net';

const socketPort: number = process.env.SOCKET_PORT
	? parseInt(process.env.SOCKET_PORT)
	: 10800;

const socketHost: string = process.env.SOCKET_HOST ?? 'localhost';

type Role = 'Client' | 'Device';

const roles: Role[] = ['Client', 'Device'];

roles.forEach((role) => {
	const socket = net.createConnection(
		{ port: socketPort, host: socketHost },
		() => {
			console.log(`✅ ${role} Connected To Socket`);

			let message: Buffer = Buffer.from('XX');

			switch (role) {
				case 'Device': {
					message = Buffer.from('MO Message From Device\n');
					break;
				}
				case 'Client': {
					message = Buffer.from('MT Message From Client\n');
					break;
				}
				default: {
					console.warn('🟨 Unknown Role.');
				}
			}

			const written = socket.write(message);

			if (written) {
				console.log(`✅ ${role} Message Written To Socket.`);
			} else {
				console.warn('🟨 Message Potentially Not Written To Socket.');
			}
		}
	);

	socket.on('data', (data) => {
		console.log(`${role} Received Data:`, data.toString());
	});

	socket.on('end', () => {
		console.log(`⬜ ${role} Disconnected`);
	});

	socket.on('error', (error) => {
		console.error(`🟥 ${role} Error:`, error);
	});
});
