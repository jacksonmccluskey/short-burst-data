export enum SessionStatus {
	COMPLETE = 0,
	MO_SUCCESS_MT_TOO_LARGE = 1,
	MO_SUCCESS_LOCATION_UNACCEPTABLE = 2,
	TIMEOUT = 10,
	MO_TOO_LARGE = 12,
	RF_LINK_LOSS = 13,
	IMEI_PROTOCOL_ANOMALY = 14,
	IMEI_PROHIBITED_ACCESS = 15,
}

export type SessionStatusKeys = keyof typeof SessionStatus;

export type SessionStatusDefinitions = {
	[key in SessionStatusKeys]: string;
};

export const sessionStatusDefinitions: SessionStatusDefinitions = {
	COMPLETE: 'The SBD Session Completed Successfully',
	MO_SUCCESS_MT_TOO_LARGE:
		'The MO Message Transfer, If Any, Was Successful. The MT Message Queued At The GSS Is Too Large To Be Transferred Within A Single SBD Session.',
	MO_SUCCESS_LOCATION_UNACCEPTABLE:
		'The MO Message Transfer, If Any, Was Successful. The Reported Location Was Determined To Be Of Unacceptable Quality. This Value Is Only Applicable To IMEIs Using SBD Protocol Revision 1',
	TIMEOUT: 'The SBD Session Timed Out Before Session Completion',
	MO_TOO_LARGE:
		'The MO Message Being Transferred By The IMEI Is Too Large To Be Transferred Within A Single SBD Session',
	RF_LINK_LOSS: 'An RF Link Loss Occurred During The SBD Session',
	IMEI_PROTOCOL_ANOMALY: 'An IMEI Protocol Anomaly Occurred During SBD Session',
	IMEI_PROHIBITED_ACCESS: 'The IMEI Is Prohibited From Accessing The GSS', // NOTE: GSS = Gateway SBD Subsystem
};

export const getSessionStatusDefinition = (
	sessionStatus: SessionStatusKeys
): string => {
	return sessionStatusDefinitions[sessionStatus];
};

export const getSessionStatusByValue = (
	value: number
): SessionStatus | undefined => {
	for (const [_key, enumValue] of Object.entries(SessionStatus)) {
		if (Number(enumValue) === value) {
			return enumValue as SessionStatus;
		}
	}
	return undefined;
};
