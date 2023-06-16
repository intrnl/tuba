const SECOND = 1;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

const parts = [HOUR, MINUTE, SECOND];

export const format = (duration: number) => {
	let res = '';
	let first = true;

	for (let idx = 0, len = parts.length; idx < len; idx++) {
		const unit = parts[idx];

		const val = Math.floor(duration / unit);
		duration -= val * unit;

		if (first && val < 1) {
			continue;
		}

		if (first && idx === len - 1) {
			res += '0';
		}

		res && (res += ':');
		res += first || val > 9 ? val : '0' + val;
		first = false;
	}

	return res;
};
