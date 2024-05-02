require('dotenv').config();

const winstonCloudWatch = require('winston-aws-cloudwatch');

import { IMessageTracker } from './message-tracker.helper';
import { resetMessageTracker } from './reset-message-tracker';
import { MessageType } from './message-type.helper';
import winston from 'winston';

const winstonMOLogger: winston.Logger = winston.createLogger({
	level: 'info',
	transports: [],
});

const winstonMTLogger: winston.Logger = winston.createLogger({
	level: 'info',
	transports: [],
});

const winstonMCLogger: winston.Logger = winston.createLogger({
	level: 'info',
	transports: [],
});

// TODO: Simplify All This Repetition

winstonMOLogger.add(
	new winstonCloudWatch({
		logGroupName: process.env.CLOUDWATCH_LOG_GROUP_NAME,
		logStreamName: process.env.CLOUDWATCH_LOG_STREAM_NAME_MO,
		awsConfig: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_KEY,
			region: process.env.AWS_REGION,
		},
	})
);

winstonMTLogger.add(
	new winstonCloudWatch({
		logGroupName: process.env.CLOUDWATCH_LOG_GROUP_NAME,
		logStreamName: process.env.CLOUDWATCH_LOG_STREAM_NAME_MT,
		awsConfig: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_KEY,
			region: process.env.AWS_REGION,
		},
	})
);

winstonMCLogger.add(
	new winstonCloudWatch({
		logGroupName: process.env.CLOUDWATCH_LOG_GROUP_NAME,
		logStreamName: process.env.CLOUDWATCH_LOG_STREAM_NAME_MC,
		awsConfig: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_KEY,
			region: process.env.AWS_REGION,
		},
	})
);

type Event = 'SUCCESS' | 'WARN' | 'ERROR' | 'TERMINATED';
type Action = 'CONSOLE' | 'WINSTON_MO' | 'WINSTON_MT' | 'WINSTON_MC' | 'EMAIL';

export const actionSelection: { [keys in MessageType]: Action } = {
	MO: 'WINSTON_MO',
	MT: 'WINSTON_MT',
	MC: 'WINSTON_MC',
};

const emojiSelection: { [keys in Event]: string } = {
	SUCCESS: '🟩',
	WARN: '🟨',
	ERROR: '🟥',
	TERMINATED: '💀',
};

interface IConsoleLogArgs {
	message: string;
	event: Event;
	messageTracker?: IMessageTracker;
	source?: string;
}

const consoleLog = async ({
	message,
	event,
	messageTracker,
}: IConsoleLogArgs) => {
	console.log(
		`${emojiSelection[event]} ${message}${
			messageTracker
				? '\n\nmessageTracker: ' + JSON.stringify(messageTracker)
				: ''
		}`
	);
};

const winstonMOLog = async ({
	message,
	event,
	messageTracker,
	source,
}: IConsoleLogArgs) => {
	winstonMOLogger.info(
		`${emojiSelection[event]} ${message}${
			messageTracker
				? '\n\nmessageTracker: ' + JSON.stringify(messageTracker)
				: ''
		}\n\n${source ? '\n\nSource: ' + source : ''}`
	);
};

const winstonMTLog = async ({
	message,
	event,
	messageTracker,
	source,
}: IConsoleLogArgs) => {
	winstonMTLogger.info(
		`${emojiSelection[event]} ${message}${
			messageTracker
				? '\n\nmessageTracker: ' + JSON.stringify(messageTracker)
				: ''
		}\n\n${source ? '\n\nSource: ' + source : ''}`
	);
};

const winstonMCLog = async ({
	message,
	event,
	messageTracker,
	source,
}: IConsoleLogArgs) => {
	winstonMCLogger.info(
		`${emojiSelection[event]} ${message}${
			messageTracker
				? '\n\nmessageTracker: ' + JSON.stringify(messageTracker)
				: ''
		}\n\n${source ? '\n\nSource: ' + source : ''}`
	);
};

const emailLog = async ({
	message,
	event,
	messageTracker,
}: IConsoleLogArgs) => {
	console.log(
		`${emojiSelection[event]} ${message}${
			messageTracker
				? '\n\nmessageTracker: ' + JSON.stringify(messageTracker)
				: ''
		}`
	); // TODO: Implement Email with AWS SES
};

export interface ILogEventArgs {
	message: string;
	event: Event;
	action: Action;
	messageTracker?: IMessageTracker;
	source?: string;
}

const logSelection: {
	[keys in Action]: (args: IConsoleLogArgs) => Promise<void>;
} = {
	CONSOLE: consoleLog,
	WINSTON_MO: winstonMOLog,
	WINSTON_MT: winstonMTLog,
	WINSTON_MC: winstonMCLog,
	EMAIL: emailLog,
};

export const logEvent = async ({
	message,
	event,
	action,
	messageTracker,
	source,
}: ILogEventArgs): Promise<void> => {
	await logSelection[action]({ message, event, messageTracker, source });

	if (messageTracker && event == 'TERMINATED') {
		resetMessageTracker({ messageTracker });
	}
};
