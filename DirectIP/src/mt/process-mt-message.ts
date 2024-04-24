import { IEI } from '../fields/information-element-identifier.field';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { IMTHeader } from './parse-mt-header';
import { IMTPayload } from './parse-mt-payload';

export interface IParsedMTMessage {
	mtHeader?: IMTHeader;
	mtPayload?: IMTPayload;
}

export interface IProcessMTMessageArgs {
	buffer: Buffer;
	iei: IEI;
	messageTracker: IMessageTracker;
	informationElementLength: number;
}

export const processMTMessage = async ({
	buffer,
	iei,
	messageTracker,
	informationElementLength,
}: IProcessMTMessageArgs) => {
	console.log(`🚀 Processing MT Message... ${JSON.stringify(messageTracker)}`);

	// TODO: Iridium Gateway Simulation
};
