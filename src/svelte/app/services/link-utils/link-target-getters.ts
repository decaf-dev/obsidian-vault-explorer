import {
	WIKI_LINK_REGEX,
	INTERNAL_EMBED_REGEX,
	EXTERNAL_EMBED_REGEX,
} from "./constants";

export const getWikiLinkTarget = (value: string) => {
	const match = value.match(WIKI_LINK_REGEX);
	if (match) {
		return match[1];
	}
	return null;
};

export const getInternalEmbedTarget = (value: string) => {
	const match = value.match(INTERNAL_EMBED_REGEX);
	if (match) {
		return match[1];
	}
	return null;
};
export const getExternalEmbedTarget = (value: string) => {
	const match = value.match(EXTERNAL_EMBED_REGEX);
	if (match) {
		return match[2];
	}
	return null;
};
