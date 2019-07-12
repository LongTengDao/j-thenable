import { isThenableOnly, FULFILLED, REJECTED, prepend } from './_';

export default {
	await: function (value :any) :any {
		if ( isThenableOnly(value) ) {
			prepend(value);
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
