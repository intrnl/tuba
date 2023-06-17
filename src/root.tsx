import { MetaProvider, Title } from '@solidjs/meta';
import { Outlet } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
		},
	},
});

const Root = () => {
	return (
		<MetaProvider>
			<Title>Tuba</Title>

			<QueryClientProvider client={queryClient}>
				<Outlet />
			</QueryClientProvider>
		</MetaProvider>
	);
};

export default Root;
