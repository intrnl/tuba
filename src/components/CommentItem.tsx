import { Show, createEffect, createSignal } from 'solid-js';

import { sanitize } from '@intrnl/dom-sanitize';

import { type Comment } from '~/api/types.ts';

import BodyRenderer, { sanitizeOptions } from '~/components/BodyRenderer.tsx';

export interface CommentItemProps {
	item: Comment;
	small?: boolean;
}

const enum ReadState {
	INITIAL,
	HIDDEN,
	VISIBLE,
}

const CommentItem = (props: CommentItemProps) => {
	let bodyEl: HTMLDivElement | undefined;

	const [state, setState] = createSignal(ReadState.INITIAL);

	const item = () => props.item;
	const small = () => props.small;

	createEffect(() => {
		const text = item().commentText;

		if ((bodyEl! as any).$text === text) {
			return;
		}

		if (state() !== ReadState.INITIAL) {
			setState(ReadState.INITIAL);
			return;
		}

		const sanitized = sanitize(text, sanitizeOptions);

		bodyEl!.innerHTML = '';
		bodyEl!.appendChild(sanitized);

		(bodyEl! as any).$text = text;

		if (bodyEl!.scrollHeight > bodyEl!.clientHeight) {
			setState(ReadState.HIDDEN);
		}
	});

	return (
		<div class="flex px-4 py-3" classList={{ 'gap-3': small(), 'gap-4': !small() }}>
			<div class="shrink-0">
				<img
					src={item().thumbnail}
					class="rounded-full"
					classList={{ 'h-6 w-6': small(), 'h-12 w-12': !small() }}
				/>
			</div>
			<div class="min-w-0 grow">
				<div class="mb-0.5 flex items-center text-sm">
					<span class="line-clamp-1 break-all font-medium">{item().author}</span>
				</div>
				<div
					ref={bodyEl}
					class="whitespace-pre-wrap break-words text-sm"
					classList={{ 'line-clamp-4': state() !== ReadState.VISIBLE }}
				/>

				<Show when={state() >= ReadState.HIDDEN}>
					<button
						onClick={() => setState(state() === ReadState.HIDDEN ? ReadState.VISIBLE : ReadState.HIDDEN)}
						class="mt-1 text-sm font-medium text-muted-fg hover:underline"
					>
						{state() === ReadState.HIDDEN ? 'Show more' : 'Show less'}
					</button>
				</Show>
			</div>
		</div>
	);
};

export default CommentItem;
