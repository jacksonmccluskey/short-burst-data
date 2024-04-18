import { IHandleParsedMessageMethodArgs } from '../methods/handle-parsed-message.method';

export const acknowledgeParsedMTConfirmationMessage = async ({
	messageTracker,
}: IHandleParsedMessageMethodArgs) => {
	const { parsedMTConfirmationMessage } = messageTracker;

	if (messageTracker.parsedMTConfirmationMessage == undefined) {
		throw new Error('MT Confirmation Message Is Not Parsed');
	}

	console.log(
		`🚀 Acknowledged Parsed MT Confirmation Message... ${JSON.stringify(
			parsedMTConfirmationMessage
		)}`
	);
};
