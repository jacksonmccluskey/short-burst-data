export type IsIridiumOutMessageProcessed = 0 | 1 | 2; // NOTE: 0 = UNPROCESSED; 1 = SUCCESS; 2 = FAIL

export interface IIridiumOutMessageRequest {
	IridiumOutId: number;
	Message: string; // NOTE: base64
	Header: string; // NOTE: base64
	Payload: string; // NOTE: base64
	IsProcessed: IsIridiumOutMessageProcessed;
	ProcessNote?: string | null;
}
