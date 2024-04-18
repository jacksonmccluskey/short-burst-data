import { convertDateToYYYYMMDDHHMMSS } from '../helpers/convert-unix-to-s-time.helper';
import { IParsedMOMessage } from '../mo/parse-mo-buffer';
import { queryDB } from './query.db';

export const insertDataIntoDB = async (parsedMOMessage: IParsedMOMessage) => {
	const iridiumIMEI = parsedMOMessage.moHeader?.IMEI;
	const messageID = parsedMOMessage.moHeader?.CDR.toString(16);
	const sTime = convertDateToYYYYMMDDHHMMSS(
		parsedMOMessage.moHeader?.timeOfSession ?? new Date()
	);
	const dataLength = parsedMOMessage.moPayload?.payloadLength;
	const data = parsedMOMessage.moPayload?.payload;
	const satelliteLatitude = parsedMOMessage.moLocationInformation?.latitude;
	const satelliteLongitude = parsedMOMessage.moLocationInformation?.longitude;
	const satelliteRadiusKm = parsedMOMessage.moLocationInformation?.cepRadius;

	const query = `INSERT INTO tblRawIridiumData (dateEntered, iridiumIMEI, messageID, sTime, dataLength, data, isProcessed, processNote, dataIn, dataOut, satelliteLatitude, satelliteLongitude, satelliteRadiusKm) VALUES ('${
		new Date().toISOString().slice(0, 19).replace('T', ' ') ?? 'NULL'
	}', '${iridiumIMEI}', '0x${messageID}', '${sTime}', ${dataLength}, '${data}', 0, 'JACKSON', 1, 0, ${satelliteLatitude}, ${satelliteLongitude}, ${satelliteRadiusKm})`; //TODO: Delete JACKSON isProcessed Rows

	await queryDB(query);
};

// NOTE: mssql Implementation For Database Query Will Be Replaced With My Company API For Security
