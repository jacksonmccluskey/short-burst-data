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
			// Expected Buffer Stream
			/*
			[
				0x01, // protocolRevisionNumber
				0x00, // overallMessageLength
				0x00, // overallMessageLength
				0x41, // mtHeaderIEI
				0x00, // mtHeaderLength
				0x00, // mtHeaderLength 
				0x00, // uniqueClientMessageID
				0x00, // uniqueClientMessageID
				0x00, // uniqueClientMessageID
				0x00, // uniqueClientMessageID
				0x00, // x 15 Bytes IMEI
				0x00, // mtDispositionFlags
				0x00, // mtDispositionFlags
				0x42, // mtPayloadIEI
				0x00, // mtPayloadLength
				0x00, // mtPayloadLength
				0x00, // x N Bytes mtPayload
			]
			*/

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
