import { type SanitizeOptions, DEFAULT_OPTIONS, sanitize } from '@intrnl/dom-sanitize';

export const sanitizeOptions: SanitizeOptions = {
	...DEFAULT_OPTIONS,
	setAttributes: {
		...DEFAULT_OPTIONS.setAttributes,
		a: {
			...DEFAULT_OPTIONS.setAttributes?.a,
			class: 'text-accent hover:underline',
		},
	},
};

export interface BodyRendererProps {
	text: string;
}

const BodyRenderer = (props: BodyRendererProps) => {
	return (
		<>
			{(() => {
				const sanitized = sanitize(props.text, sanitizeOptions);

				return sanitized;
			})()}
		</>
	);
};

export default BodyRenderer;
