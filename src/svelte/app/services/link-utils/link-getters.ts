import {
	EXTERNAL_EMBED_REGEX as EXTERNAL_EMBED_REGEX,
	INTERNAL_EMBED_REGEX,
} from "./constants";

export const getFirstInternalEmbed = (content: string) => {
	const match = content.match(INTERNAL_EMBED_REGEX);
	if (match) {
		return match[0];
	}
	return null;
};

export const getFirstExternalEmbed = (content: string) => {
	const match = content.match(EXTERNAL_EMBED_REGEX);
	if (match) {
		return match[0];
	}
	return null;
};
