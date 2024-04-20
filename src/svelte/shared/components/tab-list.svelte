<script>
	import { setContext } from "svelte";
	import { writable } from "svelte/store";

	export let initialSelectedIndex = 0;

	let numTabs = 0;
	const selectedTab = writable(initialSelectedIndex); // A store to keep track of the selected tab

	function registerTab() {
		return numTabs++;
	}

	setContext("selectedTab", selectedTab);
	setContext("registerTab", registerTab);
</script>

<div>
	<slot />
</div>
