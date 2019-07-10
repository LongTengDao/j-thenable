import TypeError from '.TypeError';

import { Status, PENDING, FULFILLED, REJECTED, isPrivate, isPublic, r, wait, Function, Private, Executor } from './_';

export { Public as default };

type Public = Readonly<object & {
	then (this :Public, onfulfilled? :Function, onrejected? :Function) :Public,
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
						if ( isPrivate(value) ) {
							_status = value._status;
							if ( _status===PENDING ) { value._on!.push(THIS); }
							else { r(THIS, value._value, _status!); }
						}
						else if ( isPublic(value) ) { wait(THIS, value); }
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
} as any;

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
			wait(THIS, _value);
			return;
		}
	}
	THIS._value = _value;
	THIS._status = _status!;
}
