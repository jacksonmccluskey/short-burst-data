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

export const getIEIDefinition = (iei: IEIKeys): string => {
	return ieiDefinitions[iei];
};
