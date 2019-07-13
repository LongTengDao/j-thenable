import TypeError from '.TypeError';

import { PENDING, FULFILLED, REJECTED, Status, Private, isThenable, isPromise, flow, depend, prepend, Executor, Onfulfilled, Onrejected, Private_call, get_status, get_dependents, get_value, set_dependents, set_value, set_status, delete_dependents } from './_';

export { Public as default };

type Public = Readonly<object & {
	then (this :Public, onfulfilled? :Onfulfilled, onrejected? :Onrejected) :Public,
}>;

var Public :{ new (executor :Executor) :Public } = function Thenable (this :Private, executor :Executor) :void {
	if ( typeof executor!=='function' ) { throw TypeError('new Thenable(executor is not a function)'); }
	var executed :boolean | undefined;
	var red :boolean | undefined;
	var _value :any;
	var _status :Status | undefined;
	var THIS :Private = this;
	//this instanceof Thenable || throw(TypeError());
	Private_call(THIS);
	try {
		executor(
			function resolve (value :any) {
				if ( red ) { return; }
				red = true;
				if ( executed ) {
					try {
						if ( isThenable(value) ) {
							prepend(value);
							_status = get_status(value);
							if ( _status===PENDING ) { get_dependents(value)!.push(THIS); }
							else { flow(THIS, get_value(value), _status!); }
						}
						else if ( isPromise(value) ) { depend(THIS, value); }
						else { flow(THIS, value, FULFILLED); }
					}
					catch (error) { if ( get_status(THIS)===PENDING ) { flow(THIS, error, REJECTED); } }
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
			set_dependents(THIS, []);
			return;
		}
	}
	catch (error) {
		if ( !red ) {
			red = true;
			set_value(THIS, error);
			set_status(THIS, REJECTED);
			return;
		}
	}
	try { rEd(THIS, _status!, _value); }
	catch (error) {
		if ( get_status(THIS)===PENDING ) {
			set_value(THIS, error);
			set_status(THIS, REJECTED);
			delete_dependents(THIS);
		}
	}
} as any;

function rEd (THIS :Private, status :Status, value :any) :void {
	if ( status===FULFILLED ) {
		if ( isThenable(value) ) {
			prepend(value);
			status = get_status(value);
			if ( status===PENDING ) {
				set_dependents(THIS, []);
				get_dependents(value)!.push(THIS);
			}
			else {
				set_value(THIS, get_value(value));
				set_status(THIS, status);
			}
			return;
		}
		if ( isPromise(value) ) {
			set_dependents(THIS, []);
			depend(THIS, value);
			return;
		}
	}
	set_value(THIS, value);
	set_status(THIS, status);
}
