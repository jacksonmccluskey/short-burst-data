require('dotenv').config();

import net from 'net';

const socketPort: number = process.env.SOCKET_PORT
	? parseInt(process.env.SOCKET_PORT)
	: 10800;

const socketHost: string = process.env.SOCKET_HOST ?? 'localhost';

const socket = net.createConnection(
	{ port: socketPort, host: socketHost },
	() => {
		console.log(`✅ Tester Connected To Socket`);

		const getProtocol = (messageLength: number) => {
			const messageLengthBuffer = Buffer.allocUnsafe(2);
			messageLengthBuffer.writeUInt16BE(messageLength);
			return [0x01, ...messageLengthBuffer];
		};

		const moHeader: Buffer = Buffer.from([
			0x01, 0x00, 0x1c, 0x5d, 0x12, 0xa9, 0xa8, 0x33, 0x31, 0x30, 0x32, 0x33,
			0x34, 0x30, 0x36, 0x34, 0x37, 0x33, 0x39, 0x30, 0x36, 0x30, 0x00, 0xc6,
			0x39, 0x00, 0x00, 0x66, 0x10, 0x27, 0x4b,
		]);

		const moPayload: Buffer = Buffer.from([
			0x02, 0x00, 0x15, 0x30, 0x85, 0x83, 0xcd, 0x00, 0x35, 0x35, 0x65, 0xc3,
			0xee, 0x15, 0x7c, 0x09, 0x44, 0x00, 0x03, 0x00, 0x0a, 0xba, 0x4f, 0xf0,
		]);

		const moLocation: Buffer = Buffer.from([
			0x03, 0x00, 0x0b, 0x01, 0x21, 0x8d, 0x4a, 0x75, 0x2a, 0xb0, 0x00, 0x00,
			0x00, 0x06,
		]);

		const messageStream = [moHeader, moPayload, moLocation];

		const message: Buffer = Buffer.from([
			0x01, 0x00, 0x45, 0x01, 0x00, 0x1c, 0x5d, 0x12, 0xa9, 0xa8, 0x33, 0x31,
			0x30, 0x32, 0x33, 0x34, 0x30, 0x36, 0x34, 0x37, 0x33, 0x39, 0x30, 0x36,
			0x30, 0x00, 0xc6, 0x39, 0x00, 0x00, 0x66, 0x10, 0x27, 0x4b, 0x03, 0x00,
			0x0b, 0x01, 0x21, 0x8d, 0x4a, 0x75, 0x2a, 0xb0, 0x00, 0x00, 0x00, 0x06,
			0x02, 0x00, 0x15, 0x30, 0x85, 0x83, 0xcd, 0x00, 0x35, 0x35, 0x65, 0xc3,
			0xee, 0x15, 0x7c, 0x09, 0x44, 0x00, 0x03, 0x00, 0x0a, 0xba, 0x4f, 0xf0,
		]);

		// message = Buffer.from([
		// 	0x01, // Protocol Revision Number
		// 	0x00, // Overall Message Length (104 bytes)
		// 	0x00, // Overall Message Length (104 bytes)
		// 	0x01, // MO Header IEI
		// 	0x00, // MO Header Length (26 bytes)
		// 	0x00, // MO Header Length (26 bytes)
		// 	0x00, // CDR Reference
		// 	...'123456789123456'.split('').map((char) => char.charCodeAt(0)), // IMEI (15 characters)
		// 	0x00, // Session Status
		// 	0x00, // MOMSN
		// 	0x00, // MOMSN
		// 	0x00, // MTMSN
		// 	0x00, // MTMSN
		// 	0x00, // Time of Session
		// 	0x00, // Time of Session
		// 	0x00, // Time of Session
		// 	0x00, // Time of Session
		// 	0x02, // MO Payload IEI
		// 	0x00, // Payload Length
		// 	0x00, // Payload Length
		// 	...'ABCDE'.split('').map((char) => char.charCodeAt(0)), // Payload (N characters)
		// 	0x03, // Location IEI
		// 	0x00, // MO Location Length
		// 	0x0b, // MO Location Length
		// 	0b00000010, // Indicator
		// 	0x00, // Latitude
		// 	0x00, // Latitude
		// 	0x00, // Latitude
		// 	0x00, // Longitude
		// 	0x00, // Longitude
		// 	0x00, // Longitude
		// 	0x00, // CEP Radius
		// 	0x00, // CEP Radius
		// 	0x00, // CEP Radius
		// 	0x00, // CEP Radius
		// ]);

		const written = socket.write(message);

		if (written) {
			console.log(`✅ Client Tester Message Written To Socket.`);
		} else {
			console.warn(
				'🟨 Client Tester Message Potentially Not Written To Socket.'
			);
		}

		socket.on('data', (data) => {
			console.log(`Client Tester Received Data:`, data.toString());
		});

		socket.on('end', () => {
			console.log(`⬜ Client Tester Disconnected`);
		});

		socket.on('error', (error) => {
			console.error(`🟥 Client Tester Error:`, error);
		});
	}
);
