import { apiConfig } from '../config/api.config';
import { IHandleParsedMessageMethodArgs } from '../methods/handle-parsed-message.method';
import axios from 'axios';
import { validateParsedMOMessage } from './validate-parsed-mo-message';
import { actionSelection, logEvent } from '../helpers/log-event.helper';
import { getSessionStatusDefinition } from '../fields/session-status.field';

export const saveParsedMOMessage = async ({
	messageTracker,
}: IHandleParsedMessageMethodArgs): Promise<void> => {
	const { parsedMOMessage } = messageTracker;

	await validateParsedMOMessage({ parsedMOMessage });

	try {
		if (!parsedMOMessage) {
			throw new Error('MO Message Undefined');
		}

		const { data } = await axios.post(
			apiConfig.saveMOMessage,
			parsedMOMessage,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		const sessionStatus = parsedMOMessage?.moHeader?.sessionStatus;

		const sessionStatusDefinition = getSessionStatusDefinition(sessionStatus);

		await logEvent({
			message: `Saved Parsed MO Message:\n\n${JSON.stringify(
				parsedMOMessage
			)}\n\nSaveMOMessage Response:\n\n${JSON.stringify(
				data
			)}\n\nSession Status: ${sessionStatusDefinition}`,
			event: 'SUCCESS',
			action: actionSelection['MO'],
			messageTracker,
		});
	} catch (error) {
		await logEvent({
			message: `Error Saving Parsed MO Message: ${error}\n\n${JSON.stringify(
				parsedMOMessage
			)}`,
			event: 'ERROR',
			action: actionSelection['MO'],
			messageTracker,
		});
	}
};
