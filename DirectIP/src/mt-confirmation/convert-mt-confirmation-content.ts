import {
	convertNumberToBuffer,
	convertStringToBuffer,
} from '../helpers/convert-value-to-buffer.helper';
import { IParsedMTConfirmationMessage } from './process-mt-confirmation';

export const convertMTConfirmationBufferContent = ({
	parsedMTConfirmationMessage,
}: {
	parsedMTConfirmationMessage: IParsedMTConfirmationMessage;
}): Buffer => {
	/*
        0x00, // uniqueClientMessageID
        0x00, // uniqueClientMessageID
        0x00, // uniqueClientMessageID
        0x00, // uniqueClientMessageID
        0x00, // x 15 Bytes IMEI
        0x00, // autoIDReference
        0x00, // autoIDReference
        0x00, // autoIDReference
        0x00, // autoIDReference
        0x00, // mtMessageStatus
        0x00, // myMessageStatus
    */

	return Buffer.from([
		...convertStringToBuffer({
			value: parsedMTConfirmationMessage.uniqueClientMessageID,
		}),
		...convertStringToBuffer({ value: parsedMTConfirmationMessage.IMEI }),
		...convertNumberToBuffer({
			value: parsedMTConfirmationMessage.autoIDReference,
			bufferSize: 4,
		}),
		...convertNumberToBuffer({
			value: parsedMTConfirmationMessage.mtMessageStatus,
			bufferSize: 2,
		}),
	]);
};
