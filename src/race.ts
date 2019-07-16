import { flow, prepend, PENDING, FULFILLED, REJECTED, Status, isThenable, isPromise, Private, get_status, set_value, set_status, delete_dependents, set_dependents, get_dependents, get_value, set_onfulfilled, set_onrejected } from './_';

export default function race (values :readonly any[]) :Public {
	var THIS :Private = new Private;
	try { race_try(values, THIS); }
	catch (error) {
		if ( get_status(THIS)===PENDING ) {
			set_value(THIS, error);
			set_status(THIS, REJECTED);
			delete_dependents(THIS);
		}
	}
	return THIS;
};

function race_try (values :readonly any[], THIS :Private) :void {
	set_dependents(THIS, []);
	function onfulfilled (value :any) :any { get_status(THIS)===PENDING && flow(THIS, value, FULFILLED); }
	function onrejected (error :any) :any { get_status(THIS)===PENDING && flow(THIS, error, REJECTED); }
	var that :Private = new Private;
	set_onfulfilled(that, onfulfilled);
	set_onrejected(that, onrejected);
	for ( var length :number = values.length, index :number = 0; index<length; ++index ) {
		var value :any = values[index];
		if ( isThenable(value) ) {
			prepend(value);
			var _status :Status = get_status(value);
			if ( _status===PENDING ) { get_dependents(value)!.push(that); }
			else {
				set_value(THIS, get_value(value));
				set_status(THIS, _status);
				break;
			}
		}
		else if ( isPromise(value) ) {
			value.then(onfulfilled, onrejected);
			if ( get_status(THIS)!==PENDING ) { break; }
		}
		else {
			set_value(THIS, value);
			set_status(THIS, FULFILLED);
			break;
		}
	}
}

import Public from './Thenable';