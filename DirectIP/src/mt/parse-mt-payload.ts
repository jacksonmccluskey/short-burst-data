import { increaseBufferOffset } from '../helpers/buffer-tracker.helper';
import { readBufferAsHexString } from '../helpers/read-buffer.helper';
import { IParseMTBufferMethodArgs } from './parse-mt-buffer';

export interface IMTPayload {
	payload: string;
	payloadLength: number;
}

export const parseMTPayload = async ({
	buffer,
	bufferTracker,
	messageTracker,
	informationElementLength,
}: IParseMTBufferMethodArgs): Promise<void> => {
	if (messageTracker.parsedMTMessage?.mtPayload !== undefined) {
		throw new Error('MT Payload Already Defined. Potential Duplicate Message');
	}

	if (buffer.length - bufferTracker.offset < informationElementLength) {
		throw new Error('Not Enough Buffer To Parse MT Payload');
	}

	const payload = readBufferAsHexString({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: informationElementLength,
	});

	if (!payload.length || payload.length !== informationElementLength) {
		console.log('Invalid payload');
		return;
	}

	increaseBufferOffset({
		bufferTracker,
		messageTracker,
		numberOfBytes: payload.length,
	});

	const mtPayload: IMTPayload = {
		payloadLength: payload.length,
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
