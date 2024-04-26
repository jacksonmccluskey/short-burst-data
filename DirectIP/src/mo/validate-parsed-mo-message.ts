import { IParsedMOMessage } from './parse-mo-buffer';

export interface IValidateParsedMOMessageArgs {
	parsedMOMessage?: IParsedMOMessage;
}

export const validateParsedMOMessage = ({
	parsedMOMessage,
}: IValidateParsedMOMessageArgs) => {
	if (parsedMOMessage == undefined) {
		throw new Error('🟥 Message Failed To Parse');
	}

	if (parsedMOMessage.moHeader == undefined) {
		throw new Error(`🟥 Missing Header: ${JSON.stringify(parsedMOMessage)}`);
	}

	if (parsedMOMessage.moPayload == undefined) {
		console.log(`🟥 Missing Payload: ${JSON.stringify(parsedMOMessage)}`); // TODO: Send Payload As NULL
	}
};
