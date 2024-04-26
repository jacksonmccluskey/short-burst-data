import { IMessageTracker } from './message-tracker.helper';

export interface IBufferTracker {
	offset: 0;
}

export interface IIncreaseBufferOffsetArgs {
	bufferTracker: IBufferTracker;
	messageTracker?: IMessageTracker;
	numberOfBytes: number;
}

export const increaseBufferOffset = ({
	bufferTracker,
	messageTracker,
	numberOfBytes,
}: IIncreaseBufferOffsetArgs) => {
	bufferTracker.offset += numberOfBytes;

	if (messageTracker) {
		messageTracker.messageBytes.currentNumberOfBytes += numberOfBytes;
	}
};
