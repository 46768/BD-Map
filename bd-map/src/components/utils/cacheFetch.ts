
/**
 * Fetch the url and cache it to sessionStorage
 * @param {String} url - string of the url to fetch
 * @param {Function} postFetchFn - post processing function after fetching but before caching, function is given data as text
*/
export default function cacheFetch(url: string, postFetchFn?: Function) {
	const postProcessor: Function = postFetchFn ? postFetchFn : (o: any) => o
	if (sessionStorage.getItem(url)) {
		return sessionStorage.getItem(url)
	} else {
		fetch(url)
		.then(obj => obj.text())
		.then(txt => sessionStorage.setItem(url, postProcessor(txt)))
		.catch(err => console.error(`error fetching ${url}: `, err))
		if (sessionStorage.getItem(url)) {
			return sessionStorage.getItem(url)
		} else {
			console.error(`failed caching ${url} to sessionStorage`)
		}
	}
}
