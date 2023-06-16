import { type ComponentProps } from 'solid-js';

const TrendingUpIcon = (props: ComponentProps<'svg'>) => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				d="m16 6l2.29 2.29l-4.88 4.88l-4-4L2 16.59L3.41 18l6-6l4 4l6.3-6.29L22 12V6z"
			/>
		</svg>
	);
};

export default TrendingUpIcon;
