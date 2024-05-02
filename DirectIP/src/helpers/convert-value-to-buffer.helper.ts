export interface IConvertStringToBufferArgs {
	value: string;
}

export const convertStringToBuffer = ({
	value,
}: IConvertStringToBufferArgs) => {
	return Buffer.from(value.split('').map((char) => char.charCodeAt(0)));
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
