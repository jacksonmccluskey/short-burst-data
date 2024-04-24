import { IEI } from '../fields/information-element-identifier.field';
import { IMTHeader, parseMTHeader } from './parse-mt-header';
import { IMTPayload, parseMTPayload } from './parse-mt-payload';
import { IMessageTracker } from '../helpers/message-tracker.helper';

export interface IParsedMTMessage {
	mtHeader?: IMTHeader;
	mtPayload?: IMTPayload;
}

export interface IParseMTBufferMethodArgs {
	buffer: Buffer;
	messageTracker: IMessageTracker;
	informationElementLength: number;
}

export type ParseMTBufferMethod = (
	args: IParseMTBufferMethodArgs
) => Promise<void>;

const parseMTBufferMethods: { [keys in IEI]?: ParseMTBufferMethod } = {
	[IEI.MT_HEADER]: parseMTHeader,
	[IEI.MT_PAYLOAD]: parseMTPayload,
};

export interface ICallParseMTBufferMethod {
	buffer: Buffer;
	iei: IEI;
	messageTracker: IMessageTracker;
	informationElementLength: number;
}

export const callParseMTBufferMethod = async ({
	buffer,
	iei,
	messageTracker,
	informationElementLength,
}: ICallParseMTBufferMethod): Promise<void> => {
	await (parseMTBufferMethods[iei] as ParseMTBufferMethod)({
		buffer,
		messageTracker,
		informationElementLength,
	});

	console.log(
		`parsedMTMessage: ${JSON.stringify(messageTracker.parsedMTMessage)}`
	);
};
