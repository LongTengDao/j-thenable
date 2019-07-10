import undefined from '.undefined';

import { PENDING } from './_';
import then from './Thenable.prototype.then';

export default {
	_status: PENDING,
	_value: undefined,
	_on: null,
	_onfulfilled: undefined,
	_onrejected: undefined,
	then: then
};
