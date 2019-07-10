export = exports;

declare const exports :Readonly<{
	
	version :string,
	
	new (executor :(resolve :(value :any) => void, reject :(value :any) => void) => void) :Thenable,
	Thenable :Readonly<{ new (executor :(resolve :(value :any) => void, reject :(value :any) => void) => void) :Thenable }>,
	
	resolve (value :any) :Thenable,
	reject (error :any) :Thenable,
	
	all (values :readonly any[]) :Thenable,
	race (values :readonly any[]) :Thenable,
	
	default :typeof exports,
	
}>;

type Thenable = Readonly<object & {
	then (this :Thenable, onfulfilled? :(value :any) => void, onrejected? :(value :any) => void) :Thenable,
}>;