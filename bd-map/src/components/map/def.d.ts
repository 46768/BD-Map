import { Ref, ComputedRef } from 'vue'

export interface CanvasCoord {
	x: number
	y: number
}

export interface IShapeData {
	shapeID: Ref<string>
	shapeDrawn: Ref<number[]>
	shapeHitbox: ComputedRef<number[4]>
	shapeLayer: Ref<number>
	shapeColor: Ref<number[4]>
	hightlighted: Ref<boolean>
}
