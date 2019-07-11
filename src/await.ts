import { isThenable, FULFILLED, REJECTED } from './_';

export default {
	await: function (value :any) :any {
		if ( isThenable(value) ) {
			switch ( value._status ) {
				case FULFILLED:
					return value._value;
				case REJECTED:
					throw value._value;
			}
		}
		return value;
	}
}.await;
