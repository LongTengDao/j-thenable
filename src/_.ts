import Promise from '.Promise';
import WeakMap from '.WeakMap';
import getPrototypeOf from '.Object.getPrototypeOf';
import preventExtensions from '.Object.preventExtensions';
import undefined from '.undefined';

export var Executor :never;
export type Executor = (resolve? :(value :any) => void, reject? :(error :any) => void) => void;
export var Onfulfilled :never;
export type Onfulfilled = (value :any) => any;
export var Onrejected :never;
export type Onrejected = (error :any) => any;
export var Onthen :never;
export type Onthen = () => any;
export var Status :never;
export type Status = 0 | 1 | 2;
export type Private = {
	_status :Status,
	_value :any,
	_dependents :Private[] | undefined,
	_onfulfilled :Onfulfilled | undefined,
	_onrejected :Onrejected | undefined,
	_onthen :Onthen | undefined,
	then (this :Private, onfulfilled? :Onfulfilled, onrejected? :Onrejected) :Private,
};

export var PENDING :0 = 0;
export var FULFILLED :1 = 1;
export var REJECTED :2 = 2;

export var Private_call :(THIS :Private) => void;
export var Private :{ new () :Private } = function Private (this :Private) :void { Private_call(this); } as any;
export var isThenable :(value :any) => value is Private;

export var delete_dependents :(THIS :Private) => void;
var delete_onrejected :(THIS :Private) => void;
var delete_onfulfilled :(THIS :Private) => void;
var delete_onthen :(THIS :Private) => void;
var delete_onfulfilled_if_has :(THIS :Private) => void;
var delete_onrejected_if_has :(THIS :Private) => void;

export var get_status :(THIS :Private) => Status;
export var get_value :(THIS :Private) => any;
export var get_dependents :(THIS :Private) => Private[] | undefined;
var get_onfulfilled :(THIS :Private) => Onfulfilled | undefined;
var get_onrejected :(THIS :Private) => Onrejected | undefined;
var get_onthen :(THIS :Private) => Onthen | undefined;

export var set_status :(THIS :Private, status :Status) => void;
export var set_value :(THIS :Private, value :any) => void;
export var set_dependents :(THIS :Private, dependents :Private[]) => void;
export var set_onfulfilled :(THIS :Private, onfulfilled :Onfulfilled) => void;
export var set_onrejected :(THIS :Private, onrejected :Onrejected) => void;
export var set_onthen :(THIS :Private, onthen :Onthen) => void;

if ( typeof WeakMap==='function' ) {
	var STATUS :WeakMap<Private, Status> = new WeakMap;
	var VALUE :WeakMap<Private, any> = new WeakMap;
	var DEPENDENTS :WeakMap<Private, Private[]> = new WeakMap;
	var ONFULFILLED :WeakMap<Private, Onfulfilled> = new WeakMap;
	var ONREJECTED :WeakMap<Private, Onrejected> = new WeakMap;
	var ONTHEN :WeakMap<Private, Onthen> = new WeakMap;
	
	Private_call = preventExtensions && /*#__PURE__*/ function () {
		var o :any = preventExtensions({});
		VALUE.set(o, o);
		return VALUE.has(o);
	}()
		? function Private_call (THIS :Private) :void { STATUS.set(preventExtensions(THIS), PENDING); }
		: function Private_call (THIS :Private) :void { STATUS.set(THIS, PENDING); };
	isThenable = function isThenable (value :any) :value is Private { return STATUS.has(value); };
	
	/* delete: */
	delete_dependents = function delete_dependents (THIS :Private) :void { DEPENDENTS['delete'](THIS); };
	delete_onfulfilled = function delete_onfulfilled (THIS :Private) :void { ONFULFILLED['delete'](THIS); };
	delete_onrejected = function delete_onrejected (THIS :Private) :void { ONREJECTED['delete'](THIS); };
	delete_onthen = function delete_onthen (THIS :Private) :void { ONTHEN['delete'](THIS); };
	delete_onfulfilled_if_has = delete_onfulfilled;
	delete_onrejected_if_has = delete_onrejected;/**/
	/* set undefined: * /
	delete_dependents = function delete_dependents (THIS :Private) :void { DEPENDENTS.set(THIS, undefined!); };
	delete_onfulfilled = function delete_onfulfilled (THIS :Private) :void { ONFULFILLED.set(THIS, undefined!); };
	delete_onrejected = function delete_onrejected (THIS :Private) :void { ONREJECTED.set(THIS, undefined!); };
	delete_onthen = function delete_onthen (THIS :Private) :void { ONTHEN.set(THIS, undefined!); };
	delete_onfulfilled_if_has = function delete_onfulfilled_if_has (THIS :Private) :void { ONFULFILLED.has(THIS) && ONFULFILLED.set(THIS, undefined!); };
	delete_onrejected_if_has = function delete_onrejected_if_has (THIS :Private) :void { ONREJECTED.has(THIS) && ONREJECTED.set(THIS, undefined!); };/**/
	
	get_status = function get_status (THIS :Private) :Status { return STATUS.get(THIS)!; };
	get_value = function get_value (THIS :Private) :any { return VALUE.get(THIS); };
	get_dependents = function get_dependents (THIS :Private) :Private[] | undefined { return DEPENDENTS.get(THIS); };
	get_onfulfilled = function get_onfulfilled (THIS :Private) :Onfulfilled | undefined { return ONFULFILLED.get(THIS); };
	get_onrejected = function get_onrejected (THIS :Private) :Onrejected | undefined { return ONREJECTED.get(THIS); };
	get_onthen = function get_onthen (THIS :Private) :Onthen | undefined { return ONTHEN.get(THIS); };
	
	set_status = function set_status (THIS :Private, status :Status) :void { STATUS.set(THIS, status); };
	set_value = function set_value (THIS :Private, value :any) :void { VALUE.set(THIS, value); };
	set_dependents = function set_dependents (THIS :Private, dependents :Private[]) :void { DEPENDENTS.set(THIS, dependents); };
	set_onfulfilled = function set_onfulfilled (THIS :Private, onfulfilled :Onfulfilled) :void { ONFULFILLED.set(THIS, onfulfilled); };
	set_onrejected = function set_onrejected (THIS :Private, onrejected :Onrejected) :void { ONREJECTED.set(THIS, onrejected); };
	set_onthen = function set_onthen (THIS :Private, onthen :Onthen) :void { ONTHEN.set(THIS, onthen); };
}
else {
	Private_call = function Private_call () :void { };
	isThenable = getPrototypeOf
		? function (value :any) :value is Private {
			var Private_prototype :Private = Private.prototype;
			isThenable = function isThenable (value :any) :value is Private { return value!=null && getPrototypeOf(value)===Private_prototype; };
			return isThenable(value);
		}
		: function isThenable (value :any) :value is Private { return value instanceof Private; };
	
	/* set undefined: */
	delete_dependents = function delete_dependents (THIS :Private) :void { THIS._dependents = undefined; };
	delete_onfulfilled = function delete_onfulfilled (THIS :Private) :void { THIS._onfulfilled = undefined; };
	delete_onrejected = function delete_onrejected (THIS :Private) :void { THIS._onrejected = undefined; };
	delete_onthen = function delete_onthen (THIS :Private) :void { THIS._onthen = undefined; };
	delete_onfulfilled_if_has = function delete_onfulfilled_if_has (THIS :Private) :void { if ( THIS._onfulfilled ) { THIS._onfulfilled = undefined; } };
	delete_onrejected_if_has = function delete_onrejected_if_has (THIS :Private) :void { if ( THIS._onrejected ) { THIS._onrejected = undefined; } };/**/
	
	get_status = function get_status (THIS :Private) :Status { return THIS._status; };
	get_value = function get_value (THIS :Private) :any { return THIS._value; };
	get_dependents = function get_dependents (THIS :Private) :Private[] | undefined { return THIS._dependents; };
	get_onfulfilled = function get_onfulfilled (THIS :Private) :Onfulfilled | undefined { return THIS._onfulfilled; };
	get_onrejected = function get_onrejected (THIS :Private) :Onrejected | undefined { return THIS._onrejected; };
	get_onthen = function get_onthen (THIS :Private) :Onthen | undefined { return THIS._onthen; };
	
	set_status = function set_status (THIS :Private, status :Status) :void { THIS._status = status; };
	set_value = function set_value (THIS :Private, value :any) :void { THIS._value = value; };
	set_dependents = function set_dependents (THIS :Private, dependents :Private[]) :void { THIS._dependents = dependents; };
	set_onfulfilled = function set_onfulfilled (THIS :Private, onfulfilled :Onfulfilled) :void { THIS._onfulfilled = onfulfilled; };
	set_onrejected = function set_onrejected (THIS :Private, onrejected :Onrejected) :void { THIS._onrejected = onrejected; };
	set_onthen = function set_onthen (THIS :Private, onthen :Onthen) :void { THIS._onthen = onthen; };
}

export var isPromise :(value :any) => value is Readonly<Promise<any>> = typeof Promise==='function'
	? function () {
		if ( getPrototypeOf ) {
			var prototype = Promise.prototype;
			return function isPromise (value :any) :value is Readonly<Promise<any>> { return value!=null && getPrototypeOf(value)===prototype; };
		}
		else {
			var constructor = Promise;
			return function isPromise (value :any) :value is Readonly<Promise<any>> { return value instanceof constructor; };
		}
	}()
	: function isPromise () { return false; } as any;

type PrependStack = { nextStack :PrependStack | null, thenable :Private, onthen :Onthen };
var prependStack :PrependStack | null = null;
var prepending :boolean = false;
export function prepend (thenable :Private) :void {
	var _onthen :Onthen | undefined = get_onthen(thenable);
	if ( !_onthen ) { return; }
	delete_onthen(thenable);
	if ( prepending ) {
		prependStack = { nextStack: prependStack, thenable: thenable, onthen: _onthen };
		return;
	}
	prepending = true;
	for ( ; ; ) {
		try {
			var value :any = _onthen();
			if ( isThenable(value) ) {
				_onthen = get_onthen(value);
				if ( _onthen ) {
					delete_onthen(value);
					get_dependents(value)!.push(thenable);
					prependStack = { nextStack: prependStack, thenable: value, onthen: _onthen };
				}
				else {
					var status :Status = get_status(value);
					if ( status===PENDING ) { get_dependents(value)!.push(thenable); }
					else { flow(thenable, get_value(value), status); }
				}
			}
			else if ( isPromise(value) ) { depend(thenable, value); }
			else { flow(thenable, value, FULFILLED); }
		}
		catch (error) { flow(thenable, error, REJECTED); }
		if ( !prependStack ) { break; }
		thenable = prependStack.thenable;
		_onthen = prependStack.onthen;
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
				delete_onrejected_if_has(thenable);
				var _onfulfilled :Onfulfilled | undefined = get_onfulfilled(thenable);
				if ( _onfulfilled ) {
					delete_onfulfilled(thenable);
					try {
						value = _onfulfilled(value);
						if ( isThenable(value) ) {
							prepend(value);
							_status = get_status(value);
							if ( _status===PENDING ) {
								get_dependents(value)!.push(thenable);
								break stack;
							}
							else {
								value = get_value(value);
								status = _status;
							}
						}
						else if ( isPromise(value) ) {
							depend(thenable, value);
							break stack;
						}
					}
					catch (error) {
						if ( get_status(thenable)!==PENDING ) { break stack; }
						value = error;
						status = REJECTED;
					}
				}
			}
			else {
				delete_onfulfilled_if_has(thenable);
				var _onrejected :Onrejected | undefined = get_onrejected(thenable);
				if ( _onrejected ) {
					delete_onrejected(thenable);
					try {
						value = _onrejected(value);
						if ( isThenable(value) ) {
							prepend(value);
							_status = get_status(value);
							if ( _status===PENDING ) {
								get_dependents(value)!.push(thenable);
								break stack;
							}
							else {
								value = get_value(value);
								status = _status;
							}
						}
						else if ( isPromise(value) ) {
							depend(thenable, value);
							break stack;
						}
						else { status = FULFILLED; }
					}
					catch (error) {
						if ( get_status(thenable)!==PENDING ) { break stack; }
						value = error;
					}
				}
			}
			set_value(thenable, value);
			set_status(thenable, status);
			var _dependents :Private[] | undefined = get_dependents(thenable);
			if ( _dependents ) {
				delete_dependents(thenable);
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
