import Logger from "js-logger";
import { writable } from "svelte/store";

const LOCAL_STORAGE_LICENSE_KEY = "vault-explorer-license-key";

export default class License {
	private licenseKey: string;
	private hasValidKey: boolean;
	private hasValidKeyStore = writable<boolean>();

	private static instance: License;

	constructor() {
		const storedKey = this.getStoredLicenseKey();
		const hasKey = storedKey !== null;

		this.licenseKey = storedKey ?? "";
		this.hasValidKey = hasKey;
		this.hasValidKeyStore.set(hasKey);

		if (storedKey) {
			Logger.debug(
				{
					fileName: "license.ts",
					functionName: "constructor",
					message: "loaded stored license key",
				},
				storedKey
			);
		}
	}

	async addKey(licenseKey: string) {
		Logger.trace({
			fileName: "license.ts",
			functionName: "addKey",
			message: "called",
		});

		const result = await this.validateKey(licenseKey);
		if (result) {
			this.setStoredKey(licenseKey);
			this.hasValidKeyStore.set(true);
			this.hasValidKey = true;
		}
		return result;
	}

	async validateKey(licenseKey: string) {
		return true;
	}

	removeKey() {
		Logger.trace({
			fileName: "license.ts",
			functionName: "removeKey",
			message: "called",
		});

		this.setStoredKey("");
		this.hasValidKeyStore.set(false);
		this.hasValidKey = false;
	}

	private setStoredKey(value: string) {
		Logger.trace({
			fileName: "license.ts",
			functionName: "setStoredKey",
			message: "called",
		});
		localStorage.setItem(LOCAL_STORAGE_LICENSE_KEY, value);
	}

	private getStoredLicenseKey() {
		return localStorage.getItem(LOCAL_STORAGE_LICENSE_KEY);
	}

	getHasValidKey() {
		return this.hasValidKey;
	}

	getHasValidKeyStore() {
		return this.hasValidKeyStore;
	}

	getLicenseKey() {
		return this.licenseKey;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new License();
		}
		return this.instance;
	}
}
