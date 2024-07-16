<script lang="ts">
	export let spacing: "none" | "xs" | "sm" | "md" | "lg" | "xl" = "md";
	export let justify:
		| "flex-start"
		| "center"
		| "space-between"
		| "flex-end"
		| "unset" = "unset";
	export let align: "flex-start" | "center" | "flex-end" | "unset" = "unset";
	export let direction: "row" | "column" | "row-reverse" | "column-reverse" =
		"row";
	export let width = "unset";
	export let height = "unset";

	let spacingPx = 0;
	switch (spacing) {
		case "none":
			spacingPx = 0;
			break;
		case "xs":
			spacingPx = 4;
			break;
		case "sm":
			spacingPx = 8;
			break;
		case "md":
			spacingPx = 16;
			break;
		case "lg":
			spacingPx = 24;
			break;
		case "xl":
			spacingPx = 32;
			break;
	}
</script>

<div
	class="vault-explorer-stack"
	style="
		display: flex;
		flex-direction: {direction};
		justify-content: {justify};
		align-items: {align};
		{direction === 'row' || direction === 'row-reverse'
		? 'column-gap'
		: 'row-gap'}: {spacingPx}px;
		width: {width};
		height: {height};
	"
>
	<slot />
</div>
