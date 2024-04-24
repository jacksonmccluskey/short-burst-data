import { convertMTHeaderBufferContent } from './convert-mt-header-buffer-content';
import { convertMTPayloadBufferContent } from './convert-mt-payload-buffer-content';
import { IParsedMTMessage } from './process-mt-message';
import { convertNumberToBuffer } from '../helpers/convert-value-to-buffer.helper';

export interface IConvertedMTMessageToBuffer {
	mtMessageBuffer: Buffer;
	mtHeaderBuffer: Buffer;
	mtPayloadBuffer: Buffer;
}

export const convertMTMessageToBuffer = ({
	mtHeader,
	mtPayload,
}: IParsedMTMessage): IConvertedMTMessageToBuffer => {
	/*
        0x41, // mtHeaderBufferIEI
        0x00, // mtHeaderBufferLength
        0x00, // mtHeaderBufferLength 
        0x00, // uniqueClientMessageID
        0x00, // uniqueClientMessageID
        0x00, // uniqueClientMessageID
        0x00, // uniqueClientMessageID
        0x00, // x 15 Bytes IMEI
        0x00, // mtDispositionFlags
        0x00, // mtDispositionFlags
    */

	if (!mtHeader || !mtPayload) {
		throw new Error('Missing MT Header or Payload');
	}

	const mtHeaderBufferContent = convertMTHeaderBufferContent({ mtHeader });

	const mtHeaderBuffer = Buffer.from([
		0x41,
		...convertNumberToBuffer({
			value: mtHeaderBufferContent.length,
			bufferSize: 2,
		}),
		...mtHeaderBufferContent,
	]);

	/*
        0x42, // mtPayloadBufferIEI
        0x00, // mtPayloadBufferLength
        0x00, // mtPayloadBufferLength
        0x00, // x N Bytes mtPayloadBuffer
    */

	const mtPayloadBufferContent = convertMTPayloadBufferContent({ mtPayload });

	const mtPayloadBuffer = Buffer.from([
		0x42,
		...convertNumberToBuffer({
			value: mtPayloadBufferContent.length,
			bufferSize: 2,
		}),
		...mtPayloadBufferContent,
	]);

	/*
        0x01, // protocolRevisionNumber
        0x00, // overallMessageLength
        0x00, // overallMessageLength
    */
	const mtMessageBuffer = Buffer.from([
		0x01,
		...convertNumberToBuffer({
			value: mtHeaderBuffer.length + mtPayloadBuffer.length,
			bufferSize: 2,
		}),
	]);

	return { mtMessageBuffer, mtHeaderBuffer, mtPayloadBuffer };
};
