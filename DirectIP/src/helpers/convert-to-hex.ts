export const convertToHexArray = (value: string | number) => {
	switch (typeof value) {
		case 'string': {
			return Buffer.from(value.split('').map((char) => char.charCodeAt(0)));
		}
		case 'number': {
			return [0x01, 0x02, 0x03, 0x04]; // TODO: Write Complete Method number to Buffer
		}
	}
};
