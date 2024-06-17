import Logger from "js-logger";
import { generateRandomDeviceId } from "./random";

const LOCAL_STORAGE_KEY = "vault-explorer-id";

/**
 * Loads the device id from local storage or creates a new one if it doesn't exist
 * @returns The device id
 */
export const loadDeviceId = (): void => {
	Logger.trace({ fileName: "license-utils.ts", functionName: "loadDeviceId", message: "called" });

	const deviceId = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (deviceId !== null) {
		Logger.trace({ fileName: "license-utils.ts", functionName: "loadDeviceId", message: "found device id" });
	} else {
		Logger.trace({ fileName: "license-utils.ts", functionName: "loadDeviceId", message: "creating device id" });
		const newDeviceId = generateRandomDeviceId();
		localStorage.setItem(LOCAL_STORAGE_KEY, newDeviceId);
	}
}

/**
 * Reads the device id from local storage
 * @returns The device id
 * @throws Error if loadDeviceId() has not been called
 */
export const readDeviceId = (): string => {
	Logger.trace({ fileName: "license-utils.ts", functionName: "readDeviceId", message: "called" });
	const deviceId = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (deviceId === null) {
		throw new Error("Device id not found. Please call loadDeviceId() first.");
	}
	return deviceId;
}
