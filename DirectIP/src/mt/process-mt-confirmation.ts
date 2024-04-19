import {
	IIridiumOutMessageRequest,
	IIridiumOutMessageResponse,
} from '../api/types.api';
import { IEI } from '../helpers/information-element-identifier.helper';
import { IMessageTracker } from '../helpers/message-tracker.helper';

export interface IParsedMTConfirmationMessage {
	uniqueClientMessageID: string; // SIZE: 4 Bytes
	imei: string; // SIZE: 15 Bytes
	autoIDReference: number; // SIZE: 4 Bytes
	mtMessageStatus: number; // SIZE: 2 Bytes
}

export interface IProcessMTConfirmationArgs {
	buffer: Buffer;
	iei: IEI;
	messageTracker: IMessageTracker;
	informationElementLength: number;
}
export const processMTConfirmationMessage = async ({
	buffer,
	iei,
	messageTracker,
	informationElementLength,
}: IProcessMTConfirmationArgs) => {
	console.log('🚀 Parsing MT Confirmation...');

	let bufferOffset = 0;

	const uniqueClientMessageID = buffer
		.toString('utf8')
		.slice(bufferOffset, bufferOffset + 4);
	bufferOffset += 4;
	messageTracker.messageBytes.currentNumberOfBytes += 4;

	const imei = buffer.toString('utf8').slice(bufferOffset, bufferOffset + 15);
	bufferOffset += 15;
	messageTracker.messageBytes.currentNumberOfBytes += 15;

	const autoIDReference = buffer.readUint32BE(bufferOffset);
	bufferOffset += 4;
	messageTracker.messageBytes.currentNumberOfBytes += 4;

	const mtMessageStatus = buffer.readUInt16BE(bufferOffset);
	bufferOffset += 2;
	messageTracker.messageBytes.currentNumberOfBytes += 2;

	messageTracker.parsedMTConfirmationMessage = {
		uniqueClientMessageID,
		imei,
		autoIDReference,
		mtMessageStatus,
	};

	console.log(JSON.stringify(messageTracker.parsedMTConfirmationMessage));
};
