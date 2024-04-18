import { IHandleParsedMessageMethodArgs } from '../methods/handle-parsed-message.method';
import { IParsedMTMessage } from './process-mt-message';

export const handleParsedMTMessage = async ({
	messageTracker,
}: IHandleParsedMessageMethodArgs) => {
	const { parsedMTMessage } = messageTracker;

	console.log(
		`Handling Parsed MT Message... ${JSON.stringify(parsedMTMessage)}`
	);
};
