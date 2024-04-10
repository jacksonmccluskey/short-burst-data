import {
	IEI,
	getIEIDefinition,
	ieiDefinitions,
} from '../helpers/information-element-identifier';
import { callParseBufferMethod } from './call-parse-method';
import { IMOHeader } from './parse-mo-header';
import { IMOLocationInformation } from './parse-mo-location-information';
import { IMOPayload } from './parse-mo-payload';

export interface IParsedBuffer {
	moHeader?: IMOHeader; // REQUIRED: The information in the MO DirectIP Header is mandatory for every DirectIP MO message.
	moPayload?: IMOPayload; // OPTIONAL (IF FAILED): This is the actual MO payload from the IMEI currently at the Gateway. The accompanying payload is a result of the successful SBD session identified in the header. In an MO message delivery related to an empty mailbox check (EMBC) session or a failed session, no payload will be included.
	moLocationInformation?: IMOLocationInformation; // OPTIONAL: This IE includes location values that are an estimate of the location of the IMEI from which the message originated. The MO Location Information field is optional for MO messages; the option is determined when the IMEI is configured but can be changed at a later time.
}

export const processMOMessage = async (buffer: Buffer): Promise<void> => {
	try {
		let offset = 0;

		const protocolRevisionNumber: number = buffer.readUInt8(offset);
		console.log(`protocolRevisionNumber: ${protocolRevisionNumber}`);
		offset += 1;

		const overallMessageLength: number = buffer.readUInt16BE(offset);
		console.log(`overallMessageLength: ${overallMessageLength}`);
		offset += 2;

		const parsedBuffer: IParsedBuffer = {};

		while (offset < overallMessageLength) {
			const informationElementID = buffer.readUInt8(offset);
			console.log(
				`informationElementID: ${getIEIDefinition(informationElementID)}`
			);
			offset += 1;

			const informationElementLength = buffer.readInt16BE(offset);
			console.log(`informationElementLength: ${informationElementLength}`);
			offset += 2;

			const currentBuffer = buffer.subarray(
				offset,
				offset + informationElementLength
			);

			if (
				informationElementLength > 0 &&
				(informationElementID == IEI.MO_HEADER ||
					informationElementID == IEI.MO_PAYLOAD ||
					informationElementID == IEI.MO_LOCATION_INFORMATION)
			) {
				await callParseBufferMethod(
					currentBuffer,
					informationElementID,
					parsedBuffer
				);

				offset += informationElementLength;
			} else {
				offset += overallMessageLength;
			}
		}

		console.log(`parsedBuffer: ${parsedBuffer}`);
	} catch (error) {
		console.error('Error parsing DirectIP message:', error);
		throw error;
	}
};
