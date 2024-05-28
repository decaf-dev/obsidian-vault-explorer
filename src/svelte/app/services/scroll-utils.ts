/**'
 * Gets the amount for the container to scroll in a given direction
 * 
 * Alogrithm:
 * If the item is overflowing the container, then scroll to the right until the item is fully visible.
 * If the distance to scroll is less than the scroll threshold, then scroll to the right one more item
 * 
 * @param containerRef - The container element that contains the items to scroll
 * @param className - The class name of the items to scroll
 * @param direction - The direction to scroll. Either "left" or "right"
 * @param buttonSize - The size of the scroll buttons. This value should be constant
 * @returns 
 */

export const getScrollAmount = (
	containerRef: HTMLElement,
	className: string,
	direction: "left" | "right",
	buttonSize: number
) => {
	const MIN_SCROLL_AMOUNT = 50;

	const items = containerRef.querySelectorAll(className);
	let scrollAmount = 0;

	if (direction === "right") {
		for (let i = 0; i < items.length; i++) {
			const item = items[i] as HTMLElement;
			const itemRight = getItemRight(item);
			const containerRight =
				containerRef.scrollLeft + containerRef.clientWidth - buttonSize;

			if (itemRight > containerRight) {
				let diff = itemRight - containerRight;
				if (diff < MIN_SCROLL_AMOUNT) {
					if (i < items.length - 1) {
						const nextItem = items[i + 1] as HTMLElement;
						const nextItemRight = getItemRight(nextItem);
						diff = nextItemRight - containerRight;
					}
				}
				scrollAmount = diff;
				break;
			}
		}
	} else if (direction === "left") {
		for (let i = items.length - 1; i >= 0; i--) {
			const item = items[i] as HTMLElement;
			const itemLeft = item.offsetLeft;
			const containerLeft = containerRef.scrollLeft + buttonSize;

			if (itemLeft < containerLeft) {
				let diff = containerLeft - itemLeft;
				if (diff < MIN_SCROLL_AMOUNT) {
					if (i > 0) {
						const nextItem = items[i - 1] as HTMLElement;
						const nextItemLeft = getItemLeft(nextItem);
						diff = containerLeft - nextItemLeft;
					}
				}
				scrollAmount = diff;
				break;
			}
		}
	}
	return scrollAmount;
}

const getItemRight = (item: HTMLElement) => item.offsetLeft + item.clientWidth;
const getItemLeft = (item: HTMLElement) => item.offsetLeft;
