export const version :'4.1.1';

export type Thenable = Readonly<object & {
	then (this :Thenable, onfulfilled? :(value :any) => any, onrejected? :(error :any) => any) :Thenable,
}>;
export const Thenable :Readonly<{ new (executor :(resolve? :(value :any) => void, reject? :(error :any) => void) => void) :Thenable }>;

export function all (values :readonly any[]) :Thenable;

export function race (values :readonly any[]) :Thenable;

export function resolve (value? :any) :Thenable;

export function reject (error? :any) :Thenable;

export function pend (callbackfn :() => any) :Thenable;

export function await (value :any) :any;

export default exports;
declare const exports :Thenable & Readonly<{
	version :typeof version,
	Thenable :typeof Thenable,
	all :typeof all,
	race :typeof race,
	resolve :typeof resolve,
	reject :typeof reject,
	pend :typeof pend,
	await :typeof await,
	default :typeof exports,
}>;
