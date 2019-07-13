import WeakMap from '.WeakMap';
import freeze from '.Object.freeze';
import seal from '.Object.seal';

import version from './version?text';
export { version };

import resolve from './resolve';
import reject from './reject';
import all from './all';
import race from './race';
import pend from './pend';
import AWAIT from './await';
export {
	resolve,
	reject,
	all,
	race,
	pend,
	AWAIT as await,
};

import { Private, Executor } from './_';
import Public from './Thenable';
import prototype from './Thenable.prototype';
Public.prototype = Private.prototype = typeof WeakMap==='function' ? /*#__PURE__*/ freeze(prototype) : seal ? /*#__PURE__*/ seal(prototype) : prototype;

import Default from '.default?=';
export default Default(Public, {
	version: version,
	Thenable: Public,
	resolve: resolve,
	reject: reject,
	all: all,
	race: race,
	pend: pend,
	await: AWAIT
});

var Thenable :Readonly<{ new (executor :Executor) :Public }> = freeze ? /*#__PURE__*/ freeze(Public) : Public;
type Thenable = Public;
export { Thenable };
