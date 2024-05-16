export interface IConvertStringToBufferArgs {
	value: string;
}

export const convertASCIIStringToBuffer = ({
	value,
}: IConvertStringToBufferArgs): Buffer => {
	return Buffer.from(value, 'ascii');
};

export const convertHexStringToBuffer = ({
	value,
}: IConvertStringToBufferArgs): Buffer => {
	const bufferElements: Buffer[] = [];

	for (let i = 0; i < value.length / 2; i += 2) {
		const currentByteString = value.substring(i, i + 2);

		const currentByte = parseInt(currentByteString, 16);

		const bufferElement = Buffer.from([currentByte]);

		bufferElements.push(bufferElement);
	}

	return Buffer.concat(bufferElements);
};

export interface IConvertNumberToBufferArgs {
	value: number;
	bufferSize: 1 | 2 | 4;
	isSigned?: boolean;
}

export const convertNumberToBuffer = ({
	value,
	bufferSize,
	isSigned,
}: IConvertNumberToBufferArgs) => {
	const buffer = Buffer.alloc(bufferSize);

	switch (bufferSize) {
		case 1: {
			if (isSigned) {
				buffer.writeInt8(value);
			} else {
				buffer.writeUInt8(value);
			}
			break;
		}
		case 2: {
			if (isSigned) {
				buffer.writeInt16BE(value);
			} else {
				buffer.writeUInt16BE(value);
			}
			break;
		}
		case 4: {
			if (isSigned) {
				buffer.writeInt32BE(value);
			} else {
				buffer.writeUInt32BE(value);
			}
			break;
		}
	}

	return buffer;
};
