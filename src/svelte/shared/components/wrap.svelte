<script lang="ts">
	export let spacingX: "xs" | "sm" | "md" | "lg" | "xl" = "md";
	export let spacingY: "xs" | "sm" | "md" | "lg" | "xl" = "md";
	export let justify:
		| "flex-start"
		| "center"
		| "space-between"
		| "flex-end"
		| "unset" = "unset";
	export let align: "flex-start" | "center" | "flex-end" | "unset" = "unset";
	export let direction: "row" | "column" = "row";
	export let width = "unset";
	export let height = "unset";
	export let wrap: "wrap" | "nowrap" = "wrap";

	let xSpacingPx = 0;
	let ySpacingPx = 0;

	if (spacingX === "xs") {
		xSpacingPx = 4;
	} else if (spacingX === "sm") {
		xSpacingPx = 8;
	} else if (spacingX === "md") {
		xSpacingPx = 16;
	} else if (spacingX === "lg") {
		xSpacingPx = 24;
	} else if (spacingX === "xl") {
		xSpacingPx = 32;
	}

	if (spacingY === "xs") {
		ySpacingPx = 4;
	} else if (spacingY === "sm") {
		ySpacingPx = 8;
	} else if (spacingY === "md") {
		ySpacingPx = 16;
	} else if (spacingY === "lg") {
		ySpacingPx = 24;
	} else if (spacingY === "xl") {
		ySpacingPx = 32;
	}
</script>

<div
	class="vault-explorer-wrap"
	style="
		display: flex;
		flex-wrap: {wrap};
		flex-direction: {direction};
		justify-content: {justify};
		align-items: {align};
		column-gap: {xSpacingPx}px;
		row-gap: {ySpacingPx}px;
		width: {width};
		height: {height};
	"
>
	<slot />
</div>
