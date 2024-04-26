import { propertySizesInBytes } from '../config/property-size.config';
import { bufferStart } from '../helpers/buffer-start.helper';
import {
	IBufferTracker,
	increaseBufferOffset,
} from '../helpers/buffer-tracker.helper';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { NumberOfBytes } from '../helpers/read-buffer.helper';

export interface IInitializeMessageArgs {
	buffer: Buffer;
	bufferTracker: IBufferTracker;
	messageTracker: IMessageTracker;
}

export interface IInitializeMessage {
	isOnlyProtocol: boolean;
}

export const initializeMessage = ({
	buffer,
	bufferTracker,
	messageTracker,
}: IInitializeMessageArgs): void => {
	if (
		bufferTracker.offset == 0 &&
		messageTracker.messageType == undefined &&
		messageTracker.messageBytes.currentNumberOfBytes == 0 &&
		messageTracker.messageBytes.expectedNumberOfBytes <= 0
	) {
		const startBytes: NumberOfBytes =
			(propertySizesInBytes.protocolRevisionNumber +
				propertySizesInBytes.overallMessageLength) as NumberOfBytes;

		if (buffer.length < startBytes) {
			throw new Error(
				`Invalid Buffer Size < ${startBytes} To Read Protocol Revision Number & Overall Message Length`
			);
		}

		bufferStart({ buffer, bufferTracker, messageTracker });
	} else {
		bufferTracker.offset = 0;
	}
};
