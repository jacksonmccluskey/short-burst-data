import { IEI } from '../fields/information-element-identifier.field';
import { IMessageTracker } from './message-tracker.helper';

export type MessageType = 'MO' | 'MT' | 'MC'; // NOTE: MO = Mobile Originated; MT = Mobile Terminated; MC = Mobile Confirmation; ME = Mobile Error (Not Used)

export const determineMessageType = ({
	informationElementID,
	messageTracker,
}: {
	informationElementID: IEI;
	messageTracker: IMessageTracker;
}) => {
	const verifyConsistentMessageType = (messageType: MessageType) => {
		if (
			messageTracker.messageType !== undefined &&
			messageTracker.messageType !== messageType
		) {
			throw new Error(
				`Conflicting Message Types Within Single Buffer Stream: Expected: ${messageTracker.messageType}; Actual: ${messageType}`
			);
		}
	};

	switch (informationElementID) {
		case IEI.MO_HEADER:
		case IEI.MO_PAYLOAD:
		case IEI.MO_LOCATION_INFORMATION: {
			verifyConsistentMessageType('MO');
			messageTracker.messageType = 'MO';
			break;
		}
		case IEI.MT_HEADER:
		case IEI.MT_PAYLOAD: {
			verifyConsistentMessageType('MT');
			messageTracker.messageType = 'MT';
			break;
		}
		case IEI.MT_CONFIRMATION_MESSAGE: {
			verifyConsistentMessageType('MC');
			messageTracker.messageType = 'MC';
			break;
		}
		default: {
			throw new Error(`Invalid IEI: ${informationElementID}`);
		}
	}
};
