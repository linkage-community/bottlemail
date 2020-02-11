function last<T>(a: T[]) {
	return a[a.length - 1]
}
export function groupBy<T>(
	a: T[],
	fn: (l: T, r: T) => boolean = (a: T, b: T) => a === b,
	acc: T[][] = []
) {
	a.forEach(e => {
		if (acc.length === 0 || !fn(last(last(acc)), e)) return acc.push([e])
		return last(acc).push(e)
	})
	return acc
}
