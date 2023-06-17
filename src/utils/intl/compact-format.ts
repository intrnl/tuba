const formatter = new Intl.NumberFormat('en-US', {
	notation: 'compact',
});

export const format = (value: number, neg = false) => {
	if (neg && value < 0) {
		return 'N/A';
	}
	if (value < 1_000) {
		return '' + value;
	}

	return formatter.format(value);
};
