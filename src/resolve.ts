import { isPrivate, isPublic, wait, FULFILLED, REJECTED, PENDING, Private } from './_';

export default function resolve (value :any) :Public {
	if ( isPrivate(value) ) { return value; }
	var THIS :Private = new Private;
	try {
		if ( isPublic(value) ) {
			THIS._on = [];
			wait(THIS, value);
		}
		else {
			THIS._value = value;
			THIS._status = FULFILLED;
		}
	}
	catch (error) {
		if ( THIS._status===PENDING ) {
			THIS._value = error;
			THIS._status = REJECTED;
		}
	}
	return THIS;
};

import Public from './Thenable';