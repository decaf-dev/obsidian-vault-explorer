import Logger from "js-logger";
import { requestUrl } from "obsidian";
import { readDeviceId } from "./device-id-utils";
import { writable } from "svelte/store";

export const LICENSE_KEY_LENGTH = 8;

const LOCAL_STORAGE_LICENSE_KEY = "vault-explorer-license-key";

const LOCAL_STORAGE_DEVICE_REGISTERED = "vault-explorer-device-registration";

export default class License {
	private isDeviceRegistered: boolean;
	private licenseKey: string;
	private responseMessage: string;
	private isDeviceRegisteredStore = writable<boolean>();

	private static instance: License;

	constructor() {
		const storedDeviceRegistered = this.getStoredDeviceRegistered();
		this.isDeviceRegistered = storedDeviceRegistered;
		this.isDeviceRegisteredStore.set(storedDeviceRegistered);
		Logger.debug({ fileName: "license.ts", functionName: "constructor", message: "loaded stored device registration", }, storedDeviceRegistered);

		this.responseMessage = "";

		const storedKey = this.getStoredLicenseKey();
		this.licenseKey = storedKey;
		Logger.debug({ fileName: "license.ts", functionName: "constructor", message: "loaded stored license key" }, storedKey);
	}

	async registerDevice(licenseKey: string) {
		Logger.trace({ fileName: "license.ts", functionName: "registerDevice", message: "called" });

		const deviceId = readDeviceId();
		const result = await this.postRegisterDevice(licenseKey, deviceId);
		if (result) {
			this.updateDeviceRegistered(true);
			this.updateLicenseKey(licenseKey);
		}
		return result;
	}

	async unregisterDevice() {
		Logger.trace({ fileName: "license.ts", functionName: "unregisterDevice", message: "called" });

		const deviceId = readDeviceId();
		const result = await this.postUnregisterDevice(this.licenseKey, deviceId);
		if (result) {
			this.updateLicenseKey("");
			this.updateDeviceRegistered(false);
		}
		return result;
	}

	async verifyLicense() {
		Logger.trace({ fileName: "license.ts", functionName: "verifyLicense", message: "called" });

		if (this.licenseKey === "") {
			Logger.debug({ fileName: "license.ts", functionName: "verifyLicense", message: "no license key set. returning..." });
			return;
		} else if (this.licenseKey.length !== LICENSE_KEY_LENGTH) {
			Logger.debug({ fileName: "license.ts", functionName: "verifyLicense", message: "license key is not the correct length. returning..." });
			return;
		}

		const deviceId = readDeviceId();

		const result = await this.postVerifyDevice(this.licenseKey, deviceId);
		if (result) {
			this.updateDeviceRegistered(true);
		} else {
			this.updateDeviceRegistered(false);
		}
	}

	private async postVerifyDevice(licenseKey: string, deviceId: string) {
		Logger.trace({ fileName: "license.ts", functionName: "postVerifyDevice", message: "called" });
		try {
			const response = await requestUrl({
				url: "https://api.vaultexplorer.com/licenses/verify",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					licenseKey,
					deviceId,
				}),
			});
			const body = response.json;
			Logger.debug({ fileName: "license.ts", functionName: "postVerifyDevice", message: "response" }, body);
			return true;
		} catch (err: unknown) {
			const error = err as Error;
			Logger.error({ fileName: "license.ts", functionName: "postVerifyDevice", message: "error verifying device" }, error.message);

			if (error.message.contains("net::ERR_INTERNET_DISCONNECTED")) {
				const deviceRegistered = License.getInstance().getIsDeviceRegistered();
				Logger.debug({ fileName: "license.ts", functionName: "postVerifyDevice", message: "returning last deviceRegistered state", }, deviceRegistered);
				return deviceRegistered;

			}
			return false;
		}
	};

	private async postRegisterDevice(licenseKey: string, deviceId: string) {
		Logger.trace({ fileName: "license.ts", functionName: "postRegisterDevice", message: "called" });
		try {
			const response = await requestUrl({
				url: "https://api.vaultexplorer.com/licenses/register",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					licenseKey,
					deviceId,
				})
			});
			const body = response.json;
			Logger.debug({ fileName: "license.ts", functionName: "postRegisterDevice", message: "response" }, body);
			this.responseMessage = "Device successfully registered."
			return true;

		} catch (err: unknown) {
			const error = err as Error;
			let message = "";
			if (error.message.contains("net::ERR_INTERNET_DISCONNECTED")) {
				message = "Internet is disconnected. Please try again"
			} else if (error.message.contains("429")) {
				message = "Too many requests. Try again later"
			} else if (error.message.contains("404")) {
				message = "Invalid license key"
			} else if (error.message.contains("400")) {
				message = "Device already registered to this license"
			} else if (error.message.contains("402")) {
				message = "Maximum number of devices reached for this license key"
			} else if (error.message.contains("502")) {
				message = "Server is offline. Please try again later"
			} else {
				message = "Server error. Please open an issue on GitHub"
			}
			this.responseMessage = message;

			Logger.error({ fileName: "license.ts", functionName: "postRegisterDevice", message: "error registering device" }, error.message);
			return false;
		}
	}

	private async postUnregisterDevice(licenseKey: string, deviceId: string) {
		Logger.trace({ fileName: "license.ts", functionName: "postUnregisterDevice", message: "called" });
		try {
			const response = await requestUrl({
				url: "https://api.vaultexplorer.com/licenses/unregister",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					licenseKey,
					deviceId,
				})
			});
			const body = response.json;
			Logger.debug({ fileName: "license.ts", functionName: "postUnregisterDevice", message: "response" }, body);
			this.responseMessage = "";
			return true;

		} catch (err: unknown) {
			const error = err as Error;

			let message = "";
			if (error.message.contains("net::ERR_INTERNET_DISCONNECTED")) {
				message = "Internet is disconnected. Please try again"
			} else if (error.message.contains("429")) {
				message = "Too many requests. Try again later"
			} else if (error.message.contains("400")) {
				message = "Device is not connected to a license key";
			} else if (error.message.contains("502")) {
				message = "Server is offline. Please try again later"
			} else {
				message = "Server error. Please open an issue on GitHub"
			}
			this.responseMessage = message;


			Logger.error({ fileName: "license.ts", functionName: "postUnregisterDevice", message: "error unregistering device" }, error.message);
			return false;
		}
	}

	/**
	 * Sets the class licenseKey and updates local storage
	 * @param value - The license key
	 */
	private updateLicenseKey(value: string) {
		Logger.trace({ fileName: "license.ts", functionName: "updateLicenseKey", message: "called" });
		this.licenseKey = value;
		this.setStoredLicenseKey(value);
	}

	/**
	 * Sets the class registration flag and updates local storage
	 * @param value - The registration status of the device
	 */
	private updateDeviceRegistered(value: boolean) {
		Logger.trace({ fileName: "license.ts", functionName: "updateDeviceRegistered", message: "called" });
		this.isDeviceRegistered = value;
		this.isDeviceRegisteredStore.set(value);
		this.setStoredDeviceRegistered(value);
	}

	private setStoredLicenseKey(value: string) {
		Logger.trace({ fileName: "license.ts", functionName: "setStoredLicenseKey", message: "called" });
		localStorage.setItem(LOCAL_STORAGE_LICENSE_KEY, value);
	}

	private getStoredLicenseKey() {
		return localStorage.getItem(LOCAL_STORAGE_LICENSE_KEY) ?? ""
	}

	private getStoredDeviceRegistered() {
		const value = localStorage.getItem(LOCAL_STORAGE_DEVICE_REGISTERED);
		if (value) {
			return value === "true";
		}
		return false;
	}

	setStoredDeviceRegistered(value: boolean) {
		Logger.trace({ fileName: "license.ts", functionName: "setStoredDeviceRegistered", message: "called" });
		localStorage.setItem(LOCAL_STORAGE_DEVICE_REGISTERED, value.toString());
	}

	getIsDeviceRegistered() {
		return this.isDeviceRegistered;
	}

	getIsDeviceRegisteredStore() {
		return this.isDeviceRegisteredStore
	}


	getLicenseKey() {
		return this.licenseKey;
	}

	getResponseMessage() {
		return this.responseMessage;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new License();
		}
		return this.instance;
	}
}
