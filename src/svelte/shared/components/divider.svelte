<script lang="ts">
	export let direction: "horizontal" | "vertical" = "horizontal";
	export let borderWidth: string = "var(--hr-thickness)";

	$: className = `vault-explorer-divider vault-explorer-divider--${direction}`;
</script>

<div class={className} style="border-width: {borderWidth}" />

<style>
	.vault-explorer-divider--horizontal {
		width: 100%;
		height: 0;
		border-top: var(--hr-thickness) solid var(--hr-color);
		border-left: 0;
	}

	.vault-explorer-divider--vertical {
		width: 0px;
		/* height: 100%; */
		border-top: 0;
		border-left: var(--hr-thickness) solid var(--hr-color);
	}
</style>
