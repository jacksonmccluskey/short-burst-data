import net from 'net';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { resetMessageTracker } from '../helpers/reset-message-tracker';
import { actionSelection, logEvent } from '../helpers/log-event.helper';

export interface ISocketOnClose {
	socket: net.Socket;
	messageTracker: IMessageTracker;
}

export const socketOnClose = async ({
	socket,
	messageTracker,
}: ISocketOnClose) => {
	socket.on('close', async () => {
		await logEvent({
			message: '⬜ Client Closed',
			event: 'TERMINATED',
			action: actionSelection[messageTracker.messageType ?? 'MO'],
			messageTracker,
		});
		resetMessageTracker({ messageTracker });
	});
};
