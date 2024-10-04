import type { VBinding } from './def'

export const vClick = {
	mounted: (el: HTMLElement, binding: VBinding) => {
		el.addEventListener('mousedown', (evt) => {
			if (typeof binding.value === 'function') {
				binding.value(evt)
			}
		})
	},
}

