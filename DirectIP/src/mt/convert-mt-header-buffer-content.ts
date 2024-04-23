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
		0x00,
		0x00,
		0x00,
		0x00,
		...'123456789123456'.split('').map((char) => char.charCodeAt(0)),
		0x00,
		0x00,
	]);
};
