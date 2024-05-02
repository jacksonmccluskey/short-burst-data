import { IEI } from '../fields/information-element-identifier.field';
import { convertNumberToBuffer } from '../helpers/convert-value-to-buffer.helper';
import { IHandleParsedMessageMethodArgs } from '../methods/handle-parsed-message.method';
import { convertMTConfirmationBufferContent } from '../mc/convert-mt-confirmation-content';
import { IParsedMTConfirmationMessage } from '../mc/process-mt-confirmation';

export const handleParsedMTMessage = async ({
	messageTracker,
	socket,
}: IHandleParsedMessageMethodArgs) => {
	const { parsedMTMessage } = messageTracker;

	if (!socket) {
		return;
	}

	const parsedMTConfirmationMessage: IParsedMTConfirmationMessage = {
		// NOTE: Only For Testing; The Iridium Gateway Defines This Logic
		uniqueClientMessageID:
			parsedMTMessage?.mtHeader?.uniqueClientMessageID ?? 'XXXX',
		IMEI: parsedMTMessage?.mtHeader?.IMEI ?? '123456789012345',
		autoIDReference: 123456,
		mtMessageStatus: -1, // TODO: Write Actual Message Status (If Needed For Testing)
	};

	const mtcHeaderBufferContent = convertMTConfirmationBufferContent({
		parsedMTConfirmationMessage,
	});

	const mtcHeaderBuffer = Buffer.from([
		...convertNumberToBuffer({
			value: IEI.MT_CONFIRMATION_MESSAGE,
			bufferSize: 1,
		}),
		...convertNumberToBuffer({
			value: mtcHeaderBufferContent.length,
			bufferSize: 2,
		}),
		...mtcHeaderBufferContent,
	]);

	const mtcMessageBuffer = Buffer.from([
		0x01,
		...convertNumberToBuffer({
			value: mtcHeaderBuffer.length,
			bufferSize: 2,
		}),
	]);

	socket.write(mtcMessageBuffer);
	socket.write(mtcHeaderBuffer);
};
