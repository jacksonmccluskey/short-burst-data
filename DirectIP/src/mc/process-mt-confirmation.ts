import { propertySizesInBytes } from '../config/property-size.config';
import { actionSelection, logEvent } from '../helpers/log-event.helper';
import {
	readBufferAsASCIIString,
	readBufferAsHexArrayString,
	readBufferAsNumber,
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
	await logEvent({
		message: `Processing MT Confirmation Buffer:\n\n${readBufferAsHexArrayString(
			buffer
		)}`,
		event: 'PROCESSING',
		action: actionSelection['MC'],
		source: 'Iridium Gateway',
	});

	if (messageTracker.parsedMTConfirmationMessage !== undefined) {
		throw new Error(
			'MT Confirmation Message Already Defined. Potential Duplicate Buffer'
		);
	}

	const uniqueClientMessageID = readBufferAsASCIIString({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes:
			propertySizesInBytes.mtConfirmationMessage.uniqueClientMessageID,
	});

	const IMEI = readBufferAsASCIIString({
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
		isSigned: true,
	});

	const parsedMTConfirmationMessage: IParsedMTConfirmationMessage = {
		uniqueClientMessageID,
		IMEI,
		autoIDReference,
		mtMessageStatus,
	};

	await logEvent({
		// TODO: Temp For Testing
		message: `Parsed MT Confirmation Message:\n\n${JSON.stringify(
			parsedMTConfirmationMessage
		)}\n\nFrom Buffer:\n\n${readBufferAsHexArrayString(buffer)}`,
		event: 'PROCESSING',
		action: actionSelection['MC'],
		messageTracker,
	});
	messageTracker.parsedMTConfirmationMessage = parsedMTConfirmationMessage;
};
