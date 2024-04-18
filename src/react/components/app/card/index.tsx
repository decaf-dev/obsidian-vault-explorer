import { MarkdownView, setIcon } from "obsidian";

import React from "react";

import { useAppMount } from "../../shared/app-mount-provider";
import Tag from "../../shared/tag";
import Spacer from "../../shared/spacer";
import Property from "../../shared/property";

import "./styles.css";
import IconButton from "../../shared/icon-button";

interface Props {
	name: string;
	path: string;
	url: string | null;
	tags: string[] | null;
	source: string | null;
	status: string | null;
}

export default function Card({ name, path, url, tags, source, status }: Props) {
	const { app } = useAppMount();

	function handleTitleClick() {
		const leaves = app.workspace.getLeavesOfType("markdown");
		const leaf = leaves.find((leaf) => {
			return ((leaf.view as MarkdownView).file?.path ?? "") === path;
		});

		if (leaf) {
			app.workspace.setActiveLeaf(leaf);
		} else {
			app.workspace.openLinkText(path, "vault-explorer");
		}
	}

	function handleUrlClick() {
		if (url != null) {
			window.open(url, "_blank");
		}
	}

	return (
		<div className="vault-explorer-card">
			<div className="vault-explorer-card__header">
				<div
					className="vault-explorer-card__title"
					onClick={handleTitleClick}
				>
					{name}
				</div>
				{url !== null && (
					<IconButton
						iconId="external-link"
						onClick={handleUrlClick}
					/>
				)}
			</div>
			<Spacer size="md" />
			<div className="vault-explorer-card__content">
				{tags && (
					<div className="vault-explorer-card__tags">
						{tags.map((tag) => (
							<Tag key={tag} name={tag} />
						))}
					</div>
				)}
				{source !== null && <Property name="source" value={source} />}
				<div className="vault-explorer-card__labels">
					{status !== null && (
						<div>
							<Property name="status" value={status} />
							<Spacer size="xs" />
							<div className="vault-explorer-property-label">
								Status
							</div>
						</div>
					)}
					{/* <Spacer size="xs" direction="horizontal" />
					{revision !== null && (
						<div>
							<Property name="revision" value={revision} />
							<Spacer size="xs" />
							<div className="vault-explorer-property-label">
								Revision
							</div>
						</div>
					)} */}
				</div>
			</div>
		</div>
	);
}
