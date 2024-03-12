import { MarkdownView, setIcon } from "obsidian";

import React from "react";

import { useAppMount } from "../AppMountProvider";
import Tag from "../tag";
import Spacer from "../spacer";

import "./styles.css";

interface Props {
	name: string;
	path: string;
	url: string | null;
	tags: string[];
	source: string | null;
}

export default function Card({ name, path, url, tags, source }: Props) {
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

	function handleSourceClick() {
		const searchPlugin = (app as any).internalPlugins.plugins[
			"global-search"
		];
		if (searchPlugin) {
			searchPlugin.instance.openGlobalSearch(`["source":${source}`);
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
						aria-label="Open link"
						className="clickable-icon"
						ref={urlIconRef}
						onClick={handleUrlClick}
					>
						{url}
					</div>
				)}
			</div>
			<Spacer size="md" />
			<div className="frontmatter-view-card__tags">
				{tags.map((tag) => (
					<Tag key={tag} name={tag} />
				))}
			</div>
			{source !== null && (
				<>
					<Spacer size="sm" />
					<a
						// href={`["${source}"]`}
						className="tag frontmatter-view-card__source"
						target="_blank"
						rel="noopener"
						onClick={handleSourceClick}
					>
						{source}
					</a>
				</>
			)}
		</div>
	);
}
