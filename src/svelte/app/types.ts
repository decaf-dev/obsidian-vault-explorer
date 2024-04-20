import { PropertyRenderType } from "src/types";

export interface MarkdownFileRenderData {
	name: string;
	path: string;
	tags: string[] | null;
	favorite: string | null;
	url: string | null;
	custom1: string | null;
	custom2: string | null;
	custom3: string | null;
}
