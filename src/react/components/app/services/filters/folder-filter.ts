import { TFile } from "obsidian";

export const filterByFolder = (file: TFile, folderPath: string) => {
	if (folderPath === "/") {
		return true;
	} else if (folderPath) {
		return file.path.startsWith(folderPath);
	}
	return false;
}
