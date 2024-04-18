import { setIcon } from "obsidian";
import React from "react";

interface Props {
	ariaLabel?: string;
	//This is the lucid icon id
	iconId: string;
	onClick: (e: React.MouseEvent) => void;
}

export default function IconButton({ ariaLabel, iconId, onClick }: Props) {
	const iconRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (iconRef.current) {
			setIcon(iconRef.current, iconId);
		}
	}, []);

	return (
		<div
			aria-label={ariaLabel}
			className="clickable-icon"
			ref={iconRef}
			onClick={onClick}
		></div>
	);
}
