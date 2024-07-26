<script lang="ts">
	export let direction: "horizontal" | "vertical" = "vertical";
	export let size: "" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" = "";

	$: size, direction, findDimesions();

	let width = 0;
	let height = 0;

	function findDimesions() {
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
				if (direction == "horizontal") width = 12;
				if (direction == "vertical") height = 12;
				break;
			case "lg":
				if (direction == "horizontal") width = 16;
				if (direction == "vertical") height = 16;
				break;
			case "xl":
				if (direction == "horizontal") width = 24;
				if (direction == "vertical") height = 24;
				break;
			case "2xl":
				if (direction == "horizontal") width = 32;
				if (direction == "vertical") height = 32;
				break;
		}
	}
</script>

<div
	style="
		width: {width}px;
		height: {height}px;
	"
></div>
