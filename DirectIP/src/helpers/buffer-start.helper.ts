import { propertySizesInBytes } from '../config/property-size.config';
import { IBufferTracker, increaseBufferOffset } from './buffer-tracker.helper';
import { IMessageTracker } from './message-tracker.helper';
import { readBufferAsNumber } from './read-buffer.helper';

export interface IBufferStartArgs {
	buffer: Buffer;
	bufferTracker: IBufferTracker;
	messageTracker: IMessageTracker;
}

export const bufferStart = ({
	buffer,
	bufferTracker,
	messageTracker,
}: IBufferStartArgs) => {
	const protocolRevisionNumber: number = readBufferAsNumber({
		buffer,
		bufferTracker,
		numberOfBytes: propertySizesInBytes.protocolRevisionNumber,
	});

	if (protocolRevisionNumber !== 1) {
		throw new Error(`Invalid Buffer. protocolRevisionNumber !== 0x01`);
	}

	const overallMessageLength: number = readBufferAsNumber({
		buffer,
		bufferTracker,
		numberOfBytes: propertySizesInBytes.overallMessageLength,
	});

	messageTracker.messageBytes.expectedNumberOfBytes = overallMessageLength;
};

/*
The application receiving a message will receive three bytes. 
A DirectIP protocol revision number, the number of bytes that make up the body of the message, and the number of information elements that the message is made of. 
The table below summarizes in detail.

| Field Name					| Data Type			| Length (Bytes)		| Range Of Values 	|
| Protocol Revision Number 		| char				| 1						| 1					|
| Overall Message Length 		| unsigned short	| 2						| N					|
| Information Element (Any)		| variable			| N						| 					|

NOTE: The value of the message length flag indicates the number of bytes (N) that make up the body of the message after the initial three bytes.
*/
