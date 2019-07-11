import { Type, THENABLE, PROMISE, Type, depend, FULFILLED, REJECTED, PENDING, Private } from './_';

export default function resolve (value? :any) :Public {
	var type :Type = Type(value);
	if ( type===THENABLE ) { return value; }
	var THIS :Private = new Private;
	if ( type===PROMISE ) {
		THIS._dependents = [];
		try_depend(THIS, value);
	}
	else {
		THIS._value = value;
		THIS._status = FULFILLED;
	}
	return THIS;
};

function try_depend (THIS :Private, value :any) {
	try { depend(THIS, value); }
	catch (error) {
		if ( THIS._status===PENDING ) {
			THIS._value = error;
			THIS._status = REJECTED;
		}
	}
}

import Public from './Thenable';