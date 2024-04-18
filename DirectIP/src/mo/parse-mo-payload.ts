import {
	IParseMOBufferMethodArgs,
	ParseMOBufferMethod,
} from './parse-mo-buffer';

export interface IMOPayload {
	payload: string;
	payloadLength: number;
}

export const parseMOPayload: ParseMOBufferMethod = async ({
	buffer,
	messageTracker,
	informationElementLength,
}: IParseMOBufferMethodArgs): Promise<void> => {
	const hexValues = Array.from(buffer).map((byte) =>
		byte.toString(16).padStart(2, '0')
	);

	const payload = `0x${hexValues.join('')}`;
	console.log(`payload: ${payload}`);

	const payloadLength = informationElementLength ?? payload.length;
	console.log(`payloadLength: ${payloadLength}`);

	if (!payload) {
		console.log('Invalid payload');
		return;
	}

	if (messageTracker.parsedMOMessage == undefined) {
		messageTracker.parsedMOMessage = {};
	}

	messageTracker.parsedMOMessage.moPayload = {
		payload,
		payloadLength,
	};
};
