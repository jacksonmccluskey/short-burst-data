import {
	IParseMOBufferMethodArgs,
	ParseMOBufferMethod,
} from './parse-mo-buffer';

export interface IMOPayload {
	payloadLength: number;
	payload: string;
}

export const parseMOPayload: ParseMOBufferMethod = async ({
	buffer,
	messageTracker,
}: IParseMOBufferMethodArgs): Promise<void> => {
	if (messageTracker.parsedMOMessage?.moPayload !== undefined) {
		throw new Error('MO Payload Already Defined. Potential Double Message.');
	}

	const hexValues = Array.from(buffer).map((byte) =>
		byte.toString(16).padStart(2, '0')
	);

	const payload = `0x${hexValues.join('')}`;
	console.log(`payload: ${payload}`);

	const payloadLength = buffer.length;
	console.log(`payloadLength: ${payloadLength}`);

	if (!payload) {
		console.log('Invalid payload');
		return;
	}

	messageTracker.messageBytes.currentNumberOfBytes += payloadLength;

	if (messageTracker.parsedMOMessage == undefined) {
		messageTracker.parsedMOMessage = {};
	}

	messageTracker.parsedMOMessage.moPayload = {
		payload,
		payloadLength,
	};
};
