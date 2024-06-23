<script lang="ts">
	import IconButton from "../../shared/components/icon-button.svelte";

	export let direction: "left" | "right";
	export let type: "group-tag" | "tag";

	function getClassName() {
		let className = `vault-explorer-scroll-button vault-explorer-scroll-button--${direction}`;
		if (type === "group-tag") {
			className += " vault-explorer-scroll-button--group-tag";
		} else {
			className += " vault-explorer-scroll-button--tag";
		}
		return className;
	}

	$: className = getClassName();
</script>

<div class={className}>
	<IconButton
		isTabbable={false}
		ariaLabel={direction === "left" ? "Scroll left" : "Scroll right"}
		noPadding
		iconId={direction === "left" ? "chevron-left" : "chevron-right"}
		on:click
	/>
</div>

<style>
	.vault-explorer-scroll-button {
		position: absolute;
		background-color: var(--background-primary);
		z-index: 1;
		top: 0;
		width: 20px;
	}

	.vault-explorer-scroll-button--left {
		left: 0;
	}

	.vault-explorer-scroll-button--right {
		right: 0;
	}

	.vault-explorer-scroll-button--group-tag {
		height: 25px;
		padding-top: 2px;
	}

	.vault-explorer-scroll-button--tag {
		height: 20px;
		padding-top: 1px;
	}
</style>
