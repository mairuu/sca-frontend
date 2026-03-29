<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { listRecentReads, type RecentRead } from '$lib/api/endpoints/history';
	import { buildFetcher } from '$lib/auth/fetcher';
	import { resolveThumbnailUrl } from '$lib/cdn';
	import { groupBy } from '$lib/collection/group';
	import { apiBase } from '$lib/config';
	import { createPagination } from '$lib/pagination/pagination.svelte';
	import History from '@lucide/svelte/icons/history';
	import { onMount } from 'svelte';

	const fetcher = buildFetcher(fetch);

	const pg = createPagination((page, pageSize) =>
		listRecentReads(apiBase, fetcher, { paging: { page, page_size: pageSize } })
	);

	const readBySameDay = $derived(
		Object.entries(groupBy(pg.items, (recentRead) => formatDate(recentRead.read_at)))
	);

	onMount(() => {
		pg.load();
	});

	function continueReading(chapter: RecentRead) {
		goto(resolve('/(app)/chapter/[id]', { id: chapter.chapter_id }), {
			state: { readProgress: chapter.progress }
		});
	}

	const dateFormatter = new Intl.DateTimeFormat(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		return dateFormatter.format(date);
	}

	const timeFormatter = new Intl.DateTimeFormat(undefined, {
		hour: '2-digit',
		minute: '2-digit'
	});

	function formatTime(timestamp: string) {
		const date = new Date(timestamp);
		return timeFormatter.format(date);
	}
</script>

<div class="sticky top-0 z-50">
	<div class="absolute inset-0 bg-base-100"></div>
	<div class="relative container mx-auto flex h-14 items-center gap-2 px-4">
		<h1 class="text-lg font-bold">Reading History</h1>
	</div>
</div>

{#if pg.loading}
	<div class="container mx-auto mt-4 flex items-center gap-2 px-4">
		<div class="loading loading-spinner"></div>
		Loading...
	</div>
{:else if pg.isEmpty}
	<div class="container mx-auto mt-4 flex items-center gap-2 px-4">
		<History class="h-6 w-6" />
		No recent reads.
	</div>
{:else}
	<ul class="container mx-auto mt-4 flex flex-col gap-4 px-4">
		{#each readBySameDay as [date, reads] (date)}
			<div class="divider">{date}</div>

			{#each reads as read (read.chapter_id)}
				<div class="flex">
					<div class="relative flex flex-1 gap-x-3">
						<a
							href={resolve('/(app)/manga/[id]', { id: read.manga_id })}
							title={read.manga_title}
							class="shrink-0"
						>
							<img
								alt=""
								src={resolveThumbnailUrl(read.cover_object_name)}
								class="block aspect-2/3 w-16 rounded-md object-cover object-top"
							/>
						</a>

						<a
							href={resolve('/(app)/chapter/[id]', { id: read.chapter_id })}
							title="{read.manga_title} Ch.{0} - {read.chapter_title}"
							onclick={(e) => {
								e.preventDefault();
								continueReading(read);
							}}
							class="flex h-full flex-1 flex-col justify-center text-sm"
						>
							<span class="line-clamp-2">
								{read.manga_title}
							</span>
							<span class="block pt-1 text-base-content/60">
								Ch. {read.chapter_number} - {formatTime(read.read_at)}
							</span>
						</a>
					</div>
				</div>
			{/each}
		{/each}
	</ul>
	<div class="container mx-auto mt-4 flex items-center justify-center gap-2 px-4">
		<button class="btn" onclick={() => pg.prev()} disabled={!pg.canPrev}> Previous </button>
		<!-- <span>Page {pg}</span> -->
		<button class="btn" onclick={() => pg.next()} disabled={!pg.canNext}> Next </button>
	</div>
{/if}
