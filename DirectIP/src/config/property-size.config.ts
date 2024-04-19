export const propertySizesInBytes = {
	protocolRevisionNumber: 1,
	overallMessageLength: 2,
	informationElementID: 1,
	informationElementLength: 2,
	moMessage: {
		moHeader: {
			length: 28,
		},
		moPayload: {}, // NOTE: This Is Variable Per Message
		moLocation: {
			length: 11,
		},
		// TODO: Add Remainder Properties
	},
	mtMessage: {},
	mtConfirmationMessage: {},
};
