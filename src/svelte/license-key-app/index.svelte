<script lang="ts">
	import { onMount } from "svelte";
	import License, { LICENSE_KEY_LENGTH } from "../shared/services/license";

	type MessageType = "success" | "failure" | "info";

	interface Message {
		type: MessageType;
		message: string;
	}

	let isRegistered = false;
	let message: Message = {
		type: "info",
		message: "",
	};

	onMount(() => {
		const registered = License.getInstance().getIsRegistered();
		if (registered) {
			message = {
				type: "success",
				message: "This device is registered with a license key.",
			};
		}
		isRegistered = registered;
	});

	async function handleInputChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;

		if (value.length === LICENSE_KEY_LENGTH) {
			message = {
				type: "info",
				message: "Registering device...",
			};

			const result = await License.getInstance().registerLicense(value);

			const responseMessage = License.getInstance().getResponseMessage();
			if (result) {
				isRegistered = true;
				message = {
					type: "success",
					message: responseMessage,
				};
			} else {
				message = {
					type: "failure",
					message: responseMessage,
				};
			}
		} else {
			message = {
				type: "info",
				message: "",
			};
		}
	}

	async function handleButtonClick() {
		const result = await License.getInstance().unregisterLicense();
		if (result) {
			isRegistered = false;
			message = {
				type: "info",
				message: "",
			};
		} else {
			const responseMessage = License.getInstance().getResponseMessage();
			message = {
				type: "failure",
				message: responseMessage,
			};
		}
	}

	//EventManager.getInstance().emit("license-setting-change");

	$: messageClassName =
		"vault-explorer-setting-message" +
		(message.type === "success"
			? " vault-explorer-setting-message--success"
			: message.type === "failure"
				? " vault-explorer-setting-message--failure"
				: "");
</script>

<div class="setting-item">
	<div class="setting-item-info">
		<div class="setting-item-name">License key</div>
		<div class="setting-item-description">
			Register your device to unlock premium features.
		</div>
		<div class={messageClassName}>
			{message.message}
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
		height: 16px;
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
