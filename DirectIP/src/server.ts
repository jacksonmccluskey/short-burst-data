require('dotenv').config();

import net from 'net';
import { processMOMessage } from './mo/parse-mo-message';
import { IEI } from './helpers/information-element-identifier';
import { sendMTMessage } from './mt/send-mt-message';
import { processMTConfirmation } from './mt/process-mt-confirmation';

let directIPServer: net.Server | null = null;

const socketPort = process.env.SOCKET_PORT
	? parseInt(process.env.SOCKET_PORT)
	: 10800;

directIPServer = net.createServer((socket: net.Socket) => {
	console.log('✅ Client Connected');

	socket.on('data', async (buffer: Buffer) => {
		console.log(`buffer: ${buffer}`);

		const protocolRevisionNumber: number = buffer.readUInt8(0);
		console.log(`protocolRevisionNumber: ${protocolRevisionNumber}`);

		if (protocolRevisionNumber !== 1) {
			throw new Error(`Invalid buffer. protocolRevisionNumber !== 1`);
		}

		const firstIEI = buffer.readUInt8(3);

		switch (firstIEI) {
			case IEI.MO_HEADER:
			case IEI.MO_PAYLOAD:
			case IEI.MO_LOCATION_INFORMATION: {
				await processMOMessage(buffer);
				break;
			}
			case IEI.MT_HEADER:
			case IEI.MT_PAYLOAD: {
				await sendMTMessage(buffer);
				break;
			}
			case IEI.MT_CONFIRMATION_MESSAGE: {
				await processMTConfirmation(buffer);
				break;
			}
			default: {
				throw new Error(`Invalid IEI: ${firstIEI}`);
			}
		}
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
