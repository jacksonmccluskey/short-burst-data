import { propertySizesInBytes } from '../config/property-size.config';
import { actionSelection, logEvent } from '../helpers/log-event.helper';
import { IMTHeader } from './parse-mt-header';
import { IMTPayload } from './parse-mt-payload';

type MTPropertyName = 'mtHeader' | 'mtPayload';

interface IValidateMTPropertyArgs {
	mtProperty?: any;
	mtPropertyName?: MTPropertyName;
	requestedMessage?: any;
}

const validateMTProperty = ({
	mtProperty,
	mtPropertyName,
	requestedMessage,
}: IValidateMTPropertyArgs) => {
	if (!mtProperty) {
		const missingExpectedPropertiesMessage = `${mtPropertyName} Missing From Request: ${JSON.stringify(
			requestedMessage
		)}`;

		throw new Error(missingExpectedPropertiesMessage);
	}
};

export interface IIsValidMTMessageArgs {
	requestedMessage: any;
}

export const isValidMTMessage = async ({
	requestedMessage,
}: IIsValidMTMessageArgs) => {
	const { mtHeader, mtPayload } = requestedMessage;

	validateMTProperty({
		mtProperty: mtHeader,
		mtPropertyName: 'mtHeader',
		requestedMessage,
	});

	if (
		(mtHeader as IMTHeader).uniqueClientMessageID?.length !==
		propertySizesInBytes.mtMessage.mtHeader.uniqueClientMessageID
	) {
		throw new Error(
			`Invalid MT Header Unique Client Message ID: ${
				(mtHeader as IMTHeader).uniqueClientMessageID
			}`
		);
	}

	if (
		(mtHeader as IMTHeader).IMEI?.length !==
		propertySizesInBytes.mtMessage.mtHeader.IMEI
	) {
		throw new Error(`Invalid MT Header IMEI: ${(mtHeader as IMTHeader).IMEI}`);
	}

	validateMTProperty({
		mtProperty: mtPayload,
		mtPropertyName: 'mtPayload',
		requestedMessage,
	});

	if (!((mtPayload as IMTPayload)?.payload.length > 1)) {
		throw new Error(
			`Invalid MT Payload: ${(mtPayload as IMTPayload)?.payload}`
		);
	}
};
