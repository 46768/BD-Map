import type { Directive } from '@/attrib/def';

export const vMouseMove: Directive = {
    mounted(el, binding) {
        el.addEventListener('mousemove', (evt) => {
            if (typeof binding.value === 'function') {
                binding.value([evt.clientX, evt.clientY]);
            }
        });
    },
};

export const vMouseDrag: Directive = {
    mounted(el, binding) {
        let x: number = 0;
        let y: number = 0;

        function onMouseDown() {
            el.addEventListener('mousemove', onMouseMove);
            el.addEventListener('mouseup', onMouseUp);
        }
        function onMouseMove(evt: MouseEvent) {
            x += evt.movementX;
            y += evt.movementY;
            if (typeof binding.value === 'function') {
                binding.value([x, y]);
            }
        }
        function onMouseUp() {
            el.removeEventListener('mousemove', onMouseMove);
            el.removeEventListener('mousemove', onMouseUp);
        }

        el.addEventListener('mousedown', onMouseDown);
    },
};
