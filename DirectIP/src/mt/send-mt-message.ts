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
			/*
			[
				0x01, // Protocol Revision Number = protocolRevisionNumber
				0x00, // Overall Message Length = overallMessageLength
				0x00, // Overall Message Length = overallMessageLength
				0x41, // MT Header IEI
				0x00, // MT Header Length
				0x00, // MT Header Length
				0x00, // Unique Client Message ID = uniqueClientMessageID
				... x4
				0x00, // IMEI = IMEI
				... x 15
				0x00, // MT Disposition Flags
				0x00, // MT Disposition Flags
				0x42, // MT Payload IEI
				0x00, // MT Payload Length (N)
				0x00, // MT Payload Length (N)
				0x00, // MT Payload = payload
				... x N
			]
			*/

			socket.write(mtMessageBuffer);
			socket.write(mtHeaderBuffer);
			socket.write(mtPayloadBuffer);
		}
	);
};
