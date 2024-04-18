import { getAllObsidianProperties } from "src/obsidian/utils";
import { useAppMount } from "../../shared/app-mount-provider";
import Flex from "../../shared/flex";
import Stack from "../../shared/stack";
import IconButton from "../../shared/icon-button";
import Switch from "../../shared/switch";
import { TextFilterCondition } from "src/types";

import "./styles.css";
import { getDisplayNameForFilterCondition } from "./utils";

interface Props {
	id: string;
	propertyName: string;
	value: string;
	condition: TextFilterCondition;
	isEnabled: boolean;
	onPropertyChange: (id: string, propertyName: string) => void;
	onConditionChange: (id: string, condition: TextFilterCondition) => void;
	onDelete: (id: string) => void;
	onToggle: (id: string) => void;
	onValueChange: (id: string, value: string) => void;
}

export default function PropertyFilter({
	id,
	propertyName,
	condition,
	isEnabled,
	value,
	onPropertyChange,
	onToggle,
	onDelete,
	onConditionChange,
	onValueChange,
}: Props) {
	const { app } = useAppMount();
	const obsidianProperties = getAllObsidianProperties(app);

	return (
		<div className="vault-explorer-property-filter">
			<Flex justify="space-between">
				<Stack spacing="md">
					<select
						value={propertyName}
						onChange={(e) => onPropertyChange(id, e.target.value)}
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
							onConditionChange(
								id,
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
					<input
						type="text"
						value={value}
						onChange={(e) => onValueChange(id, e.target.value)}
					/>
				</Stack>
				<Stack spacing="sm" align="center">
					<Switch value={isEnabled} onToggle={() => onToggle(id)} />
					<IconButton iconId="trash" onClick={() => onDelete(id)} />
				</Stack>
			</Flex>
		</div>
	);
}
