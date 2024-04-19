<script lang="ts">
	export let direction: "row" | "column" = "row";
	export let justify: "flex-start" | "center" | "space-between" | "flex-end" =
		"flex-start";
	export let align: "flex-start" | "center" | "flex-end" = "flex-start";
	export let wrap: "wrap" | "nowrap" = "wrap";
	export let width: string = "";
	export let height: string = "";

	if (width === undefined && direction === "row") {
		width = "100%";
	} else if (height === undefined && direction === "column") {
		height = "100%";
	}
</script>

<div
	class="vault-explorer-flex"
	style="
		display: flex;
		flex-direction: {direction};
		justify-content: {justify};
		align-items: {align};
		flex-wrap: {wrap};
		width: {width};
		height: {height};
	"
>
	<slot />
</div>
