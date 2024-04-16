export interface MarkdownFileData {
	name: string,
	path: string,
	tags: string[],
	source: string | null,
	favorite: string | null,
	url: string | null
	revision: string | null,
	status: string | null
}
