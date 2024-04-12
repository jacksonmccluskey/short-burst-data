import { IParseBufferMethodArgs, ParseBufferMethod } from './call-parse-method';

export interface IMOPayload {
	payload: string;
	payloadLength: number;
}

export const parseMOPayload: ParseBufferMethod = async ({
	buffer,
	parsedBuffer,
	informationElementLength,
}: IParseBufferMethodArgs): Promise<void> => {
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

	parsedBuffer.moPayload = {
		payload,
		payloadLength,
	};
};
