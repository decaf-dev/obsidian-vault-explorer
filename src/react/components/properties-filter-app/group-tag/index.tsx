import "./styles.css";

interface Props {
	name: string;
	isSelected: boolean;
	onClick?: (e: React.MouseEvent) => void;
}

export default function GroupTag({ name, isSelected, onClick }: Props) {
	let className = "vault-explorer-group-tag";
	if (isSelected) {
		className += " vault-explorer-group-tag--selected";
	}
	return (
		<div className={className} onClick={onClick}>
			{name}
		</div>
	);
}
