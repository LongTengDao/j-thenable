import version from './version?text';
export { version };

import freeze from '.Object.freeze';
import TypeError from '.TypeError';
import undefined from '.undefined';

var PENDING :0 = 0;
var FULFILLED :1 = 1;
var REJECTED :2 = 2;
type Status = 0 | 1 | 2;

var Private = function Thenable () {} as unknown as { new () :Private };

export function isThenable (value :any) :value is Public {
	return value instanceof Private;
}

function t (thenable :Private, value :any) :void {
	if ( ( isThenable as (value :any) => value is Private )(value) ) {
		var _status :Status = value._status;
		if ( _status===PENDING ) {
			thenable._on = [];
			value._on!.push(thenable);
		}
		else {
			thenable._value = value._value;
			thenable._status = _status;
		}
	}
	else {
		thenable._value = value;
		thenable._status = FULFILLED;
	}
}

type Stack = { nextStack :Stack, thenable :Private, value :any, status :Status } | null;
var stack :Stack = null;
function r (thenable :Private, value :any, status :Status) :void {
	if ( stack ) {
		stack = { nextStack: stack, thenable: thenable, value: value, status: status };
		return;
	}
	for ( ; ; ) {
		stack: {
			if ( status===FULFILLED ) {
				if ( thenable._onrejected ) { thenable._onrejected = undefined; }
				var _onfulfilled :Function | undefined = thenable._onfulfilled;
				if ( _onfulfilled ) {
					thenable._onfulfilled = undefined;
					try {
						value = _onfulfilled(value);
						if ( ( isThenable as (value :any) => value is Private )(value) ) {
							var _status :Status = value._status;
							if ( _status===PENDING ) {
								value._on!.push(thenable);
								break stack;
							}
							else {
								value = value._value;
								status = _status;
							}
						}
					}
					catch (error) {
						value = error;
						status = REJECTED;
					}
				}
			}
			else {
				if ( thenable._onfulfilled ) { thenable._onfulfilled = undefined; }
				var _onrejected :Function | undefined = thenable._onrejected;
				if ( _onrejected ) {
					thenable._onrejected = undefined;
					try {
						value = _onrejected(value);
						if ( ( isThenable as (value :any) => value is Private )(value) ) {
							var _status :Status = value._status;
							if ( _status===PENDING ) {
								value._on!.push(thenable);
								break stack;
							}
							else {
								value = value._value;
								status = _status;
							}
						}
						else { status = FULFILLED; }
					}
					catch (error) { value = error; }
				}
			}
			thenable._value = value;
			thenable._status = status;
			var _on :Private[] | null = thenable._on;
			if ( _on ) {
				thenable._on = null;
				for ( var index :number = _on.length; index; ) {
					stack = { nextStack: stack, thenable: _on[--index], value: value, status: status };
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

var Public :{ new (executor :Executor) :Public } = function Thenable (this :Private, executor :Executor) :void {
	if ( typeof executor!=='function' ) { throw TypeError('Thenable executor is not a function'); }
	var executed :boolean | undefined;
	var red :boolean | undefined;
	var _value :any;
	var _status :Status | undefined;
	var THIS :Private = this;
	THIS._on = [];
	try {
		executor(
			function resolve (value :any) {
				if ( red ) { return; }
				red = true;
				if ( executed ) {
					if ( ( isThenable as (value :any) => value is Private )(value) ) {
						_status = value._status;
						if ( _status===PENDING ) { value._on!.push(THIS); }
						else { r(THIS, value._value, _status); }
					}
					else { r(THIS, value, FULFILLED); }
				}
				else {
					_value = value;
					_status = FULFILLED;
				}
			},
			function reject (error :any) {
				if ( red ) { return; }
				red = true;
				if ( executed ) { r(THIS, error, REJECTED); }
				else {
					_value = error;
					_status = REJECTED;
				}
			}
		);
		if ( !red ) {
			executed = true;
			return;
		}
	}
	catch (error) {
		if ( !red ) {
			red = true;
			THIS._value = error;
			THIS._status = REJECTED;
			THIS._on = null;
			return;
		}
	}
	if ( _status===FULFILLED && ( isThenable as (value :any) => value is Private )(_value) ) {
		_status = _value._status;
		if ( _status===PENDING ) {
			_value._on!.push(THIS);
			return;
		}
		_value = _value._value;
	}
	THIS._value = _value;
	THIS._status = _status!;
	THIS._on = null;
} as unknown as { new (executor :Executor) :Public };

Private.prototype = Public.prototype = {
	_status: PENDING,
	_value: undefined,
	_on: null,
	_onfulfilled: undefined,
	_onrejected: undefined,
	then: function then (this :Private, onfulfilled? :Function, onrejected? :Function) :Private {
		var THIS :Private = this;
		var thenable :Private = new Private;
		switch ( THIS._status ) {
			case PENDING:
				thenable._on = [];
				thenable._onfulfilled = onfulfilled;
				thenable._onrejected = onrejected;
				THIS._on!.push(thenable);
				return thenable;
			case FULFILLED:
				if ( typeof onfulfilled==='function' ) {
					try { t(thenable, onfulfilled(THIS._value)); }
					catch (error) {
						thenable._value = error;
						thenable._status = REJECTED;
					}
				}
				else {
					thenable._value = THIS._value;
					thenable._status = FULFILLED;
				}
				return thenable;
			case REJECTED:
				if ( typeof onrejected==='function' ) {
					try { t(thenable, onrejected(THIS._value)); }
					catch (error) {
						thenable._value = error;
						thenable._status = REJECTED;
					}
				}
				else {
					thenable._value = THIS._value;
					thenable._status = REJECTED;
				}
				return thenable;
		}
		throw TypeError('Method Thenable.prototype.then called on incompatible receiver');
	}
};

export function resolve (value :any) :Public {
	var THIS :Private = new Private;
	t(THIS, value);
	return THIS;
}

export function reject (error :any) :Public {
	var THIS :Private = new Private;
	THIS._status = REJECTED;
	THIS._value = error;
	return THIS;
}

export function all (values :readonly any[]) :Public {
	var THIS :Private = new Private;
	THIS._on = [];
	var _value :any[] = [];
	var count :number = 0;
	function _onrejected (error :any) :void { THIS._status===PENDING && r(THIS, error, REJECTED); }
	for ( var length :number = values.length, index :number = 0; index<length; ++index ) {
		var value :any = values[index];
		if ( ( isThenable as (value :any) => value is Private )(value) ) {
			var _status :Status = value._status;
			if ( _status===PENDING ) {
				++count;
				_value[index] = undefined;
				value._on!.push({
					_onfulfilled: function (index :number) :Function {
						return function (value :any) :void {
							if ( THIS._status===PENDING ) {
								_value[index] = value;
								if ( count>1 ) { --count; }
								else { r(THIS, _value, FULFILLED); }
							}
						};
					}(index),
					_onrejected: _onrejected
				} as Private);
			}
			else if ( _status===REJECTED ) {
				THIS._value = value._value;
				THIS._status = REJECTED;
				break;
			}
			else { _value[index] = value._value; }
		}
		else { _value[index] = value; }
	}
	return THIS;
}

export function race (values :readonly any[]) :Public {
	var THIS :Private = new Private;
	THIS._on = [];
	var that :Private = {
		_onfulfilled: function (value :any) :void { THIS._status===PENDING && r(THIS, value, FULFILLED); },
		_onrejected: function (error :any) :void { THIS._status===PENDING && r(THIS, error, REJECTED); }
	} as Private;
	for ( var length :number = values.length, index :number = 0; index<length; ++index ) {
		var value :any = values[index];
		if ( ( isThenable as (value :any) => value is Private )(value) ) {
			var _status :Status = value._status;
			if ( _status===PENDING ) { value._on!.push(that); }
			else {
				THIS._value = value._value;
				THIS._status = _status;
				break;
			}
		}
		else {
			THIS._value = value;
			THIS._status = FULFILLED;
			break;
		}
	}
	return THIS;
}

import Default from '.default?=';
export default Default(Public, {
	version: version,
	Thenable: Public,
	isThenable: isThenable,
	resolve: resolve,
	reject: reject,
	all: all,
	race: race
});

export var Thenable :Readonly<{ new (executor :Executor) :Public }> = freeze
	? /*#__PURE__*/ function () {
		freeze(Public.prototype);
		freeze(Public);
		return Public;
	}()
	: Public;

type Function = (value :any) => void;
type Executor = (resolve :Function, reject :Function) => void;
type Private = {
	_status :Status,
	_value :any,
	_on :Private[] | null,
	_onfulfilled :Function | undefined,
	_onrejected :Function | undefined,
	then (onfulfilled? :Function, onrejected? :Function) :Private,
};
type Public = Readonly<object & {
	then (this :Public, onfulfilled? :Function, onrejected? :Function) :Public,
}>;