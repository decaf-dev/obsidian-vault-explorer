import { FileRenderData } from "../../types";

//TODO add tests
export const filterBySearch = (file: FileRenderData, value: string) => {
	if (value === "") {
		return true;
	}

	const compare = value.toLowerCase().trim();

	const { name, tags, path, content, custom1, custom2, custom3 } = file;

	if (name.toLowerCase().includes(compare)) {
		return true;
	}


	if (path.toLowerCase().includes(compare)) {
		return true;
	}

	//TODO should this include the frontmatter?
	if (content !== null && content.toLowerCase().includes(compare)) {
		return true;
	}

	if (
		tags !== null && tags.some((tag) =>
			tag.toLowerCase().includes(compare)
		)
	) {
		return true;
	}

	if (custom1 !== null && custom1.toLowerCase().includes(compare)) {
		return true;
	}

	if (custom2 !== null && custom2.toLowerCase().includes(compare)) {
		return true;
	}

	if (custom3 !== null && custom3.toLowerCase().includes(compare)) {
		return true;
	}

	return false;
}
