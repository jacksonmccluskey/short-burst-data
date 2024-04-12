import { dbConfig } from '../config/db.config';

import sql, { ConnectionPool } from 'mssql';

export const queryDB = async (queryString: string) => {
	let poolConnection: ConnectionPool | undefined;

	try {
		console.log(`Attempting To Connect To DB With ${JSON.stringify(dbConfig)}`);
		poolConnection = await sql.connect(dbConfig);
	} catch (error) {
		console.log(`Failed To Connect To DB: ${error}`);
		return;
	}

	console.log('Connected To DB');

	try {
		console.log(`Calling Query: ${queryString}`);

		const resultSet = await poolConnection.query(queryString);

		console.log(`resultSet: ${JSON.stringify(resultSet)}`);
	} catch (err) {
		console.error(`Failed To Query DB: ${err.message}`);
	}
};

// TODO: Implement poolConnection.close();
