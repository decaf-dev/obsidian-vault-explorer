import "./styles.css";

interface Props {
	id?: string;
	ariaLabel?: string;
	value: boolean;
	onToggle: (value: boolean) => void;
}

export default function Switch({ id, value, ariaLabel, onToggle }: Props) {
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.stopPropagation();
			onToggle(!value);
		}
	}

	function handleClick(e: React.MouseEvent) {
		e.stopPropagation();
		onToggle(!value);
	}

	let className = "checkbox-container vault-explorer-switch";
	if (value) className += " is-enabled";
	return (
		<div
			tabIndex={0}
			className={className}
			aria-label={ariaLabel}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			<input id={id} type="checkbox" />
		</div>
	);
}