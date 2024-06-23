import { FolderFilterCondition } from "src/types";

export const matchFolderFilter = (
	filePath: string,
	compare: string,
	condition: FolderFilterCondition,
	options: {
		includeSubfolders: boolean;
	}
): boolean => {
	console.assert(filePath === filePath.toLowerCase(), `FolderFilter filePath "${filePath}" must be lowercase`);
	console.assert(/^\s/.test(filePath) === false, `FolderFilter filePath "${filePath}" must not contain whitespace`);
	console.assert(compare === compare.toLowerCase(), `FolderFilter compare "${compare}" must be lowercase`);
	console.assert(/\s$/.test(compare) === false, `FolderFilter compare "${compare}" must not contain whitespace`);

	if (compare === "/") {
		return true;
	}

	const { includeSubfolders } = options;

	switch (condition) {
		case FolderFilterCondition.IS:
			if (compare.length === 0) return true;
			if (includeSubfolders) return filePath.startsWith(compare);
			return filePath === compare;

		case FolderFilterCondition.IS_NOT:
			if (compare.length === 0) return true;
			if (includeSubfolders) return !filePath.startsWith(compare);
			return filePath !== compare;

		default:
			throw new Error(`FolderFilterCondition not supported: ${condition}`);
	}
};
