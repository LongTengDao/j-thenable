import { REJECTED, Private } from './_';

export default function reject (error? :any) :Public {
	var THIS :Private = new Private;
	THIS._status = REJECTED;
	THIS._value = error;
	return THIS;
};

import Public from './Thenable';