import {
	INTERNAL_EMBED_REGEX,
	EXTERNAL_EMBED_REGEX,
	URL_REGEX,
	WIKI_LINK_REGEX,
} from "./constants";

export const isInternalEmbed = (value: string) => {
	return INTERNAL_EMBED_REGEX.test(value);
};

export const isExternalEmbed = (value: string) => {
	return EXTERNAL_EMBED_REGEX.test(value);
};

export const isUrl = (content: string) => {
	return URL_REGEX.test(content);
};

export const isWikiLink = (value: string) => {
	return WIKI_LINK_REGEX.test(value);
};
