import { Request, Response } from 'express';

import express from 'express';
const app = express();
const port = 1234;

app.get('/', (_req: Request, res: Response) => {
	res.send('✅ API Tester GET Request Success');
});

app.listen(port, () => {
	console.log(`✅ Express Tester Running On Port ${port}`);
});
