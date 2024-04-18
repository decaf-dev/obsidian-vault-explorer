import "./styles.css";

import Stack from "src/react/shared/stack";
import { PropertyFilterGroup } from "src/types";
import GroupTag from "../group-tag";

interface Props {
	groups: PropertyFilterGroup[];
	selectedGroupId: string;
	onGroupClick: (groupId: string) => void;
}

export default function GroupTagList({
	groups,
	selectedGroupId,
	onGroupClick,
}: Props) {
	return (
		<div className="vault-explorer-group-tag-list">
			<Stack>
				{groups.map((group, i) => {
					const { id, name } = group;
					const isSelected =
						selectedGroupId === ""
							? i === 0
							: id === selectedGroupId;
					return (
						<GroupTag
							key={id}
							name={name}
							isSelected={isSelected}
							onClick={() => onGroupClick(id)}
						/>
					);
				})}
			</Stack>
		</div>
	);
}
