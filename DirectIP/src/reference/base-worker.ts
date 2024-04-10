parentPort.postMessage('Worker Started');

const processTheData = (data: any): any => {
	return data;
};

const processData = async (data: any): Promise<void> => {
	const processedData = processTheData(data);

	parentPort.postMessage(processedData);
};

parentPort.on('message', async (message: any) => {
	try {
		await processData(message);
	} catch (error) {
		parentPort.postMessage(`Error: ${error.message}`);
	}
});

process.on('uncaughtException', (error) => {
	parentPort.postMessage(`Uncaught Exception: ${error.message}`);
});
