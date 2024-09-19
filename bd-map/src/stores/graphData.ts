import { ref } from 'vue'
import { defineStore } from 'pinia'

export const graphData = defineStore('graphData', () => {
	const pathfinder = ref<Function>((graph: number[][], source: number, target: number, nodec: number, nodenc: number): number[] => {
		return []
	})
	const graph = ref<Uint32Array>(new Uint32Array())
	const nodec = ref<number>(0)
	const nodenc = ref<number>(0)
	const defined = ref<boolean>(false)
	
	function pathfind(source: number, target: number): number[] {
		if (!defined.value) return []
		return pathfinder.value(graph.value, source, target, nodec.value, nodenc.value).toReversed()
	}

	function getNodeLocation(node: number): [number, number] {
		if (!defined.value) return [-1, -1]
		return [graph.value[node*nodenc.value], graph.value[1+(node*nodenc.value)]] 
	}

	function defineGraph(csvData: string) {
		const nodeData: number[][] = csvData.split('\n').map(data => data.split(',').map(val => parseInt(val)))
		nodec.value = nodeData.length
		nodenc.value = nodeData[0].length
		graph.value = new Uint32Array(nodeData.flat(1))
		defined.value = true
	}

	return { pathfinder, graph, nodec, nodenc, defined, pathfind, getNodeLocation, defineGraph }
})
