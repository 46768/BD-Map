export class AStar {
	static url: string = "/BD-Map/wasm/astar.wasm"
	public wasmModule: WebAssembly.WebAssemblyInstantiatedSource | undefined;
	public wasmMemory: WebAssembly.Memory | undefined;
	constructor() {
		WebAssembly.instantiateStreaming(fetch(AStar.url)).then(result => {
			this.wasmModule = result;
		});
	}
	
	get loaded() {
		return this.wasmModule ? true : false;
	}


}
