import { propertySizesInBytes } from '../config/property-size.config';
import { DispositionFlag } from '../fields/disposition-flag.field';
import {
	readBufferAsASCIIString,
	readBufferAsNumber,
} from '../helpers/read-buffer.helper';
import { IParseMTBufferMethodArgs } from './parse-mt-buffer';

export interface IMTHeader {
	uniqueClientMessageID: string;
	IMEI: string;
	dispositionFlag: DispositionFlag;
}

export const parseMTHeader = async ({
	buffer,
	bufferTracker,
	messageTracker,
}: IParseMTBufferMethodArgs): Promise<void> => {
	if (messageTracker.parsedMTMessage?.mtHeader !== undefined) {
		throw new Error('MT Header Already Defined. Potential Duplicate Message.');
	}

	if (buffer.length < propertySizesInBytes.mtMessage.mtHeader.length) {
		throw new Error('Not Enough Buffer To Parse MT Header');
	}

	const uniqueClientMessageID: string = readBufferAsASCIIString({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes:
			propertySizesInBytes.mtMessage.mtHeader.uniqueClientMessageID,
	});

	const IMEI: string = readBufferAsASCIIString({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.mtMessage.mtHeader.IMEI,
	});

	const dispositionFlag = readBufferAsNumber({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.mtMessage.mtHeader.dispositionFlag,
	});

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
