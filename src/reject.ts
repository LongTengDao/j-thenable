import { REJECTED, Private, set_status, set_value } from './_';

export default function reject (error? :any) :Public {
	var THIS :Private = new Private;
	set_status(THIS, REJECTED);
	set_value(THIS, error);
	return THIS;
};

import Public from './Thenable';