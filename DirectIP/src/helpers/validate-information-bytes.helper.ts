import { propertySizesInBytes } from '../config/property-size.config';

export interface IValidateInformationBytes {
	buffer: Buffer;
}

export const validateInformationBytes = ({
	buffer,
}: IValidateInformationBytes) => {
	const informationBytes =
		propertySizesInBytes.informationElementID +
		propertySizesInBytes.informationElementLength;

	if (buffer.length < informationBytes) {
		throw new Error('Buffer Is Smaller Than Needed To Parse Information Bytes');
	}
};
