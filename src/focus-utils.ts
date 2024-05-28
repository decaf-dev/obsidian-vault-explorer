export const moveFocus = (direction: "previous" | "next") => {
	const focused = document.activeElement;
	if (focused instanceof HTMLElement) {
		const root = focused.closest('.vault-explorer');
		if (!root) return;

		const inputElements = root.querySelectorAll('a, button, input, select, textarea, [role="button"], [role="link"]')
		const focusableElements = Array.from(inputElements).filter(isElementTabble);
		const currentIndex = focusableElements.indexOf(focused);

		const newIndex = direction === "previous" ? currentIndex - 1 : currentIndex + 1;
		if (newIndex >= 0 && newIndex < focusableElements.length) {
			(focusableElements[newIndex] as HTMLElement).focus();
		}
	}

	function isElementTabble(element: Element) {
		return element.getAttribute('disabled') == null && element.getAttribute('tabindex') !== '-1';
	}
}
