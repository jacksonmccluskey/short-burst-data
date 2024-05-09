import { Express } from 'express';
import { isValidMTRequest } from '../mt/is-valid-mt-request';
import { sendMTMessage } from '../mt/send-mt-message';
import { convertMTMessageToBuffer } from '../mt/convert-mt-message-to-buffer';
import { IMTHeader } from '../mt/parse-mt-header';
import { IMTPayload } from '../mt/parse-mt-payload';
import { actionSelection, logEvent } from '../helpers/log-event.helper';
import { isValidMTMessage } from '../mt/is-valid-mt-message';

export type ProcessedMessageStatus = 'SUCCESS' | 'FAIL';

export interface IProcessedMessageIDs {
	uniqueClientMessageID?: string;
	status: ProcessedMessageStatus;
	message?: string;
}

export const apiRoutes = (app: Express) => {
	app.post('/api/mt', async (req, res) => {
		try {
			if (!isValidMTRequest(req, res)) {
				throw new Error('Invalid MT Message Request');
			}

			let messagesProcessed = 0;

			const processedMessageIDs: IProcessedMessageIDs[] = [];

			while (messagesProcessed < req.body.length) {
				const currentRequestedMessage = req.body[messagesProcessed];

				const { mtHeader, mtPayload } = currentRequestedMessage;

				try {
					await isValidMTMessage({
						requestedMessage: currentRequestedMessage,
					});

					const { mtMessageBuffer, mtHeaderBuffer, mtPayloadBuffer } =
						convertMTMessageToBuffer({
							mtHeader: mtHeader as IMTHeader,
							mtPayload: mtPayload as IMTPayload,
						});

					await sendMTMessage({
						mtMessageBuffer,
						mtHeaderBuffer,
						mtPayloadBuffer,
					});

					const processMessage = `Writing MT Message:\n\nMT Header: ${JSON.stringify(
						mtHeader
					)}\n\nMT Payload: ${JSON.stringify(mtPayload)}`;

					await logEvent({
						message: processMessage,
						event: 'SUCCESS',
						action: actionSelection['MT'],
					});

					processedMessageIDs.push({
						uniqueClientMessageID: mtHeader?.uniqueClientMessageID,
						status: 'SUCCESS',
						message: processMessage,
					});
				} catch (error) {
					const errorMessage = `Error Converting Or Sending MT Message: ${error}\n\nMT Header:\n\n${JSON.stringify(
						mtHeader
					)}\n\nMT Payload:\n\n${JSON.stringify(mtPayload)}`;

					await logEvent({
						message: errorMessage,
						event: 'ERROR',
						action: actionSelection['MT'],
					});

					processedMessageIDs.push({
						uniqueClientMessageID: mtHeader?.uniqueClientMessageID,
						status: 'FAIL',
						message: errorMessage,
					});
				}

				messagesProcessed++;
			}

			const successfulMessageIDs = processedMessageIDs.filter(
				(processedMessageID) => processedMessageID.status === 'SUCCESS'
			).length;
			res.json({
				message:
					processedMessageIDs.length > 0
						? `✅ ${messagesProcessed} MT Messages Received.\n\n✅ ${successfulMessageIDs} Processed Successfully${
								messagesProcessed > successfulMessageIDs
									? `\n\n🟨 ${
											messagesProcessed - successfulMessageIDs
									  } Invalid Messages`
									: ''
						  }`
						: `🟨 ${messagesProcessed} Messages Received. None Valid.`,
				processedMessageIDs,
			});
		} catch (error) {
			await logEvent({
				message: `Error Processing MT Messages: ${error}\n\nRequest:\n\n${JSON.stringify(
					req.body
				)}`,
				event: 'TERMINATED',
				action: actionSelection['MT'],
				source: req.ip,
			});

			res.status(500).json({ error: error.message });
		}
	});

	app.post('/api/got-or-not', (req, res) => {
		// NOTE: This Is For Testing Purposes Only
		if (req.body) {
			res.status(200).json({ message: '✅ GOT', status: 1 });
		} else {
			res.status(400).json({ message: '🟥 NOT', status: 2 });
		}
	});
};
