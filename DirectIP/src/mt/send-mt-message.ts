import net from 'net';
import { socketOnData } from '../methods/socket-on-data.method';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { socketOnError } from '../methods/socket-on-error.method';
import { socketOnClose } from '../methods/socket-on-close.method';
import { actionSelection, logEvent } from '../helpers/log-event.helper';
import {
	readBufferAsASCIIString,
	readBufferAsHexArrayString,
} from '../helpers/read-buffer.helper';

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
	const socketPort = process.env.SOCKET_PORT
		? parseInt(process.env.SOCKET_PORT)
		: 10800; // process.env.COMMERCIAL_IRIDIUM_PORT ? parseInt(process.env.COMMERCIAL_IRIDIUM_PORT) : undefined
	const socketHost = process.env.SOCKET_HOST
		? process.env.SOCKET_HOST
		: 'localhost'; // process.env.COMMERCIAL_IRIDIUM_GATEWAY ? parseInt(COMMERCIAL_IRIDIUM_GATEWAY) : undefined

	const mtMessageBufferInterpretted =
		readBufferAsHexArrayString(mtMessageBuffer);

	const mtHeaderBufferInterpretted = readBufferAsHexArrayString(mtHeaderBuffer);

	const mtPayloadBufferInterpretted =
		readBufferAsHexArrayString(mtPayloadBuffer);

	await logEvent({
		message: `Writing Buffer (Sending MT Message):\n\nMT Message Buffer:\n\n${mtMessageBufferInterpretted}\n\nMT Header Buffer:\n\n${mtHeaderBufferInterpretted}\n\nMT Payload Buffer:\n\n${mtPayloadBufferInterpretted}`,
		event: 'PROCESSING',
		action: actionSelection['MT'],
		source: 'directip-api',
	});

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

	const messageTracker: IMessageTracker = {
		messageBytes: { currentNumberOfBytes: 0, expectedNumberOfBytes: 0 },
	};

	socketOnData({ socket, messageTracker });

	socketOnError({ socket, messageTracker });

	socketOnClose({ socket, messageTracker });
};

/*
MT DirectIP Transfers – DirectIP SBD Information

For MT message transfers the MT DirectIP component plays the role of server while the vendor application plays the role of client in a server/client architecture. In this case the MT component of the Gateway listens for connections from the vendor software for the purpose of transferring MT messages.

The MT DirectIP protocol will only transfer MT messages from the vendor application (client) to the Iridium Gateway (server). 
The MT DirectIP protocol calls for a confirmation to be sent from the server back to the client; 
the confirmation will indicate success or failure of data processing.

When the vendor application wishes for a message to be queued, the application opens a socket and connects to the Iridium Gateway server, the message is then delivered with disposition. 
The Iridium server parses the received message and inserts the payload into its database. 
Afterwards a confirmation is sent back to the client application.

After the payload is deposited a separate process in the Iridium Gateway queues the payload for transfer while assigning a Mobile Terminated Message Sequence Number to each payload. 
The payload in the front of the queue is marked as “Pending” and the others are marked as “Queued”.

The added MT delivery features are only available with the use of the MT DirectIP protocol. 
The MT disposition field in the MT header is a 2-byte bit map that provides the availability of 16 flags.

There is a Flush MT Queue flag that enables an application to delete all of the messages in the MT Queue at the Gateway except for the current payload that arrived with the set MT Queue flag.

There is also a Send Ring Alert with no MT payload flag. 
When set, this flag causes the GSS to send a ring alert to the given IMEI within the bounds of normal ring alert processing. 
The bounds include the ISU’s ring alert enable flag and the ISU’s attach/detach status. 
If the ISU is attached and its ring alerts are enabled, a single alert will be sent.
If either of these conditions fails to be met the vendor will be made aware, through a status flag in the confirmation message, that no ring alert will be sent. 
If a MT payload is included with the ring alert from the GSS the MT-SBD transfer will result in a protocol error. 
If a ring alert is sent from the GSS and there is an awaiting payload in the queue, that payload will not be delivered until the ISU retrieves the MT-SBD message. The functionality provided by this feature should not be used to check the power status of ISUs or to compensate for poor application design. 
Using this command for those purposes may result in the implementation of restrictions. 
Instead the application should utilize the +SBDI command with an empty send buffer for those purposes.

MT DirectIP Server/Client Requirements MT GSS Server Requirements – DirectIP SBD Information

• The server will listen for TCP/IP socket connections on a specific port.

• Once connected, the server will receive the entire MT message before parsing.

• The server will validate the message to ensure it meets these criteria:

1. IMEI is valid and provisioned.

2. Input in MT header is valid.

3. Payload does not exceed maximum for ISU (270 bytes for 9601 IMEIs and 1890 for 9522[A]s).

4. Gateway resources are available.

• The server will send a confirmation indicating success or failure.

• The server will terminate the socket connection after transmission of confirmation message.

• If the connection fails at any time prior to transmission of confirmation, the MT message will be dropped.
MT Application Client Requirements

• The client will seek to establish a TCP/IP socket connection to the IP address of the Gateway MT DirectIP server on a specified port.

• Once connected, the client will transmit the MT payload and wait for the confirmation.

• Once the confirmation has been received, the client will allow the server to close the socket connection.
*/
