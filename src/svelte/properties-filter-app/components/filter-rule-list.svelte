<script lang="ts">
	import Stack from "src/svelte/shared/components/stack.svelte";
	import PropertyFilter from "./property-filter.svelte";
	import { FilterRule, FilterRuleType, PropertyType } from "src/types";
	import ContentFilter from "./content-filter.svelte";
	import FolderFilter from "./folder-filter.svelte";
	import FileNameFilter from "./file-name-filter.svelte";

	export let rules: FilterRule[] = [];
</script>

<Stack direction="column" spacing="md" width="100%">
	{#each rules as rule, index (rule.id)}
		{#if rule.type === FilterRuleType.PROPERTY}
			<PropertyFilter
				{index}
				id={rule.id}
				type={rule.type}
				propertyName={rule.propertyName}
				operator={rule.operator}
				value={rule.value}
				{...rule.propertyType === PropertyType.DATE
					? { valueData: rule.valueData }
					: { valueData: null }}
				condition={rule.condition}
				matchWhenPropertyDNE={rule.matchWhenPropertyDNE}
				propertyType={rule.propertyType}
				isEnabled={rule.isEnabled}
				on:ruleTypeChange
				on:ruleConditionChange
				on:ruleOperatorChange
				on:ruleValueChange
				on:ruleToggle
				on:ruleDeleteClick
				on:propertyNameChange
				on:propertyTypeChange
				on:propertyValueDataChange
				on:propertyMatchWhenPropertyDNEChange
			/>
		{/if}

		{#if rule.type === FilterRuleType.FILE_NAME}
			<FileNameFilter
				{index}
				id={rule.id}
				type={rule.type}
				operator={rule.operator}
				value={rule.value}
				condition={rule.condition}
				isEnabled={rule.isEnabled}
				on:ruleTypeChange
				on:ruleConditionChange
				on:ruleOperatorChange
				on:ruleValueChange
				on:ruleToggle
				on:ruleDeleteClick
			/>
		{/if}

		{#if rule.type === FilterRuleType.FOLDER}
			<FolderFilter
				{index}
				id={rule.id}
				type={rule.type}
				operator={rule.operator}
				includeSubfolders={rule.includeSubfolders}
				value={rule.value}
				condition={rule.condition}
				isEnabled={rule.isEnabled}
				on:ruleTypeChange
				on:ruleConditionChange
				on:ruleOperatorChange
				on:ruleValueChange
				on:ruleToggle
				on:ruleDeleteClick
				on:folderSubfoldersToggle
			/>
		{/if}

		{#if rule.type === FilterRuleType.CONTENT}
			<ContentFilter
				{index}
				id={rule.id}
				type={rule.type}
				operator={rule.operator}
				value={rule.value}
				condition={rule.condition}
				isEnabled={rule.isEnabled}
				on:ruleTypeChange
				on:ruleConditionChange
				on:ruleOperatorChange
				on:ruleValueChange
				on:ruleToggle
				on:ruleDeleteClick
			/>
		{/if}
	{/each}
</Stack>
