<script lang="ts">
	import { onMount } from "svelte";
	import License from "../shared/services/license";
	import EventManager from "src/event/event-manager";
	import PremiumLink from "../shared/components/premium-link.svelte";
	import { PluginEvent } from "src/event/types";

	interface Message {
		type: "success" | "failure" | "info";
		text: string;
	}

	let hasValidLicenseKey = false;
	let message: Message | null = null;

	const LICENSE_KEY_SIZE = 148;

	onMount(() => {
		const hasValidKey = License.getInstance().getHasValidKey();
		if (hasValidKey) {
			message = {
				type: "success",
				text: "Premium features are enabled.",
			};
		}
		hasValidLicenseKey = hasValidKey;
	});

	async function handleInputChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;

		if (value.length < LICENSE_KEY_SIZE) return;

		message = {
			type: "info",
			text: "Validating key...",
		};

		const result = await License.getInstance().addKey(value);

		if (result) {
			hasValidLicenseKey = true;
			message = {
				type: "success",
				text: "Premium features are enabled.",
			};
			EventManager.getInstance().emit(
				PluginEvent.LICENSE_KEY_VALIDATION_CHANGE,
				true,
			);
		} else {
			hasValidLicenseKey = false;
			message = {
				type: "failure",
				text: "Invalid key.",
			};
		}
	}

	function handleRemoveButtonClick() {
		License.getInstance().removeKey();
		hasValidLicenseKey = false;
		message = null;
		EventManager.getInstance().emit(
			PluginEvent.LICENSE_KEY_VALIDATION_CHANGE,
			false,
		);
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
			Enter your license key to enable premium features.
		</div>
		{#if message == null}
			<PremiumLink />
		{/if}
		{#if message != null}
			<div class={messageClassName}>
				{message?.text ?? ""}
			</div>
		{/if}
	</div>
	<div class="setting-item-control">
		{#if hasValidLicenseKey === false}
			<input
				type="text"
				maxlength={LICENSE_KEY_SIZE}
				on:input={handleInputChange}
			/>
		{/if}
		{#if hasValidLicenseKey === true}
			<button class="mod-destructive" on:click={handleRemoveButtonClick}
				>Remove key</button
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
