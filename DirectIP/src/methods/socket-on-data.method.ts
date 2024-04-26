import net from 'net';
import { IBufferTracker } from '../helpers/buffer-tracker.helper';
import { initializeMessage } from './initialize-message.method';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { readBufferAsNumber } from '../helpers/read-buffer.helper';
import { propertySizesInBytes } from '../config/property-size.config';
import { determineMessageType } from '../helpers/message-type.helper';
import { processBuffer } from './process-buffer.method';
import { handleParsedMessage } from './handle-parsed-message.method';
import { resetMessageTracker } from '../helpers/reset-message-tracker';

export interface ISocketOnData {
	socket: net.Socket;
	messageTracker: IMessageTracker;
}

export const socketOnData = ({ socket, messageTracker }: ISocketOnData) => {
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
				await handleParsedMessage({ messageTracker, socket });
				resetMessageTracker({ messageTracker });
			}
		} catch (error) {
			console.log(`🟥 Data Error: ${error.message}`); // TODO: Implement winston CloudWatch Logs
			resetMessageTracker({ messageTracker });
		}

		bufferTracker.offset = 0;
	});
};
