import { propertySizesInBytes } from '../config/property-size.config';
import { DispositionFlag } from '../fields/disposition-flag.field';
import { IParseMTBufferMethodArgs } from './parse-mt-buffer';

export interface IMTHeader {
	uniqueClientMessageID: string;
	IMEI: string;
	dispositionFlag: DispositionFlag;
}

export const parseMTHeader = async ({
	buffer,
	messageTracker,
}: IParseMTBufferMethodArgs): Promise<void> => {
	if (messageTracker.parsedMTMessage?.mtHeader !== undefined) {
		throw new Error('MT Header Already Defined. Potential Duplicate Message.');
	}

	if (buffer.length < propertySizesInBytes.mtMessage.mtHeader.length) {
		throw new Error('Not Enough Buffer To Parse MT Header');
	}

	let bufferOffset = 0;

	const uniqueClientMessageID = buffer
		.toString('utf8')
		.slice(
			bufferOffset,
			bufferOffset +
				propertySizesInBytes.mtMessage.mtHeader.uniqueClientMessageID
		);
	console.log(`uniqueClientMessageID: ${uniqueClientMessageID}`);

	if (
		!uniqueClientMessageID.length ||
		uniqueClientMessageID.length !==
			propertySizesInBytes.mtMessage.mtHeader.uniqueClientMessageID
	) {
		console.log('Invalid uniqueClientMessageID');
		return;
	}
	bufferOffset += propertySizesInBytes.mtMessage.mtHeader.uniqueClientMessageID;
	messageTracker.messageBytes.currentNumberOfBytes +=
		propertySizesInBytes.mtMessage.mtHeader.uniqueClientMessageID;

	const IMEI = buffer
		.toString('utf8')
		.slice(
			bufferOffset,
			bufferOffset + propertySizesInBytes.mtMessage.mtHeader.IMEI
		);
	console.log(`IMEI: ${IMEI}`);

	if (
		!IMEI.length ||
		IMEI.length !== propertySizesInBytes.mtMessage.mtHeader.IMEI
	) {
		console.log('Invalid IMEI');
		return;
	}
	bufferOffset += propertySizesInBytes.mtMessage.mtHeader.IMEI;
	messageTracker.messageBytes.currentNumberOfBytes +=
		propertySizesInBytes.mtMessage.mtHeader.IMEI;

	const dispositionFlag = buffer.readUInt16BE(bufferOffset);

	console.log(`dispositionFlags: ${dispositionFlag}`);

	if (!dispositionFlag) {
		console.log('Invalid dispositionFlag');
		return;
	}

	bufferOffset += propertySizesInBytes.mtMessage.mtHeader.dispositionFlag;
	messageTracker.messageBytes.currentNumberOfBytes +=
		propertySizesInBytes.mtMessage.mtHeader.dispositionFlag;

	const mtHeader: IMTHeader = {
		uniqueClientMessageID,
		IMEI,
		dispositionFlag,
	};

	if (messageTracker.parsedMTMessage == undefined) {
		messageTracker.parsedMTMessage = { mtHeader };
	} else if (messageTracker.parsedMTMessage.mtHeader == undefined) {
		messageTracker.parsedMTMessage.mtHeader = mtHeader;
	}
};
