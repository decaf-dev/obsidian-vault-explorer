const ellipsisVertical = (className: string) =>
	`<svg class="${className}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`;

export const getSvgData = (iconId: string, className: string) => {
	switch (iconId) {
		case "ellipsis-vertical":
			return ellipsisVertical(className);
		default:
			return "";
	}
};
