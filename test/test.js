'use strict';

module.exports = require('@ltd/j-dev')(__dirname+'/..')(async function ({ import_default }) {
	
	const Thenable = await import_default('src/default', { ES: 3 });
	
	let e;
	
	let n = -1;
	
	function log (m) {
		if ( e ) { return; }
		if ( m!==++n ) { e = e || Error(`log(${m}) when ${n} is expected`); }
	}
	
	log(0);
	
	new Thenable(function executor (resolve) {
		log(1)
		resolve('executor');
		log(2);
	}).then(function onfulfilled (value) {
		if ( value!=='executor' ) { e = e || Error(`got ${value} when 'executor' is expected`); }
		log(3);
		return 'onfulfilled';
	}).then(function onfulfilled (value) {
		if ( value!=='onfulfilled' ) { e = e || Error(`got ${value} when 'onfulfilled' is expected`); }
		log(4);
		throw 'error';
	}, function onrejected () {
		e = e || Error(`onrejected is executed`);
	}).then('ignore', function onrejected (error) {
		if ( error!=='error' ) { e = e || Error(`got ${error} when 'error' is expected`); }
		log(5);
	});
	
	log(6);
	
	if ( e ) { throw e; }
	
});
