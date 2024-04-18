import React from "react";
import { useTabs } from "../tab-list";
import "./styles.css";

interface Props {
	index?: number;
	children: React.ReactNode;
	onClick: (e: React.MouseEvent) => void;
}

export default function Tab({ index, children, onClick }: Props) {
	if (index === undefined) {
		throw new Error("Tab component must have an index prop");
	}

	const tabContext = useTabs();
	const { activeIndex, setActiveIndex } = tabContext;

	function handleClick(e: React.MouseEvent) {
		if (index === undefined) return;

		setActiveIndex(index);
		onClick(e);
	}

	let className = "vault-explorer-tab";
	if (activeIndex === index) {
		className += " vault-explorer-tab--active";
	}

	return (
		<div className={className} onClick={handleClick}>
			{children}
		</div>
	);
}
