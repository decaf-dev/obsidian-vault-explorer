import { PluginEvent, EventCallback } from "./types";

export default class EventManager {
	private static instance: EventManager;
	private eventListeners: Record<PluginEvent, EventCallback[]>;

	private constructor() {
		this.eventListeners = {} as Record<PluginEvent, EventCallback[]>;
	}

	// Ensures only one instance is created
	public static getInstance(): EventManager {
		if (!EventManager.instance) {
			EventManager.instance = new EventManager();
		}
		return EventManager.instance;
	}

	// Method to add an event listener
	public on(eventName: PluginEvent, callback: EventCallback): void {
		if (!this.eventListeners[eventName]) {
			this.eventListeners[eventName] = [];
		}
		this.eventListeners[eventName].push(callback);
	}

	// Method to remove an event listener
	public off(
		eventName: PluginEvent,
		callbackToRemove: EventCallback
	): void {
		if (!this.eventListeners[eventName]) {
			return;
		}
		this.eventListeners[eventName] = this.eventListeners[eventName].filter(
			(callback) => callback !== callbackToRemove
		);
	}

	// Method to trigger all callbacks associated with an event
	public emit(eventName: PluginEvent, ...data: unknown[]): void {
		//console.log("[EventManager] emiting event:", eventName);
		if (!this.eventListeners[eventName]) {
			return;
		}
		this.eventListeners[eventName].forEach((callback) => {
			callback(...data);
		});
	}
}
