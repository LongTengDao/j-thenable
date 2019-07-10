import undefined from '.undefined';

import { r, PENDING, FULFILLED, REJECTED, Status, isPrivate, isPublic, Private } from './_';

export default function race (values :readonly any[]) :Public {
	var THIS :Private = new Private;
	try { race_try(values, THIS); }
	catch (error) {
		if ( THIS._status===PENDING ) {
			THIS._value = error;
			THIS._status = REJECTED;
			THIS._on = null;
		}
	}
	return THIS;
};

function race_try (values :readonly any[], THIS :Private) :void {
	THIS._on = [];
	function _onfulfilled (value :any) :void { THIS._status===PENDING && r(THIS, value, FULFILLED); }
	function _onrejected (error :any) :void { THIS._status===PENDING && r(THIS, error, REJECTED); }
	var that :Private = {
		_status: 0,
		_value: undefined,
		_on: null,
		_onfulfilled: _onfulfilled,
		_onrejected: _onrejected
	} as Private;
	for ( var length :number = values.length, index :number = 0; index<length; ++index ) {
		var value :any = values[index];
		if ( isPrivate(value) ) {
			var _status :Status = value._status;
			if ( _status===PENDING ) { value._on!.push(that); }
			else {
				THIS._value = value._value;
				THIS._status = _status;
				break;
			}
		}
		else if ( isPublic(value) ) {
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