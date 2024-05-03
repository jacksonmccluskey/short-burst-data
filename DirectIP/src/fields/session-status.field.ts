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
	[key in SessionStatus]: string;
};

export const sessionStatusDefinitions: SessionStatusDefinitions = {
	[SessionStatus.COMPLETE]: 'The SBD Session Completed Successfully',
	[SessionStatus.MO_SUCCESS_MT_TOO_LARGE]:
		'The MO Message Transfer, If Any, Was Successful. The MT Message Queued At The GSS Is Too Large To Be Transferred Within A Single SBD Session.',
	[SessionStatus.MO_SUCCESS_LOCATION_UNACCEPTABLE]:
		'The MO Message Transfer, If Any, Was Successful. The Reported Location Was Determined To Be Of Unacceptable Quality. This Value Is Only Applicable To IMEIs Using SBD Protocol Revision 1',
	[SessionStatus.TIMEOUT]:
		'The SBD Session Timed Out Before Session Completion',
	[SessionStatus.MO_TOO_LARGE]:
		'The MO Message Being Transferred By The IMEI Is Too Large To Be Transferred Within A Single SBD Session',
	[SessionStatus.RF_LINK_LOSS]:
		'An RF Link Loss Occurred During The SBD Session',
	[SessionStatus.IMEI_PROTOCOL_ANOMALY]:
		'An IMEI Protocol Anomaly Occurred During SBD Session',
	[SessionStatus.IMEI_PROHIBITED_ACCESS]:
		'The IMEI Is Prohibited From Accessing The GSS', // NOTE: GSS = Gateway SBD Subsystem
};

export function getSessionStatusDefinition(
	sessionStatus?: SessionStatus
): string {
	if (sessionStatus == undefined) {
		return 'Unknown Session Status';
	}

	return sessionStatusDefinitions[sessionStatus];
}

export function getSessionStatusKey(
	statusCode?: number
): SessionStatusKeys | undefined {
	if (statusCode == undefined) {
		return undefined;
	}

	return (SessionStatus as { [key: number]: SessionStatusKeys })?.[statusCode];
}
