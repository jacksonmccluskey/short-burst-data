import { IsIridiumOutMessageProcessed } from './iridium-out-message-request.type';

export type IridiumOutMessageProcessNote = 'SUCCESS' | 'FAIL';

export interface IUpdateIridiumMTMessagesRequest {
	iridiumOutId: number; // uniqueClientMessageID
	isProcessed: IsIridiumOutMessageProcessed;
	processNote: IridiumOutMessageProcessNote;
}
