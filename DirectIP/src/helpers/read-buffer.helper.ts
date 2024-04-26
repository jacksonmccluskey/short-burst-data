import { IBufferTracker, increaseBufferOffset } from './buffer-tracker.helper';
import { IMessageTracker } from './message-tracker.helper';

export type NumberOfBytes = 1 | 2 | 4;

export interface IReadBufferAsNumber {
	buffer: Buffer;
	bufferTracker: IBufferTracker;
	messageTracker?: IMessageTracker;
	numberOfBytes: NumberOfBytes;
}

interface IReadUIntArgs {
	buffer: Buffer;
	offset: number;
}

const readUIntBytes: {
	[keys in NumberOfBytes]: ({ buffer, offset }: IReadUIntArgs) => number;
} = {
	1: ({ buffer, offset }: IReadUIntArgs) => {
		return buffer.readUInt8(offset);
	},
	2: ({ buffer, offset }: IReadUIntArgs) => {
		return buffer.readUInt16BE(offset);
	},
	4: ({ buffer, offset }: IReadUIntArgs) => {
		return buffer.readUInt32BE(offset);
	},
};

export const readBufferAsNumber = ({
	buffer,
	bufferTracker,
	messageTracker,
	numberOfBytes,
}: IReadBufferAsNumber): number => {
	const parsedBuffer: number = readUIntBytes[numberOfBytes]({
		buffer,
		offset: bufferTracker.offset,
	});

	increaseBufferOffset({
		bufferTracker,
		messageTracker,
		numberOfBytes,
	});

	return parsedBuffer;
};

export interface IReadBufferAsString {
	buffer: Buffer;
	bufferTracker: IBufferTracker;
	messageTracker?: IMessageTracker;
	numberOfBytes: number;
}

export const readBufferAsString = ({
	buffer,
	bufferTracker,
	messageTracker,
	numberOfBytes,
}: IReadBufferAsString) => {
	const parsedBuffer: string = buffer
		.subarray(bufferTracker.offset, bufferTracker.offset + numberOfBytes)
		.toString('utf8');

	increaseBufferOffset({
		bufferTracker,
		messageTracker,
		numberOfBytes,
	});

	return parsedBuffer;
};
