import sql from 'mssql';

export const dbConfig: sql.config = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_SERVER ?? '',
	database: process.env.DB_NAME,
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : -1,
};
