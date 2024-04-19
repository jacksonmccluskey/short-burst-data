import { IEI } from './information-element-identifier.helper';
import { IMessageTracker } from './message-tracker.helper';

export type MessageType = 'MO' | 'MT' | 'MC'; // NOTE: MO = Mobile Originated; MT = Mobile Terminated; MC = Mobile Confirmation; ME = Mobile Error (Not Used)

export const determineMessageType = ({
	informationElementID,
	messageTracker,
}: {
	informationElementID: IEI;
	messageTracker: IMessageTracker;
}) => {
	if (messageTracker.messageType == undefined) {
		switch (informationElementID) {
			case IEI.MO_HEADER:
			case IEI.MO_PAYLOAD:
			case IEI.MO_LOCATION_INFORMATION: {
				messageTracker.messageType = 'MO';
				break;
			}
			case IEI.MT_HEADER:
			case IEI.MT_PAYLOAD: {
				messageTracker.messageType = 'MT';
				break;
			}
			case IEI.MT_CONFIRMATION_MESSAGE: {
				messageTracker.messageType = 'MC';
				break;
			}
			default: {
				throw new Error(`Invalid IEI: ${informationElementID}`);
			}
		}
	}

	console.log(`messageType: ${messageTracker.messageType}`);
};
