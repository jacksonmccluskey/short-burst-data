export enum DispositionFlag {
	FLUSH_MT_QUEUE = 1,
	SEND_RING_ALERT = 2,
	FORCE_RING_ALERT = 4,
	UPDATE_SSD_LOCATION = 8,
	HIGH_PRIORITY_MESSAGE = 16,
}

export type DispositionFlagKeys = keyof typeof DispositionFlag;

export type DispositionFlagDefinitions = {
	[key in DispositionFlagKeys]: string;
};

export const dispositionFlagDefinitions: DispositionFlagDefinitions = {
	FLUSH_MT_QUEUE: "Delete All MT Payloads In The IMEI's MT Queue",
	SEND_RING_ALERT:
		'Send Ring Alert With No Associated MT Payload (Normal Ring Alert Rules Apply)',
	FORCE_RING_ALERT:
		'Force Ring Alert With Or Without MT Payload (Override Ring Alert Rules)',
	UPDATE_SSD_LOCATION: 'Update IMEI Location With Given Lat/Lng Values',
	HIGH_PRIORITY_MESSAGE:
		'Place The Associated MT Payload In Front Of The Queue',
};

export const getDispositionFlagDefinition = (
	dispositionFlag: DispositionFlagKeys
): string => {
	return dispositionFlagDefinitions[dispositionFlag];
};

export const isDispositionFlag = (
	dispositionFlag?: number
): dispositionFlag is DispositionFlag => {
	return dispositionFlag
		? Object.values(DispositionFlag).includes(dispositionFlag)
		: false;
};

export function getDispositionFlagKey(
	dispositionFlag: number
): DispositionFlagKeys | undefined {
	return isDispositionFlag(dispositionFlag)
		? (DispositionFlag as { [key: number]: DispositionFlagKeys })?.[
				dispositionFlag
		  ]
		: undefined;
}
