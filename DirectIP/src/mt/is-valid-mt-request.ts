import { Request, Response } from 'express';

export const isValidMTRequest = (req: Request, res: Response) => {
	if (!req.is('application/json')) {
		const invalidRequestTypeMessage = `🟥 Request Type Invalid. Required: application/json`;
		console.log(invalidRequestTypeMessage);
		res.status(400).json({ error: invalidRequestTypeMessage });
		return false;
	}

	if (req.body === undefined) {
		const undefinedRequestBodyMessage = '🟥 Undefined Request Body';
		console.log(undefinedRequestBodyMessage);
		res.status(400).json({ error: undefinedRequestBodyMessage });
		return false;
	}

	if (req.body.length < 1) {
		const invalidRequestBodyTypeMessage =
			'🟥 Invalid Request Body Type: Must Be A Non-Empty Array';
		console.log(invalidRequestBodyTypeMessage);
		res.status(400).json({ error: invalidRequestBodyTypeMessage });
		return false;
	}

	return true;
};
