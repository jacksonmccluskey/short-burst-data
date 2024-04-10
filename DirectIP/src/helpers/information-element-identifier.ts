export enum IEI {
	MO_HEADER = 0x01,
	MO_PAYLOAD = 0x02,
	MO_LOCATION_INFORMATION = 0x03,
	MT_HEADER = 0x41,
	MT_PAYLOAD = 0x42,
	MT_CONFIRMATION_MESSAGE = 0x44,
}

export type IEIKeys = keyof typeof IEI;

export type IEIDefinitions = {
	[key in IEIKeys]: string;
};

export const ieiDefinitions: IEIDefinitions = {
	MO_HEADER: 'MO Header',
	MO_PAYLOAD: 'MO Payload',
	MO_LOCATION_INFORMATION: 'MO Location Information',
	MT_HEADER: 'MT Header',
	MT_PAYLOAD: 'MT Payload',
	MT_CONFIRMATION_MESSAGE: 'MT Confirmation Message',
};

export const getIEIDefinition = (iei: IEI): string | undefined => {
	switch (iei) {
		case IEI.MO_HEADER: {
			return ieiDefinitions.MO_HEADER;
		}
		case IEI.MO_PAYLOAD: {
			return ieiDefinitions.MO_PAYLOAD;
		}
		case IEI.MO_LOCATION_INFORMATION: {
			return ieiDefinitions.MO_LOCATION_INFORMATION;
		}
		case IEI.MT_HEADER: {
			return ieiDefinitions.MT_HEADER;
		}
		case IEI.MT_PAYLOAD: {
			return ieiDefinitions.MT_PAYLOAD;
		}
		case IEI.MT_CONFIRMATION_MESSAGE: {
			return ieiDefinitions.MT_CONFIRMATION_MESSAGE;
		}
		default:
			return undefined;
	}
};
