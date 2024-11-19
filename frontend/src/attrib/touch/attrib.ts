import type { Directive } from '@/attrib/def'

interface TouchDirective extends Directive {
	touchList: Record<number, Touch>
	onTouch: Function
}

export const vTouch: TouchDirective = {
	touchList: {},
	onTouch: () => {},
	mounted: (el) => {
		this.touchList = []
		el.addEventListener("touchstart", this.onTouch)
	},
}
