export enum MTMessageStatus {
	SUCCESS = 1,
	EMPTY = 0,
	INVALID_IMEI = -1,
	UNKNOWN_IMEI = -2,
	PAYLOAD_SIZE_MAX = -3,
	PAYLOAD_EXPECTED = -4,
	MT_MESSAGE_QUEUE_FULL = -5,
	MT_RESOURCES_UNAVAILABLE = -6,
	VIOLATION_OF_PROTOCOL = -7,
	RING_ALERTS_DISABLED = -8,
	IMEI_NOT_ATTACHED = -9,
}

export type MTMessageStatusKeys = keyof typeof MTMessageStatus;

export type MTMessageStatusDefinitions = {
	[key in MTMessageStatusKeys]: string;
};

export const mtMessageStatusDefinitions: MTMessageStatusDefinitions = {
	SUCCESS: 'Successful, Order Of Message In The MT Message Queue', // NOTE: Could Be Value 1 to 50
	EMPTY: 'Successful, No Payload In Message',
	INVALID_IMEI: 'Invalid IMEI - Too Few Characters, Non-Numeric Characters',
	UNKNOWN_IMEI: 'Unknown IMEI - Not Provisioned On The GSS',
	PAYLOAD_SIZE_MAX: 'Payload Size Exceeded Maximum Allowed',
	PAYLOAD_EXPECTED: 'Payload Expected, But None Received',
	MT_MESSAGE_QUEUE_FULL: 'MT Message Queue Full (Max Of 50)',
	MT_RESOURCES_UNAVAILABLE: 'MT Resources Unavailable',
	VIOLATION_OF_PROTOCOL: 'Violation Of MT DirectIP Protocol',
	RING_ALERTS_DISABLED: 'Ring Alerts To The Given IMEI Are Disabled',
	IMEI_NOT_ATTACHED:
		'The Given IMEI Is Not Attached (Not Set To Receive Ring Alerts)',
};

export const getMTMessageStatusDefinition = (
	sessionStatus: MTMessageStatusKeys
): string => {
	return mtMessageStatusDefinitions[sessionStatus];
};

export const getMTMessageStatusByValue = (
	value: number
): MTMessageStatus | undefined => {
	for (const [_key, enumValue] of Object.entries(MTMessageStatus)) {
		if (Number(enumValue) === value) {
			return enumValue as MTMessageStatus;
		}
	}
	return undefined;
};
