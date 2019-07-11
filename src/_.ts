import Promise from '.Promise';
import undefined from '.undefined';

export var PENDING :0 = 0;
export var FULFILLED :1 = 1;
export var REJECTED :2 = 2;

export var THENABLE :1 = 1;
export var PROMISE :2 = 2;

export var Private :{ new () :Private } = function Thenable () {} as any;

export function isThenable (value :any) :value is Private {
	return value instanceof Private;
}

export var Type :(value :any) => typeof value extends Private ? 1 : typeof value extends Promise<any> ? 2 : 0 =
	
	typeof Promise==='function'
		
		? function () {
			var Native = function () {};
			Native.prototype = Promise.prototype;
			return function Type (value :any) :any {
				return isThenable(value) ? THENABLE : value instanceof Native ? PROMISE : 0;
			};
		}()
		
		: function Type (value :any) :any {
			return isThenable(value) ? THENABLE : 0;
		};

var stack :Stack | null = null;

export function flow (thenable :Private, value :any, status :Status) :void {
	if ( stack ) {
		stack = { nextStack: stack, thenable: thenable, value: value, status: status };
		return;
	}
	for ( var type :Type, _status :Status; ; ) {
		stack: {
			if ( status===FULFILLED ) {
				if ( thenable._onrejected ) { thenable._onrejected = undefined; }
				var _onfulfilled :Onfulfilled | undefined = thenable._onfulfilled;
				if ( _onfulfilled ) {
					thenable._onfulfilled = undefined;
					try {
						type = Type(value = _onfulfilled(value));
						if ( type===THENABLE ) {
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
						else if ( type===PROMISE ) {
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
						type = Type(value = _onrejected(value));
						if ( type===THENABLE ) {
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
						else if ( type===PROMISE ) {
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
					stack = { nextStack: stack, thenable: _dependents[--index], value: value, status: status };
				}
			}
		}
		if ( !stack ) { break; }
		thenable = stack.thenable;
		value = stack.value;
		status = stack.status;
		stack = stack.nextStack;
	}
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

type Stack = { nextStack :Stack | null, thenable :Private, value :any, status :Status };

export type Private = {
	_status :Status,
	_value :any,
	_dependents :Private[] | null,
	_onfulfilled :Onfulfilled | undefined,
	_onrejected :Onrejected | undefined,
	_Value :( () => any ) | undefined,
	then (this :Private, onfulfilled? :Onfulfilled, onrejected? :Onrejected) :Private,
};

export type Onfulfilled = (value :any) => any;

export type Onrejected = (error :any) => any;

export type Status = 0 | 1 | 2;

export type Type = 0 | 1 | 2;

export type Executor = (resolve? :(value :any) => void, reject? :(error :any) => void) => void;
