import { propertySizesInBytes } from '../config/property-size.config';
import {
	DispositionFlag,
	isDispositionFlag,
} from '../fields/disposition-flag.field';
import {
	convertNumberToBuffer,
	convertStringToBuffer,
} from '../helpers/convert-value-to-buffer.helper';
import { IMTHeader } from './parse-mt-header';

export const convertMTHeaderBufferContent = ({
	mtHeader,
}: {
	mtHeader: IMTHeader;
}): Buffer => {
	/*
        0x00, // uniqueClientMessageID
        0x00, // uniqueClientMessageID
        0x00, // uniqueClientMessageID
        0x00, // uniqueClientMessageID
        0x00, // x 15 Bytes IMEI
        0x00, // mtDispositionFlags
        0x00, // mtDispositionFlags
    */

	const dispositionFlag: DispositionFlag = DispositionFlag.SEND_RING_ALERT; // NOTE: This Is Currently Fixed To 2

	if (!isDispositionFlag(dispositionFlag as number)) {
		throw new Error('Invalid MT Header Disposition Flag');
	}

	return Buffer.from([
		...convertStringToBuffer({ value: mtHeader.uniqueClientMessageID }),
		...convertStringToBuffer({ value: mtHeader.IMEI }),
		...convertNumberToBuffer({
			value: dispositionFlag,
			bufferSize: propertySizesInBytes.mtMessage.mtHeader.dispositionFlag,
		}),
	]);
};
