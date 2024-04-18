<script lang="ts">
	export let direction: "horizontal" | "vertical" = "vertical";
	export let size: "" | "xs" | "sm" | "md" | "lg" = "";

	let width = 0;
	let height = 0;
	switch (size) {
		case "xs":
			if (direction == "horizontal") width = 4;
			if (direction == "vertical") height = 4;
			break;
		case "sm":
			if (direction == "horizontal") width = 8;
			if (direction == "vertical") height = 8;
			break;
		case "md":
			if (direction == "horizontal") width = 16;
			if (direction == "vertical") height = 16;
			break;
		case "lg":
			if (direction == "horizontal") width = 24;
			if (direction == "vertical") height = 24;
			break;
	}
</script>

<div
	style="
		width: {width};
		height: {height};
	"
></div>
