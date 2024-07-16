export const parseItems = <T>(rawData: string): T[] => {
	const json = JSON.parse(rawData);
	if (!json.items) return [];
	return json.items;
};

export const stringifyItems = (items: unknown[]) => {
	return JSON.stringify(
		{
			items,
		},
		null,
		2
	);
};
