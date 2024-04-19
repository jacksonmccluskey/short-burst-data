import { MessageType } from '../helpers/message-type.helper';
import { IEI } from '../helpers/information-element-identifier.helper';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { callParseMOBufferMethod } from '../mo/parse-mo-buffer';
import { processMTConfirmationMessage } from '../mt/process-mt-confirmation';
import { processMTMessage } from '../mt/process-mt-message';

export interface IHandleProcessBufferMethodArgs {}

export type HandleProcessBufferMethod = (
	args: IHandleProcessBufferMethodArgs
) => Promise<void>;

export const handleProcessBufferMethods: {
	[keys in MessageType]: HandleProcessBufferMethod;
} = {
	MO: callParseMOBufferMethod,
	MT: processMTMessage,
	MC: processMTConfirmationMessage,
};

export interface IProcessBufferArgs {
	buffer: Buffer;
	iei: number;
	messageTracker: IMessageTracker;
	informationElementLength: number;
}

export const processBuffer = async ({
	buffer,
	iei,
	messageTracker,
	informationElementLength,
}: IProcessBufferArgs) => {
	if (messageTracker.messageType) {
		if (buffer.length < informationElementLength) {
			throw new Error('Not Enough Buffer To Go Around');
		}

		await handleProcessBufferMethods[messageTracker.messageType]({
			buffer,
			iei,
			messageTracker,
			informationElementLength,
		});
	} else {
		throw new Error('No Message Type Defined');
	}
};
