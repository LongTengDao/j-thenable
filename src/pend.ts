import TypeError from '.TypeError';

import { Private, Onthen, set_dependents, set_onthen } from './_';

export default function pend (onthen :Onthen) :Public {
	if ( typeof onthen!=='function' ) { throw TypeError('Thenable.pend(onthen is not a function)'); }
	var THIS :Private = new Private;
	set_dependents(THIS, []);
	set_onthen(THIS, onthen);
	return THIS;
};

import Public from './Thenable';