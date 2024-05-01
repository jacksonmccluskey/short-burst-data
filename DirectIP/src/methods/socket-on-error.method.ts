import net from 'net';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { resetMessageTracker } from '../helpers/reset-message-tracker';
import { actionSelection, logEvent } from '../helpers/log-event.helper';

export interface ISocketOnError {
	socket: net.Socket;
	messageTracker: IMessageTracker;
}

export const socketOnError = async ({
	socket,
	messageTracker,
}: ISocketOnError) => {
	socket.on('error', async (error) => {
		await logEvent({
			message: `Socket Error: ${error}`,
			event: 'TERMINATED',
			action: actionSelection[messageTracker.messageType ?? 'MO'],
			messageTracker,
		});
		resetMessageTracker({ messageTracker });
		socket.destroy();
	});
};
