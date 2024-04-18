import { Express } from 'express';
import { isValidMTRequest } from '../mt/is-valid-mt-request';
import { sendMTMessage } from '../mt/send-mt-message';

export const apiRoutes = (app: Express) => {
	app.post('/mt', async (req, res) => {
		try {
			if (!isValidMTRequest(req, res)) {
				throw new Error('Invalid MT Message Request');
			}

			let messagesProcessed = 0;

			while (messagesProcessed < req.body.length) {
				const { IridiumOutId, Header, Message, Payload } =
					req.body[messagesProcessed];

				if (
					IridiumOutId == undefined ||
					Header == undefined ||
					Message == undefined ||
					Payload == undefined
				) {
					const missingExpectedPropertiesMessage = `🟥 1 Or More Elements Missing Expected Properties: ${JSON.stringify(
						req.body[messagesProcessed]
					)}`;

					throw new Error(missingExpectedPropertiesMessage);
				}

				// TODO: Calculate Overall Message Length

				await sendMTMessage({
					message: Buffer.from([0x01, ...Buffer.from(Message, 'base64')]), // TODO: Implement Protocol Revision Number
					header: Buffer.from(Header, 'base64'),
					payload: Buffer.from(Header, 'base64'),
				});

				messagesProcessed++;
			}

			res.json({
				message: `✅ ${messagesProcessed} MT Messages Received & Processed`,
			});
		} catch (error) {
			console.error('🟥 Error Processing MT Messages:', error);
			res.status(500).json({ error: error.message });
		}
	});

	app.post('/got-or-not', (req, res) => {
		// NOTE: This Is For Testing Purposes Only
		if (req.body) {
			res.status(200).json({ message: '✅ GOT', status: 1 });
		} else {
			res.status(400).json({ message: '🟥 NOT', status: 2 });
		}
	});
};
