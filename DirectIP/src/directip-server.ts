require('dotenv').config();

import net from 'net';
import { IMessageTracker } from './helpers/message-tracker.helper';
import { handleParsedMessage } from './methods/handle-parsed-message.method';
import { resetMessageTracker } from './helpers/reset-message-tracker';
import { processBuffer } from './methods/process-buffer.method';
import { determineMessageType } from './helpers/message-type.helper';
import { propertySizesInBytes } from './config/property-size.config';
import {
	IBufferTracker,
	increaseBufferOffset,
} from './helpers/buffer-tracker.helper';
import { initializeMessage } from './methods/initialize-message.method';
import { validateInformationBytes } from './helpers/validate-information-bytes.helper';
import { readBufferAsNumber } from './helpers/read-buffer.helper';

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
		const bufferTracker: IBufferTracker = {
			offset: 0,
		};

		try {
			initializeMessage({
				buffer,
				bufferTracker,
				messageTracker,
			});

			while (bufferTracker.offset < buffer.length) {
				const informationElementID = readBufferAsNumber({
					buffer,
					bufferTracker,
					messageTracker,
					numberOfBytes: propertySizesInBytes.informationElementID,
				});

				const informationElementLength = readBufferAsNumber({
					buffer,
					bufferTracker,
					messageTracker,
					numberOfBytes: propertySizesInBytes.informationElementLength,
				});

				determineMessageType({ informationElementID, messageTracker });

				await processBuffer({
					buffer,
					bufferTracker,
					informationElementID,
					messageTracker,
					informationElementLength,
				});
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

		bufferTracker.offset = 0;
	});

	socket.on('error', (error) => {
		console.log('🟥 Socket Error: ', error); // TODO: Implement winston CloudWatch Logs
		resetMessageTracker({ messageTracker });
	});

	socket.on('close', () => {
		console.log('⬜ Client Disconnected'); // TODO: Implement winston CloudWatch Logs
		resetMessageTracker({ messageTracker });
	});
});

directIPServer.listen(socketPort, () => {
	console.log(`✅ DirectIP Server Listening On Port ${socketPort}`);
});

/*
MO DirectIP Server/Client Requirements MO Gateway Client Requirements – DirectIP SBD Information

• The client must seek to establish a TCP/IP socket connection to the IP address and port number provided for the originating ISU.

• After a connection is established the client will transfer the MO payload and close the connection.

• If a connection is failed to be established the client will follow the retry protocol described above in Section 2.2 paragraph 6.

• After successful transmission the client will close the socket connection and will not expect an acknowledgment from the server.
MO Application Server Requirements

• The server will listen for TCP/IP socket connections on a specific port.

• Once connected, the client will transmit the MO payload and the server will receive the message in its entirety before parsing.

• The server will allow the client to close the socket connection.
*/
