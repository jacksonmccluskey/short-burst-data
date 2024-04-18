import { IMessageTracker } from './message-tracker.helper';

export interface IBufferStartArgs {
	buffer: Buffer;
	messageTracker: IMessageTracker;
}

export const bufferStart = ({ buffer, messageTracker }: IBufferStartArgs) => {
	const protocolRevisionNumber: number = buffer.readUInt8(0);
	console.log(`protocolRevisionNumber: ${protocolRevisionNumber}`);

	if (protocolRevisionNumber !== 1) {
		throw new Error(`Invalid Buffer. protocolRevisionNumber !== 0x01`);
	}

	const overallMessageLength: number = buffer.readUInt16BE(1);
	console.log(`overallMessageLength: ${overallMessageLength}`);

	messageTracker.messageBytes.expectedNumberOfBytes = overallMessageLength;
};
