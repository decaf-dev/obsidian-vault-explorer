export interface MarkdownFileRenderData {
	name: string;
	path: string;
	tags: string[] | null;
	source: string | null;
	favorite: string | null;
	url: string | null;
	status: string | null;
}
