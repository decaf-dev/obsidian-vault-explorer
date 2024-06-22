import { ContentFilterCondition } from "src/types";

export const matchContentFilter = (
	content: string,
	compare: string,
	condition: ContentFilterCondition,
): boolean => {
	switch (condition) {
		case ContentFilterCondition.CONTAINS:
			return content.includes(compare);

		case ContentFilterCondition.DOES_NOT_CONTAIN:
			return !content.includes(compare);

		default:
			throw new Error(`ContentFilterCondition not supported: ${condition}`);
	}
};
