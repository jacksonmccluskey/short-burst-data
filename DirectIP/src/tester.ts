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
						0x01, // Protocol Revision Number
						0x01, // Overall Message Length (104 bytes)
						0x02, // Overall Message Length (104 bytes)
						0x01, // MO Header IEI
						0x00, // MO Header Length (26 bytes)
						0x1c, // MO Header Length (26 bytes)
						0x00, // CDR Reference
						0x00, // CDR Reference
						0x00, // CDR Reference
						0x01, // CDR Reference
						...'123456789123456'.split('').map((char) => char.charCodeAt(0)), // IMEI (15 characters)
						0x02, // Session Status
						0x00, // MOMSN
						0x01, // MOMSN
						0x00, // MTMSN
						0x02, // MTMSN
						0x00, // Time of Session
						0x00, // Time of Session
						0x00, // Time of Session
						0x01, // Time of Session
						0x02, // MO Payload IEI
						0x00, //
						0x04, //
						...'ABCDE'.split('').map((char) => char.charCodeAt(0)),
						0x03, // Location IEI
						0x14, // This many bytes down
						0x00, // Latitude
						0x00, // Latitude
						0x00, // Latitude
						0x00, // Latitude
						0x00, // Latitude
						0x00, // Latitude
						0x00, // Latitude
						0x01, // Latitude
						0x00, // Longitude
						0x00, // Longitude
						0x00, // Longitude
						0x00, // Longitude
						0x00, // Longitude
						0x00, // Longitude
						0x00, // Longitude
						0x01, // Longitude
						0x00, // CEP Radius
						0x00, // CEP Radius
						0x00, // CEP Radius
						0x00, // CEP Radius
					]);
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
