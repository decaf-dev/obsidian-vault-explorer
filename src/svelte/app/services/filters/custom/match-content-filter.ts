import { ContentFilterCondition } from "src/types";

export const matchContentFilter = (
	content: string,
	compare: string,
	condition: ContentFilterCondition,
): boolean => {
	console.assert(content === content.toLowerCase(), `ContentFilter content "${content}" must be lowercase`);
	console.assert(/^\s/.test(content) === false, `ContentFilter content "${content}" must not contain whitespace`);
	console.assert(compare === compare.toLowerCase(), `ContentFilter compare "${compare}" must be lowercase`);
	console.assert(/\s$/.test(compare) === false, `ContentFilter compare "${compare}" must not contain whitespace`);

	switch (condition) {
		case ContentFilterCondition.CONTAINS:
			return content.includes(compare);

		case ContentFilterCondition.DOES_NOT_CONTAIN:
			return !content.includes(compare);

		case ContentFilterCondition.IS_EMPTY:
			return content === "";

		case ContentFilterCondition.IS_NOT_EMPTY:
			return content !== "";

		default:
			throw new Error(`ContentFilterCondition not supported: ${condition}`);
	}
};
