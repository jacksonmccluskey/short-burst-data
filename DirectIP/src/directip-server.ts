require('dotenv').config();

import net from 'net';
import { IMessageTracker } from './helpers/message-tracker.helper';
import { handleParsedMessage } from './methods/handle-parsed-message.method';
import { resetMessageTracker } from './helpers/reset-message-tracker';
import { processBuffer } from './methods/process-buffer.method';
import { determineMessageType } from './helpers/message-type.helper';
import { bufferStart } from './helpers/buffer-start.helper';

let directIPServer: net.Server | null = null;

const socketPort = process.env.SOCKET_PORT
	? parseInt(process.env.SOCKET_PORT)
	: 10800;

directIPServer = net.createServer((socket: net.Socket) => {
	console.log('✅ Client Connected');

	const messageTracker: IMessageTracker = {
		messageBytes: { expectedNumberOfBytes: 0, currentNumberOfBytes: 0 },
	};

	socket.on('data', async (buffer: Buffer) => {
		console.log(`buffer: ${buffer}`);

		let bufferOffset = 0;

		if (messageTracker.messageType == undefined) {
			bufferStart({ buffer, messageTracker });
		}

		const informationElementID = buffer.readUInt8(bufferOffset);
		bufferOffset += 1;

		const informationElementLength = buffer.readUInt16BE(bufferOffset);
		bufferOffset += 2;

		determineMessageType({ informationElementID, messageTracker });

		await processBuffer({
			buffer,
			iei: informationElementID,
			messageTracker,
			informationElementLength,
		});

		messageTracker.messageBytes.currentNumberOfBytes +=
			informationElementLength;

		if (
			messageTracker.messageBytes.currentNumberOfBytes ===
			messageTracker.messageBytes.expectedNumberOfBytes
		) {
			await handleParsedMessage({ messageTracker });
			resetMessageTracker({ messageTracker });
		}
	});

	socket.on('error', (error) => {
		console.error('🟥 Socket Error: ', error); // TODO: Implement winston CloudWatch Logs
	});

	socket.on('close', () => {
		console.log('⬜ Client Disconnected'); // TODO: Implement winston CloudWatch Logs
	});
});

directIPServer.listen(socketPort, () => {
	console.log(`✅ DirectIP Server Listening On Port ${socketPort}`);
});
