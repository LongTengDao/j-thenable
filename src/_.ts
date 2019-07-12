import Promise_prototype from '.Promise.prototype?';
import undefined from '.undefined';

export type Executor = (resolve? :(value :any) => void, reject? :(error :any) => void) => void;
export type Onfulfilled = (value :any) => any;
export type Onrejected = (error :any) => any;
export type Status = 0 | 1 | 2;
export type Private = {
	_status :Status,
	_value :any,
	_dependents :Private[] | null,
	_onfulfilled :Onfulfilled | undefined,
	_onrejected :Onrejected | undefined,
	_Value :( () => any ) | undefined,
	then (this :Private, onfulfilled? :Onfulfilled, onrejected? :Onrejected) :Private,
};

export var PENDING :0 = 0;
export var FULFILLED :1 = 1;
export var REJECTED :2 = 2;

export var Private :{ new () :Private } = function Thenable () {} as any;

var wasPromise :boolean = false;
export function isThenableOnly (value :any) :value is Private {
	return value instanceof Private;
}
export var isThenable :(value :any) => value is Private = Promise_prototype
	? function () {
		var Promise = function () {};
		Promise.prototype = Promise_prototype;
		return function isThenable (value :any) :value is Private {
			if ( value instanceof Private ) { return true; }
			wasPromise = value instanceof Promise;
			return false;
		};
	}()
	: isThenableOnly;
export function beenPromise (value :any) :value is Readonly<Promise<any>> { return wasPromise; }

type PrependStack = { nextStack :PrependStack | null, thenable :Private, Value :() => any };
var prependStack :PrependStack | null = null;
var prepending :boolean = false;
export function prepend (thenable :Private) :void {
	var callbackfn :( () => any ) | undefined = thenable._Value;
	if ( !callbackfn ) { return; }
	thenable._Value = undefined;
	if ( prepending ) {
		prependStack = { nextStack: prependStack, thenable: thenable, Value: callbackfn };
		return;
	}
	prepending = true;
	for ( ; ; ) {
		try {
			var value :any = callbackfn();
			if ( isThenable(value) ) {
				callbackfn = value._Value;
				if ( callbackfn ) {
					value._Value = undefined;
					value._dependents!.push(thenable);
					prependStack = { nextStack: prependStack, thenable: value, Value: callbackfn };
				}
				else {
					var status :Status = value._status;
					if ( status===PENDING ) { value._dependents!.push(thenable); }
					else { flow(thenable, value._value, status); }
				}
			}
			else if ( beenPromise(value) ) { depend(thenable, value); }
			else { flow(thenable, value, FULFILLED); }
		}
		catch (error) { flow(thenable, error, REJECTED); }
		if ( !prependStack ) { break; }
		thenable = prependStack.thenable;
		callbackfn = prependStack.Value;
		prependStack = prependStack.nextStack;
	}
	prepending = false;
}

type FlowStack = { nextStack :FlowStack | null, thenable :Private, value :any, status :Status };
var flowStack :FlowStack | null = null;
var flowing :boolean = false;
export function flow (thenable :Private, value :any, status :Status) :void {
	if ( flowing ) {
		flowStack = { nextStack: flowStack, thenable: thenable, value: value, status: status };
		return;
	}
	flowing = true;
	for ( var _status :Status; ; ) {
		stack: {
			if ( status===FULFILLED ) {
				if ( thenable._onrejected ) { thenable._onrejected = undefined; }
				var _onfulfilled :Onfulfilled | undefined = thenable._onfulfilled;
				if ( _onfulfilled ) {
					thenable._onfulfilled = undefined;
					try {
						value = _onfulfilled(value);
						if ( isThenable(value) ) {
							prepend(value);
							_status = value._status;
							if ( _status===PENDING ) {
								value._dependents!.push(thenable);
								break stack;
							}
							else {
								value = value._value;
								status = _status;
							}
						}
						else if ( beenPromise(value) ) {
							depend(thenable, value);
							break stack;
						}
					}
					catch (error) {
						if ( thenable._status!==PENDING ) { break stack; }
						value = error;
						status = REJECTED;
					}
				}
			}
			else {
				if ( thenable._onfulfilled ) { thenable._onfulfilled = undefined; }
				var _onrejected :Onrejected | undefined = thenable._onrejected;
				if ( _onrejected ) {
					thenable._onrejected = undefined;
					try {
						value = _onrejected(value);
						if ( isThenable(value) ) {
							prepend(value);
							_status = value._status;
							if ( _status===PENDING ) {
								value._dependents!.push(thenable);
								break stack;
							}
							else {
								value = value._value;
								status = _status;
							}
						}
						else if ( beenPromise(value) ) {
							depend(thenable, value);
							break stack;
						}
						else { status = FULFILLED; }
					}
					catch (error) {
						if ( thenable._status!==PENDING ) { break stack; }
						value = error;
					}
				}
			}
			thenable._value = value;
			thenable._status = status;
			var _dependents :Private[] | null = thenable._dependents;
			if ( _dependents ) {
				thenable._dependents = null;
				for ( var index :number = _dependents.length; index; ) {
					flowStack = { nextStack: flowStack, thenable: _dependents[--index], value: value, status: status };
				}
			}
		}
		if ( !flowStack ) { break; }
		thenable = flowStack.thenable;
		value = flowStack.value;
		status = flowStack.status;
		flowStack = flowStack.nextStack;
	}
	flowing = false;
}

export function depend (thenable :Private, value :Readonly<{ then (...args :any[]) :any }>) :void {
	var red :boolean | undefined;
	value.then(
		function onfulfilled (value :any) :void {
			if ( red ) { return; }
			red = true;
			flow(thenable, value, FULFILLED);
		},
		function onrejected (error :any) :void {
			if ( red ) { return; }
			red = true;
			flow(thenable, error, REJECTED);
		}
	);
}
