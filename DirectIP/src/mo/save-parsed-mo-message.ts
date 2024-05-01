import { apiConfig } from '../config/api.config';
import { IHandleParsedMessageMethodArgs } from '../methods/handle-parsed-message.method';
import axios from 'axios';
import { validateParsedMOMessage } from './validate-parsed-mo-message';
import { actionSelection, logEvent } from '../helpers/log-event.helper';

export const saveParsedMOMessage = async ({
	messageTracker,
}: IHandleParsedMessageMethodArgs): Promise<void> => {
	const { parsedMOMessage } = messageTracker;

	validateParsedMOMessage({ parsedMOMessage });

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

		await logEvent({
			message: `Saved Parsed MO Message: ${JSON.stringify(data)}`,
			event: 'SUCCESS',
			action: actionSelection['MO'],
			messageTracker,
		});
	} catch (error) {
		await logEvent({
			message: `Error Saving Parsed MO Message: ${error}`,
			event: 'ERROR',
			action: actionSelection['MO'],
			messageTracker,
		});
	}
};
