require('dotenv').config();

import express from 'express';
import bodyParser from 'body-parser';
import { apiRoutes } from './routes.api';
import { actionSelection, logEvent } from '../helpers/log-event.helper';

const app = express();

app.use(bodyParser.json());

apiRoutes(app);

const apiPort = process.env.API_PORT ? parseInt(process.env.API_PORT) : 1234;

app.listen(apiPort, async () => {
	await logEvent({
		message: `API Listening On Port ${apiPort}`,
		event: 'SUCCESS',
		action: actionSelection['MT'],
	});
});
