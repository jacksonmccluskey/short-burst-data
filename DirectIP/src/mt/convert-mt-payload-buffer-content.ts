import { convertStringToBuffer } from '../helpers/convert-value-to-buffer.helper';
import { IMTPayload } from './parse-mt-payload';

export const convertMTPayloadBufferContent = ({
	mtPayload,
}: {
	mtPayload: IMTPayload;
}): Buffer => {
	return convertStringToBuffer({ value: mtPayload.payload });
};
