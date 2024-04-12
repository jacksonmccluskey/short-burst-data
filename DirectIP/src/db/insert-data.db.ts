import { convertDateToYYYYMMDDHHMMSS } from '../helpers/convert-unix-to-s-time';
import { IParsedBuffer } from '../mo/parse-mo-message';
import { queryDB } from './query.db';

export const insertDataIntoDB = async (parsedBuffer: IParsedBuffer) => {
	const iridiumIMEI = parsedBuffer.moHeader?.IMEI;
	const messageID = parsedBuffer.moHeader?.CDR.toString(16);
	const sTime = convertDateToYYYYMMDDHHMMSS(
		parsedBuffer.moHeader?.timeOfSession ?? new Date()
	);
	const dataLength = parsedBuffer.moPayload?.payloadLength;
	const data = parsedBuffer.moPayload?.payload;
	const satelliteLatitude = parsedBuffer.moLocationInformation?.latitude;
	const satelliteLongitude = parsedBuffer.moLocationInformation?.longitude;
	const satelliteRadiusKm = parsedBuffer.moLocationInformation?.cepRadius;

	const query = `INSERT INTO tblRawIridiumData (dateEntered, iridiumIMEI, messageID, sTime, dataLength, data, isProcessed, processNote, dataIn, dataOut, satelliteLatitude, satelliteLongitude, satelliteRadiusKm) VALUES ('${
		new Date().toISOString().slice(0, 19).replace('T', ' ') ?? 'NULL'
	}', '${iridiumIMEI}', '0x${messageID}', '${sTime}', ${dataLength}, '${data}', 0, 'JACKSON', 1, 0, ${satelliteLatitude}, ${satelliteLongitude}, ${satelliteRadiusKm})`; //TODO: Delete JACKSON isProcessed Rows

	await queryDB(query);
};
