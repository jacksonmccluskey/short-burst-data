import { IParsedMOMessage } from '../mo/parse-mo-buffer';
import { IParsedMTConfirmationMessage } from '../mc/process-mt-confirmation';
import { IParsedMTMessage } from '../mt/process-mt-message';
import { MessageType } from './message-type.helper';

export interface IMessageBytes {
	expectedNumberOfBytes: number;
	currentNumberOfBytes: number;
}

export interface IMessageTracker {
	messageType?: MessageType;
	parsedMOMessage?: IParsedMOMessage;
	parsedMTMessage?: IParsedMTMessage;
	parsedMTConfirmationMessage?: IParsedMTConfirmationMessage;
	messageBytes: IMessageBytes;
}
