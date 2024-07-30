import Logger from "js-logger";
import { writable } from "svelte/store";
import crypto from "crypto";

const LOCAL_STORAGE_LICENSE_KEY = "vault-explorer-license";

const PUBLIC_KEY_PEM = `
-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAO539qAsgBzbukUNDuOtPZKXNj8MSXvt3zS1ci4plDBA=
-----END PUBLIC KEY-----
`;

export default class License {
	private licenseKey: string;
	private hasValidKey: boolean;
	private hasValidKeyStore = writable<boolean>();

	private static instance: License;

	constructor() {
		this.licenseKey = "";
		this.hasValidKey = false;
		this.hasValidKeyStore.set(false);
	}

	async loadStoredKey() {
		const storedKey = this.getStoredLicenseKey();
		if (storedKey) {
			const isValid = await this.validateKey(storedKey);

			this.licenseKey = storedKey;
			this.hasValidKey = isValid;
			this.hasValidKeyStore.set(isValid);
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

	/**
	 * Verify the licenseKey using the public key.
	 * @param signature- The licenseKey to verify. This is created by signing a file with the private key.
	 */
	async validateKey(licenseKey: string) {
		Logger.trace({
			fileName: "license.ts",
			functionName: "validateKey",
			message: "called",
		});

		try {
			// Decode Base64 to buffer
			const decodedBuffer = Buffer.from(licenseKey, "base64");
			const decodedString = decodedBuffer.toString("utf-8");
			const split = decodedString.split("|");

			const data = split[0];
			const signatureBase64 = split[1];

			const dataBuffer = Buffer.from(data);
			const signatureBuffer = Buffer.from(signatureBase64, "base64");

			const verify = crypto.createVerify("SHA256");
			verify.update(data);
			verify.end();

			return crypto.verify(
				null,
				dataBuffer,
				{
					key: PUBLIC_KEY_PEM,
					format: "pem",
					type: "spki",
				},
				signatureBuffer
			);
		} catch (err) {
			return false;
		}
	}

	removeKey() {
		Logger.trace({
			fileName: "license.ts",
			functionName: "removeKey",
			message: "called",
		});

		this.setStoredKey(null);
		this.hasValidKeyStore.set(false);
		this.hasValidKey = false;
	}

	private setStoredKey(value: string | null) {
		Logger.trace({
			fileName: "license.ts",
			functionName: "setStoredKey",
			message: "called",
		});
		if (value !== null) {
			localStorage.setItem(LOCAL_STORAGE_LICENSE_KEY, value);
		} else {
			localStorage.removeItem(LOCAL_STORAGE_LICENSE_KEY);
		}
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
