import { Express } from 'express';
import { isValidMTRequest } from '../mt/is-valid-mt-request';
import { sendMTMessage } from '../mt/send-mt-message';
import { convertMTMessageToBuffer } from '../mt/convert-mt-message-to-buffer';
import { IMTHeader } from '../mt/parse-mt-header';
import { IMTPayload } from '../mt/parse-mt-payload';
import { actionSelection, logEvent } from '../helpers/log-event.helper';

export const apiRoutes = (app: Express) => {
	app.post('/api/mt', async (req, res) => {
		try {
			if (!isValidMTRequest(req, res)) {
				throw new Error('Invalid MT Message Request');
			}

			let messagesProcessed = 0;

			const processedMessageIDs = [];

			while (messagesProcessed < req.body.length) {
				const { mtHeader, mtPayload } = req.body[messagesProcessed];

				if (!mtHeader || !mtPayload) {
					const missingExpectedPropertiesMessage = `🟥 1 Or More Missing Properties: ${JSON.stringify(
						req.body[messagesProcessed]
					)}`;

					throw new Error(missingExpectedPropertiesMessage);
				}

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

				await logEvent({
					message: `Writing MT Message:\n\nMT Header: ${JSON.stringify(
						mtHeader
					)}\n\nMT Payload: ${JSON.stringify(mtPayload)}`,
					event: 'SUCCESS',
					action: actionSelection['MT'],
				});

				processedMessageIDs.push(mtHeader.uniqueClientMessageID);

				messagesProcessed++;
			}

			res.json({
				message: `✅ ${messagesProcessed} MT Messages Received & Processed`,
				processedMessageIDs,
			});
		} catch (error) {
			console.error('🟥 Error Processing MT Messages:', error);
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
