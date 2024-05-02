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
	[key in MTMessageStatus]: string;
};

export const mtMessageStatusDefinitions: MTMessageStatusDefinitions = {
	[MTMessageStatus.SUCCESS]:
		'Successful, Order Of Message In The MT Message Queue', // NOTE: Could Be Value 1 to 50
	[MTMessageStatus.EMPTY]: 'Successful, No Payload In Message',
	[MTMessageStatus.INVALID_IMEI]:
		'Invalid IMEI - Too Few Characters, Non-Numeric Characters',
	[MTMessageStatus.UNKNOWN_IMEI]: 'Unknown IMEI - Not Provisioned On The GSS',
	[MTMessageStatus.PAYLOAD_SIZE_MAX]: 'Payload Size Exceeded Maximum Allowed',
	[MTMessageStatus.PAYLOAD_EXPECTED]: 'Payload Expected, But None Received',
	[MTMessageStatus.MT_MESSAGE_QUEUE_FULL]: 'MT Message Queue Full (Max Of 50)',
	[MTMessageStatus.MT_RESOURCES_UNAVAILABLE]: 'MT Resources Unavailable',
	[MTMessageStatus.VIOLATION_OF_PROTOCOL]: 'Violation Of MT DirectIP Protocol',
	[MTMessageStatus.RING_ALERTS_DISABLED]:
		'Ring Alerts To The Given IMEI Are Disabled',
	[MTMessageStatus.IMEI_NOT_ATTACHED]:
		'The Given IMEI Is Not Attached (Not Set To Receive Ring Alerts)',
};

export function getMTMessageStatusDefinition(
	mtMessageStatus?: MTMessageStatus
): string | undefined {
	if (mtMessageStatus == undefined) {
		return;
	}

	if ((mtMessageStatus as number) >= 1 && (mtMessageStatus as number) <= 50) {
		return mtMessageStatusDefinitions[MTMessageStatus.SUCCESS];
	}

	if ((mtMessageStatus as number) > 50) {
		return mtMessageStatusDefinitions[MTMessageStatus.MT_MESSAGE_QUEUE_FULL];
	}

	if ((mtMessageStatus as number) < -9) {
		return 'Invalid MT Message Status';
	}

	return mtMessageStatusDefinitions[mtMessageStatus];
}

export function getMTMessageStatusKey(statusCode: number): MTMessageStatusKeys {
	if (statusCode >= 1 && statusCode <= 50) {
		return 'SUCCESS';
	}

	if (statusCode > 50) {
		return 'MT_MESSAGE_QUEUE_FULL';
	}

	return (MTMessageStatus as { [key: number]: MTMessageStatusKeys })?.[
		statusCode
	];
}

export const getRandomMTMessageStatus = (): MTMessageStatus => {
	const enumValues = Object.values(MTMessageStatus) as MTMessageStatus[];
	const randomIndex = Math.floor(Math.random() * enumValues.length);
	return enumValues[randomIndex];
};
