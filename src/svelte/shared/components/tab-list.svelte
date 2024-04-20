<script>
	import { setContext } from "svelte";
	import { writable } from "svelte/store";

	let numTabs = 0;
	const selectedTab = writable(0); // A store to keep track of the selected tab

	function registerTab() {
		return numTabs++;
	}

	setContext("selectedTab", selectedTab);
	setContext("registerTab", registerTab);
</script>

<div>
	<slot />
</div>
