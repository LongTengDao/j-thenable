export as namespace Thenable;
export = exports;

declare class exports {
	
	constructor (executor :(resolve :(value :any) => void, reject :(value :any) => void) => void)
	then (this :exports, onfulfilled? :(value :any) => void, onrejected? :(value :any) => void) :exports
	
	static version :'4.2.1';
	static all (values :readonly any[]) :exports
	static race (values :readonly any[]) :exports
	static resolve (value? :any) :exports
	static reject (error? :any) :exports
	static pend (callbackfn :() => any) :exports
	static await (value :any) :any
	
}

declare namespace exports {
	
	export class Thenable {
		constructor (executor :(resolve :(value :any) => void, reject :(value :any) => void) => void)
		then (this :exports, onfulfilled? :(value :any) => void, onrejected? :(value :any) => void) :exports
	}
	
	export { exports as default };
	
}
