import undefined from '.undefined';

import { PENDING, REJECTED, FULFILLED, r, isPrivate, isPublic, Status, Function, Private } from './_';

export default function all (values :readonly any[]) :Public {
	var THIS :Private = new Private;
	try { all_try(values, THIS); }
	catch (error) {
		if ( THIS._status===PENDING ) {
			THIS._value = error;
			THIS._status = REJECTED;
			THIS._on = null;
		}
	}
	return THIS;
};

function all_try (values :readonly any[], THIS :Private) :void {
	THIS._on = [];
	function _onrejected (error :any) :void { THIS._status===PENDING && r(THIS, error, REJECTED); }
	var _value :any[] = [];
	var count :number = 0;
	var counted :boolean | undefined;
	for ( var length :number = values.length, index :number = 0; index<length; ++index ) {
		var value :any = values[index];
		if ( isPrivate(value) ) {
			var _status :Status = value._status;
			if ( _status===PENDING ) {
				++count;
				_value[index] = undefined;
				value._on!.push({
					_status: 0,
					_value: undefined,
					_on: null,
					_onfulfilled: function (index :number) :Function {
						return function (value :any) :void {
							if ( THIS._status===PENDING ) {
								_value[index] = value;
								if ( !--count && counted ) { r(THIS, _value, FULFILLED); }
							}
						};
					}(index),
					_onrejected: _onrejected
				} as Private);
			}
			else if ( _status===REJECTED ) {
				THIS._value = value._value;
				THIS._status = REJECTED;
				break;
			}
			else { _value[index] = value._value; }
		}
		else if ( isPublic(value) ) {
			++count;
			_value[index] = undefined;
			value.then(
				function (index :number) :Function {
					var red :boolean | undefined;
					return function (value :any) :void {
						if ( red ) { return; }
						red = true;
						if ( THIS._status===PENDING ) {
							_value[index] = value;
							if ( !--count && counted ) { r(THIS, _value, FULFILLED); }
						}
					};
				}(index),
				_onrejected
			);
		}
		else { _value[index] = value; }
	}
	counted = true;
	if ( !count && THIS._status===PENDING ) {
		THIS._value = _value;
		THIS._status = FULFILLED;
		THIS._on = null;
	}
}

import Public from './Thenable';