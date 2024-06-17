import Logger from "js-logger";
import { requestUrl } from "obsidian";
import { readDeviceId } from "./device-id-utils";

export const LICENSE_KEY_LENGTH = 8;

const LOCAL_STORAGE_LICENSE_KEY = "vault-explorer-license-key";

export default class License {
	private isRegistered: boolean;
	private licenseKey: string;
	private responseMessage: string;

	private static instance: License;

	constructor() {
		this.isRegistered = false;
		this.responseMessage = "";
		this.licenseKey = localStorage.getItem(LOCAL_STORAGE_LICENSE_KEY) ?? "";
	}

	async registerLicense(licenseKey: string) {
		Logger.trace({ fileName: "license.ts", functionName: "registerLicense", message: "called" });

		const deviceId = readDeviceId();
		const result = await this.postRegisterLicense(licenseKey, deviceId);
		if (result) {
			this.isRegistered = true;
			this.setLicenseKey(licenseKey);
		}
		return result;
	}

	async unregisterLicense() {
		Logger.trace({ fileName: "license.ts", functionName: "unregister", message: "called" });

		const deviceId = readDeviceId();
		const result = await this.postUnregisterLicense(this.licenseKey, deviceId);
		if (result) {
			this.isRegistered = false;
			this.setLicenseKey("");
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

		const result = await this.postVerifyLicense(this.licenseKey, deviceId);
		if (result) {
			this.isRegistered = true;
		}
	}

	private async postVerifyLicense(licenseKey: string, deviceId: string) {
		Logger.trace({ fileName: "license.ts", functionName: "postVerifyLicense", message: "called" });
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
			Logger.debug({ fileName: "license.ts", functionName: "postVerifyLicense", message: "response" }, body);
			return true;
		} catch (err: unknown) {
			const error = err as Error;
			Logger.error({ fileName: "license.ts", functionName: "postVerifyLicense", message: "error verifying license" }, error.message);
			return false;
		}
	};

	private async postRegisterLicense(licenseKey: string, deviceId: string) {
		Logger.trace({ fileName: "license.ts", functionName: "postRegisterLicense", message: "called" });
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
			Logger.debug({ fileName: "license.ts", functionName: "postRegisterLicense", message: "response" }, body);
			this.responseMessage = "License successfully registered."
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
				message = "License key already registered to this device"
			} else if (error.message.contains("402")) {
				message = "Maximum number of devices reached for this license key"
			} else if (error.message.contains("502")) {
				message = "Server is offline. Please try again later"
			} else {
				message = "Server error. Please open an issue on GitHub"
			}
			this.responseMessage = message;

			Logger.error({ fileName: "license.ts", functionName: "postRegisterLicense", message: "error registering license" }, error.message);
			return false;
		}
	}

	private async postUnregisterLicense(licenseKey: string, deviceId: string) {
		Logger.trace({ fileName: "license.ts", functionName: "postUnregisterLicense", message: "called" });
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
			Logger.debug({ fileName: "license.ts", functionName: "postUnregisterLicense", message: "response" }, body);
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
				message = "License key is not connected to device";
			} else if (error.message.contains("502")) {
				message = "Server is offline. Please try again later"
			} else {
				message = "Server error. Please open an issue on GitHub"
			}
			this.responseMessage = message;

			Logger.error({ fileName: "license.ts", functionName: "postUnregisterLicense", message: "error registering license" }, error.message);
			return false;
		}
	}

	private setLicenseKey(value: string) {
		localStorage.setItem(LOCAL_STORAGE_LICENSE_KEY, value);
		this.licenseKey = value;
	}

	getIsRegistered() {
		return this.isRegistered;
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
