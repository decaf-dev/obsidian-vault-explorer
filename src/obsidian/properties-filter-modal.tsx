import { Modal } from "obsidian";
import { Root, createRoot } from "react-dom/client";

export default class PropertiesFilterModal extends Modal {
	root: Root;

	onOpen(): void {
		const { contentEl } = this;
		// const modalTitleEl = containerEl.querySelector(".modal-title");
		// modalTitleEl?.createEl("h5", { text: "Properties Filter" });

		const root = createRoot(contentEl);
		root.render(<div>Properties Filter </div>);
		this.root = root;
	}

	onClose(): void {
		const { contentEl } = this;
		this.root.unmount();
		contentEl.empty();
	}
}
