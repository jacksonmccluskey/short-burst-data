import { Request, Response } from 'express';

import express from 'express';
import { actionSelection, logEvent } from '../helpers/log-event.helper';
const app = express();
const port = 1234;

app.get('/', (_req: Request, res: Response) => {
	res.send('✅ API Tester GET Request Success');
});

app.listen(port, async () => {
	await logEvent({
		message: `Express Tester Running On Port ${port}`,
		event: 'SUCCESS',
		action: actionSelection['MT'],
	});
});
