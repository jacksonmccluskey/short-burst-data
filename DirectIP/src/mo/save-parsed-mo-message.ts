import { IHandleParsedMessageMethodArgs } from '../methods/handle-parsed-message.method';

export const saveParsedMOMessage = async ({
	messageTracker,
}: IHandleParsedMessageMethodArgs): Promise<void> => {
	const { parsedMOMessage } = messageTracker;

	if (parsedMOMessage == undefined) {
		throw new Error('🟥 Message Failed To Parse');
	}

	if (parsedMOMessage.moHeader == undefined) {
		throw new Error(`🟥 Missing Header: ${JSON.stringify(parsedMOMessage)}`);
	}

	if (parsedMOMessage.moPayload == undefined) {
		throw new Error(`🟥 Missing Payload: ${JSON.stringify(parsedMOMessage)}`);
	}

	console.log(
		`🚀 Saving Parsed MO Message...\n${JSON.stringify(parsedMOMessage)}`
	);

	// TODO: Call API
};
