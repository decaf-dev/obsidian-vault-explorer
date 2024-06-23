<script lang="ts">
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import Switch from "src/svelte/shared/components/switch.svelte";
	import {
		CheckboxFilterCondition,
		DateFilterCondition,
		FilterCondition,
		FilterOperator,
		ListFilterCondition,
		NumberFilterCondition,
		TextFilterCondition,
		PropertyType,
		FilterRuleType,
		FolderFilterCondition,
		FileNameFilterCondition,
		ContentFilterCondition,
	} from "src/types";
	import {
		getDisplayNameForFilterCondition,
		getDisplayNameForFilterRuleType,
	} from "./display-name-utils";
	import { createEventDispatcher } from "svelte";
	import Wrap from "src/svelte/shared/components/wrap.svelte";
	import License from "src/svelte/shared/services/license";

	export let index: number;
	export let id: string;
	export let type: FilterRuleType;
	export let propertyType: PropertyType | null;
	export let operator: FilterOperator;
	export let condition: FilterCondition;
	export let isEnabled: boolean;

	let enablePremiumFeatures = false;

	const dispatch = createEventDispatcher();

	License.getInstance()
		.getIsDeviceRegisteredStore()
		.subscribe((isRegistered) => {
			enablePremiumFeatures = isRegistered;
		});

	function handleDeleteClick() {
		dispatch("ruleDeleteClick", { id });
	}

	function handleTypeChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("ruleTypeChange", { id, type: value });
	}

	function handleConditionChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		dispatch("ruleConditionChange", { id, condition: value });
	}

	function handleOperatorChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		dispatch("ruleOperatorChange", { id, operator: value });
	}

	function handleToggle() {
		dispatch("ruleToggle", { id });
	}

	$: filterConditions = findFilterConditions(type, propertyType);

	function findFilterConditions(
		type: FilterRuleType,
		propertyType: PropertyType | null,
	): FilterCondition[] {
		if (type === FilterRuleType.PROPERTY) {
			if (propertyType === "text") {
				return Object.values(TextFilterCondition);
			} else if (propertyType === "number") {
				return Object.values(NumberFilterCondition);
			} else if (propertyType === "list") {
				return Object.values(ListFilterCondition);
			} else if (propertyType === "checkbox") {
				return Object.values(CheckboxFilterCondition);
			} else if (propertyType === "date" || propertyType === "datetime") {
				return Object.values(DateFilterCondition);
			} else {
				throw new Error(
					`Unknown PropertyFilterCondition type: ${type}`,
				);
			}
		} else if (type === FilterRuleType.FOLDER) {
			return Object.values(FolderFilterCondition);
		} else if (type === FilterRuleType.FILE_NAME) {
			return Object.values(FileNameFilterCondition);
		} else if (type === FilterRuleType.CONTENT) {
			return Object.values(ContentFilterCondition);
		} else {
			throw new Error(`Unknown FilterConditionType: ${type}`);
		}
	}
</script>

<div class="vault-explorer-filter-rule">
	<Wrap spacingX="sm" spacingY="sm" align="center">
		{#if index > 0}
			<select
				class="vault-explorer-filter-rule__operator"
				value={operator}
				on:change={handleOperatorChange}
			>
				<option value="and">and</option>
				<option value="or">or</option>
			</select>
		{/if}
		<select value={type} on:change={handleTypeChange}>
			{#each Object.values(FilterRuleType) as type}
				<option value={type}
					>{getDisplayNameForFilterRuleType(type)}</option
				>
			{/each}
		</select>
		<slot name="before-condition"></slot>
		<select
			disabled={type === FilterRuleType.CONTENT && !enablePremiumFeatures}
			value={condition}
			on:change={handleConditionChange}
		>
			{#each filterConditions as condition}
				<option value={condition}>
					{getDisplayNameForFilterCondition(condition)}
				</option>
			{/each}
		</select>
		<slot name="after-condition"></slot>
		<Stack spacing="sm" align="center">
			<Switch value={isEnabled} on:change={() => handleToggle()} />
			<IconButton
				ariaLabel="Delete filter rule"
				iconId="trash"
				on:click={() => handleDeleteClick()}
			/>
			<slot name="after-toggle"></slot>
		</Stack>
	</Wrap>
</div>

<style>
	.vault-explorer-filter-rule__operator {
		width: 58px;
	}

	:global(.vault-explorer-filter-rule input) {
		max-width: 125px;
	}

	.vault-explorer-filter-rule select {
		max-width: 160px;
	}
</style>
