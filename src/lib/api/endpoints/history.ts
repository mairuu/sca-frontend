import { applyParams, unwrappedApi, type Fetch, type Paged, type PagingQuery } from '../api';

export type RecentRead = {
	manga_id: string;
	manga_title: string;
	cover_object_name: string;
	chapter_id: string;
	chapter_title: string;
	chapter_number: number;
	progress: number;
	read_at: string;
};

export type RecentReadQuery = {
	paging?: PagingQuery;
};

export type MangaRead = {
	chapter_id: string;
	progress: number;
	read_at: string;
};

export async function listRecentReads(
	apiBase: string,
	fetcher: Fetch,
	query?: RecentReadQuery,
	signal?: AbortSignal
): Promise<Paged<RecentRead>> {
	const url = new URL(`${apiBase}/my/history`);
	applyParams(url.searchParams, query?.paging);
	return unwrappedApi(fetcher, url, {
		method: 'GET',
		signal
	});
}

export async function listMangaReads(
	apiBase: string,
	fetcher: Fetch,
	mangaId: string,
	signal?: AbortSignal
): Promise<Paged<MangaRead>> {
	const url = `${apiBase}/my/history/manga/${mangaId}?page=1&page_size=10000`;
	return unwrappedApi(fetcher, url, {
		method: 'GET',
		signal
	});
}

export type ChapterProgress = {
	id: string;
	progress: number;
};

export async function markChaptersRead(
	apiBase: string,
	fetcher: Fetch,
	chapters: ChapterProgress[],
	signal?: AbortSignal
) {
	const url = `${apiBase}/my/history`;
	return unwrappedApi(fetcher, url, {
		method: 'PUT',
		body: JSON.stringify({ chapters }),
		headers: {
			'Content-Type': 'application/json'
		},
		signal
	});
}

export async function unmarkChaptersRead(
	apiBase: string,
	fetcher: Fetch,
	chapterIds: string[],
	signal?: AbortSignal
) {
	const url = `${apiBase}/my/history`;
	return unwrappedApi(fetcher, url, {
		method: 'DELETE',
		body: JSON.stringify({ chapter_ids: chapterIds }),
		headers: {
			'Content-Type': 'application/json'
		},
		signal
	});
}
