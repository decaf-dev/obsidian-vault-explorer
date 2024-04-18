import { getAllObsidianProperties } from "src/obsidian/utils";
import { useAppMount } from "../../shared/app-mount-provider";
import Flex from "../../shared/flex";
import Stack from "../../shared/stack";
import IconButton from "../../shared/icon-button";
import Switch from "../../shared/switch";
import {
	PropertyFilterGroup,
	TextFilterCondition,
	TextPropertyFilter,
} from "src/types";

import "./styles.css";
import { getDisplayNameForFilterCondition } from "./utils";

interface Props {
	id: string;
	propertyName: string;
	value: string;
	condition: TextFilterCondition;
	isEnabled: boolean;
	onGroupsChange: React.Dispatch<React.SetStateAction<PropertyFilterGroup[]>>;
}

export default function PropertyFilter({
	id,
	propertyName,
	condition,
	isEnabled,
	value,
	onGroupsChange,
}: Props) {
	const { app } = useAppMount();
	const obsidianProperties = getAllObsidianProperties(app);

	function handlePropertyChange(args: Partial<TextPropertyFilter>) {
		onGroupsChange((groups) => {
			return groups.map((group) => {
				if (group.id === id) {
					return {
						...group,
						filters: group.filters.map((filter) => {
							if (filter.id === id) {
								return {
									...filter,
									...args,
								};
							}
							return filter;
						}),
					};
				}
				return group;
			});
		});
	}

	function handleDelete() {
		onGroupsChange((groups) =>
			groups.map((group) => {
				if (group.id === id) {
					return {
						...group,
						filters: group.filters.filter(
							(filter) => filter.id !== id
						),
					};
				}
				return group;
			})
		);
	}

	function handlePropertyNameChange(value: string) {
		handlePropertyChange({ propertyName: value });
	}

	function handleConditionChange(value: TextFilterCondition) {
		handlePropertyChange({ condition: value });
	}

	function handleValueChange(value: string) {
		handlePropertyChange({ value });
	}

	function handleToggle() {
		handlePropertyChange({ isEnabled: !isEnabled });
	}

	return (
		<div className="vault-explorer-property-filter">
			<Flex justify="space-between">
				<Stack spacing="md">
					<select
						value={propertyName}
						onChange={(e) =>
							handlePropertyNameChange(e.target.value)
						}
					>
						<option value="">Select a property</option>
						{obsidianProperties.map((prop) => {
							const { name } = prop;
							return (
								<option key={name} value={name}>
									{name}
								</option>
							);
						})}
					</select>
					<select
						value={condition}
						onChange={(e) =>
							handleConditionChange(
								e.target.value as TextFilterCondition
							)
						}
					>
						{Object.values(TextFilterCondition).map((condition) => {
							return (
								<option key={condition} value={condition}>
									{getDisplayNameForFilterCondition(
										condition
									)}
								</option>
							);
						})}
					</select>
					{condition !== TextFilterCondition.IS_EMPTY &&
						condition !== TextFilterCondition.IS_NOT_EMPTY && (
							<input
								type="text"
								value={value}
								onChange={(e) =>
									handleValueChange(e.target.value)
								}
							/>
						)}
				</Stack>
				<Stack spacing="sm" align="center">
					<Switch value={isEnabled} onToggle={() => handleToggle()} />
					<IconButton iconId="trash" onClick={() => handleDelete()} />
				</Stack>
			</Flex>
		</div>
	);
}
