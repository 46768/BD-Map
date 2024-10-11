export interface DirectiveBinding {
    value: any;
    oldValue: any;
    arg: any;
    modifiers: { [modifier: string]: boolean };
    instance: any;
    dir: any;
}

export interface Directive {
    created?(el: HTMLElement, binding: DirectiveBinding, vnode: any): void;
    beforeMount?(el: HTMLElement, binding: DirectiveBinding, vnode: any): void;
    mounted?(el: HTMLElement, binding: DirectiveBinding, vnode: any): void;
    beforeUpdate?(el: HTMLElement, binding: DirectiveBinding, vnode: any, prevVnode: any): void;
    updated?(el: HTMLElement, binding: DirectiveBinding, vnode: any, prevVnode): void;
    beforeUnmount?(el: HTMLElement, binding: DirectiveBinding, vnode: any): void;
    unmounted?(el: HTMLElement, binding: DirectiveBinding, vnode: any): void;
}
