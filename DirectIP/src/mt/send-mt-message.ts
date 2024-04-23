import net from 'net';

interface ISendMTMessage {
	mtMessageBuffer: Buffer;
	mtHeaderBuffer: Buffer;
	mtPayloadBuffer: Buffer;
}

export const sendMTMessage = async ({
	mtMessageBuffer,
	mtHeaderBuffer,
	mtPayloadBuffer,
}: ISendMTMessage): Promise<void> => {
	console.log('Sending MT Message...');
	console.log(`mtMessageBuffer: ${mtMessageBuffer}`);
	console.log(`mtHeaderBuffer: ${mtHeaderBuffer}`);
	console.log(`mtPayloadBuffer: ${mtPayloadBuffer}`);

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
				0x41, // mtHeaderBufferIEI
				0x00, // mtHeaderBufferLength
				0x00, // mtHeaderBufferLength 
				0x00, // uniqueClientMessageID
				0x00, // uniqueClientMessageID
				0x00, // uniqueClientMessageID
				0x00, // uniqueClientMessageID
				0x00, // x 15 Bytes IMEI
				0x00, // mtDispositionFlags
				0x00, // mtDispositionFlags
				0x42, // mtPayloadBufferIEI
				0x00, // mtPayloadBufferLength
				0x00, // mtPayloadBufferLength
				0x00, // x N Bytes mtPayloadBuffer
			]
			*/

			socket.write(mtMessageBuffer);
			socket.write(mtHeaderBuffer);
			socket.write(mtPayloadBuffer);
		}
	);
};
