import { propertySizesInBytes } from '../config/property-size.config';
import { IBufferTracker } from '../helpers/buffer-tracker.helper';
import { IMessageTracker } from '../helpers/message-tracker.helper';
import { readBufferAsNumber } from '../helpers/read-buffer.helper';

export interface IGetInformationArgs {
	buffer: Buffer;
	bufferTracker: IBufferTracker;
	messageTracker: IMessageTracker;
}

export interface IGetInformation {
	informationElementID: number;
	informationElementLength: number;
}

export const getInformation = ({
	buffer,
	bufferTracker,
	messageTracker,
}: IGetInformationArgs): IGetInformation => {
	const informationElementID = readBufferAsNumber({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.informationElementID,
	});

	const informationElementLength = readBufferAsNumber({
		buffer,
		bufferTracker,
		messageTracker,
		numberOfBytes: propertySizesInBytes.informationElementLength,
	});

	return { informationElementID, informationElementLength };
};
