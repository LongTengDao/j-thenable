export const version :'1.0.1';

export const Thenable :Readonly<{ new (executor :(resolve :(value :any) => void, reject :(value :any) => void) => void) :Thenable }>;

export function isThenable (value :any) :value is Thenable;

export function resolve (value :any) :Thenable;

export function reject (error :any) :Thenable;

export function all (values :readonly any[]) :Thenable;

export function race (values :readonly any[]) :Thenable;

export default exports;
declare const exports :Thenable & Readonly<{
	version :typeof version,
	Thenable :typeof Thenable,
	isThenable :typeof isThenable,
	resolve :typeof resolve,
	reject :typeof reject,
	all :typeof all,
	race :typeof race,
	default :typeof exports,
}>;

type Thenable = Readonly<object & {
	then (this :Thenable, onfulfilled? :(value :any) => void, onrejected? :(value :any) => void) :Thenable,
}>;