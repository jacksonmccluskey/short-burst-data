import { IMessageTracker } from './message-tracker.helper';

export interface IBufferStartArgs {
	buffer: Buffer;
	messageTracker: IMessageTracker;
}

export const bufferStart = ({ buffer, messageTracker }: IBufferStartArgs) => {
	let bufferOffset = 0;

	const protocolRevisionNumber: number = buffer.readUInt8(bufferOffset); // 1 Byte [char]
	console.log(`protocolRevisionNumber: ${protocolRevisionNumber}`);
	bufferOffset += 1;

	if (protocolRevisionNumber !== 1) {
		throw new Error(`Invalid Buffer. protocolRevisionNumber !== 0x01`);
	}

	const overallMessageLength: number = buffer.readUInt16BE(bufferOffset); // 2 Byte [unsigned short]
	console.log(`overallMessageLength: ${overallMessageLength}`);
	bufferOffset += 2; // NOTE: Unused Local Increment

	messageTracker.messageBytes.expectedNumberOfBytes = overallMessageLength;
};
