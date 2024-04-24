import { IParseMTBufferMethodArgs } from './parse-mt-buffer';

export interface IMTPayload {
	payload: string;
	payloadLength: number;
}

export const parseMTPayload = async ({
	buffer,
	messageTracker,
	informationElementLength,
}: IParseMTBufferMethodArgs): Promise<void> => {
	if (messageTracker.parsedMTMessage?.mtPayload !== undefined) {
		throw new Error('MT Payload Already Defined. Potential Duplicate Message');
	}

	if (buffer.length < informationElementLength) {
		throw new Error('Not Enough Buffer To Parse MT Payload');
	}

	let bufferOffset = 0;

	const payload = buffer
		.toString('utf8')
		.slice(bufferOffset, bufferOffset + informationElementLength);
	console.log(`payload: ${payload}`);

	if (!payload.length || payload.length !== informationElementLength) {
		console.log('Invalid payload');
		return;
	}
	bufferOffset += payload.length;
	messageTracker.messageBytes.currentNumberOfBytes += payload.length;

	const mtPayload: IMTPayload = {
		payloadLength: informationElementLength,
		payload,
	};

	if (messageTracker.parsedMTMessage == undefined) {
		messageTracker.parsedMTMessage = { mtPayload };
	} else if (messageTracker.parsedMTMessage.mtPayload == undefined) {
		messageTracker.parsedMTMessage.mtPayload = mtPayload;
	} else {
		throw new Error('MT Payload Already Defined');
	}
};
