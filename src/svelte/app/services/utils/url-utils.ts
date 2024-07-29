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
