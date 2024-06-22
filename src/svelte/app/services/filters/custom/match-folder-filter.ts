import { FolderFilterCondition } from "src/types";

export const matchFolderFilter = (
	folderName: string,
	compare: string,
	condition: FolderFilterCondition,
): boolean => {
	console.assert(folderName === folderName.toLowerCase(), `FolderFilter folderName "${folderName}" must be lowercase`);
	console.assert(compare === compare.toLowerCase(), `FolderFilter compare "${compare}" must be lowercase`);
	console.assert(/^\s/.test(compare) === false, `FolderFilter compare "${compare}" must not contain whitespace`);
	console.assert(/\s$/.test(compare) === false, `FolderFilter compare "${compare}" must not contain whitespace`);

	switch (condition) {
		case FolderFilterCondition.IS:
			if (compare.length === 0) return true;
			return compare === compare;

		case FolderFilterCondition.IS_NOT:
			if (compare.length === 0) return true;
			return compare !== compare;

		case FolderFilterCondition.CONTAINS:
			return folderName.includes(compare);

		case FolderFilterCondition.DOES_NOT_CONTAIN:
			return !folderName.includes(compare);

		case FolderFilterCondition.STARTS_WITH:
			return folderName.startsWith(compare);

		case FolderFilterCondition.ENDS_WITH:
			return folderName.endsWith(compare);

		default:
			throw new Error(`FolderFilterCondition not supported: ${condition}`);
	}
};
