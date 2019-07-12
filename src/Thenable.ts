import TypeError from '.TypeError';

import { PENDING, FULFILLED, REJECTED, Status, Private, isThenable, beenPromise, flow, depend, prepend, Executor, Onfulfilled, Onrejected } from './_';

export { Public as default };

type Public = Readonly<object & {
	then (this :Public, onfulfilled? :Onfulfilled, onrejected? :Onrejected) :Public,
}>;

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
						if ( isThenable(value) ) {
							prepend(value);
							_status = value._status;
							if ( _status===PENDING ) { value._dependents!.push(THIS); }
							else { flow(THIS, value._value, _status!); }
						}
						else if ( beenPromise(value) ) { depend(THIS, value); }
						else { flow(THIS, value, FULFILLED); }
					}
					catch (error) { if ( THIS._status===PENDING ) { flow(THIS, error, REJECTED); } }
				}
				else {
					_value = value;
					_status = FULFILLED;
				}
			},
			function reject (error :any) {
				if ( red ) { return; }
				red = true;
				if ( executed ) { flow(THIS, error, REJECTED); }
				else {
					_value = error;
					_status = REJECTED;
				}
			}
		);
		if ( !red ) {
			executed = true;
			THIS._dependents = [];
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
	try { rEd(THIS, _status!, _value); }
	catch (error) {
		if ( THIS._status===PENDING ) {
			THIS._value = error;
			THIS._status = REJECTED;
			THIS._dependents = null;
		}
	}
} as any;

function rEd (THIS :Private, status :Status, value :any) :void {
	if ( status===FULFILLED ) {
		if ( isThenable(value) ) {
			prepend(value);
			status = value._status;
			if ( status===PENDING ) {
				THIS._dependents = [];
				value._dependents!.push(THIS);
			}
			else {
				THIS._value = value._value;
				THIS._status = status;
			}
			return;
		}
		if ( beenPromise(value) ) {
			THIS._dependents = [];
			depend(THIS, value);
			return;
		}
	}
	THIS._value = value;
	THIS._status = status;
}
