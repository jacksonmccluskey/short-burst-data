import { propertySizesInBytes } from '../config/property-size.config';
import {
	NumberOfBytes,
	readBufferAsNumber,
} from '../helpers/read-buffer.helper';
import {
	IParseMOBufferMethodArgs,
	ParseMOBufferMethod,
} from './parse-mo-buffer';

export interface IMOLocationInformation {
	latitude: number;
	longitude: number;
	cepRadius: number;
}

interface IParseLocationIndicatorsArgs {
	indicatorByte: number;
}

interface IParseLocationIndicators {
	north?: number;
	east?: number;
}

const parseLocationIndicators = ({
	indicatorByte,
}: IParseLocationIndicatorsArgs): IParseLocationIndicators => {
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
	bufferTracker,
	messageTracker,
}: IParseMOBufferMethodArgs): Promise<void> => {
	if (messageTracker.parsedMOMessage?.moLocationInformation !== undefined) {
		throw new Error(
			'MO Location Information Already Defined. Potential Double Message.'
		);
	}

	const indicatorByte = readBufferAsNumber({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.moMessage.moLocation.NSI,
	});

	const { north, east } = parseLocationIndicators({ indicatorByte });

	if (north == undefined || east == undefined) {
		throw new Error('No Indicators (NSI or EWI) Were Found.');
	}

	const latitudeDegrees = readBufferAsNumber({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.moMessage.moLocation.latitudeDegrees,
	});

	const latitudeMinutes = readBufferAsNumber({
		buffer,
		bufferTracker,
		numberOfBytes: (propertySizesInBytes.moMessage.moLocation
			.latitudeThousandsOfAMinuteMS +
			propertySizesInBytes.moMessage.moLocation
				.latitudeThousandsOfAMinuteLS) as NumberOfBytes,
		messageTracker,
	});

	// TODO: Implement parsedLatitudeMinutes
	//const parsedLatitudeMinutes = latitudeMinutes / 60000; // / (60 * 1000) = Convert Minutes To Decimal
	const calculatedLatitudeDegrees = north * latitudeDegrees;
	const latitude = parseFloat(
		`${calculatedLatitudeDegrees}.${latitudeMinutes}`
	); // TODO: + parsedLatitudeMinutes; // Calculate Decimal

	const longitudeDegrees = readBufferAsNumber({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.moMessage.moLocation.longitudeDegrees,
	});

	const longitudeMinutes = readBufferAsNumber({
		buffer,
		bufferTracker,
		numberOfBytes: (propertySizesInBytes.moMessage.moLocation
			.longitudeThousandsOfAMinuteMS +
			propertySizesInBytes.moMessage.moLocation
				.longitudeThousandsOfAMinuteLS) as NumberOfBytes,
		messageTracker,
	});

	// TODO: Implement parsedLongitudeMinutes
	// const parsedLongitudeMinutes = longitudeMinutes / 60000; // / (60 * 1000) = Convert Minutes To Decimal
	const calculatedLongitudeDegrees = east * longitudeDegrees;
	const longitude = parseFloat(
		`${calculatedLongitudeDegrees}.${longitudeMinutes}`
	); // TODO: + parsedLongitudeMinutes; // Calculate Decimal

	const cepRadius = readBufferAsNumber({
		buffer,
		bufferTracker,
		numberOfBytes: propertySizesInBytes.moMessage.moLocation.cepRadius,
		messageTracker,
	});

	const moLocationInformation: IMOLocationInformation = {
		latitude,
		longitude,
		cepRadius,
	};

	if (messageTracker.parsedMOMessage == undefined) {
		messageTracker.parsedMOMessage = { moLocationInformation };
	} else if (
		messageTracker.parsedMOMessage.moLocationInformation == undefined
	) {
		messageTracker.parsedMOMessage.moLocationInformation =
			moLocationInformation;
	} else {
		throw new Error('MO Location Information Already Defined'); // NOTE: Duplicate Error Handling
	}
};
