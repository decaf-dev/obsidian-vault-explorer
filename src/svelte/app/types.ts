export interface FileRenderData {
	id: string;
	displayName: string;
	path: string;
	basePath: string;
	extension: string;
	baseName: string;
	content: string | null;
	url: string | null;
	imageUrl: string | null;
	tags: string[] | null;
	isFavorite: boolean | null;
	createdMillis: number;
	modifiedMillis: number;
	custom1: string | null;
	custom2: string | null;
	custom3: string | null;
}
