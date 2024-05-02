import { actionSelection, logEvent } from '../helpers/log-event.helper';
import { IParsedMOMessage } from './parse-mo-buffer';

export interface IValidateParsedMOMessageArgs {
	parsedMOMessage?: IParsedMOMessage;
}

export const validateParsedMOMessage = async ({
	parsedMOMessage,
}: IValidateParsedMOMessageArgs) => {
	if (parsedMOMessage == undefined) {
		throw new Error('Message Failed To Parse');
	}

	if (parsedMOMessage.moHeader == undefined) {
		throw new Error(`Missing Header: ${JSON.stringify(parsedMOMessage)}`);
	}

	if (parsedMOMessage.moPayload == undefined) {
		await logEvent({
			message: `Missing MO Payload\n\n${JSON.stringify(parsedMOMessage)}`,
			event: 'WARN',
			action: actionSelection['MO'],
		});
	}
};
