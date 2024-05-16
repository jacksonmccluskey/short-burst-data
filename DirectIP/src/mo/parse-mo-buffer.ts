import { IEI } from '../fields/information-element-identifier.field';
import { IMOHeader, parseMOHeader } from './parse-mo-header';
import {
	IMOLocationInformation,
	parseMOLocationInformation,
} from './parse-mo-location-information';
import { IMOPayload, parseMOPayload } from './parse-mo-payload';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { IHandleProcessBufferMethodArgs } from '../methods/process-buffer.method';
import { IBufferTracker } from '../helpers/buffer-tracker.helper';
import { actionSelection, logEvent } from '../helpers/log-event.helper';
import {
	readBufferAsASCIIString,
	readBufferAsHexArrayString,
} from '../helpers/read-buffer.helper';

export interface IParsedMOMessage {
	moHeader?: IMOHeader; // REQUIRED: The Information In The MO DirectIP Header Is Mandatory For Every DirectIP MO Message.
	moPayload?: IMOPayload; // OPTIONAL (IF FAILED OR EMPTY): This Is The Actual MO Payload From The IMEI Currently At The Gateway. The Accompanying Payload Is A Result Of The Successful SBD Session Identified In The Header. In An MO Message Delivery Related To An Empty Mailbox Check (EMBC) Session Or A Failed Session, No Payload Will Be Included.
	moLocationInformation?: IMOLocationInformation; // OPTIONAL: This IE Includes Location Values That Are An Estimate Of The Location Of The IMEI From Which The Message Originated. The MO Location Information Field Is Optional For MO Messages; The Option Is Determined When The IMEI Is Configured But Can Be Changed At A Later Time.
}

export interface IParseMOBufferMethodArgs {
	buffer: Buffer;
	bufferTracker: IBufferTracker;
	messageTracker: IMessageTracker;
	informationElementLength: number;
}

export type ParseMOBufferMethod = (
	args: IParseMOBufferMethodArgs
) => Promise<void>;

const parseMOBufferMethods: { [keys in IEI]?: ParseMOBufferMethod } = {
	[IEI.MO_HEADER]: parseMOHeader,
	[IEI.MO_PAYLOAD]: parseMOPayload,
	[IEI.MO_LOCATION_INFORMATION]: parseMOLocationInformation,
};

export const callParseMOBufferMethod = async ({
	buffer,
	bufferTracker,
	informationElementID,
	messageTracker,
	informationElementLength,
}: IHandleProcessBufferMethodArgs): Promise<void> => {
	await (parseMOBufferMethods[informationElementID] as ParseMOBufferMethod)({
		buffer,
		bufferTracker,
		messageTracker,
		informationElementLength,
	});
};

/*
MO DirectIP Transfers – DirectIP SBD Information

In the case of MO messages the vendor application plays the role of a server application. 
For MO messages the Iridium Gateway seeks to establish a connection with the vendor application for MO transfers. 
In this case an attachment is only made by the Gateway to the vendor application when data is being delivered by the Gateway.

The MO DirectIP protocol will only transfer MO messages from the Iridium Gateway (client) to the vendor application (server). 
No acknowledgment is expected from the server in the MO DirectIP protocol.
When a number of messages are sent to the same ISU they are stored and delivered in first-in-first-out order; 
however, only one message is delivered per socket connection. 
When the first message in the FIFO queue is delivered the remaining messages move up in position toward the first position or front of the queue.

When an ISU initiates a session between itself and the Iridium Gateway to send out a MO message the Gateway stores the message in the queue. 
Upon reception of this message the Gateway opens a socket, connects to the client application, and then transfers the MO message which includes SBD session descriptors. 
The socket is then closed and the aforementioned process is repeated for any other messages in the queue.

Each client application may have up to 1000 messages in its provided queue at the Gateway at any given time. 
In the case of an exceeded message limit the oldest messages will be deleted.

If the first attempt to connect to the client times out the message delivery will not take place. 
Additional attempts will be made with the timeout values for the first, second, and third attempts being 5, 15, and 45 seconds respectively. 
Following the third attempt, attempts to connect will continue using the previously mentioned timeout values. 
This will continue up to the lifetime of the message which is 12 hours from the time it is received at the Gateway. 
Each message has a lifetime of up to 12 hours starting at the time the payload arrived at the GSS. 
If it cannot be delivered it will be deleted from the queue.
*/
