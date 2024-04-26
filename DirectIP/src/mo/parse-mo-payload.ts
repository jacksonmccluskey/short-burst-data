import { increaseBufferOffset } from '../helpers/buffer-tracker.helper';
import {
	IParseMOBufferMethodArgs,
	ParseMOBufferMethod,
} from './parse-mo-buffer';

export interface IMOPayload {
	payloadLength: number;
	payload: string;
}

export const parseMOPayload: ParseMOBufferMethod = async ({
	buffer,
	bufferTracker,
	messageTracker,
	informationElementLength,
}: IParseMOBufferMethodArgs): Promise<void> => {
	if (messageTracker.parsedMOMessage?.moPayload !== undefined) {
		throw new Error('MO Payload Already Defined. Potential Double Message.');
	}

	if (buffer.length < informationElementLength) {
		throw new Error('Not Enough Buffer To Parse MO Payload');
	}

	// This Is The Actual MO Payload From The IMEI Currently At The Gateway. The Accompanying Payload Is A Result Of The Successful SBD Session Identified In The Header. In An MO Message Delivery Related To An Empty Mailbox Check (EMBC) Session Or A Failed Session, No Payload Will Be Included.
	const payloadString = buffer.toString('utf-8');

	// The MO Payload Field Is The Data Of The MO Payload. The Size Of The MO Payload Is Restricted To 340 Bytes For The 9601 Series And 1960 Bytes For The A3LA Series
	const payload = `0x${payloadString}`;

	const payloadLength = informationElementLength;

	increaseBufferOffset({
		bufferTracker,
		messageTracker,
		numberOfBytes: payloadLength,
	});

	const moPayload: IMOPayload = {
		payload,
		payloadLength,
	};

	if (messageTracker.parsedMOMessage == undefined) {
		messageTracker.parsedMOMessage = { moPayload };
	} else if (messageTracker.parsedMOMessage.moPayload == undefined) {
		messageTracker.parsedMOMessage.moPayload = moPayload;
	} else {
		throw new Error('MO Payload Already Defined'); // NOTE: Duplicate Error Checking
	}
};

/*

*/
