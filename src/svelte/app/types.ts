export interface FileRenderData {
	name: string;
	path: string;
	content: string | null;
	url: string | null;
	tags: string[] | null;
	favorite: boolean | null;
	createdMillis: number;
	modifiedMillis: number;
	custom1: string | null;
	custom2: string | null;
	custom3: string | null;
}

export interface FileContent {
	path: string;
	content: string | null;
}
