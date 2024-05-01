import net from 'net';
import { IBufferTracker } from '../helpers/buffer-tracker.helper';
import { initializeMessage } from './initialize-message.method';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { determineMessageType } from '../helpers/message-type.helper';
import { processBuffer } from './process-buffer.method';
import { handleParsedMessage } from './handle-parsed-message.method';
import { resetMessageTracker } from '../helpers/reset-message-tracker';
import { actionSelection, logEvent } from '../helpers/log-event.helper';
import { getInformation } from './get-information.method';

export interface ISocketOnData {
	socket: net.Socket;
	messageTracker: IMessageTracker;
}

export const socketOnData = async ({
	socket,
	messageTracker,
}: ISocketOnData) => {
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
				const { informationElementID, informationElementLength } =
					getInformation({ buffer, bufferTracker, messageTracker });

				determineMessageType({ informationElementID, messageTracker });

				await processBuffer({
					buffer,
					bufferTracker,
					informationElementID,
					informationElementLength,
					messageTracker,
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
			await logEvent({
				message: `Socket On Data Error: ${error.message}`,
				event: 'TERMINATED',
				action: actionSelection[messageTracker.messageType ?? 'MO'],
				messageTracker,
			});
			socket.destroy();
		}

		bufferTracker.offset = 0;
	});
};
