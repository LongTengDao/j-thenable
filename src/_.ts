import undefined from '.undefined';

export var PENDING :0 = 0;
export var FULFILLED :1 = 1;
export var REJECTED :2 = 2;

export var Private :{ new () :Private } = function Thenable () {} as any;

export function isPrivate (value :any) :value is Private {
	return value instanceof Private;
}

export function isPublic (value :any) :value is { then (onfulfilled? :Function, onrejected? :Function) :any } {
	return value!=null && typeof value.then==='function';
}

var stack :Stack = null;

export function r (thenable :Private, value :any, status :Status) :void {
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
							wait(thenable, value);
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
							wait(thenable, value);
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

export function wait (thenable :Private, value :{ then (onfulfilled? :Function, onrejected? :Function) :any }) :void {
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

export type Private = {
	_status :Status,
	_value :any,
	_on :Private[] | null,
	_onfulfilled :Function | undefined,
	_onrejected :Function | undefined,
	then (onfulfilled? :Function, onrejected? :Function) :Private,
};

export type Status = 0 | 1 | 2;

export type Executor = (resolve :Function, reject :Function) => void;

export type Function = (value :any) => void;
