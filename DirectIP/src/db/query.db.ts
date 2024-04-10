// TODO: import { dbConfig } from '../config/db.config';

// TODO: import sql from 'mssql';

// TODO: const poolConnection = sql.connect(dbConfig);

export const queryDB = async (query: string) => {
	try {
		// TODO: const resultSet = await poolConnection.request().query(query);

		console.log(`Calling Query: ${query}`);
	} catch (err) {
		console.error(err.message);
	}
};

// TODO: poolConnection.close();
