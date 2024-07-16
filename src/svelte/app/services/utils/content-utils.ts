export const removeFrontmatter = (content: string) => {
	return content.replace(/^---\n[\s\S]*?\n---/, "");
};

export const removeEmptyLines = (content: string) => {
	const emptyLineRegex = /^\s*[\r\n]/gm;
	return content.replace(emptyLineRegex, "");
};

export const removeNewLineCharacters = (content: string) => {
	return content.replace(/\n/g, " ");
};

export const removeMarkdownHashes = (content: string) => {
	// Regular expression to match Markdown headers
	const headerRegex = /^(#{1,6})\s*(.*)$/gm;

	// Replace headers with the text without the hashes
	return content.replace(headerRegex, (_match, _hashes, text) => `${text}`);
};

export const removeLevel1Headers = (content: string) => {
	const header1Regex = /^#\s.*$/gm;
	return content.replace(header1Regex, "");
};

export const removeItalicsMarkdown = (content: string) => {
	// Regular expression to match bold formatting
	const italicRegex = /\*(.*?)\*/g;
	// Remove bold and italic formatting
	return content.replace(italicRegex, "$1");
};

export const removeBoldMarkdown = (content: string) => {
	// Regular expression to match bold formatting
	const boldRegex = /\*\*(.*?)\*\*/g;
	// Remove bold and italic formatting
	return content.replace(boldRegex, "$1");
};

export const removeMarkdownHighlight = (content: string) => {
	const highlightRegex = /==(.*?)==/g;
	return content.replace(highlightRegex, "$1");
};

export const removeCodeBlocks = (content: string) => {
	const codeBlockRegex = /```[\s\S]*?```/g;
	return content.replace(codeBlockRegex, "");
};

export const removeMarkdownTables = (content: string) => {
	const tableRegex = /\|.*\n\|[-:| ]+\n(\|.*\n)*/g;
	return content.replace(tableRegex, "");
};

export const removeWikiLinks = (content: string) => {
	const wikiLinkRegex = /\[\[(.*?)\]\]/g;
	return content.replace(wikiLinkRegex, "$1");
};
