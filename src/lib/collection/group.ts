export function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
	return arr.reduce(
		(groups, item) => {
			const key = keyFn(item);
			if (!groups[key]) {
				groups[key] = [];
			}
			groups[key].push(item);
			return groups;
		},
		{} as Record<string, T[]>
	);
}
