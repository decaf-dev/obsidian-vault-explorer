import Logger from "js-logger";

export const getIconIdForFile = (baseName: string, extension: string) => {
	if (baseName.endsWith(".excalidraw")) {
		return "excalidraw-icon";
	}

	switch (extension) {
		case "md":
			return "file";
		case "canvas":
			return "layout-dashboard";
		case "zip":
			return "file-archive";
		case "png":
		case "jpg":
		case "jpeg":
		case "gif":
		case "webp":
		case "svg":
		case "avif":
		case "bmp":
			return "file-image";
		case "mp3":
		case "wav":
		case "aac":
		case "flac":
		case "ogg":
		case "wma":
		case "alac":
		case "aiff":
			return "file-audio";
		case "mp4":
		case "avi":
		case "mkv":
		case "mov":
		case "wmv":
		case "flv":
		case "webm":
		case "mpeg":
		case "m4v":
		case "3gp":
			return "file-video";
		case "xls":
		case "xlsx":
			return "file-spreadsheet";
		case "xml":
		case "json":
			return "file-code";
		case "ppt":
		case "pptx":
			return "images";
		case "doc":
		case "docx":
			return "file-type";
		case "pdf":
		case "txt":
			return "file-text";
		default:
			Logger.warn(`No icon found for file extension: ${extension}`);
			return "file";
	}
};
