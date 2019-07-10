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

function isPrivate (value :any) :value is Private {
	return value instanceof Private;
}

function isPublic (value :any) :value is { then (onfulfilled? :Function, onrejected? :Function) :any } {
	return value!=null && typeof value.then==='function';
}

function onto (thenable :Private, value :{ then (onfulfilled? :Function, onrejected? :Function) :any }) :void {
	var red :boolean | undefined;
	value.then(
		function onfulfilled (value :any) :void {
			if ( red ) { return; }
			red = true;
			r(thenable, value, FULFILLED);
		},
		function onrejected (error :any) :void {
			if ( red ) { return; }
			red = true;
			r(thenable, error, REJECTED);
		}
	);
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
						if ( isPrivate(value) ) {
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
						else if ( isPublic(value) ) {
							onto(thenable, value);
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
				var _onrejected :Function | undefined = thenable._onrejected;
				if ( _onrejected ) {
					thenable._onrejected = undefined;
					try {
						value = _onrejected(value);
						if ( isPrivate(value) ) {
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
						else if ( isPublic(value) ) {
							onto(thenable, value);
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

function rEd (THIS :Private, _status :Status | undefined, _value :any) :void {
	if ( _status===FULFILLED ) {
		if ( isPrivate(_value) ) {
			_status = _value._status;
			if ( _status===PENDING ) {
				THIS._on = [];
				_value._on!.push(THIS);
			}
			else {
				THIS._value = _value._value;
				THIS._status = _status;
			}
			return;
		}
		if ( isPublic(_value) ) {
			THIS._on = [];
			onto(THIS, _value);
			return;
		}
	}
	THIS._value = _value;
	THIS._status = _status!;
}
var Public :{ new (executor :Executor) :Public } = function Thenable (this :Private, executor :Executor) :void {
	if ( typeof executor!=='function' ) { throw TypeError('Thenable executor is not a function'); }
	var executed :boolean | undefined;
	var red :boolean | undefined;
	var _value :any;
	var _status :Status | undefined;
	var THIS :Private = this;
	try {
		executor(
			function resolve (value :any) {
				if ( red ) { return; }
				red = true;
				if ( executed ) {
					try {
						if ( isPrivate(value) ) {
							_status = value._status;
							if ( _status===PENDING ) { value._on!.push(THIS); }
							else { r(THIS, value._value, _status); }
						}
						else if ( isPublic(value) ) { onto(THIS, value); }
						else { r(THIS, value, FULFILLED); }
					}
					catch (error) { if ( THIS._status===PENDING ) { r(THIS, error, REJECTED); } }
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
			THIS._on = [];
			return;
		}
	}
	catch (error) {
		if ( !red ) {
			red = true;
			THIS._value = error;
			THIS._status = REJECTED;
			return;
		}
	}
	try { rEd(THIS, _status, _value); }
	catch (error) {
		if ( THIS._status===PENDING ) {
			THIS._value = error;
			THIS._status = REJECTED;
			THIS._on = null;
		}
	}
} as unknown as { new (executor :Executor) :Public };

function t (thenable :Private, value :any) :void {
	if ( isPrivate(value) ) {
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
	else if ( isPublic(value) ) {
		thenable._on = [];
		onto(thenable, value);
	}
	else {
		thenable._value = value;
		thenable._status = FULFILLED;
	}
}

function pass (THIS :Private, on :Function, thenable :Private) {
	try { t(thenable, on(THIS._value)); }
	catch (error) {
		if ( thenable._status===PENDING ) {
			thenable._value = error;
			thenable._status = REJECTED;
		}
	}
}
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
				if ( typeof onfulfilled==='function' ) { pass(THIS, onfulfilled, thenable); }
				else {
					thenable._value = THIS._value;
					thenable._status = FULFILLED;
				}
				return thenable;
			case REJECTED:
				if ( typeof onrejected==='function' ) { pass(THIS, onrejected, thenable); }
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
	try { t(THIS, value); }
	catch (error) {
		if ( THIS._status===PENDING ) {
			THIS._value = error;
			THIS._status = REJECTED;
		}
	}
	return THIS;
}

export function reject (error :any) :Public {
	var THIS :Private = new Private;
	THIS._status = REJECTED;
	THIS._value = error;
	return THIS;
}

function _all (values :readonly any[], THIS :Private) :void {
	THIS._on = [];
	function _onrejected (error :any) :void { THIS._status===PENDING && r(THIS, error, REJECTED); }
	var _value :any[] = [];
	var count :number = 0;
	var counted :boolean | undefined;
	for ( var length :number = values.length, index :number = 0; index<length; ++index ) {
		var value :any = values[index];
		if ( isPrivate(value) ) {
			var _status :Status = value._status;
			if ( _status===PENDING ) {
				++count;
				_value[index] = undefined;
				value._on!.push({
					_status: 0,
					_value: undefined,
					_on: null,
					_onfulfilled: function (index :number) :Function {
						return function (value :any) :void {
							if ( THIS._status===PENDING ) {
								_value[index] = value;
								if ( !--count && counted ) { r(THIS, _value, FULFILLED); }
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
		else if ( isPublic(value) ) {
			++count;
			_value[index] = undefined;
			value.then(
				function (index :number) :Function {
					var red :boolean | undefined;
					return function (value :any) :void {
						if ( red ) { return; }
						red = true;
						if ( THIS._status===PENDING ) {
							_value[index] = value;
							if ( !--count && counted ) { r(THIS, _value, FULFILLED); }
						}
					};
				}(index),
				_onrejected
			);
		}
		else { _value[index] = value; }
	}
	counted = true;
	if ( !count && THIS._status===PENDING ) {
		THIS._value = _value;
		THIS._status = FULFILLED;
		THIS._on = null;
	}
}
export function all (values :readonly any[]) :Public {
	var THIS :Private = new Private;
	try { _all(values, THIS); }
	catch (error) {
		if ( THIS._status===PENDING ) {
			THIS._value = error;
			THIS._status = REJECTED;
			THIS._on = null;
		}
	}
	return THIS;
}

function _race (values :readonly any[], THIS :Private) :void {
	THIS._on = [];
	function _onfulfilled (value :any) :void { THIS._status===PENDING && r(THIS, value, FULFILLED); }
	function _onrejected (error :any) :void { THIS._status===PENDING && r(THIS, error, REJECTED); }
	var that :Private = {
		_status: 0,
		_value: undefined,
		_on: null,
		_onfulfilled: _onfulfilled,
		_onrejected: _onrejected
	} as Private;
	for ( var length :number = values.length, index :number = 0; index<length; ++index ) {
		var value :any = values[index];
		if ( isPrivate(value) ) {
			var _status :Status = value._status;
			if ( _status===PENDING ) { value._on!.push(that); }
			else {
				THIS._value = value._value;
				THIS._status = _status;
				break;
			}
		}
		else if ( isPublic(value) ) {
			value.then(_onfulfilled, _onrejected);
			if ( THIS._status!==PENDING ) { break; }
		}
		else {
			THIS._value = value;
			THIS._status = FULFILLED;
			break;
		}
	}
}
export function race (values :readonly any[]) :Public {
	var THIS :Private = new Private;
	try { _race(values, THIS); }
	catch (error) {
		if ( THIS._status===PENDING ) {
			THIS._value = error;
			THIS._status = REJECTED;
			THIS._on = null;
		}
	}
	return THIS;
}

import Default from '.default?=';
export default Default(Public, {
	version: version,
	Thenable: Public,
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