import { IMessageTracker } from './message-tracker.helper';

type Event = 'SUCCESS' | 'WARN' | 'ERROR' | 'TERMINATED';
type Action = 'CONSOLE' | 'WINSTON' | 'EMAIL';

const emojiSelection: { [keys in Event]: string } = {
	SUCCESS: 'Green',
	WARN: 'Yellow',
	ERROR: 'Red',
	TERMINATED: 'Skull',
};

interface IConsoleLogArgs {
	message: string;
	event: Event;
}

const consoleLog = async ({ message, event }: IConsoleLogArgs) => {
	console.log(`${emojiSelection[event]} ${message}`);
};
export interface ILogEventArgs {
	message: string;
	event: Event;
	action: Action;
	messageTracker: IMessageTracker;
}

const logSelection: { [keys in Action]: (args: any) => Promise<void> } = {
	CONSOLE: consoleLog,
	WINSTON: async () => {}, // TODO: Implement winston CloudWatch Logs
	EMAIL: async () => {}, // TODO: Implement Email Notifications
};

export const logEvent = async ({
	message,
	event,
	action,
	messageTracker,
}: ILogEventArgs): Promise<void> => {
	logSelection[action]({ message, event });
};
