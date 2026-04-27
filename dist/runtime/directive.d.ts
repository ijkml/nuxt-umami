import type { Directive } from 'vue';
type BindingValue = string | {
    name: string;
    [k: string]: string | boolean | number;
};
declare const directive: Directive<HTMLElement, BindingValue>;
export { directive };
