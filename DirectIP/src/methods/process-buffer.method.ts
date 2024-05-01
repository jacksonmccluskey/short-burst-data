import { MessageType } from '../helpers/message-type.helper';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { callParseMOBufferMethod } from '../mo/parse-mo-buffer';
import { processMTConfirmationMessage } from '../mt-confirmation/process-mt-confirmation';
import { callParseMTBufferMethod } from '../mt/parse-mt-buffer';
import { IEI } from '../fields/information-element-identifier.field';
import { IBufferTracker } from '../helpers/buffer-tracker.helper';

export interface IHandleProcessBufferMethodArgs {
	buffer: Buffer;
	bufferTracker: IBufferTracker;
	informationElementID: IEI;
	messageTracker: IMessageTracker;
	informationElementLength: number;
}

export type HandleProcessBufferMethod = (
	args: IHandleProcessBufferMethodArgs
) => Promise<void>;

export const handleProcessBufferMethods: {
	[keys in MessageType]: HandleProcessBufferMethod;
} = {
	MO: callParseMOBufferMethod,
	MT: callParseMTBufferMethod,
	MC: processMTConfirmationMessage,
};

export interface IProcessBufferArgs {
	buffer: Buffer;
	bufferTracker: IBufferTracker;
	informationElementID: number;
	messageTracker: IMessageTracker;
	informationElementLength: number;
}

export const processBuffer = async ({
	buffer,
	bufferTracker,
	informationElementID,
	messageTracker,
	informationElementLength,
}: IProcessBufferArgs) => {
	if (messageTracker.messageType) {
		if (buffer.length < informationElementLength) {
			throw new Error('Not Enough Buffer To Go Around');
		}

		await handleProcessBufferMethods[messageTracker.messageType]({
			buffer,
			bufferTracker,
			informationElementID,
			messageTracker,
			informationElementLength,
		});
	} else {
		throw new Error('No Message Type Defined');
	}
};
