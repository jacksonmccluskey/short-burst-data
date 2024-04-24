import { propertySizesInBytes } from '../config/property-size.config';
import {
	IParseMOBufferMethodArgs,
	ParseMOBufferMethod,
} from './parse-mo-buffer';

export interface IMOHeader {
	CDR: number; // 4 Byte [unsigned integer]
	IMEI: string; // 15 Byte [char]
	sessionStatus: number; // 1 Byte [unsigned char]
	MTMSN: number; // 2 Byte [unsigned short]
	MOMSN: number; // 2 Byte [unsigned short]
	timeOfSession: Date; // 4 Byte [unsigned integer]
}

export const parseMOHeader: ParseMOBufferMethod = async ({
	buffer,
	messageTracker,
}: IParseMOBufferMethodArgs): Promise<void> => {
	if (messageTracker.parsedMOMessage?.moHeader !== undefined) {
		throw new Error('MO Header Already Defined. Potential Double Message.');
	}

	if (buffer.length < propertySizesInBytes.moMessage.moHeader.length) {
		throw new Error('Not Enough Buffer To Parse MO Header');
	}

	let bufferOffset = 0;

	const cdrReference = buffer.readUInt32BE(bufferOffset);
	console.log(`cdrReference: ${cdrReference}`);
	if (!cdrReference) {
		console.log('Invalid cdrReference');
		return;
	}
	bufferOffset += 4;
	messageTracker.messageBytes.currentNumberOfBytes += 4;

	const imei = buffer.toString('utf8').slice(bufferOffset, bufferOffset + 15);
	console.log(`imei: ${imei}`);
	if (!imei) {
		console.log('Invalid imei');
		return;
	}
	bufferOffset += 15;
	messageTracker.messageBytes.currentNumberOfBytes += 15;

	const sessionStatus = buffer.readUInt8(bufferOffset);
	console.log(`sessionStatus: ${sessionStatus}`);
	if (sessionStatus === undefined || sessionStatus < 0) {
		console.log('Invalid sessionStatus');
		return;
	}
	bufferOffset += 1;
	messageTracker.messageBytes.currentNumberOfBytes += 1;

	const momsn = buffer.readUInt16BE(bufferOffset);
	console.log(`momsn: ${momsn}`);
	if (momsn === undefined || momsn < 0) {
		console.log('Invalid momsn');
		return;
	}
	bufferOffset += 2;
	messageTracker.messageBytes.currentNumberOfBytes += 2;

	const mtmsn = buffer.readUInt16BE(bufferOffset);
	console.log(`mtmsn: ${mtmsn}`);
	if (mtmsn === undefined || mtmsn < 0) {
		console.log('Invalid mtmsn');
		return;
	}
	bufferOffset += 2;
	messageTracker.messageBytes.currentNumberOfBytes += 2;

	const timeOfSession = buffer.readUInt32BE(bufferOffset);
	console.log(`timeOfSession: ${timeOfSession}`);
	if (!timeOfSession) {
		console.log('Invalid timeOfSession');
		return;
	}
	bufferOffset += 4;
	messageTracker.messageBytes.currentNumberOfBytes += 4;

	const moHeader: IMOHeader = {
		CDR: cdrReference,
		IMEI: imei,
		sessionStatus,
		MTMSN: mtmsn,
		MOMSN: momsn,
		timeOfSession: new Date(timeOfSession * 1000), // NOTE: timeOfSession UNIX Time in Seconds; Date UNIX Time in Milliseconds = timeOfSession * 1000
	};

	if (messageTracker.parsedMOMessage == undefined) {
		messageTracker.parsedMOMessage = { moHeader };
	} else if (messageTracker.parsedMOMessage.moHeader == undefined) {
		messageTracker.parsedMOMessage.moHeader = moHeader;
	} else {
		throw new Error('MO Message Already Defined'); // NOTE: Duplicate Check
	}
};
