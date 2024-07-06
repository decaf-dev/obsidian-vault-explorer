export const removeFrontmatterBlock = (data: string) => {
	return data.replace(/^---\n[\s\S]*?\n---/, "").trim();
}
