import { NumberOfBytes } from '../helpers/read-buffer.helper';

interface IPropertySizesInBytes {
	protocolRevisionNumber: NumberOfBytes;
	overallMessageLength: NumberOfBytes;
	informationElementID: NumberOfBytes;
	informationElementLength: NumberOfBytes;
	moMessage: {
		moHeader: {
			length: number;
			CDR: NumberOfBytes;
			IMEI: number;
			sessionStatus: NumberOfBytes;
			MOMSN: NumberOfBytes;
			MTMSN: NumberOfBytes;
			timeOfSession: NumberOfBytes;
		};
		moPayload: {};
		moLocation: {
			length: number;
			NSI: NumberOfBytes;
			latitudeDegrees: NumberOfBytes;
			latitudeThousandsOfAMinuteMS: NumberOfBytes;
			latitudeThousandsOfAMinuteLS: NumberOfBytes;
			longitudeDegrees: NumberOfBytes;
			longitudeThousandsOfAMinuteMS: NumberOfBytes;
			longitudeThousandsOfAMinuteLS: NumberOfBytes;
			cepRadius: NumberOfBytes;
		};
	};
	mtMessage: {
		mtHeader: {
			length: number;
			uniqueClientMessageID: NumberOfBytes;
			IMEI: number;
			dispositionFlag: NumberOfBytes;
		};
		mtPayload: {};
	};
	mtConfirmationMessage: {
		uniqueClientMessageID: number;
		IMEI: number;
		autoIDReference: NumberOfBytes;
		mtMessageStatus: NumberOfBytes;
	};
}

export const propertySizesInBytes: IPropertySizesInBytes = {
	protocolRevisionNumber: 1, // SIZE: 1 Byte [char]
	overallMessageLength: 2, // SIZE: 2 Byte [unsigned short]
	informationElementID: 1, // SIZE: 1 Byte [char]
	informationElementLength: 2, // SIZE: 2 Byte [unsigned short]
	moMessage: {
		moHeader: {
			length: 28,
			CDR: 4, // SIZE: 4 Byte [unsigned integer]
			IMEI: 15, // SIZE: 15 Byte [char]
			sessionStatus: 1, // SIZE: 1 Byte [unsigned char]
			MOMSN: 2, // SIZE: 2 Byte [unsigned short]
			MTMSN: 2, // SIZE: 2 Byte [unsigned short]
			timeOfSession: 4, // SIZE: 4 Byte [unsigned integer]
		},
		moPayload: {}, // NOTE: This Is Variable Per Message
		moLocation: {
			length: 11,
			NSI: 1, // SIZE: 1 Byte [0,1,2,3 = Reserved Bits; 4,5 = Format Bits; 6 NSI = Bit; 7 = EWI Bit]
			latitudeDegrees: 1, // SIZE: 1 Byte
			latitudeThousandsOfAMinuteMS: 1, // SIZE: 1 Byte
			latitudeThousandsOfAMinuteLS: 1, // SIZE: 1 Byte
			longitudeDegrees: 1, // SIZE: 1 Byte
			longitudeThousandsOfAMinuteMS: 1, // SIZE: 1 Byte
			longitudeThousandsOfAMinuteLS: 1, // SIZE: 1 Byte
			cepRadius: 4, // SIZE: 4 Byte [unsigned integer]
		},
	},
	mtMessage: {
		mtHeader: {
			length: 21,
			uniqueClientMessageID: 4, // SIZE: 4 Byte [char]
			IMEI: 15, // SIZE: 15 Byte [char]
			dispositionFlag: 2, // SIZE: 2 Byte [unsigned short]
		},
		mtPayload: {}, // NOTE: This Is Variable Per Message
	},
	mtConfirmationMessage: {
		uniqueClientMessageID: 4,
		IMEI: 15,
		autoIDReference: 4,
		mtMessageStatus: 2,
	},
};
