import { IEI } from '../fields/information-element-identifier.field';
import { IMTHeader, parseMTHeader } from './parse-mt-header';
import { IMTPayload, parseMTPayload } from './parse-mt-payload';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { IHandleProcessBufferMethodArgs } from '../methods/process-buffer.method';
import { IBufferTracker } from '../helpers/buffer-tracker.helper';

export interface IParsedMTMessage {
	mtHeader?: IMTHeader;
	mtPayload?: IMTPayload;
}

export interface IParseMTBufferMethodArgs {
	buffer: Buffer;
	bufferTracker: IBufferTracker;
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

export const callParseMTBufferMethod = async ({
	// NOTE: MT Message Parsing Is Only For Testing As Only The Iridium Gateway Will Receive MT Messages
	buffer,
	bufferTracker,
	informationElementID,
	messageTracker,
	informationElementLength,
}: IHandleProcessBufferMethodArgs): Promise<void> => {
	await (parseMTBufferMethods[informationElementID] as ParseMTBufferMethod)({
		buffer,
		bufferTracker,
		messageTracker,
		informationElementLength,
	});
};
