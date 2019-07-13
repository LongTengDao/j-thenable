import TypeError from '.TypeError';
import WeakMap from '.WeakMap';
import undefined from '.undefined';

import { PENDING, REJECTED, FULFILLED, Private, isThenable, isPromise, Status, depend, prepend, Onfulfilled, Onrejected, get_status, set_dependents, set_onfulfilled, set_onrejected, get_dependents, set_value, get_value, set_status } from './_';

export default typeof WeakMap==='function'
	? { then: then }
	: {
		_status: PENDING,
		_value: undefined,
		_dependents: undefined,
		_onfulfilled: undefined,
		_onrejected: undefined,
		_onthen: undefined,
		then: then
	};

function then (this :Private, onfulfilled? :Onfulfilled, onrejected? :Onrejected) :Private {
	var THIS :Private = this;
	var thenable :Private = new Private;
	switch ( get_status(THIS) ) {
		case PENDING:
			prepend(THIS);
			set_dependents(thenable, []);
			if ( typeof onfulfilled==='function' ) { set_onfulfilled(thenable, onfulfilled); }
			if ( typeof onrejected==='function' ) { set_onrejected(thenable, onrejected); }
			get_dependents(THIS)!.push(thenable);
			return thenable;
		case FULFILLED:
			prepend(THIS);
			if ( typeof onfulfilled==='function' ) { onto(THIS, onfulfilled, thenable); }
			else {
				set_value(thenable, get_value(THIS));
				set_status(thenable, FULFILLED);
			}
			return thenable;
		case REJECTED:
			prepend(THIS);
			if ( typeof onrejected==='function' ) { onto(THIS, onrejected, thenable); }
			else {
				set_value(thenable, get_value(THIS));
				set_status(thenable, REJECTED);
			}
			return thenable;
	}
	throw TypeError('Method Thenable.prototype.then called on incompatible receiver');
}

function onto (THIS :Private, on :(_ :any) => any, thenable :Private) {
	try { onto_try(thenable, on(get_value(THIS))); }
	catch (error) {
		if ( get_status(thenable)===PENDING ) {
			set_value(thenable, error);
			set_status(thenable, REJECTED);
		}
	}
}

function onto_try (thenable :Private, value :any) :void {
	if ( isThenable(value) ) {
		prepend(value);
		var status :Status = get_status(value);
		if ( status===PENDING ) {
			set_dependents(thenable, []);
			get_dependents(value)!.push(thenable);
		}
		else {
			set_value(thenable, get_value(value));
			set_status(thenable, status);
		}
	}
	else if ( isPromise(value) ) {
		set_dependents(thenable, []);
		depend(thenable, value);
	}
	else {
		set_value(thenable, value);
		set_status(thenable, FULFILLED);
	}
}
