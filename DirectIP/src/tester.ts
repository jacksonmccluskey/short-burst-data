require('dotenv').config();

import net from 'net';

const socketPort: number = process.env.SOCKET_PORT
	? parseInt(process.env.SOCKET_PORT)
	: 10800;

const socketHost: string = process.env.SOCKET_HOST ?? 'localhost';

type Role = 'Client' | 'Device';

const roles: Role[] = ['Device'];

roles.forEach((role) => {
	const socket = net.createConnection(
		{ port: socketPort, host: socketHost },
		() => {
			console.log(`✅ ${role} Connected To Socket`);

			let message: Buffer = Buffer.from('Device');

			switch (role) {
				case 'Device': {
					message = Buffer.from([
						0x01, 0x00, 0x45, 0x01, 0x00, 0x1c, 0x5d, 0x12, 0xa9, 0xa8, 0x33,
						0x31, 0x30, 0x32, 0x33, 0x34, 0x30, 0x36, 0x34, 0x37, 0x33, 0x39,
						0x30, 0x36, 0x30, 0x00, 0xc6, 0x39, 0x00, 0x00, 0x66, 0x10, 0x27,
						0x4b, 0x03, 0x00, 0x0b, 0x01, 0x21, 0x8d, 0x4a, 0x75, 0x2a, 0xb0,
						0x00, 0x00, 0x00, 0x06, 0x02, 0x00, 0x15, 0x30, 0x85, 0x83, 0xcd,
						0x00, 0x35, 0x35, 0x65, 0xc3, 0xee, 0x15, 0x7c, 0x09, 0x44, 0x00,
						0x03, 0x00, 0x0a, 0xba, 0x4f, 0xf0,
					]);
					// message = Buffer.from([
					// 	0x01, // Protocol Revision Number
					// 	0x00, // Overall Message Length (104 bytes)
					// 	0x38, // Overall Message Length (104 bytes)
					// 	0x01, // MO Header IEI
					// 	0x00, // MO Header Length (26 bytes)
					// 	0x1c, // MO Header Length (26 bytes)
					// 	0x00, // CDR Reference
					// 	0x00, // CDR Reference
					// 	0x00, // CDR Reference
					// 	0x01, // CDR Reference
					// 	...'123456789123456'.split('').map((char) => char.charCodeAt(0)), // IMEI (15 characters)
					// 	0x02, // Session Status
					// 	0x00, // MOMSN
					// 	0x01, // MOMSN
					// 	0x00, // MTMSN
					// 	0x02, // MTMSN
					// 	0x00, // Time of Session
					// 	0x00, // Time of Session
					// 	0x00, // Time of Session
					// 	0x01, // Time of Session
					// 	0x02, // MO Payload IEI
					// 	0x00, // Payload Length
					// 	0x05, // Payload Length
					// 	...'ABCDE'.split('').map((char) => char.charCodeAt(0)),
					// 	0x03, // Location IEI
					// 	0x00, // MO Location Length
					// 	0x0b, // MO Location Length
					// 	0b00000010, // Indicator
					// 	0x5a, // Latitude
					// 	0x00, // Latitude
					// 	0x00, // Latitude
					// 	0xb4, // Longitude
					// 	0x00, // Longitude
					// 	0x00, // Longitude
					// 	0x00, // CEP Radius
					// 	0x00, // CEP Radius
					// 	0x00, // CEP Radius
					// 	0x0b, // CEP Radius
					// ]);
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
