import { MarkdownFileRenderData } from "../../types";

export const filterBySearch = (file: MarkdownFileRenderData, search: string) => {
	if (search === "") {
		return true;
	}

	search = search.toLowerCase().trim();

	const { name, tags, path, status, source } = file;

	if (name.toLowerCase().includes(search)) {
		return true;
	}

	if (
		tags !== null && tags.some((tag) =>
			tag.toLowerCase().includes(search)
		)
	) {
		return true;
	}

	if (path.toLowerCase().includes(search)) {
		return true;
	}

	if (
		source !== null &&
		source.toLowerCase().includes(search)
	) {
		return true;
	}

	if (
		status !== null &&
		status.toLowerCase().includes(search)
	) {
		return true;
	}

	return false;
}
