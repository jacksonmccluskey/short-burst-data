import axios from 'axios';
import { IHandleParsedMessageMethodArgs } from '../methods/handle-parsed-message.method';
import { apiConfig } from '../config/api.config';
import { actionSelection, logEvent } from '../helpers/log-event.helper';
import {
	getMTMessageStatusDefinition,
	getMTMessageStatusKey,
} from '../fields/mt-message-status.field';

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
			parsedMTConfirmationMessage,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		const mtMessageStatus = parsedMTConfirmationMessage.mtMessageStatus;

		const mtMessageStatusKey = getMTMessageStatusKey(mtMessageStatus);

		const mtMessageStatusDefinition = mtMessageStatusKey
			? getMTMessageStatusDefinition(mtMessageStatus)
			: 'Unknown Message Status';

		logEvent({
			message: `Acknowledged Parsed MT Confirmation Message...\n\nParsed MT Confirmation Message:\n\n${JSON.stringify(
				parsedMTConfirmationMessage
			)}\n\nMT Message Status:\n\n${mtMessageStatusDefinition}\n\nData:\n\n${JSON.stringify(
				data
			)}`,
			event: 'SUCCESS',
			action: actionSelection['MC'],
			messageTracker,
		});
	} catch (error) {
		await logEvent({
			message: `Error Acknowledging MT Confirmation Message: ${error}`,
			event: 'ERROR',
			action: actionSelection['MC'],
			messageTracker,
		});
	}
};
