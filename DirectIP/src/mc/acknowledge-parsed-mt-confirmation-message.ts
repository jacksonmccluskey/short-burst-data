import axios from 'axios';
import { IHandleParsedMessageMethodArgs } from '../methods/handle-parsed-message.method';
import { apiConfig } from '../config/api.config';
import { actionSelection, logEvent } from '../helpers/log-event.helper';
import {
	MTMessageStatus,
	getMTMessageStatusDefinition,
} from '../fields/mt-message-status.field';

export const acknowledgeParsedMTConfirmationMessage = async ({
	messageTracker,
}: IHandleParsedMessageMethodArgs) => {
	const { parsedMTConfirmationMessage } = messageTracker;

	if (parsedMTConfirmationMessage == undefined) {
		throw new Error('MT Confirmation Message Is Not Parsed');
	}

	try {
		const mtMessageStatus: number | undefined =
			parsedMTConfirmationMessage?.mtMessageStatus;

		const mtMessageStatusDefinition =
			getMTMessageStatusDefinition(mtMessageStatus);

		if (mtMessageStatus == MTMessageStatus.SUCCESS) {
			const { data } = await axios.post(
				apiConfig.updateIridiumMTMessages,
				parsedMTConfirmationMessage,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

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
		} else {
			logEvent({
				message: `MT Message Was Not Successful.\n\nParsed MT Confirmation Message:\n\n${JSON.stringify(
					parsedMTConfirmationMessage
				)}\n\nMT Message Status:\n\n${mtMessageStatusDefinition}`,
				event: 'WARN',
				action: actionSelection['MC'],
				messageTracker,
			});
		}
	} catch (error) {
		await logEvent({
			message: `Error Acknowledging MT Confirmation Message: ${error}`,
			event: 'ERROR',
			action: actionSelection['MC'],
			messageTracker,
		});
	}
};
