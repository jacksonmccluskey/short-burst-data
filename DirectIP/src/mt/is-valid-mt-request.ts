import { Request, Response } from 'express';

export const isValidMTRequest = (req: Request, res: Response) => {
	if (!req.is('application/json')) {
		const invalidRequestTypeMessage = `🟥 Request Type Invalid. Required: application/json`;
		res.status(400).json({ error: invalidRequestTypeMessage });
		return false;
	}

	if (req.body === undefined) {
		const undefinedRequestBodyMessage = '🟥 Undefined Request Body';
		res.status(400).json({ error: undefinedRequestBodyMessage });
		return false;
	}

	if (req.body.length < 1) {
		const invalidRequestBodyTypeMessage =
			'🟥 Invalid Request Body Type: Must Be A Non-Empty Array';
		res.status(400).json({ error: invalidRequestBodyTypeMessage });
		return false;
	}

	return true;
};
