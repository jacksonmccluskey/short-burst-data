import { convertHexStringToBuffer } from '../helpers/convert-value-to-buffer.helper';
import { IMTPayload } from './parse-mt-payload';

export const convertMTPayloadBufferContent = ({
	mtPayload,
}: {
	mtPayload: IMTPayload;
}): Buffer => {
	return convertHexStringToBuffer({ value: mtPayload.payload });
};
