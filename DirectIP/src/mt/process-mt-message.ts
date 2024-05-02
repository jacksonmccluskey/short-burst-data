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
	messageTracker,
}: IProcessMTMessageArgs) => {
	console.log(
		`🚀 Processing MT Message...\n\n${JSON.stringify(messageTracker)}`
	);

	// NOTE: Iridium Gateway Simulation
};
