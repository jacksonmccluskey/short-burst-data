import { IMessageTracker } from './message-tracker.helper';

export interface IResetMessageTrackerArgs {
	messageTracker: IMessageTracker;
}

export const resetMessageTracker = ({
	messageTracker,
}: IResetMessageTrackerArgs) => {
	messageTracker.messageBytes = {
		currentNumberOfBytes: 0,
		expectedNumberOfBytes: 0,
	};
	messageTracker.messageType = undefined;
	messageTracker.parsedMOMessage = undefined;
	messageTracker.parsedMTMessage = undefined;
	messageTracker.parsedMTConfirmationMessage = undefined;
};
