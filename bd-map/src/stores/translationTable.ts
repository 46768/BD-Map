import { ref } from 'vue'
import { defineStore } from 'pinia'

export const translationTable = defineStore('translationTable', () => {
	const nodeAlias = ref<Map<string, number>>(new Map())
	const defined = ref<boolean>(false)

	function translateAlias(alias: string): number | undefined {
		if (!defined.value) return -1
		return nodeAlias.value.get(alias)
	}

	function defineAlias(csvData: string) {
		csvData.split('\n').forEach(nodeA => {
			const split = nodeA.split(',')
			split.slice(1).map(alias => nodeAlias.value.set(alias, parseInt(split[0])))
		})
		defined.value = true
	}

	return { nodeAlias, defined, translateAlias, defineAlias }
})
