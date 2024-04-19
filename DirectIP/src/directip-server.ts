require('dotenv').config();

import net from 'net';
import { IMessageTracker } from './helpers/message-tracker.helper';
import { handleParsedMessage } from './methods/handle-parsed-message.method';
import { resetMessageTracker } from './helpers/reset-message-tracker';
import { processBuffer } from './methods/process-buffer.method';
import { determineMessageType } from './helpers/message-type.helper';
import { bufferStart } from './helpers/buffer-start.helper';
import { propertySizesInBytes } from './config/property-size.config';

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
		try {
			let bufferOffset = 0;

			const increaseBufferOffset = (numberOfBytes: number) => {
				bufferOffset += numberOfBytes;
				messageTracker.messageBytes.currentNumberOfBytes += numberOfBytes;
			};

			if (
				messageTracker.messageType == undefined &&
				messageTracker.messageBytes.expectedNumberOfBytes == 0
			) {
				const startBytes =
					propertySizesInBytes.protocolRevisionNumber +
					propertySizesInBytes.overallMessageLength;

				if (buffer.length < startBytes) {
					throw new Error(`Invalid Buffer Size < ${startBytes}`);
				}

				bufferStart({ buffer, messageTracker });

				bufferOffset += startBytes;

				if (buffer.length == startBytes) {
					console.log('Buffer Is Only Protocol');
					return;
				}
			}

			while (bufferOffset < buffer.length) {
				const informationBytes =
					propertySizesInBytes.informationElementID +
					propertySizesInBytes.informationElementLength;

				if (buffer.length < informationBytes) {
					throw new Error('Not Enough Information Bytes');
				}

				const informationElementID = buffer.readUInt8(bufferOffset); // 1 Byte [char]
				increaseBufferOffset(propertySizesInBytes.informationElementID);
				console.log(`informationElementID: ${informationElementID}`);

				const informationElementLength = buffer.readUInt16BE(bufferOffset); // 2 Byte [unsigned short]
				increaseBufferOffset(propertySizesInBytes.informationElementLength);
				console.log(`informationElementLength: ${informationElementLength}`);

				determineMessageType({ informationElementID, messageTracker });

				await processBuffer({
					buffer: buffer.subarray(
						bufferOffset,
						bufferOffset + informationElementLength
					),
					iei: informationElementID,
					messageTracker,
					informationElementLength,
				});

				bufferOffset += informationElementLength;
			}

			if (
				messageTracker.messageBytes.currentNumberOfBytes >=
				messageTracker.messageBytes.expectedNumberOfBytes
			) {
				await handleParsedMessage({ messageTracker });
				resetMessageTracker({ messageTracker });
			}
		} catch (error) {
			console.log(`🟥 Data Error: ${error.message}`); // TODO: Implement winston CloudWatch Logs
			resetMessageTracker({ messageTracker });
		}
	});

	socket.on('error', (error) => {
		console.log('🟥 Socket Error: ', error); // TODO: Implement winston CloudWatch Logs
	});

	socket.on('close', () => {
		console.log('⬜ Client Disconnected'); // TODO: Implement winston CloudWatch Logs
	});
});

directIPServer.listen(socketPort, () => {
	console.log(`✅ DirectIP Server Listening On Port ${socketPort}`);
});
