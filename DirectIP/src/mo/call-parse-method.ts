import { IEI } from '../helpers/information-element-identifier';
import { parseMOHeader } from './parse-mo-header';
import { parseMOLocationInformation } from './parse-mo-location-information';
import { IParsedBuffer } from './parse-mo-message';
import { parseMOPayload } from './parse-mo-payload';

export interface IParseBufferMethodArgs {
	buffer: Buffer;
	parsedBuffer: IParsedBuffer;
	informationElementLength?: number;
}
export type ParseBufferMethod = (args: IParseBufferMethodArgs) => Promise<void>;

const parseMethods: { [keys in IEI]?: ParseBufferMethod } = {
	[IEI.MO_HEADER]: parseMOHeader,
	[IEI.MO_PAYLOAD]: parseMOPayload,
	[IEI.MO_LOCATION_INFORMATION]: parseMOLocationInformation,
};

export const callParseBufferMethod = async (
	buffer: Buffer,
	iei: IEI,
	parsedBuffer: IParsedBuffer,
	informationElementLength: number
): Promise<void> => {
	await (parseMethods[iei] as ParseBufferMethod)({
		buffer,
		parsedBuffer,
		informationElementLength,
	});
};
