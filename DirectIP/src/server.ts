require('dotenv').config();

import net from 'net';

const socketPort = process.env.SOCKET_PORT
	? parseInt(process.env.SOCKET_PORT)
	: 10800;

type MessageType = 'MO' | 'MT' | 'XX' | undefined;

interface IParseDirectIPMessage {
	type: MessageType;
	payload: string;
}

const parseDirectIPMessage = (data: Buffer): IParseDirectIPMessage => {
	// TODO: Implement Logic To Parse Data Based On DirectIP Message Structure
	console.warn('parseDirectIPMessage Not Implemented!');
	return { type: 'XX', payload: data.toString() };
};

interface IMessage {
	IMEI: string;
	payload: string;
}

const handleMOMessage = (_message: IMessage): void => {
	// TODO: Implement Logic To Store, Process, And Forward MO Messages
	console.warn('handleMOMessage Not Implemented!');
};

const validateMTMessage = (_message: IMessage): boolean => {
	// TODO: Implement Logic To Validate IMEI, Header Integrity, And Payload Size
	console.warn('validateMTMessage Not Implemented!');
	return true; // TODO: Replace With Actual Validation Logic Response
};

function sendMTConfirmation(_success: boolean, _messageID: number): void {
	// TODO: Implement Logic To Send Confirmation Message To Gateway
	console.warn('sendMTConfirmation Not Implemented!');
}

interface IMOMessage {
	IMEI: string;
	payload: string;
}

interface IMTMessage {
	IMEI: string;
	payload: string;
}

const directIPServer = net.createServer((socket: net.Socket) => {
	console.log('✅ Client Connected.');

	socket.on('data', (data: Buffer) => {
		const message = parseDirectIPMessage(data);

		switch (message.type) {
			case 'MO':
				const moMessage: IMOMessage = {
					IMEI: message.payload.slice(0, 15), // TODO: Extract IMEI
					payload: message.payload.slice(15), // TODO: Extract payload
					// TODO: Extract All Properties
				};
				handleMOMessage(moMessage);
				break;
			case 'MT':
				const mtMessage: IMTMessage = {
					IMEI: message.payload.slice(0, 15), // TODO: Extract IMEI
					payload: message.payload.slice(15), // TODO: Extract payload
					// TODO: Extract All Properties
				};

				if (validateMTMessage(mtMessage)) {
					console.log('✅ MT Message Received.', mtMessage);
					// TODO: Send Positive Confirmation After Processing
					sendMTConfirmation(true, 1); // TODO: ID
					// TODO: Process MT Message
				} else {
					console.error('❌ Invalid MT Message!');
					// TODO: Send Negative Confirmation
					sendMTConfirmation(false, 1); // TODO: ID
				}
				break;
			case 'XX':
				console.warn('🟨 Message Received But Type Unknown.');
				break;
			default:
				console.error('❌ Unexpected Message Type:', message.type);
		}
	});

	socket.on('error', (error) => {
		console.error('🟥 Socket Error:', error);
	});

	socket.on('close', () => {
		console.log('⬜ Client Disconnected');
	});
});

directIPServer.listen(socketPort, () => {
	console.log(`✅ Server Listening On Port ${socketPort}`);
});
