import TypeError from '.TypeError';

import { PENDING, REJECTED, FULFILLED, Function, Private, isPrivate, Status, isPublic, wait } from './_';

export default function then (this :Private, onfulfilled? :Function, onrejected? :Function) :Private {
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
			if ( typeof onfulfilled==='function' ) { onto(THIS, onfulfilled, thenable); }
			else {
				thenable._value = THIS._value;
				thenable._status = FULFILLED;
			}
			return thenable;
		case REJECTED:
			if ( typeof onrejected==='function' ) { onto(THIS, onrejected, thenable); }
			else {
				thenable._value = THIS._value;
				thenable._status = REJECTED;
			}
			return thenable;
	}
	throw TypeError('Method Thenable.prototype.then called on incompatible receiver');
};

function onto (THIS :Private, on :Function, thenable :Private) {
	try { onto_try(thenable, on(THIS._value)); }
	catch (error) {
		if ( thenable._status===PENDING ) {
			thenable._value = error;
			thenable._status = REJECTED;
		}
	}
}

function onto_try (thenable :Private, value :any) :void {
	if ( isPrivate(value) ) {
		var status :Status = value._status;
		if ( status===PENDING ) {
			thenable._on = [];
			value._on!.push(thenable);
		}
		else {
			thenable._value = value._value;
			thenable._status = status;
		}
	}
	else if ( isPublic(value) ) {
		thenable._on = [];
		wait(thenable, value);
	}
	else {
		thenable._value = value;
		thenable._status = FULFILLED;
	}
}
