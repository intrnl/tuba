import { type VideoItem } from '~/api/types.ts';

import { A } from '~/router.ts';
import * as CompactFormat from '~/utils/intl/compact-format.ts';

export interface VideoItemShortProps {
	item: VideoItem;
}

export const createShortVideoKey = (item: VideoItem, cols: number) => {
	return `${item.url.slice(9)}:${cols}`;
};

const VideoItemShort = (props: VideoItemShortProps) => {
	const item = () => props.item;

	return (
		<A href="/watch/:video" params={{ video: item().url.slice(9) }} class="relative block aspect-[9/16]">
			<img src={item().thumbnail} class="h-full w-full object-cover" />
			<div class="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-2">
				<p class="text-shadow-img line-clamp-3 break-words text-sm font-medium text-white">{item().title}</p>
				<p class="text-shadow-img mt-1 text-xs text-white">{CompactFormat.format(item().views)} views</p>
			</div>
		</A>
	);
};

export default VideoItemShort;
