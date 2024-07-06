import { FileRenderData } from "../../types";

//TODO add tests
export const filterBySearch = (file: FileRenderData, value: string) => {
	if (value === "") {
		return true;
	}

	const compare = value.toLowerCase().trim();

	const { displayName, path, content } = file;

	if (displayName.toLowerCase().includes(compare)) {
		return true;
	}

	if (path.toLowerCase().includes(compare)) {
		return true;
	}

	if (content !== null && content.toLowerCase().includes(compare)) {
		return true;
	}

	return false;
};
