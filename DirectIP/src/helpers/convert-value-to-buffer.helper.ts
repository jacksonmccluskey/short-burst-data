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
}

export const convertNumberToBuffer = ({
	value,
	bufferSize,
}: IConvertNumberToBufferArgs) => {
	const buffer = Buffer.alloc(bufferSize);

	switch (bufferSize) {
		case 1: {
			buffer.writeUInt8(value, 0);
			break;
		}
		case 2: {
			buffer.writeUInt16BE(value, 0);
			break;
		}
		case 4: {
			buffer.writeUInt32BE(value, 0);
			break;
		}
	}

	return buffer;
};
