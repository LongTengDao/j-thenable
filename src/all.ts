import undefined from '.undefined';

import { PENDING, REJECTED, FULFILLED, flow, prepend, isThenable, isPromise, Status, Private, Onfulfilled, get_status, set_value, set_status, delete_dependents, set_dependents, get_dependents, get_value } from './_';

export default function all (values :readonly any[]) :Public {
	var THIS :Private = new Private;
	try { all_try(values, THIS); }
	catch (error) {
		if ( get_status(THIS)===PENDING ) {
			set_value(THIS, error);
			set_status(THIS, REJECTED);
			delete_dependents(THIS);
		}
	}
	return THIS;
};

function all_try (values :readonly any[], THIS :Private) :void {
	set_dependents(THIS, []);
	function _onrejected (error :any) :any { get_status(THIS)===PENDING && flow(THIS, error, REJECTED); }
	var _value :any[] = [];
	var count :number = 0;
	var counted :boolean | undefined;
	for ( var length :number = values.length, index :number = 0; index<length; ++index ) {
		var value :any = values[index];
		if ( isThenable(value) ) {
			prepend(value);
			var _status :Status = get_status(value);
			if ( _status===PENDING ) {
				++count;
				_value[index] = undefined;
				get_dependents(value)!.push({
					_status: 0,
					_value: undefined,
					_dependents: undefined,
					_onfulfilled: function (index :number) :Onfulfilled {
						return function (value :any) :void {
							if ( get_status(THIS)===PENDING ) {
								_value[index] = value;
								if ( !--count && counted ) { flow(THIS, _value, FULFILLED); }
							}
						};
					}(index),
					_onrejected: _onrejected
				} as Private);
			}
			else if ( _status===REJECTED ) {
				set_value(THIS, get_value(value));
				set_status(THIS, REJECTED);
				break;
			}
			else { _value[index] = get_value(value); }
		}
		else if ( isPromise(value) ) {
			++count;
			_value[index] = undefined;
			value.then(
				function (index :number) :Onfulfilled {
					var red :boolean | undefined;
					return function (value :any) :void {
						if ( red ) { return; }
						red = true;
						if ( get_status(THIS)===PENDING ) {
							_value[index] = value;
							if ( !--count && counted ) { flow(THIS, _value, FULFILLED); }
						}
					};
				}(index),
				_onrejected
			);
		}
		else { _value[index] = value; }
	}
	counted = true;
	if ( !count && get_status(THIS)===PENDING ) {
		set_value(THIS, _value);
		set_status(THIS, FULFILLED);
		delete_dependents(THIS);
	}
}

import Public from './Thenable';