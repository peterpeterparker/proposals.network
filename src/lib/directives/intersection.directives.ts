export interface IntersectingDetail {
	intersecting: boolean;
}

const dispatchIntersecting = ({
	element,
	intersecting
}: {
	element: HTMLElement;
	intersecting: boolean;
}) => {
	const $event = new CustomEvent<IntersectingDetail>('pnwrkIntersecting', {
		detail: { intersecting },
		bubbles: false
	});
	element.dispatchEvent($event);
};

export const onIntersectionCell = (element: HTMLElement) =>
	onIntersection({ element, rootMargin: '0px', threshold: 0.01 });

export const onIntersectionTitle = (element: HTMLElement) =>
	onIntersection({ element, rootMargin: '120px 0px', threshold: 0.7 });

const onIntersection = ({
	element,
	rootMargin,
	threshold
}: {
	element: HTMLElement;
	rootMargin: string;
	threshold: number;
}) => {
	// IntersectionObserverInit is not recognized by the linter

	const options: IntersectionObserverInit = {
		threshold,
		rootMargin
	};

	const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
		const intersecting: boolean =
			entries.find(({ isIntersecting }: IntersectionObserverEntry) => isIntersecting) !== undefined;

		dispatchIntersecting({ element, intersecting });
	};

	const observer: IntersectionObserver = new IntersectionObserver(intersectionCallback, options);

	observer.observe(element);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
