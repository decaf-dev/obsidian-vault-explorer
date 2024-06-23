import { FileNameFilterCondition } from "src/types";

export const matchFileNameFilter = (
	fileName: string,
	compare: string,
	condition: FileNameFilterCondition,
): boolean => {
	console.assert(fileName === fileName.toLowerCase(), `FileNameFilter fileName "${fileName}" must be lowercase`);
	console.assert(/^\s/.test(fileName) === false, `FileNameFilter fileName "${fileName}" must not contain whitespace`);

	console.assert(compare === compare.toLowerCase(), `FileNameFilter compare "${compare}" must be lowercase`);
	console.assert(/\s$/.test(compare) === false, `FileNameFilter compare "${compare}" must not contain whitespace`);

	switch (condition) {
		case FileNameFilterCondition.IS:
			if (compare.length === 0) return true;
			return fileName === compare;

		case FileNameFilterCondition.IS_NOT:
			if (compare.length === 0) return true;
			return fileName !== compare;

		case FileNameFilterCondition.CONTAINS:
			return fileName.includes(compare);

		case FileNameFilterCondition.DOES_NOT_CONTAIN:
			return !fileName.includes(compare);

		case FileNameFilterCondition.STARTS_WITH:
			return fileName.startsWith(compare);

		case FileNameFilterCondition.ENDS_WITH:
			return fileName.endsWith(compare);

		default:
			throw new Error(`FileNameFilterCondition not supported: ${condition}`);
	}
};
