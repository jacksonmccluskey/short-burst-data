import axios from 'axios';
import { IHandleParsedMessageMethodArgs } from '../methods/handle-parsed-message.method';
import { apiConfig } from '../config/api.config';

export const acknowledgeParsedMTConfirmationMessage = async ({
	messageTracker,
}: IHandleParsedMessageMethodArgs) => {
	const { parsedMTConfirmationMessage } = messageTracker;

	if (parsedMTConfirmationMessage == undefined) {
		throw new Error('MT Confirmation Message Is Not Parsed');
	}

	try {
		const { data } = await axios.post(
			apiConfig.updateIridiumMTMessages,
			[parsedMTConfirmationMessage],
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		console.log(data);
	} catch (error) {
		console.log(error);
	}

	console.log(
		`🚀 Acknowledged Parsed MT Confirmation Message... ${JSON.stringify(
			parsedMTConfirmationMessage
		)}`
	);
};
