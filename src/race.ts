import undefined from '.undefined';

import { flow, prepend, PENDING, FULFILLED, REJECTED, Status, isThenable, beenPromise, Private } from './_';

export default function race (values :readonly any[]) :Public {
	var THIS :Private = new Private;
	try { race_try(values, THIS); }
	catch (error) {
		if ( THIS._status===PENDING ) {
			THIS._value = error;
			THIS._status = REJECTED;
			THIS._dependents = null;
		}
	}
	return THIS;
};

function race_try (values :readonly any[], THIS :Private) :void {
	THIS._dependents = [];
	function _onfulfilled (value :any) :any { THIS._status===PENDING && flow(THIS, value, FULFILLED); }
	function _onrejected (error :any) :any { THIS._status===PENDING && flow(THIS, error, REJECTED); }
	var that :Private = {
		_status: 0,
		_value: undefined,
		_dependents: null,
		_onfulfilled: _onfulfilled,
		_onrejected: _onrejected
	} as Private;
	for ( var length :number = values.length, index :number = 0; index<length; ++index ) {
		var value :any = values[index];
		if ( isThenable(value) ) {
			prepend(value);
			var _status :Status = value._status;
			if ( _status===PENDING ) { value._dependents!.push(that); }
			else {
				THIS._value = value._value;
				THIS._status = _status;
				break;
			}
		}
		else if ( beenPromise(value) ) {
			value.then(_onfulfilled, _onrejected);
			if ( THIS._status!==PENDING ) { break; }
		}
		else {
			THIS._value = value;
			THIS._status = FULFILLED;
			break;
		}
	}
}

import Public from './Thenable';