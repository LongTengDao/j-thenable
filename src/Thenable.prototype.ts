import TypeError from '.TypeError';
import undefined from '.undefined';

import { PENDING, REJECTED, FULFILLED, Private, Type, THENABLE, PROMISE, Type, Status, depend, flow, Onfulfilled, Onrejected } from './_';

export default {
	_status: PENDING,
	_value: undefined,
	_dependents: null,
	_onfulfilled: undefined,
	_onrejected: undefined,
	_Value: undefined,
	then: function then (this :Private, onfulfilled? :Onfulfilled, onrejected? :Onrejected) :Private {
		var THIS :Private = this;
		var callbackfn :( () => any ) | undefined = THIS._Value;
		if ( callbackfn ) {
			THIS._Value = undefined;
			callbackAs(callbackfn, THIS);
		}
		var thenable :Private = new Private;
		switch ( THIS._status ) {
			case PENDING:
				thenable._dependents = [];
				thenable._onfulfilled = onfulfilled;
				thenable._onrejected = onrejected;
				THIS._dependents!.push(thenable);
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
	}
};

function callbackAs (callbackfn :() => any, THIS :Private) :void {
	try { flow(THIS, callbackfn(), FULFILLED); }
	catch (error) { flow(THIS, error, REJECTED); }
}

function onto (THIS :Private, on :(_ :any) => any, thenable :Private) {
	try { onto_try(thenable, on(THIS._value)); }
	catch (error) {
		if ( thenable._status===PENDING ) {
			thenable._value = error;
			thenable._status = REJECTED;
		}
	}
}

function onto_try (thenable :Private, value :any) :void {
	var type :Type = Type(value);
	if ( type===THENABLE ) {
		var status :Status = value._status;
		if ( status===PENDING ) {
			thenable._dependents = [];
			value._dependents!.push(thenable);
		}
		else {
			thenable._value = value._value;
			thenable._status = status;
		}
	}
	else if ( value===PROMISE ) {
		thenable._dependents = [];
		depend(thenable, value);
	}
	else {
		thenable._value = value;
		thenable._status = FULFILLED;
	}
}
