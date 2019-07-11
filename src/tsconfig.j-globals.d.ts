
declare module '.Object.assign' { export default Object.assign; }
declare module '.Object.create?=' { export default Object.create; }
declare module '.Object.defineProperty' { export default Object.defineProperty; }
declare module '.Object.freeze' { export default Object.freeze; }
declare module '.Object.prototype.hasOwnProperty' { export default Object.prototype.hasOwnProperty; }
declare module '.Object.seal' { export default Object.seal; }

declare module '.Promise' { export default Promise;
	export { default as all } from '.Promise.all';
	export { default as race } from '.Promise.race';
	export { default as reject } from '.Promise.reject';
	export { default as resolve } from '.Promise.resolve';
}
declare module '.Promise.all' { export default Promise.all; }
declare module '.Promise.race' { export default Promise.race; }
declare module '.Promise.reject' { export default Promise.reject; }
declare module '.Promise.resolve' { export default Promise.resolve; }

declare module '.Symbol.toStringTag?' { export default Symbol.toStringTag; }

declare module '.TypeError' { export default TypeError; }

declare module '.default?=' { export default Default;
	function Default<Exports extends Readonly<{ [key :string] :any, default? :Module<Exports> }>> (exports :Exports) :Module<Exports>;
	function Default<Statics extends Readonly<{ [key :string] :any, default? :ModuleFunction<Statics, Main> }>, Main extends Callable | Newable | Callable & Newable> (main :Main, statics :Statics) :ModuleFunction<Statics, Main>;
	type Module<Exports> = Readonly<Exports & { default :Module<Exports> }>;
	type ModuleFunction<Statics, Main> = Readonly<Statics & { default :ModuleFunction<Statics, Main> } & Main>;
	type Callable = (...args :any[]) => any;
	type Newable = { new (...args :any[]) :any };
}

declare module '.undefined' { export default undefined; }
