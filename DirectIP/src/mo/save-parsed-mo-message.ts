import { apiConfig } from '../config/api.config';
import { IHandleParsedMessageMethodArgs } from '../methods/handle-parsed-message.method';
import axios from 'axios';
import { validateParsedMOMessage } from './validate-parsed-mo-message';

export const saveParsedMOMessage = async ({
	messageTracker,
}: IHandleParsedMessageMethodArgs): Promise<void> => {
	const { parsedMOMessage } = messageTracker;

	validateParsedMOMessage({ parsedMOMessage });

	console.log(
		`🚀 Saving Parsed MO Message...\n${JSON.stringify(parsedMOMessage)}`
	);

	try {
		const { data } = await axios.post(
			apiConfig.saveMOMessage,
			parsedMOMessage,
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
};
