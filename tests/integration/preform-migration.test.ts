import { preformMigrations } from "src/migrations";
import { isVaultExplorerPluginSettings } from "src/types/index.guard";
import { TextFilterCondition_0_3_3, VaultExplorerPluginSettings_0_3_3 } from "src/types/types-0.3.3";
import { CheckboxFilterCondition_0_5_5, DateFilterCondition_0_5_5, ListFilterCondition_0_5_5, NumberFilterCondition_0_5_5, PropertyFilterType_0_5_5, TextFilterCondition_0_5_5, VaultExplorerPluginSettings_0_5_5 } from "src/types/types-0.5.5";

describe("preformMigrations", () => {
	it("should migrate from 0.3.3 to the latest version", () => {
		//Arrange
		const settingsData: VaultExplorerPluginSettings_0_3_3 = {
			"properties": {
				"favorite": "note-123",
				"url": "https://example.com",
				"custom1": "custom-value-1",
				"custom2": "custom-value-2",
				"custom3": "custom-value-3"
			},
			"filters": {
				"folder": "MyNotes",
				"search": "project",
				"onlyFavorites": true,
				"sort": "file-name-asc",
				"timestamp": "created-today",
				"properties": {
					"selectedGroupId": "group-1",
					"groups": [
						{
							"id": "group-1",
							"name": "Project Filters",
							"filters": [
								{
									"id": "filter-1",
									"propertyName": "status",
									"operator": "and",
									"isEnabled": true,
									"condition": TextFilterCondition_0_3_3.IS,
									"value": "active"
								},
								{
									"id": "filter-2",
									"propertyName": "priority",
									"operator": "or",
									"isEnabled": false,
									"condition": TextFilterCondition_0_3_3.CONTAINS,
									"value": "high"
								}
							],
							"position": 0,
							"isEnabled": true
						},
						{
							"id": "group-2",
							"name": "Personal Filters",
							"filters": [
								{
									"id": "filter-3",
									"propertyName": "tag",
									"operator": "and",
									"isEnabled": true,
									"condition": TextFilterCondition_0_3_3.STARTS_WITH,
									"value": "work"
								},
								{
									"id": "filter-4",
									"propertyName": "deadline",
									"operator": "or",
									"isEnabled": true,
									"condition": TextFilterCondition_0_3_3.IS_NOT_EMPTY,
									"value": ""
								}
							],
							"position": 1,
							"isEnabled": false
						}
					]
				}
			},
			"currentView": "grid",
			"pageSize": 20,
			"pluginVersion": "0.3.3"
		}

		//Same guard clause as in main.js
		if (settingsData.pluginVersion === null) return;

		//Act
		const result = preformMigrations(settingsData.pluginVersion, settingsData as unknown as Record<string, unknown>);

		//Assert
		expect(isVaultExplorerPluginSettings(result)).toBe(true);
	});

	it("should migrate from 0.4.0 to the latest version", () => {
		//Arrange
		const settingsData: VaultExplorerPluginSettings_0_5_5 = {
			properties: {
				favorite: "yes",
				url: "https://example.com",
				custom1: "customValue1",
				custom2: "customValue2",
				custom3: "customValue3"
			},
			filters: {
				folder: "root",
				search: "example search",
				onlyFavorites: true,
				sort: "file-name-asc",
				timestamp: "created-today",
				properties: {
					selectedGroupId: "group1",
					groups: [
						{
							id: "group1",
							name: "Group 1",
							filters: [
								{
									id: "filter1",
									propertyName: "name",
									operator: "and",
									type: PropertyFilterType_0_5_5.TEXT,
									isEnabled: true,
									value: "example",
									condition: TextFilterCondition_0_5_5.CONTAINS
								},
								{
									id: "filter2",
									propertyName: "size",
									operator: "or",
									type: PropertyFilterType_0_5_5.NUMBER,
									isEnabled: true,
									value: "100",
									condition: NumberFilterCondition_0_5_5.IS_GREATER
								}
							],
							position: 1,
							isEnabled: true
						},
						{
							id: "group2",
							name: "Group 2",
							filters: [
								{
									id: "filter3",
									propertyName: "tags",
									operator: "and",
									type: PropertyFilterType_0_5_5.LIST,
									isEnabled: true,
									value: "important",
									condition: ListFilterCondition_0_5_5.CONTAINS
								},
								{
									id: "filter4",
									propertyName: "isArchived",
									operator: "or",
									type: PropertyFilterType_0_5_5.CHECKBOX,
									isEnabled: true,
									value: "true",
									condition: CheckboxFilterCondition_0_5_5.IS
								},
								{
									id: "filter5",
									propertyName: "dateCreated",
									operator: "and",
									type: PropertyFilterType_0_5_5.DATE,
									isEnabled: true,
									value: "2023-01-01",
									condition: DateFilterCondition_0_5_5.IS_AFTER
								}
							],
							position: 2,
							isEnabled: true
						}
					]
				}
			},
			currentView: "list",
			pageSize: 20,
			pluginVersion: "0.4.0"
		};

		//This the same guard clause as in main.js
		if (settingsData.pluginVersion === null) return;

		//Act
		const result = preformMigrations(settingsData.pluginVersion, settingsData as unknown as Record<string, unknown>);

		//Assert
		expect(isVaultExplorerPluginSettings(result)).toBe(true);
	});
});
