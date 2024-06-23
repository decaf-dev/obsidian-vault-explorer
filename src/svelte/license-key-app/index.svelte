<script lang="ts">
	import { onMount } from "svelte";
	import License, { LICENSE_KEY_LENGTH } from "../shared/services/license";
	import EventManager from "src/event/event-manager";

	interface Message {
		type: "success" | "failure" | "info";
		text: string;
	}

	let isDeviceRegistered = false;
	let message: Message | null = null;

	onMount(() => {
		const registered = License.getInstance().getIsDeviceRegistered();
		if (registered) {
			message = {
				type: "success",
				text: "This device is registered with a license key.",
			};
		}
		isDeviceRegistered = registered;
	});

	async function handleInputChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;

		if (value.length === LICENSE_KEY_LENGTH) {
			message = {
				type: "info",
				text: "Registering device...",
			};

			const result = await License.getInstance().registerDevice(value);

			const responseMessage = License.getInstance().getResponseMessage();
			if (result) {
				isDeviceRegistered = true;
				message = {
					type: "success",
					text: responseMessage,
				};
				EventManager.getInstance().emit(
					"device-registration-change",
					true,
				);
			} else {
				message = {
					type: "failure",
					text: responseMessage,
				};
			}
		} else {
			message = null;
		}
	}

	async function handleButtonClick() {
		const result = await License.getInstance().unregisterDevice();
		if (result) {
			isDeviceRegistered = false;
			message = null;
			EventManager.getInstance().emit(
				"device-registration-change",
				false,
			);
		} else {
			const responseMessage = License.getInstance().getResponseMessage();
			message = {
				type: "failure",
				text: responseMessage,
			};
		}
	}

	function getMessageClassName(message: Message | null) {
		let className = "vault-explorer-setting-message";
		if (message !== null) {
			const { type } = message;
			if (type === "success") {
				className += " vault-explorer-setting-message--success";
			} else if (type === "failure") {
				className += " vault-explorer-setting-message--failure";
			}
		}
		return className;
	}

	$: messageClassName = getMessageClassName(message);
</script>

<div class="setting-item">
	<div class="setting-item-info">
		<div class="setting-item-name">License key</div>
		<div class="setting-item-description">
			Enter your license key to unlock premium features.
		</div>
		{#if message == null}
			<a
				class="vault-explorer-premium-link"
				href="https://vaultexplorer.com/docs/premium"
				target="_blank"
				rel="noopener">Learn more</a
			>
		{/if}
		{#if message != null}
			<div class={messageClassName}>
				{message?.text ?? ""}
			</div>
		{/if}
	</div>
	<div class="setting-item-control">
		{#if isDeviceRegistered === false}
			<input type="text" maxlength="8" on:input={handleInputChange} />
		{/if}
		{#if isDeviceRegistered === true}
			<button class="mod-destructive" on:click={handleButtonClick}
				>Unregister device</button
			>
		{/if}
	</div>
</div>

<style>
	.vault-explorer-setting-message {
		color: var(--text-muted);
		font-size: var(--font-smallest);
		padding-top: var(--size-4-1);
		line-height: var(--line-height-tight);
	}

	.vault-explorer-setting-message--success {
		color: var(--color-green);
	}

	.vault-explorer-setting-message--failure {
		color: var(--color-red);
	}
</style>
