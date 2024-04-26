import { propertySizesInBytes } from '../config/property-size.config';
import { IBufferTracker } from '../helpers/buffer-tracker.helper';
import {
	NumberOfBytes,
	readBufferAsNumber,
	readBufferAsString,
} from '../helpers/read-buffer.helper';
import {
	IParseMOBufferMethodArgs,
	ParseMOBufferMethod,
} from './parse-mo-buffer';

export interface IMOHeader {
	CDR: number;
	IMEI: string;
	sessionStatus: number;
	MTMSN: number;
	MOMSN: number;
	timeOfSession: Date;
}

export const parseMOHeader: ParseMOBufferMethod = async ({
	buffer,
	bufferTracker,
	messageTracker,
}: IParseMOBufferMethodArgs): Promise<void> => {
	if (messageTracker.parsedMOMessage?.moHeader !== undefined) {
		throw new Error('MO Header Already Defined. Potential Double Message.');
	}

	if (buffer.length < propertySizesInBytes.moMessage.moHeader.length) {
		throw new Error('Not Enough Buffer To Parse MO Header');
	}

	const CDR = readBufferAsNumber({
		// Also Referred To As The Auto ID, This Is A Unique Value Given To Each Call Data Record To Guarantee The Ability To Reference An Individual Call.
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.moMessage.moHeader.CDR,
	});

	const IMEI = readBufferAsString({
		// The IMEI Is Unique To Each ISU. In This Case It Is The IMEI Of The ISU That Sent The MO Message. It Is Always 15 Chracters
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.moMessage.moHeader.IMEI,
	});

	const sessionStatus = readBufferAsNumber({
		// The Session Status Indicates Success Or Failure Of The SBD Session Between The IMEI And The Gateway. No Payload Will Be Preseent In MO Messages For Which The Status Is Unsuccessful
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.moMessage.moHeader.sessionStatus,
	});

	const MOMSN = readBufferAsNumber({
		// The Mobile Originated Message Sequence Number Associated With The SBD Session. This Value IS Set By The IMEI. The MOMSN IS Transmitted To The Gateway During Every SBD Session. The MOMSN Is Incremented For Every Successful SBD Session
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.moMessage.moHeader.MOMSN,
	});

	const MTMSN = readBufferAsNumber({
		// The Mobile Terminated Message Sequence Number Associated With An SBD Session. Unlike The MOMSN Which Is Set By The IMEI, The Unique MTMSN Is Set By The Gateway When The Message Is Queued For Delivery. The MTMSN Is Transferred To The IMEI As Part Of The MT Payload Transfer Regardless Of An SBD Session's Success. The Value Of MOMSN Will Be Zero If There Is No MT Delivery Attempt. This Is Unique To Each IMEI.
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.moMessage.moHeader.MOMSN,
	}) as number;

	const timeOfSessionInSeconds = readBufferAsNumber({
		// This Is A UTC Timestamp In The Form Of An Epoch Time Integer. The Timestamp IS The Time Of The Session Between The IMEI And The Gateway. The Epoch Time Represents The Seconds Since The Start Of The Epoch: 1/1/1970 00:00:00. Format: Epoch Time Integer Resolution: 1 Second
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.moMessage.moHeader.timeOfSession,
	}) as number;

	const timeOfSession = new Date(timeOfSessionInSeconds * 1000); // NOTE: timeOfSession UNIX Time in Seconds; Date UNIX Time in Milliseconds = timeOfSession * 1000

	const moHeader: IMOHeader = {
		CDR,
		IMEI,
		sessionStatus,
		MTMSN,
		MOMSN,
		timeOfSession,
	};

	if (messageTracker.parsedMOMessage == undefined) {
		messageTracker.parsedMOMessage = { moHeader };
	} else if (messageTracker.parsedMOMessage.moHeader == undefined) {
		messageTracker.parsedMOMessage.moHeader = moHeader;
	} else {
		throw new Error('MO Message Already Defined'); // NOTE: Duplicate Check
	}
};

/*
The information in the MO DirectIP Header is mandatory for every DirectIP MO message. 
The header is detailed in the following table.

| Field Name				| Data Type			| Length (Bytes)			| Range Of Values			|
| CDR Reference (Auto ID)	| unsigned integer	| 4							| 0 To 16^4					|
| IMEI						| char				| 15						| ASCII Numeric Characters	|
| Session Status			| unsigned char		| 1							| See Session Status		|
| MOMSN						| unsigned short	| 2							| 1 to 65535				|
| MTMSN						| unsigned short	| 2							| 1 to 65535				|
| Time Of Session			| unsigned integer	| 4							| Epoch Time (Seconds)		|
*/
