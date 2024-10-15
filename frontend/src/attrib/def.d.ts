import type { VNode } from 'vue';

export interface DirectiveBinding {
    value: any;
    oldValue: any;
    arg: any;
    modifiers: Record<string, boolean>;
    instance: any;
    dir: any;
}

export interface Directive {
    created?(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void;
    beforeMount?(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void;
    mounted?(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void;
    beforeUpdate?(el: HTMLElement, binding: DirectiveBinding, vnode: VNode, prevVnode: VNode): void;
    updated?(el: HTMLElement, binding: DirectiveBinding, vnode: VNode, prevVnode: VNode): void;
    beforeUnmount?(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void;
    unmounted?(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void;
}
