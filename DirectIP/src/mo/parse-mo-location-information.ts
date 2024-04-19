import {
	IParseMOBufferMethodArgs,
	ParseMOBufferMethod,
} from './parse-mo-buffer';

export interface IMOLocationInformation {
	latitude: number; // See Docs
	longitude: number; // See Docs
	cepRadius: number; // 4 Byte [unsigned integer]
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

export const parseMOLocationInformation: ParseMOBufferMethod = async ({
	buffer,
	messageTracker,
	informationElementLength,
}: IParseMOBufferMethodArgs): Promise<void> => {
	if (messageTracker.parsedMOMessage?.moLocationInformation !== undefined) {
		throw new Error(
			'MO Location Information Already Defined. Potential Double Message.'
		);
	}

	let bufferOffset = 0;

	const indicatorByte = buffer.readUInt8(bufferOffset);
	bufferOffset += 1;

	const { north, east } = parseLocationIndicators(indicatorByte);

	if (north == undefined || east == undefined) {
		console.log('No Indicators (NSI or EWI) Were Found.');
		return;
	}
	console.log(`north: ${north}; east: ${east}`);

	const latitudeDegrees = buffer.readUInt8(bufferOffset);
	bufferOffset += 1;

	console.log(`latitudeDegrees: ${latitudeDegrees}`);

	const latitudeMinutes = buffer.readUInt16BE(bufferOffset);
	bufferOffset += 2;

	console.log(`latitudeMinutes: ${latitudeMinutes}`);

	// TODO: Implement parsedLatitudeMinutes
	//const parsedLatitudeMinutes = latitudeMinutes / 60000; // / (60 * 1000) = Convert Minutes To Decimal
	const calculatedLatitudeDegrees = north * latitudeDegrees;
	const latitude = parseFloat(
		`${calculatedLatitudeDegrees}.${latitudeMinutes}`
	); // TODO: + parsedLatitudeMinutes; // Calculate Decimal

	console.log(`latitude: ${latitude}`);

	const longitudeDegrees = buffer.readUInt8(bufferOffset);
	bufferOffset += 1;

	console.log(`longitudeDegrees: ${longitudeDegrees}`);

	const longitudeMinutes = buffer.readUInt16BE(bufferOffset);
	bufferOffset += 2;

	console.log(`longitudeMinutes: ${longitudeMinutes}`);

	// TODO: Implement parsedLongitudeMinutes
	// const parsedLongitudeMinutes = longitudeMinutes / 60000; // / (60 * 1000) = Convert Minutes To Decimal
	const calculatedLongitudeDegrees = east * longitudeDegrees;
	const longitude = parseFloat(
		`${calculatedLongitudeDegrees}.${longitudeMinutes}`
	); // TODO: + parsedLongitudeMinutes; // Calculate Decimal
	console.log(`longitude: ${longitude}`);

	const cepRadius = buffer.readUInt32BE(bufferOffset);
	console.log(`cepRadius: ${cepRadius}`);
	bufferOffset += 4;

	console.log(
		`Adding ${bufferOffset} Bytes To currentNumberOfBytes: ${messageTracker.messageBytes.currentNumberOfBytes}`
	);
	messageTracker.messageBytes.currentNumberOfBytes += bufferOffset;
	console.log(
		`currentNumberOfBytes: ${messageTracker.messageBytes.currentNumberOfBytes}`
	);

	if (messageTracker.parsedMOMessage == undefined) {
		messageTracker.parsedMOMessage = {};
	}

	messageTracker.parsedMOMessage.moLocationInformation = {
		latitude,
		longitude,
		cepRadius,
	};
};
