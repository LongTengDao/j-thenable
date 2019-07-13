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
	
	Thenable.race([
		new Thenable(function executor (resolve) { setTimeout(function () { resolve(1); }, 0); }),
		new Thenable(function executor (resolve) { resolve(2); }),
		new Thenable(function executor (resolve) { resolve(3); }),
	]).then(function onfulfilled (value) {
		if ( value!==2 ) { e = e || Error(`got value ${value} when 2 is expected`); }
	});
	
	Thenable.all([
		new Thenable(function executor (resolve) { resolve(1); }),
		new Thenable(function executor (resolve, reject) { reject(2); }),
		new Thenable(function executor (resolve) { resolve(3); }),
	]).then('ignore', function onrejected (error) {
		if ( error!==2 ) { e = e || Error(`got error ${error} when 2 is expected`); }
	});
	
	Thenable.all([
		new Thenable(function executor (resolve) { log(7); resolve(1); log(8); }),
		new Thenable(function executor (resolve) { log(9); resolve(2); log(10); }),
		new Thenable(function executor (resolve) { log(11); resolve(3); log(12); }),
	]).then(function onfulfilled (values) {
		if ( ''+values!=='1,2,3' ) { e = e || Error(`got values ${values} when 1,2,3 is expected`); }
		log(13);
	});
	
	const thenable = new Thenable(function executor (resolve) {
		setTimeout(resolve, 0);
	}).then(function onfulfilled () {
		log(15);
	});
	
	log(14);
	
	await thenable;
	
	log(16);
	
	Thenable.all([
		Thenable.pend(function onthen () {
			return Thenable.resolve(1);
		}),
		Thenable.resolve(2),
	]).then(function onfulfilled (values) {
		if ( ''+values!=='1,2' ) { e = e || Error(`got values ${values} when 1,2 is expected`); }
	});
	
	if ( e ) { throw e; }
	
});
