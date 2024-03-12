import { MarkdownEditView, MarkdownView, setIcon } from "obsidian";
import { useAppMount } from "../AppMountProvider";
import Tag from "../tag";

import "./styles.css";
import React from "react";

interface Props {
	name: string;
	path: string;
	url: string | null;
	tags: string[];
}

export default function Card({ name, path, url, tags }: Props) {
	const { app } = useAppMount();
	const urlIconRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (urlIconRef.current) {
			setIcon(urlIconRef.current, "external-link");
		}
	}, []);

	function handleTitleClick() {
		const leaves = app.workspace.getLeavesOfType("markdown");
		const leaf = leaves.find((leaf) => {
			return ((leaf.view as MarkdownView).file?.path ?? "") === path;
		});
		if (leaf) {
			app.workspace.setActiveLeaf(leaf);
		} else {
			app.workspace.openLinkText(path, "frontmatter-view");
		}
	}

	function handleUrlClick() {
		if (url != null) {
			window.open(url, "_blank");
		}
	}

	return (
		<div className="frontmatter-view-card">
			<div className="frontmatter-view-card__header">
				<div
					className="frontmatter-view-card__title"
					onClick={handleTitleClick}
				>
					{name}
				</div>
				{url !== null && (
					<div
						className="clickable-icon"
						ref={urlIconRef}
						onClick={handleUrlClick}
					>
						{url}
					</div>
				)}
			</div>
			<div className="frontmatter-view-card__tags">
				{tags.map((tag) => (
					<Tag key={tag} name={tag} />
				))}
			</div>
		</div>
	);
}
