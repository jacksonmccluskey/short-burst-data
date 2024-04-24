import { convertStringToBuffer } from '../helpers/convert-value-to-buffer.helper';
import { IMTHeader } from './parse-mt-header';

export const convertMTHeaderBufferContent = ({
	mtHeader,
}: {
	mtHeader: IMTHeader;
}): Buffer => {
	console.log(`Converting MT Header To Buffer: ${JSON.stringify(mtHeader)}`);

	/*
        0x00, // uniqueClientMessageID
        0x00, // uniqueClientMessageID
        0x00, // uniqueClientMessageID
        0x00, // uniqueClientMessageID
        0x00, // x 15 Bytes IMEI
        0x00, // mtDispositionFlags
        0x00, // mtDispositionFlags
    */

	return Buffer.from([
		...convertStringToBuffer({ value: mtHeader.uniqueClientMessageID }),
		...convertStringToBuffer({ value: mtHeader.IMEI }),
		0x00,
		0x02,
	]);
};
