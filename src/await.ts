import { isThenable, FULFILLED, REJECTED, prepend, get_status, get_value } from './_';

export default {
	await: function (value :any) :any {
		if ( isThenable(value) ) {
			prepend(value);
			switch ( get_status(value) ) {
				case FULFILLED:
					return get_value(value);
				case REJECTED:
					throw get_value(value);
			}
		}
		return value;
	}
}.await;
