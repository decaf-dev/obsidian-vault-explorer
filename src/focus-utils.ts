export const moveFocus = (direction: "previous" | "next") => {
	const focusedEl = document.activeElement;
	if (focusedEl instanceof HTMLElement) {
		const rootEl = focusedEl.closest('.vault-explorer');
		if (!rootEl) return;

		const inputEls = rootEl.querySelectorAll('a, button, input, select, textarea, [role="button"], [role="link"]')
		const focusableEls = Array.from(inputEls).filter(isElementTabble);
		const currentIndex = focusableEls.indexOf(focusedEl);

		const newIndex = direction === "previous" ? currentIndex - 1 : currentIndex + 1;
		if (newIndex >= 0 && newIndex < focusableEls.length) {
			(focusableEls[newIndex] as HTMLElement).focus();
		} else if (newIndex > focusableEls.length - 1) {
			(focusableEls[0] as HTMLElement).focus();
		} else if (newIndex < 0) {
			(focusableEls[focusableEls.length - 1] as HTMLElement).focus();
		}
	}

	function isElementTabble(element: Element) {
		return element.getAttribute('disabled') == null && element.getAttribute('tabindex') !== '-1';
	}
}
