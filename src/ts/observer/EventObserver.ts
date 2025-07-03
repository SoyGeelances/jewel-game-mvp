// EventObserver.ts
export class EventObserver {
	private static instance: EventObserver;
	public eventEmitter: Phaser.Events.EventEmitter;

	private constructor() {
			this.eventEmitter = new Phaser.Events.EventEmitter();
	}

	public static getInstance(): EventObserver {
			if (!EventObserver.instance) {
					EventObserver.instance = new EventObserver();
			}
			return EventObserver.instance;
	}

	public on(event: string, callback: (a: any) => void, context?: any) {
			this.eventEmitter.on(event, callback, context);
	}

	public emit(event: string, ...args: any[]) {
			this.eventEmitter.emit(event, ...args);
	}
}
