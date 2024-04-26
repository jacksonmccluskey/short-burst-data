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
	SUCCESS: '',
	EMPTY: '',
	INVALID_IMEI: '',
	UNKNOWN_IMEI: '',
	PAYLOAD_SIZE_MAX: '',
	PAYLOAD_EXPECTED: '',
	MT_MESSAGE_QUEUE_FULL: '',
	MT_RESOURCES_UNAVAILABLE: '',
	VIOLATION_OF_PROTOCOL: '',
	RING_ALERTS_DISABLED: '',
	IMEI_NOT_ATTACHED: '',
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
