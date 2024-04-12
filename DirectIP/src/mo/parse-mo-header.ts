import { IParseBufferMethodArgs, ParseBufferMethod } from './call-parse-method';

export interface IMOHeader {
	CDR: number;
	IMEI: string;
	sessionStatus: number;
	MTMSN: number;
	MOMSN: number;
	timeOfSession: Date;
}

export const parseMOHeader: ParseBufferMethod = async ({
	buffer,
	parsedBuffer,
}: IParseBufferMethodArgs): Promise<void> => {
	let offset = 0;

	const cdrReference = buffer.readUInt32BE(offset);
	console.log(`cdrReference: ${cdrReference}`);
	if (!cdrReference) {
		console.log('Invalid cdrReference');
		return;
	}
	offset += 4;

	const imei = buffer.toString('utf8').slice(offset, offset + 15);
	console.log(`imei: ${imei}`);
	if (!imei) {
		console.log('Invalid imei');
		return;
	}
	offset += 15;

	const sessionStatus = buffer.readUInt8(offset);
	console.log(`sessionStatus: ${sessionStatus}`);
	if (sessionStatus === undefined || sessionStatus < 0) {
		console.log('Invalid sessionStatus');
		return;
	}
	offset += 1;

	const momsn = buffer.readUInt16BE(offset);
	console.log(`momsn: ${momsn}`);
	if (momsn === undefined || momsn < 0) {
		console.log('Invalid momsn');
		return;
	}
	offset += 2;

	const mtmsn = buffer.readUInt16BE(offset);
	console.log(`mtmsn: ${mtmsn}`);
	if (mtmsn === undefined || mtmsn < 0) {
		console.log('Invalid mtmsn');
		return;
	}
	offset += 2;

	const timeOfSession = buffer.readUInt32BE(offset);
	console.log(`timeOfSession: ${timeOfSession}`);
	if (!timeOfSession) {
		console.log('Invalid timeOfSession');
		return;
	}

	parsedBuffer.moHeader = {
		CDR: cdrReference,
		IMEI: imei,
		sessionStatus,
		MTMSN: mtmsn,
		MOMSN: momsn,
		timeOfSession: new Date(timeOfSession * 1000), // timeOfSession UNIX Time in Seconds; Date UNIX Time in Milliseconds = timeOfSession * 1000
	};
};
