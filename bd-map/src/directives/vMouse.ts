import type { VBinding } from './def'
import type { CanvasCoord } from '@/components/map/def'

function onMouseMove() {}
export const vMouse = {
	mounted: (el: HTMLElement, binding: VBinding) => {
		const pos: CanvasCoord = {x: 0, y: 0}
		const onMouseMove = (evt: MouseEvent) => {
			pos.x = evt.clientX
			pos.y = evt.clientY

			if (typeof binding.value === "function") {
				binding.value(pos)
			}
		}

		el.addEventListener('mousemove', onMouseMove)
	},

	beforeUnmount(el: HTMLElement) {
		el.removeEventListener('mousemove', onMouseMove)
	}
}

