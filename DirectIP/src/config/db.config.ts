export const dbConfig = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_SERVER,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	authentication: {
		type: 'default',
	},
	options: {
		encrypt: true,
	},
};
