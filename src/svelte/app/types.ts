export interface MarkdownFileRenderData {
	name: string;
	path: string;
	tags: string[] | null;
	favorite: string | null;
	url: string | null;
	creationMillis: number;
	modifiedMillis: number;
	custom1: string | null;
	custom2: string | null;
	custom3: string | null;
}
