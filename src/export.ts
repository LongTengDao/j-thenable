import seal from '.Object.seal';
import freeze from '.Object.freeze';

import version from './version?text';
export { version };

import resolve from './resolve';
import reject from './reject';
import all from './all';
import race from './race';
export {
	resolve,
	reject,
	all,
	race,
};

import { Private, Executor } from './_';
import Public from './Thenable';
import prototype from './Thenable.prototype';
Public.prototype = Private.prototype = seal ? /*#__PURE__*/ seal(prototype) : prototype;

import Default from '.default?=';
export default Default(Public, {
	version: version,
	Thenable: Public,
	resolve: resolve,
	reject: reject,
	all: all,
	race: race
});

var Thenable :Readonly<{ new (executor :Executor) :Public }> = freeze ? /*#__PURE__*/ freeze(Public) : Public;
type Thenable = Public;
export { Thenable };
