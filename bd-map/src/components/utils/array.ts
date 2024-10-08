export function deepCopyArray(arr: any[]) {
	return JSON.parse(JSON.stringify(arr))
}
