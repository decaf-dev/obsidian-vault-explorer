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

	//TODO handle /

	switch (condition) {
		case FolderFilterCondition.IS:
			if (compare.length === 0) return true;
			return folderName === compare;

		case FolderFilterCondition.IS_NOT:
			if (compare.length === 0) return true;
			return folderName !== compare;

		default:
			throw new Error(`FolderFilterCondition not supported: ${condition}`);
	}
};
