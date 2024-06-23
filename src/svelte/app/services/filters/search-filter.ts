import { FileRenderData } from "../../types";

export const filterBySearch = (file: FileRenderData, search: string) => {
	if (search === "") {
		return true;
	}

	search = search.toLowerCase().trim();

	const { name, tags, path, custom1, custom2, custom3 } = file;

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

	if (custom1 !== null && custom1.toLowerCase().includes(search)) {
		return true;
	}

	if (custom2 !== null && custom2.toLowerCase().includes(search)) {
		return true;
	}

	if (custom3 !== null && custom3.toLowerCase().includes(search)) {
		return true;
	}

	return false;
}
