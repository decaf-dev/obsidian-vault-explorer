<script lang="ts">
	import EventManager from "src/event/event-manager";
	import { onMount } from "svelte";
	import store from "../shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import {
		CheckboxFilterCondition,
		DateFilterCondition,
		ListFilterCondition,
		NumberFilterCondition,
		TextFilterCondition,
		DatePropertyFilterValue,
		PropertyType,
		FilterRuleType,
		ContentFilterCondition,
		FolderFilterCondition,
		FileNameFilterCondition,
		TFilterRule,
		TFilterGroup,
	} from "src/types";
	import { generateRandomId } from "../shared/services/random";
	import { createPropertyFilter } from "./services/utils";
	import GroupList from "./components/group-list.svelte";
	import Divider from "../shared/components/divider.svelte";
	import Logger from "js-logger";
	import { PluginEvent } from "src/event/types";
	import IconButton from "../shared/components/icon-button.svelte";
	import Stack from "../shared/components/stack.svelte";
	import Spacer from "../shared/components/spacer.svelte";
	import FilterRuleList from "./components/filter-rule-list.svelte";

	let selectedGroupId: string = "";
	let groups: TFilterGroup[] = [];
	let plugin: VaultExplorerPlugin;

	$: selectedGroup = groups.find((group) => group.id === selectedGroupId);

	$: groups, selectedGroupId, saveSettings();

	async function saveSettings() {
		plugin.settings.filters.custom.groups = groups;
		plugin.settings.filters.custom.selectedGroupId = selectedGroupId;
		await plugin.saveSettings();
	}

	store.plugin.subscribe((p) => {
		plugin = p;

		groups = plugin.settings.filters.custom.groups;
		selectedGroupId = plugin.settings.filters.custom.selectedGroupId;
	});

	onMount(() => {
		return () => {
			EventManager.getInstance().emit(
				PluginEvent.PROPERTIES_FILTER_UPDATE,
			);
		};
	});

	function handleGroupChange(e: Event) {
		const { value } = e.target as HTMLSelectElement;
		selectedGroupId = value;
	}

	function handleGroupAddClick() {
		const newGroup: TFilterGroup = {
			id: generateRandomId(),
			name: `Group ${groups.length + 1}`,
			rules: [createPropertyFilter()],
			isEnabled: false,
			isSticky: false,
		};

		selectedGroupId = newGroup.id;
		groups = [...groups, newGroup];
	}

	function handleGroupDeleteClick() {
		const index = groups.findIndex((group) => group.id === selectedGroupId);
		const newGroups = groups.filter(
			(group) => group.id !== selectedGroupId,
		);

		let newIndex = index - 1;
		if (newIndex < 0) {
			newIndex = 0;
		}

		groups = newGroups;

		if (newGroups.length === 0) {
			selectedGroupId = "";
		} else {
			selectedGroupId = newGroups[newIndex].id;
		}
	}

	function handleRuleAddClick() {
		const newFilter = createPropertyFilter();

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? { ...group, rules: [...group.rules, newFilter] }
				: group,
		);

		groups = newGroups;
	}

	function handleGroupNameChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId ? { ...group, name: value } : group,
		);

		groups = newGroups;
	}

	function handleRuleConditionChange(e: CustomEvent) {
		const { id, condition } = e.detail;

		const newGroups: TFilterGroup[] = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id ? { ...rule, condition } : rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleRuleDeleteClick(e: CustomEvent) {
		const { id } = e.detail;
		Logger.trace({
			fileName: "custom-filter-app/index.svelte",
			functionName: "handleRuleDeleteClick",
			message: "called",
		});
		Logger.debug(
			{
				fileName: "custom-filter-app/index.svelte",
				functionName: "handleRuleDeleteClick",
				message: "deleting rule",
			},
			{ id },
		);

		const newGroups: TFilterGroup[] = groups.map((group) => {
			if (group.id === selectedGroupId) {
				const newRules: TFilterRule[] = group.rules.filter(
					(rule) => rule.id !== id,
				);
				return {
					...group,
					rules: newRules,
				};
			}
			return group;
		});

		groups = newGroups;
	}

	function handleRuleDuplicateClick(e: CustomEvent) {
		const { id } = e.detail;

		Logger.trace({
			fileName: "custom-filter-app/index.svelte",
			functionName: "handleRuleDuplicateClick",
			message: "called",
		});
		Logger.debug(
			{
				fileName: "custom-filter-app/index.svelte",
				functionName: "handleRuleDuplicateClick",
				message: "duplicating rule",
			},
			{ id },
		);

		const newGroups: TFilterGroup[] = groups.map((group) => {
			if (group.id === selectedGroupId) {
				const rule = group.rules.find((rule) => rule.id === id);
				if (!rule) {
					throw new Error(`Rule with id ${id} not found`);
				}

				const newRules: TFilterRule[] = [
					...group.rules,
					{
						...rule,
						id: generateRandomId(),
					},
				];

				return {
					...group,
					rules: newRules,
				};
			}

			return group;
		});

		groups = newGroups;
	}

	function handlePropertyNameChange(e: CustomEvent) {
		const { id, name } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id
								? { ...rule, propertyName: name }
								: rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleRuleToggle(e: CustomEvent) {
		const { id } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id
								? { ...rule, isEnabled: !rule.isEnabled }
								: rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleRuleOperatorChange(e: CustomEvent) {
		const { id, operator } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id ? { ...rule, operator } : rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleRuleTypeChange(e: CustomEvent) {
		const { id, type } = e.detail;

		let newCondition: any;
		if (type === FilterRuleType.PROPERTY) {
			newCondition = TextFilterCondition.IS;
		} else if (type === FilterRuleType.CONTENT) {
			newCondition = ContentFilterCondition.CONTAINS;
		} else if (type === FilterRuleType.FOLDER) {
			newCondition = FolderFilterCondition.IS;
		} else if (type === FilterRuleType.FILE_NAME) {
			newCondition = FileNameFilterCondition.CONTAINS;
		} else {
			throw new Error(`Unhandled filter type: ${type}`);
		}

		const newGroups: TFilterGroup[] = groups.map((group) => {
			if (group.id === selectedGroupId) {
				const newRules = group.rules.map((rule) => {
					if (rule.id === id) {
						return {
							...rule,
							type,
							condition: newCondition,
							value: "",
						};
					}
					return rule;
				});
				return {
					...group,
					rules: newRules,
				};
			}
			return group;
		});

		groups = newGroups;
	}

	function handlePropertyTypeChange(e: CustomEvent) {
		const { id, propertyType } = e.detail;

		let newCondition: any;
		let newValue = "";
		if (propertyType === "text") {
			newCondition = TextFilterCondition.IS;
		} else if (propertyType === "number") {
			newCondition = NumberFilterCondition.IS_EQUAL;
		} else if (propertyType === "checkbox") {
			newCondition = CheckboxFilterCondition.IS;
			newValue = "true";
		} else if (propertyType === "list") {
			newCondition = ListFilterCondition.CONTAINS;
		} else if (propertyType === "date" || propertyType === "datetime") {
			newValue = DatePropertyFilterValue.TODAY;
			newCondition = DateFilterCondition.IS;
		} else {
			throw new Error(`Unhandled filter type: ${propertyType}`);
		}

		const newGroups: TFilterGroup[] = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id
								? {
										...rule,
										propertyType,
										propertyName: "",
										condition: newCondition,
										value: newValue,
										...(propertyType ===
											PropertyType.DATE ||
										propertyType === PropertyType.DATETIME
											? { valueData: "" }
											: {}),
									}
								: rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleRuleValueChange(e: CustomEvent) {
		const { id, value } = e.detail;

		const newGroups: TFilterGroup[] = groups.map((group) => {
			const { rules } = group;
			if (group.id === selectedGroupId) {
				const newRules = rules.map((rule) => {
					if (rule.id === id) {
						return {
							...rule,
							value,
							...(rule.type === FilterRuleType.PROPERTY &&
							(rule.propertyType === PropertyType.DATE ||
								rule.propertyType) === PropertyType.DATETIME
								? { valueData: "" }
								: {}),
						};
					}
					return rule;
				});
				return {
					...group,
					rules: newRules,
				};
			}
			return group;
		});

		groups = newGroups;
	}

	function handlePropertyValueDataChange(e: CustomEvent) {
		const { id, value } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id
								? { ...rule, valueData: value }
								: rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleFolderSubfoldersToggle(e: CustomEvent) {
		const { id, includeSubfolders } = e.detail;

		const newGroups: TFilterGroup[] = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id &&
							rule.type === FilterRuleType.FOLDER
								? {
										...rule,
										includeSubfolders,
									}
								: rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handlePropertyMatchWhenPropertyDNEChange(e: CustomEvent) {
		const { id, matchWhenDNE } = e.detail;

		const newGroups: TFilterGroup[] = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id
								? {
										...rule,
										matchWhenPropertyDNE: matchWhenDNE,
									}
								: rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}
</script>

<div class="vault-explorer-filter-app">
	<h3>Custom filter</h3>
	{#if selectedGroup !== undefined}
		<Stack spacing="md" align="flex-end">
			<select value={selectedGroup.id} on:change={handleGroupChange}>
				{#each groups as group}
					<option value={group.id}>{group.name}</option>
				{/each}
			</select>
			<Stack spacing="xs" align="flex-end">
				<input
					id="filter-group-name"
					type="text"
					value={selectedGroup.name}
					on:change={handleGroupNameChange}
				/>
				<IconButton
					ariaLabel="Delete group"
					iconId="trash"
					on:click={() => handleGroupDeleteClick()}
				/>
			</Stack>
		</Stack>
		<Spacer size="sm" />
		<Divider />
		<Spacer size="sm" />
	{/if}
	<IconButton iconId="plus" on:click={() => handleGroupAddClick()}
		>Add group</IconButton
	>
	<Spacer size="sm" />
	<Divider />
	<FilterRuleList
		rules={selectedGroup?.rules ?? []}
		on:ruleTypeChange={handleRuleTypeChange}
		on:ruleConditionChange={handleRuleConditionChange}
		on:ruleDeleteClick={handleRuleDeleteClick}
		on:ruleDuplicateClick={handleRuleDuplicateClick}
		on:ruleValueChange={handleRuleValueChange}
		on:ruleOperatorChange={handleRuleOperatorChange}
		on:ruleToggle={handleRuleToggle}
		on:groupDeleteClick={handleGroupDeleteClick}
		on:groupNameChange={handleGroupNameChange}
		on:propertyTypeChange={handlePropertyTypeChange}
		on:propertyNameChange={handlePropertyNameChange}
		on:propertyValueDataChange={handlePropertyValueDataChange}
		on:propertyMatchWhenPropertyDNEChange={handlePropertyMatchWhenPropertyDNEChange}
		on:folderSubfoldersToggle={handleFolderSubfoldersToggle}
	/>
	<Divider />
	<Spacer size="md" />
	<div class="vault-explorer-filter-app__footer">
		{#if groups.length > 0}
			<IconButton iconId="plus" on:click={handleRuleAddClick}
				>Add rule</IconButton
			>
		{/if}
	</div>
</div>
