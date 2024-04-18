import {
	IIridiumOutMessageRequest,
	IIridiumOutMessageResponse,
} from '../api/types.api';
import { IEI } from '../helpers/information-element-identifier.helper';
import { IMessageTracker } from '../helpers/message-tracker.helper';

export interface IParsedMTConfirmationMessage {}

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
	console.log(buffer, iei, informationElementLength);
	console.log(JSON.stringify(messageTracker.parsedMTConfirmationMessage));

	// CALL POST Request HTTPS `${process.env.MESSAGES_API_URL} + ${process.env.UPDATE_IRIDIUM_MT_MESSAGES_ENDPOINT}` Content-Type: application/json
};
