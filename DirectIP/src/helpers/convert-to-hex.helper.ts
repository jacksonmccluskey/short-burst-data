export const convertToHexArray = (value: string | number) => {
	switch (typeof value) {
		case 'string': {
			return Buffer.from(value.split('').map((char) => char.charCodeAt(0))); // NOTE: This Will Be Implemented In An External Program
		}
		case 'number': {
			return Buffer.from([0x01, 0x02, 0x03, 0x04]); // TODO: Write Complete Method number to Buffer (This Will Be Implemented In An External Program)
		}
	}
};
