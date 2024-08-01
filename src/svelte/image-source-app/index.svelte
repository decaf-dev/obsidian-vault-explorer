<script lang="ts">
	import store from "../shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import { CoverImageSource, CoverImageSourceType } from "src/types";
	import { getDisplayNameForImageSource } from "./display-name";
	import Icon from "../shared/components/icon.svelte";
	import { PluginEvent } from "src/event/types";
	import EventManager from "src/event/event-manager";

	let plugin: VaultExplorerPlugin | null = null;
	let coverImageSources: CoverImageSource[] = [];

	store.plugin.subscribe((p) => {
		plugin = p;
		coverImageSources = p.settings.views.grid.coverImageSources;
	});

	function handleSourceClick(type: CoverImageSourceType) {
		const updatedSources = coverImageSources.map((source) => {
			if (source.type === type) {
				return {
					...source,
					isEnabled: !source.isEnabled,
				};
			}
			return source;
		});
		coverImageSources = updatedSources;
	}

	async function saveSettings() {
		if (!plugin) return;

		plugin.settings.views.grid.coverImageSources = coverImageSources;
		await plugin.saveSettings();
		EventManager.getInstance().emit(
			PluginEvent.COVER_IMAGE_SOURCE_SETTING_CHANGE,
		);
	}

	$: coverImageSources, saveSettings();
</script>

<div class="setting-item">
	<div class="setting-item-info">
		<div class="setting-item-name">Image source</div>
		<div class="setting-item-description">
			<div class="vault-explorer-image-source-setting-container">
				{#each coverImageSources as source}
					<div
						tabindex="0"
						role="button"
						class="vault-explorer-image-source-setting-row"
						on:click={() => handleSourceClick(source.type)}
						on:keydown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								handleSourceClick(source.type);
							}
						}}
					>
						<div class="vault-explorer-image-source-setting-title">
							<Icon iconId={source.isEnabled ? "check" : "x"} />
							<div>
								{getDisplayNameForImageSource(source.type)}
							</div>
						</div>
						<Icon iconId="grip-horizontal" />
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.vault-explorer-image-source-setting-title {
		display: flex;
		column-gap: 8px;
	}

	.vault-explorer-image-source-setting-row {
		display: flex;
		justify-content: space-between;
		padding: 8px 8px;
	}

	.vault-explorer-image-source-setting-row:hover {
		background-color: var(--background-modifier-hover);
	}
</style>
