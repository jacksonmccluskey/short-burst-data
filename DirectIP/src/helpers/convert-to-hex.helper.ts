export const convertToHexArray = (value: string | number) => {
	switch (typeof value) {
		case 'string': {
			return Buffer.from(value.split('').map((char) => char.charCodeAt(0))); // NOTE: This Will Be Implemented In An External Program
		}
		case 'number': {
			const buffer = Buffer.alloc(2);
			buffer.writeUInt16BE(value, 0); // NOTE: Only For 2 Byte Buffer
			return buffer;
		}
	}
};
