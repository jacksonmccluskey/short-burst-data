import net from 'net';

interface ISendMTMessage {
	message: Buffer;
	header: Buffer;
	payload: Buffer;
}

interface ISendMTMessageResponse {
	processNote: 'success' | 'fail';
}

export const sendMTMessage = async ({
	message,
	header,
	payload,
}: ISendMTMessage): Promise<ISendMTMessageResponse> => {
	console.log('Sending MT Message...');
	console.log(`message: ${message}`);
	console.log(`header: ${header}`);
	console.log(`payload: ${payload}`);

	const socketPort = 10800; // process.env.COMMERCIAL_IRIDIUM_PORT ? parseInt(process.env.COMMERCIAL_IRIDIUM_PORT) : undefined
	const socketHost = 'localhost'; // process.env.COMMERCIAL_IRIDIUM_GATEWAY ? parseInt(COMMERCIAL_IRIDIUM_GATEWAY) : undefined

	const socket = net.createConnection(
		{ port: socketPort, host: socketHost },
		() => {
			const writtenMessage = socket.write(message);
			const writtenHeader = socket.write(header);
			const writtenPayload = socket.write(payload);

			if (writtenHeader) {
				console.log(
					`Socket Writes: ${JSON.stringify({
						writtenMessage,
						writtenHeader,
						writtenPayload,
					})}`
				);

				return { processNote: 'success' };
			}
		}
	);

	return { processNote: 'fail' };
};
