import { IHandleParsedMessageMethodArgs } from '../methods/handle-parsed-message.method';

export interface IUpdateIridiumMTMessagesRequest {
	iridiumOutId: number; // uniqueClientMessageID
	isProcessed: number; // 1 = SUCCESS; 2 = FAIL
	processNote: string; // SUCCESS | FAIL
}

export const acknowledgeParsedMTConfirmationMessage = async ({
	messageTracker,
}: IHandleParsedMessageMethodArgs) => {
	const { parsedMTConfirmationMessage } = messageTracker;

	if (messageTracker.parsedMTConfirmationMessage == undefined) {
		throw new Error('MT Confirmation Message Is Not Parsed');
	}

	// CALL POST Request HTTPS `${process.env.MESSAGES_API_URL} + ${process.env.UPDATE_IRIDIUM_MT_MESSAGES_ENDPOINT}` Content-Type: application/json

	console.log(
		`🚀 Acknowledged Parsed MT Confirmation Message... ${JSON.stringify(
			parsedMTConfirmationMessage
		)}`
	);
};
