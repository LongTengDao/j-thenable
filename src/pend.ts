import { Private } from './_';

export default function pend (callbackfn :() => any) :Public {
	var THIS :Private = new Private;
	THIS._dependents = [];
	THIS._Value = callbackfn;
	return THIS;
};

import Public from './Thenable';