import { IParseBufferMethodArgs, ParseBufferMethod } from './call-parse-method';

export interface IMOPayload {
	payload: string;
}

export const parseMOPayload: ParseBufferMethod = async ({
	buffer,
	parsedBuffer,
}: IParseBufferMethodArgs): Promise<void> => {
	const payload = buffer.toString('utf8');
	console.log(`payload: ${payload}`);

	if (!payload) {
		console.log('Invalid payload');
		return;
	}

	parsedBuffer.moPayload = {
		payload,
	};
};
