import { IParseBufferMethodArgs, ParseBufferMethod } from './call-parse-method';

export interface IMOLocationInformation {
	latitude: number;
	longitude: number;
	cepRadius: number;
}

const parseLocationIndicators = (
	indicatorByte: number
): { north?: number; east?: number } => {
	if (indicatorByte < 0 || indicatorByte > 255) {
		return {};
	}

	const reservedFormat = (indicatorByte & 0xf0) >> 4;

	if (reservedFormat !== 0) {
		return {};
	}

	const north = (indicatorByte & 0x02) === 0;

	const east = (indicatorByte & 0x01) === 0;

	return { north: north ? 1 : -1, east: east ? 1 : -1 };
};

export const parseMOLocationInformation: ParseBufferMethod = async ({
	buffer,
	parsedBuffer,
}: IParseBufferMethodArgs): Promise<void> => {
	let offset = 0;

	const indicatorByte = buffer.readUInt8(offset);
	offset += 1;

	const { north, east } = parseLocationIndicators(indicatorByte);

	if (north == undefined || east == undefined) {
		console.log('No Indicators (NSI or EWI) Were Found.');
		return;
	}

	const latitudeDegrees = buffer.readUInt8(offset);
	offset += 1;

	const latitudeMinutes = buffer.readUInt16BE(offset);
	offset += 2;

	const latitude = north * (latitudeDegrees + latitudeMinutes / (60 * 1000));

	const longitudeDegrees = buffer.readUInt8(offset);
	offset += 1;

	const longitudeMinutes = buffer.readUInt16BE(offset);
	offset += 2;

	const longitude = east * (longitudeDegrees + longitudeMinutes / (60 * 1000));

	const cepRadius = buffer.readUInt8(offset);

	parsedBuffer.moLocationInformation = { latitude, longitude, cepRadius };
};
