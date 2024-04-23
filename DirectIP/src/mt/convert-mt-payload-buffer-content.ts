import { IMTPayload } from './parse-mt-payload';

export const convertMTPayloadBufferContent = ({
	mtPayload,
}: {
	mtPayload: IMTPayload;
}): Buffer => {
	return Buffer.from([]);
};
