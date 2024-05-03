require('dotenv').config();

import net from 'net';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { socketOnData } from '../methods/socket-on-data.method';
import { actionSelection, logEvent } from '../helpers/log-event.helper';
import { socketOnClose } from '../methods/socket-on-close.method';
import { socketOnError } from '../methods/socket-on-error.method';

let directIPServer: net.Server | null = null;

const socketPort = process.env.SOCKET_PORT
	? parseInt(process.env.SOCKET_PORT)
	: 10800;

directIPServer = net.createServer(async (socket: net.Socket) => {
	const clientIP = socket.remoteAddress;

	await logEvent({
		message: `Client Connected: ${clientIP}`,
		event: 'SUCCESS',
		action: actionSelection['MO'],
	});

	const messageTracker: IMessageTracker = {
		messageBytes: { expectedNumberOfBytes: 0, currentNumberOfBytes: 0 },
	};

	await socketOnData({ socket, messageTracker });

	await socketOnError({ socket, messageTracker });

	await socketOnClose({ socket, messageTracker });
});

directIPServer.listen(socketPort, async () => {
	await logEvent({
		message: `DirectIP Server Listening On Port ${socketPort}`,
		event: 'SUCCESS',
		action: actionSelection['MO'],
	});
});

/*
MO DirectIP Server/Client Requirements MO Gateway Client Requirements – DirectIP SBD Information

• The client must seek to establish a TCP/IP socket connection to the IP address and port number provided for the originating ISU.

• After a connection is established the client will transfer the MO payload and close the connection.

• If a connection is failed to be established the client will follow the retry protocol described above in Section 2.2 paragraph 6.

• After successful transmission the client will close the socket connection and will not expect an acknowledgment from the server.
MO Application Server Requirements

• The server will listen for TCP/IP socket connections on a specific port.

• Once connected, the client will transmit the MO payload and the server will receive the message in its entirety before parsing.

• The server will allow the client to close the socket connection.
*/
