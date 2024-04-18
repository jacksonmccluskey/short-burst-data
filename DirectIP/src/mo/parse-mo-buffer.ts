import { IEI } from '../helpers/information-element-identifier.helper';
import { IMOHeader, parseMOHeader } from './parse-mo-header';
import {
	IMOLocationInformation,
	parseMOLocationInformation,
} from './parse-mo-location-information';
import { IMOPayload, parseMOPayload } from './parse-mo-payload';
import { IMessageTracker } from '../helpers/message-tracker.helper';

export interface IParsedMOMessage {
	moHeader?: IMOHeader; // REQUIRED: The information in the MO DirectIP Header is mandatory for every DirectIP MO message.
	moPayload?: IMOPayload; // OPTIONAL (IF FAILED): This is the actual MO payload from the IMEI currently at the Gateway. The accompanying payload is a result of the successful SBD session identified in the header. In an MO message delivery related to an empty mailbox check (EMBC) session or a failed session, no payload will be included.
	moLocationInformation?: IMOLocationInformation; // OPTIONAL: This IE includes location values that are an estimate of the location of the IMEI from which the message originated. The MO Location Information field is optional for MO messages; the option is determined when the IMEI is configured but can be changed at a later time.
}

export interface IParseMOBufferMethodArgs {
	buffer: Buffer;
	messageTracker: IMessageTracker;
	informationElementLength?: number;
}

export type ParseMOBufferMethod = (
	args: IParseMOBufferMethodArgs
) => Promise<void>;

const parseMOBufferMethods: { [keys in IEI]?: ParseMOBufferMethod } = {
	[IEI.MO_HEADER]: parseMOHeader,
	[IEI.MO_PAYLOAD]: parseMOPayload,
	[IEI.MO_LOCATION_INFORMATION]: parseMOLocationInformation,
};

export interface ICallParseMOBufferMethod {
	buffer: Buffer;
	iei: IEI;
	messageTracker: IMessageTracker;
	informationElementLength: number;
}

export const callParseMOBufferMethod = async ({
	buffer,
	iei,
	messageTracker,
	informationElementLength,
}: ICallParseMOBufferMethod): Promise<void> => {
	messageTracker.messageType = 'MO';

	await (parseMOBufferMethods[iei] as ParseMOBufferMethod)({
		buffer,
		messageTracker,
		informationElementLength,
	});
};
