import { IBufferTracker, increaseBufferOffset } from './buffer-tracker.helper';
import { IMessageTracker } from './message-tracker.helper';

export type NumberOfBytes = 1 | 2 | 4;

export interface IReadBufferAsNumber {
	buffer: Buffer;
	bufferTracker: IBufferTracker;
	messageTracker?: IMessageTracker;
	numberOfBytes: NumberOfBytes;
	isSigned?: boolean;
}

interface IReadIntArgs {
	buffer: Buffer;
	offset: number;
	isSigned?: boolean;
}

const readIntBytes: {
	[keys in NumberOfBytes]: ({
		buffer,
		offset,
		isSigned,
	}: IReadIntArgs) => number;
} = {
	1: ({ buffer, offset, isSigned }: IReadIntArgs) => {
		if (isSigned) {
			return buffer.readInt8(offset);
		} else {
			return buffer.readUInt8(offset);
		}
	},
	2: ({ buffer, offset, isSigned }: IReadIntArgs) => {
		if (isSigned) {
			return buffer.readInt16BE(offset);
		} else {
			return buffer.readUInt16BE(offset);
		}
	},
	4: ({ buffer, offset, isSigned }: IReadIntArgs) => {
		if (isSigned) {
			return buffer.readInt32BE(offset);
		} else {
			return buffer.readUInt32BE(offset);
		}
	},
};

export const readBufferAsNumber = ({
	buffer,
	bufferTracker,
	messageTracker,
	numberOfBytes,
	isSigned,
}: IReadBufferAsNumber): number => {
	const parsedBuffer: number = readIntBytes[numberOfBytes]({
		buffer,
		offset: bufferTracker.offset,
		isSigned,
	});

	increaseBufferOffset({
		bufferTracker,
		messageTracker,
		numberOfBytes,
	});

	return parsedBuffer;
};

export interface IReadBufferAsASCIIString {
	buffer: Buffer;
	bufferTracker: IBufferTracker;
	messageTracker?: IMessageTracker;
	numberOfBytes: number;
}

export const readBufferAsASCIIString = ({
	buffer,
	bufferTracker,
	messageTracker,
	numberOfBytes,
}: IReadBufferAsASCIIString) => {
	const parsedBuffer: string = buffer
		.subarray(bufferTracker.offset, bufferTracker.offset + numberOfBytes)
		.toString('ascii');

	increaseBufferOffset({
		bufferTracker,
		messageTracker,
		numberOfBytes,
	});

	return parsedBuffer;
};

export const readBufferAsHexString = ({
	buffer,
	bufferTracker,
	messageTracker,
	numberOfBytes,
}: IReadBufferAsASCIIString) => {
	const parsedBuffer: string = buffer
		.subarray(bufferTracker.offset, bufferTracker.offset + numberOfBytes)
		.toString('hex');

	increaseBufferOffset({
		bufferTracker,
		messageTracker,
		numberOfBytes,
	});

	return parsedBuffer;
};
