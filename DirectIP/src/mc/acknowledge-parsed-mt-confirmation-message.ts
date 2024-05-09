import axios from 'axios';
import { IHandleParsedMessageMethodArgs } from '../methods/handle-parsed-message.method';
import { apiConfig } from '../config/api.config';
import { actionSelection, logEvent } from '../helpers/log-event.helper';
import { getMTMessageStatusDefinition } from '../fields/mt-message-status.field';

export const acknowledgeParsedMTConfirmationMessage = async ({
	messageTracker,
}: IHandleParsedMessageMethodArgs) => {
	const { parsedMTConfirmationMessage } = messageTracker;

	if (parsedMTConfirmationMessage == undefined) {
		throw new Error('MT Confirmation Message Is Not Parsed');
	}

	const mtMessageStatus: number | undefined =
		parsedMTConfirmationMessage?.mtMessageStatus;

	const mtMessageStatusDefinition =
		getMTMessageStatusDefinition(mtMessageStatus);

	try {
		const isASuccessfulMTMessage =
			mtMessageStatus >= 1 && mtMessageStatus <= 50;

		const isProcessed = isASuccessfulMTMessage ? 1 : 2;

		const updateIridiumMTMessageRequestBody = {
			...parsedMTConfirmationMessage,
			isProcessed,
			processNote: mtMessageStatusDefinition,
		};

		const { data } = await axios.post(
			apiConfig.updateIridiumMTMessages,
			updateIridiumMTMessageRequestBody,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		if (isASuccessfulMTMessage) {
			logEvent({
				message: `Acknowledged Parsed MT Confirmation Message...\n\nParsed MT Confirmation Message:\n\n${JSON.stringify(
					parsedMTConfirmationMessage
				)}\n\nMT Message Status:\n\n${mtMessageStatusDefinition}\n\nAPI Request:\n\n${JSON.stringify(
					updateIridiumMTMessageRequestBody
				)}\n\nData:\n\n${JSON.stringify(data)}`,
				event: 'SUCCESS',
				action: actionSelection['MC'],
				messageTracker,
			});
		} else {
			logEvent({
				message: `MT Message Was Not Successful.\n\nParsed MT Confirmation Message:\n\n${JSON.stringify(
					parsedMTConfirmationMessage
				)}\n\nMT Message Status:\n\n${mtMessageStatusDefinition}\n\n${JSON.stringify(
					parsedMTConfirmationMessage
				)}\n\nAPI Request:\n\n${JSON.stringify(
					updateIridiumMTMessageRequestBody
				)}\n\nData:\n\n${JSON.stringify(data)}`,
				event: 'WARN',
				action: actionSelection['MC'],
				messageTracker,
			});
		}
	} catch (error) {
		await logEvent({
			message: `Error Acknowledging MT Confirmation Message: ${error}\n\n${JSON.stringify(
				parsedMTConfirmationMessage
			)}\n\nMT Message Status: ${mtMessageStatusDefinition}`,
			event: 'ERROR',
			action: actionSelection['MC'],
			messageTracker,
		});
	}
};
