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

	const north = (indicatorByte & 0x2) === 0;

	const east = (indicatorByte & 0x1) === 0;

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
	console.log(`north: ${north}; east: ${east}`);

	const latitudeDegrees = buffer.readUInt8(offset);
	offset += 1;

	console.log(`latitudeDegrees: ${latitudeDegrees}`);

	const latitudeMinutes = buffer.readUInt16BE(offset);
	offset += 2;

	console.log(`latitudeMinutes: ${latitudeMinutes}`);

	const parsedLatitudeMinutes = latitudeMinutes; // / (60 * 1000);
	const calculatedLatitudeDegrees = north * latitudeDegrees;
	const latitude = parseFloat(
		`${calculatedLatitudeDegrees}.${parsedLatitudeMinutes}`
	);
	console.log(`latitude: ${latitude}`);

	const longitudeDegrees = buffer.readUInt8(offset);
	offset += 1;

	console.log(`longitudeDegrees: ${longitudeDegrees}`);

	const longitudeMinutes = buffer.readUInt16BE(offset);
	offset += 2;

	console.log(`longitudeMinutes: ${longitudeMinutes}`);

	const parsedLongitudeMinutes = longitudeMinutes; // / (60 * 1000);
	const calculatedLongitudeDegrees = east * longitudeDegrees;
	const longitude = parseFloat(
		`${calculatedLongitudeDegrees}.${parsedLongitudeMinutes}`
	);
	console.log(`longitude: ${longitude}`);

	const cepRadius = buffer.readUInt32BE(offset);
	console.log(`cepRadius: ${cepRadius}`);

	parsedBuffer.moLocationInformation = { latitude, longitude, cepRadius };
};
