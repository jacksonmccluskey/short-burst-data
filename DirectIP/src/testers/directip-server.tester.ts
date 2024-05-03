require('dotenv').config();

import net from 'net';
import {
	convertStringToBuffer,
	convertNumberToBuffer,
} from '../helpers/convert-value-to-buffer.helper';

const socketPort: number = process.env.SOCKET_PORT
	? parseInt(process.env.SOCKET_PORT)
	: 10800;

const socketHost: string = process.env.SOCKET_HOST ?? 'localhost';

const socket = net.createConnection(
	// NOTE: Mock Connection From Client
	{ port: socketPort, host: socketHost },
	() => {
		console.log(`✅ Tester Connected To Socket`);

		const moHeaderContent = Buffer.from([
			0x5d, 0x12, 0xaa, 0xa8, 0x33, 0x30, 0x30, 0x32, 0x33, 0x34, 0x30, 0x36,
			0x34, 0x37, 0x33, 0x39, 0x30, 0x36, 0x30, 0x01, 0xc6, 0x39, 0x00, 0x00,
			0x66, 0x10, 0x27, 0x4b,
		]);

		const moHeader: Buffer = Buffer.from([
			0x01,
			...convertNumberToBuffer({
				value: moHeaderContent.length,
				bufferSize: 2,
			}),
			...moHeaderContent,
		]);

		const moPayloadContent = convertStringToBuffer({ value: '010A02' });

		const moPayload: Buffer = Buffer.from([
			0x02,
			...convertNumberToBuffer({
				value: moPayloadContent.length,
				bufferSize: 2,
			}),
			...moPayloadContent,
		]);

		const moLocationContent = Buffer.from([
			0b00000010, 0x21, 0x8d, 0x4a, 0x75, 0x2a, 0xb0, 0x00, 0x00, 0x00, 0x06,
		]);

		const moLocation: Buffer = Buffer.from([
			0x03,
			...convertNumberToBuffer({
				value: moLocationContent.length,
				bufferSize: 2,
			}),
			...moLocationContent,
		]);

		// 	0x01, // Protocol Revision Number
		// 	0x00, // Overall Message Length
		// 	0x00, // Overall Message Length
		// 	0x01, // MO Header IEI
		// 	0x00, // MO Header Length
		// 	0x00, // MO Header Length
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
		// 	...'ABC123'.split('').map((char) => char.charCodeAt(0)), // Payload (N characters)
		// 	0x03, // Location IEI
		// 	0x00, // MO Location Length
		// 	0x0b, // MO Location Length
		// 	0b00000010, // Indicator
		// 	0x00, // Latitude // Degrees
		// 	0x00, // Latitude // Minute MS
		// 	0x00, // Latitude // Minute LS
		// 	0x00, // Longitude // Degrees
		// 	0x00, // Longitude // Minute MS
		// 	0x00, // Longitude // Minute LS
		// 	0x00, // CEP Radius
		// 	0x00, // CEP Radius
		// 	0x00, // CEP Radius
		// 	0x00, // CEP Radius

		const message = Buffer.from([
			0x01,
			...convertNumberToBuffer({
				value: moHeader.length + moPayload.length + moLocation.length,
				bufferSize: 2,
			}),
		]);

		socket.write(message);
		socket.write(moHeader);
		socket.write(moPayload);
		socket.write(moLocation);

		socket.on('end', () => {
			console.log(`⬜ Client Tester Disconnected`);
		});

		socket.on('error', (error) => {
			console.error(`🟥 Client Tester Error:`, error);
		});
	}
);
