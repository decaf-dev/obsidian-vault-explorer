import "./styles.css";

interface Props {
	id: string;
	label: string;
	value: boolean;
	onChange: (value: boolean) => void;
}

export default function Checkbox({ id, label, value, onChange }: Props) {
	return (
		<div className="vault-explorer-checkbox">
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				type="checkbox"
				checked={value}
				onChange={(e) => onChange(e.target.checked)}
			/>
		</div>
	);
}
