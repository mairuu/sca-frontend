import { listChapters } from '$lib/api/endpoints/chapter';
import { listMangaReads } from '$lib/api/endpoints/history';
import { buildFetcher } from '$lib/auth/fetcher';
import { apiBase } from '$lib/config';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const fetcher = buildFetcher(fetch);

	const a = listChapters(apiBase, fetcher, {
		filter: {
			manga_ids: [params.id]
		},
		paging: {
			page: 1,
			page_size: 10000 // virtually no limit, we just want to get all chapters for the manga
		},
		orders: [{ field: 'number', direction: 'desc' }]
	});

	const b = listMangaReads(apiBase, fetcher, params.id);

	const [chapters, reads] = await Promise.all([a, b]);

	return {
		chapters: chapters.items,
		totalChapters: chapters.pagination.total_items,
		reads: reads.items
	};
};
