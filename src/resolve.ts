import { isThenable, isPromise, depend, FULFILLED, REJECTED, PENDING, Private, set_dependents, set_value, set_status, get_status } from './_';

export default function resolve (value? :any) :Public {
	if ( isThenable(value) ) { return value; }
	var THIS :Private = new Private;
	if ( isPromise(value) ) {
		set_dependents(THIS, []);
		try_depend(THIS, value);
	}
	else {
		set_value(THIS, value);
		set_status(THIS, FULFILLED);
	}
	return THIS;
};

function try_depend (THIS :Private, value :any) {
	try { depend(THIS, value); }
	catch (error) {
		if ( get_status(THIS)===PENDING ) {
			set_value(THIS, error);
			set_status(THIS, REJECTED);
		}
	}
}

import Public from './Thenable';