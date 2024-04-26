import { MessageType } from '../helpers/message-type.helper';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { saveParsedMOMessage } from '../mo/save-parsed-mo-message';
import { acknowledgeParsedMTConfirmationMessage } from '../mt-confirmation/acknowledge-parsed-mt-confirmation-message';
import { handleParsedMTMessage } from '../mt/handle-parsed-mt-message';

export interface IHandleParsedMessageMethodArgs {
	messageTracker: IMessageTracker;
}

export type HandleParsedMessageMethod = (
	args: IHandleParsedMessageMethodArgs
) => Promise<void>;

export const handleParsedMessageMethods: {
	[keys in MessageType]: HandleParsedMessageMethod;
} = {
	MO: saveParsedMOMessage,
	MT: handleParsedMTMessage,
	MC: acknowledgeParsedMTConfirmationMessage,
};

export interface IHandleParsedMessageArgs {
	messageTracker: IMessageTracker;
}

export const handleParsedMessage = async ({
	messageTracker,
}: IHandleParsedMessageArgs) => {
	const { messageType } = messageTracker;

	if (messageType !== undefined) {
		await handleParsedMessageMethods[messageType]({ messageTracker });
	} else {
		throw new Error('Message Is Not Parsed');
	}
};
