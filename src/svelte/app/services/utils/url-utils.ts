export const findFirstHttpsLink = (content: string) => {
	const HTTPS_REGEX = /https:\/\/[^\s]+/;
	const match = content.match(HTTPS_REGEX);
	return match ? match[0] : null;
};

export const isHttpsLink = (content: string) => {
	const HTTPS_REGEX = /https:\/\/[^\s]+$/;
	const match = content.match(HTTPS_REGEX);
	return match ? true : false;
};
