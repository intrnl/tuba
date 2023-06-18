import { createQuery } from '@tanstack/solid-query';

import { requestKey, requestNextpage } from '~/api/request.ts';
import { type Comments } from '~/api/types.ts';

import { useParams } from '~/router.ts';

const WatchVideoCommentsPage = () => {
	const params = useParams('/watch/:video/comments');

	const query = createQuery({
		queryKey: () => requestKey(['nextpage', 'comments', params.video]),
		queryFn: requestNextpage<Comments>,
		getNextPageParam: (last) => last.nextpage,
		meta: {
			nextpage: true,
		},
	});

	return (
		<>
			<div class="sticky top-0 z-10 flex h-13 items-center border-b border-divider bg-background px-4">
				<p class="text-base font-bold leading-5">Comments</p>
			</div>
		</>
	);
};

export default WatchVideoCommentsPage;
