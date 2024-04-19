import { IMessageTracker } from './message-tracker.helper';

export interface IResetMessageTrackerArgs {
	messageTracker: IMessageTracker;
}

export const resetMessageTracker = ({
	messageTracker,
}: IResetMessageTrackerArgs) => {
	console.log('Resetting Message Tracker To Default Values...');
	messageTracker.messageBytes = {
		currentNumberOfBytes: 0,
		expectedNumberOfBytes: 0,
	};
	messageTracker.messageType = undefined;
	messageTracker.parsedMOMessage = undefined;
	messageTracker.parsedMTMessage = undefined;
	messageTracker.parsedMTConfirmationMessage = undefined;
	console.log(JSON.stringify(messageTracker));
};
