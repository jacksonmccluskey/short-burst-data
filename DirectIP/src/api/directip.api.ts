require('dotenv').config();

import express from 'express';
import bodyParser from 'body-parser';
import { apiRoutes } from './routes.api';

const app = express();

app.use(bodyParser.json());

apiRoutes(app); // TODO: Add /api Route Name

const apiPort = process.env.API_PORT ? parseInt(process.env.API_PORT) : 1234;

app.listen(apiPort, () => {
	console.log(`✅ API Listening On Port ${apiPort}`);
});
