export const findFirstHttpsLink = (content: string) => {
	const HTTPS_REGEX = /https:\/\/[^\s]+/;
	const match = content.match(HTTPS_REGEX);
	return match ? match[0] : null;
};

export const isHttpsLink = (content: string) => {
	const HTTPS_REGEX = /^https:\/\/[^\s]+$/;
	const match = content.match(HTTPS_REGEX);
	return match ? true : false;
};

export const getDomainFromUrl = (url: string) => {
	try {
		const parsedUrl = new URL(url);

		let hostname = parsedUrl.hostname;
		if (hostname.startsWith("www.")) {
			hostname = hostname.substring(4);
		}
		return hostname;
	} catch (error) {
		return "Invalid URL";
	}
};
