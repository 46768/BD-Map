import type { VBinding } from './def'
import type { CanvasCoord } from '@/components/map/def'
function onMouseDown(){};
export const vDrag = {
	mounted: (el: HTMLElement, binding: VBinding) => {
		const pos: CanvasCoord = {x: 0, y: 0}


		const onMouseMove = (evt: MouseEvent) => {
			pos.x += evt.movementX
			pos.y += evt.movementY

			if (typeof binding.value === "function") {
				binding.value(pos)
			}
		}

		const onMouseUp = () => {
			el.removeEventListener('mouseup', onMouseUp)
			el.removeEventListener('mousemove', onMouseMove)
		}

		const onMouseDown = () => {
			el.addEventListener('mouseup', onMouseUp)
			el.addEventListener('mousemove', onMouseMove)
		}

		el.addEventListener('mousedown', onMouseDown)
	},

	beforeUnmount(el: HTMLElement) {
		el.removeEventListener('mousedown', onMouseDown)
	}
}
