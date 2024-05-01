import { propertySizesInBytes } from '../config/property-size.config';
import {
	readBufferAsNumber,
	readBufferAsString,
} from '../helpers/read-buffer.helper';
import { IHandleProcessBufferMethodArgs } from '../methods/process-buffer.method';

export interface IParsedMTConfirmationMessage {
	uniqueClientMessageID: string; // SIZE: 4 Byte [char]
	IMEI: string; // SIZE: 15 Byte [char]
	autoIDReference: number; // SIZE: 4 Byte [unsigned int]
	mtMessageStatus: number; // SIZE: 2 Bytes
}

export const processMTConfirmationMessage = async ({
	buffer,
	bufferTracker,
	messageTracker,
}: IHandleProcessBufferMethodArgs) => {
	if (messageTracker.parsedMTConfirmationMessage !== undefined) {
		throw new Error(
			'MT Confirmation Message Already Defined. Potential Duplicate Buffer'
		);
	}

	const uniqueClientMessageID = readBufferAsString({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes:
			propertySizesInBytes.mtConfirmationMessage.uniqueClientMessageID,
	});

	const IMEI = readBufferAsString({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.mtConfirmationMessage.IMEI,
	});

	const autoIDReference = readBufferAsNumber({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.mtConfirmationMessage.autoIDReference,
	});

	const mtMessageStatus = readBufferAsNumber({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.mtConfirmationMessage.mtMessageStatus,
	});

	const parsedMTConfirmationMessage: IParsedMTConfirmationMessage = {
		uniqueClientMessageID,
		IMEI,
		autoIDReference,
		mtMessageStatus,
	};

	messageTracker.parsedMTConfirmationMessage = parsedMTConfirmationMessage;
};
