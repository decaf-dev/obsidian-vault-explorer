import { MarkdownView } from "obsidian";
import { useAppMount } from "../app-mount-provider";
import "./styles.css";

interface Props {
	name: string;
	path: string;
}

export default function ListItem({ name, path }: Props) {
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

	return (
		<div className="vault-explorer-list-item">
			<div
				className="vault-explorer-list-item__title"
				onClick={handleTitleClick}
			>
				{name}
			</div>
		</div>
	);
}
