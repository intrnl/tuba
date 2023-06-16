export type VoidFunction = (...args: any[]) => void;

export const debounce = <F extends VoidFunction>(fn: F, delay: number, leading = false) => {
	let timeout: any;

	return (...args: Parameters<F>) => {
		if (leading && !timeout) {
			fn(...args);
		}

		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay);
	};
};
