<script lang="ts">
	import { onMount } from "svelte";
	import License, { LICENSE_KEY_LENGTH } from "../shared/services/license";
	import EventManager from "src/event/event-manager";

	interface Message {
		type: "success" | "failure" | "info";
		text: string;
	}

	let isRegistered = false;
	let message: Message | null = null;

	onMount(() => {
		const registered = License.getInstance().getIsRegistered();
		if (registered) {
			message = {
				type: "success",
				text: "This device is registered with a license key.",
			};
		}
		isRegistered = registered;
	});

	async function handleInputChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;

		if (value.length === LICENSE_KEY_LENGTH) {
			message = {
				type: "info",
				text: "Registering device...",
			};

			const result = await License.getInstance().registerLicense(value);

			const responseMessage = License.getInstance().getResponseMessage();
			if (result) {
				isRegistered = true;
				message = {
					type: "success",
					text: responseMessage,
				};
				EventManager.getInstance().emit(
					"license-registration-change",
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
		const result = await License.getInstance().unregisterLicense();
		if (result) {
			isRegistered = false;
			message = null;
			EventManager.getInstance().emit(
				"license-registration-change",
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
			Register your device to unlock premium features.
		</div>
		<div class={messageClassName}>
			{message?.text ?? ""}
		</div>
	</div>
	<div class="setting-item-control">
		{#if isRegistered === false}
			<input type="text" maxlength="8" on:input={handleInputChange} />
		{/if}
		{#if isRegistered === true}
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
		height: 16px;
	}

	.vault-explorer-setting-message--success {
		color: var(--color-green);
	}

	.vault-explorer-setting-message--failure {
		color: var(--color-red);
	}
</style>
