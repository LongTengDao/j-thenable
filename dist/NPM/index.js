'use strict';

var freeze = Object.freeze;

var seal = Object.seal;

var version = '4.4.0';

var getPrototypeOf = Object.getPrototypeOf;

var preventExtensions = Object.preventExtensions;

var undefined$1 = void 0;

var PENDING    = 0;
var FULFILLED    = 1;
var REJECTED    = 2;

var Private_call                         ;
var Private                      = function Private (             )       { Private_call(this); }       ;
var isThenable                                  ;

var delete_dependents                         ;
var delete_onrejected                         ;
var delete_onfulfilled                         ;
var delete_onthen                         ;
var delete_onfulfilled_if_has                         ;
var delete_onrejected_if_has                         ;

var get_status                           ;
var get_value                        ;
var get_dependents                                          ;
var get_onfulfilled                                            ;
var get_onrejected                                           ;
var get_onthen                                       ;

var set_status                                         ;
var set_value                                     ;
var set_dependents                                                ;
var set_onfulfilled                                                   ;
var set_onrejected                                                 ;
var set_onthen                                         ;

if ( typeof WeakMap==='function' ) {
	var STATUS                           = new WeakMap;
	var VALUE                        = new WeakMap;
	var DEPENDENTS                              = new WeakMap;
	var ONFULFILLED                                = new WeakMap;
	var ONREJECTED                               = new WeakMap;
	var ONTHEN                           = new WeakMap;
	
	Private_call = preventExtensions && /*#__PURE__*/ function () {
		var o      = preventExtensions({});
		VALUE.set(o, o);
		return VALUE.has(o);
	}()
		? function Private_call (THIS         )       { STATUS.set(preventExtensions(THIS), PENDING); }
		: function Private_call (THIS         )       { STATUS.set(THIS, PENDING); };
	isThenable = function isThenable (value     )                   { return STATUS.has(value); };
	
	/* delete: */
	delete_dependents = function delete_dependents (THIS         )       { DEPENDENTS['delete'](THIS); };
	delete_onfulfilled = function delete_onfulfilled (THIS         )       { ONFULFILLED['delete'](THIS); };
	delete_onrejected = function delete_onrejected (THIS         )       { ONREJECTED['delete'](THIS); };
	delete_onthen = function delete_onthen (THIS         )       { ONTHEN['delete'](THIS); };
	delete_onfulfilled_if_has = delete_onfulfilled;
	delete_onrejected_if_has = delete_onrejected;/**/
	/* set undefined: * /
	delete_dependents = function delete_dependents (THIS :Private) :void { DEPENDENTS.set(THIS, undefined!); };
	delete_onfulfilled = function delete_onfulfilled (THIS :Private) :void { ONFULFILLED.set(THIS, undefined!); };
	delete_onrejected = function delete_onrejected (THIS :Private) :void { ONREJECTED.set(THIS, undefined!); };
	delete_onthen = function delete_onthen (THIS :Private) :void { ONTHEN.set(THIS, undefined!); };
	delete_onfulfilled_if_has = function delete_onfulfilled_if_has (THIS :Private) :void { ONFULFILLED.has(THIS) && ONFULFILLED.set(THIS, undefined!); };
	delete_onrejected_if_has = function delete_onrejected_if_has (THIS :Private) :void { ONREJECTED.has(THIS) && ONREJECTED.set(THIS, undefined!); };/**/
	
	get_status = function get_status (THIS         )         { return STATUS.get(THIS) ; };
	get_value = function get_value (THIS         )      { return VALUE.get(THIS); };
	get_dependents = function get_dependents (THIS         )                        { return DEPENDENTS.get(THIS); };
	get_onfulfilled = function get_onfulfilled (THIS         )                          { return ONFULFILLED.get(THIS); };
	get_onrejected = function get_onrejected (THIS         )                         { return ONREJECTED.get(THIS); };
	get_onthen = function get_onthen (THIS         )                     { return ONTHEN.get(THIS); };
	
	set_status = function set_status (THIS         , status        )       { STATUS.set(THIS, status); };
	set_value = function set_value (THIS         , value     )       { VALUE.set(THIS, value); };
	set_dependents = function set_dependents (THIS         , dependents           )       { DEPENDENTS.set(THIS, dependents); };
	set_onfulfilled = function set_onfulfilled (THIS         , onfulfilled             )       { ONFULFILLED.set(THIS, onfulfilled); };
	set_onrejected = function set_onrejected (THIS         , onrejected            )       { ONREJECTED.set(THIS, onrejected); };
	set_onthen = function set_onthen (THIS         , onthen        )       { ONTHEN.set(THIS, onthen); };
}
else {
	Private_call = function Private_call ()       { };
	isThenable = getPrototypeOf
		? function (value     )                   {
			var Private_prototype          = Private.prototype;
			isThenable = function isThenable (value     )                   { return value!=null && getPrototypeOf(value)===Private_prototype; };
			return isThenable(value);
		}
		: function isThenable (value     )                   { return value instanceof Private; };
	
	/* set undefined: */
	delete_dependents = function delete_dependents (THIS         )       { THIS._dependents = undefined$1; };
	delete_onfulfilled = function delete_onfulfilled (THIS         )       { THIS._onfulfilled = undefined$1; };
	delete_onrejected = function delete_onrejected (THIS         )       { THIS._onrejected = undefined$1; };
	delete_onthen = function delete_onthen (THIS         )       { THIS._onthen = undefined$1; };
	delete_onfulfilled_if_has = function delete_onfulfilled_if_has (THIS         )       { if ( THIS._onfulfilled ) { THIS._onfulfilled = undefined$1; } };
	delete_onrejected_if_has = function delete_onrejected_if_has (THIS         )       { if ( THIS._onrejected ) { THIS._onrejected = undefined$1; } };/**/
	
	get_status = function get_status (THIS         )         { return THIS._status; };
	get_value = function get_value (THIS         )      { return THIS._value; };
	get_dependents = function get_dependents (THIS         )                        { return THIS._dependents; };
	get_onfulfilled = function get_onfulfilled (THIS         )                          { return THIS._onfulfilled; };
	get_onrejected = function get_onrejected (THIS         )                         { return THIS._onrejected; };
	get_onthen = function get_onthen (THIS         )                     { return THIS._onthen; };
	
	set_status = function set_status (THIS         , status        )       { THIS._status = status; };
	set_value = function set_value (THIS         , value     )       { THIS._value = value; };
	set_dependents = function set_dependents (THIS         , dependents           )       { THIS._dependents = dependents; };
	set_onfulfilled = function set_onfulfilled (THIS         , onfulfilled             )       { THIS._onfulfilled = onfulfilled; };
	set_onrejected = function set_onrejected (THIS         , onrejected            )       { THIS._onrejected = onrejected; };
	set_onthen = function set_onthen (THIS         , onthen        )       { THIS._onthen = onthen; };
}

var isPromise                                                  = typeof Promise==='function'
	? function () {
		if ( getPrototypeOf ) {
			var prototype = Promise.prototype;
			return function isPromise (value     )                                  { return value!=null && getPrototypeOf(value)===prototype; };
		}
		else {
			var constructor = Promise;
			return function isPromise (value     )                                  { return value instanceof constructor; };
		}
	}()
	: function isPromise () { return false; }       ;

                                                                                          
var prependStack                      = null;
var prepending          = false;
function prepend (thenable         )       {
	var _onthen                     = get_onthen(thenable);
	if ( !_onthen ) { return; }
	delete_onthen(thenable);
	if ( prepending ) {
		prependStack = { nextStack: prependStack, thenable: thenable, onthen: _onthen };
		return;
	}
	prepending = true;
	for ( ; ; ) {
		try {
			var value      = _onthen();
			if ( isThenable(value) ) {
				_onthen = get_onthen(value);
				if ( _onthen ) {
					delete_onthen(value);
					get_dependents(value) .push(thenable);
					prependStack = { nextStack: prependStack, thenable: value, onthen: _onthen };
				}
				else {
					var status         = get_status(value);
					if ( status===PENDING ) { get_dependents(value) .push(thenable); }
					else { flow(thenable, get_value(value), status); }
				}
			}
			else if ( isPromise(value) ) { depend(thenable, value); }
			else { flow(thenable, value, FULFILLED); }
		}
		catch (error) { flow(thenable, error, REJECTED); }
		if ( !prependStack ) { break; }
		thenable = prependStack.thenable;
		_onthen = prependStack.onthen;
		prependStack = prependStack.nextStack;
	}
	prepending = false;
}

                                                                                                
var flowStack                   = null;
var flowing          = false;
function flow (thenable         , value     , status        )       {
	if ( flowing ) {
		flowStack = { nextStack: flowStack, thenable: thenable, value: value, status: status };
		return;
	}
	flowing = true;
	for ( var _status        ; ; ) {
		stack: {
			if ( status===FULFILLED ) {
				delete_onrejected_if_has(thenable);
				var _onfulfilled                          = get_onfulfilled(thenable);
				if ( _onfulfilled ) {
					delete_onfulfilled(thenable);
					try {
						value = _onfulfilled(value);
						if ( isThenable(value) ) {
							prepend(value);
							_status = get_status(value);
							if ( _status===PENDING ) {
								get_dependents(value) .push(thenable);
								break stack;
							}
							else {
								value = get_value(value);
								status = _status;
							}
						}
						else if ( isPromise(value) ) {
							depend(thenable, value);
							break stack;
						}
					}
					catch (error) {
						if ( get_status(thenable)!==PENDING ) { break stack; }
						value = error;
						status = REJECTED;
					}
				}
			}
			else {
				delete_onfulfilled_if_has(thenable);
				var _onrejected                         = get_onrejected(thenable);
				if ( _onrejected ) {
					delete_onrejected(thenable);
					try {
						value = _onrejected(value);
						if ( isThenable(value) ) {
							prepend(value);
							_status = get_status(value);
							if ( _status===PENDING ) {
								get_dependents(value) .push(thenable);
								break stack;
							}
							else {
								value = get_value(value);
								status = _status;
							}
						}
						else if ( isPromise(value) ) {
							depend(thenable, value);
							break stack;
						}
						else { status = FULFILLED; }
					}
					catch (error) {
						if ( get_status(thenable)!==PENDING ) { break stack; }
						value = error;
					}
				}
			}
			set_value(thenable, value);
			set_status(thenable, status);
			var _dependents                        = get_dependents(thenable);
			if ( _dependents ) {
				delete_dependents(thenable);
				for ( var index         = _dependents.length; index; ) {
					flowStack = { nextStack: flowStack, thenable: _dependents[--index], value: value, status: status };
				}
			}
		}
		if ( !flowStack ) { break; }
		thenable = flowStack.thenable;
		value = flowStack.value;
		status = flowStack.status;
		flowStack = flowStack.nextStack;
	}
	flowing = false;
}

function depend (thenable         , value                                          )       {
	var red                     ;
	value.then(
		function onfulfilled (value     )       {
			if ( red ) { return; }
			red = true;
			flow(thenable, value, FULFILLED);
		},
		function onrejected (error     )       {
			if ( red ) { return; }
			red = true;
			flow(thenable, error, REJECTED);
		}
	);
}

var Public                                       = function Thenable (               executor          )       {
	if ( typeof executor!=='function' ) { throw TypeError('new Thenable(executor is not a function)'); }
	var executed                     ;
	var red                     ;
	var _value     ;
	var _status                    ;
	var THIS          = this;
	//this instanceof Thenable || throw(TypeError());
	Private_call(THIS);
	try {
		executor(
			function resolve (value     ) {
				if ( red ) { return; }
				red = true;
				if ( executed ) {
					try {
						if ( isThenable(value) ) {
							prepend(value);
							_status = get_status(value);
							if ( _status===PENDING ) { get_dependents(value) .push(THIS); }
							else { flow(THIS, get_value(value), _status ); }
						}
						else if ( isPromise(value) ) { depend(THIS, value); }
						else { flow(THIS, value, FULFILLED); }
					}
					catch (error) { if ( get_status(THIS)===PENDING ) { flow(THIS, error, REJECTED); } }
				}
				else {
					_value = value;
					_status = FULFILLED;
				}
			},
			function reject (error     ) {
				if ( red ) { return; }
				red = true;
				if ( executed ) { flow(THIS, error, REJECTED); }
				else {
					_value = error;
					_status = REJECTED;
				}
			}
		);
		if ( !red ) {
			executed = true;
			set_dependents(THIS, []);
			return;
		}
	}
	catch (error) {
		if ( !red ) {
			red = true;
			set_value(THIS, error);
			set_status(THIS, REJECTED);
			return;
		}
	}
	try { rEd(THIS, _status , _value); }
	catch (error) {
		if ( get_status(THIS)===PENDING ) {
			set_value(THIS, error);
			set_status(THIS, REJECTED);
			delete_dependents(THIS);
		}
	}
}       ;

function rEd (THIS         , status        , value     )       {
	if ( status===FULFILLED ) {
		if ( isThenable(value) ) {
			prepend(value);
			status = get_status(value);
			if ( status===PENDING ) {
				set_dependents(THIS, []);
				get_dependents(value) .push(THIS);
			}
			else {
				set_value(THIS, get_value(value));
				set_status(THIS, status);
			}
			return;
		}
		if ( isPromise(value) ) {
			set_dependents(THIS, []);
			depend(THIS, value);
			return;
		}
	}
	set_value(THIS, value);
	set_status(THIS, status);
}

function resolve (value      )         {
	if ( isThenable(value) ) { return value; }
	var THIS          = new Private;
	if ( isPromise(value) ) {
		set_dependents(THIS, []);
		try_depend(THIS, value);
	}
	else {
		set_value(THIS, value);
		set_status(THIS, FULFILLED);
	}
	return THIS;
}
function try_depend (THIS         , value     ) {
	try { depend(THIS, value); }
	catch (error) {
		if ( get_status(THIS)===PENDING ) {
			set_value(THIS, error);
			set_status(THIS, REJECTED);
		}
	}
}

function reject (error      )         {
	var THIS          = new Private;
	set_status(THIS, REJECTED);
	set_value(THIS, error);
	return THIS;
}

function all (values                )         {
	var THIS          = new Private;
	try { all_try(values, THIS); }
	catch (error) {
		if ( get_status(THIS)===PENDING ) {
			set_value(THIS, error);
			set_status(THIS, REJECTED);
			delete_dependents(THIS);
		}
	}
	return THIS;
}
function all_try (values                , THIS         )       {
	set_dependents(THIS, []);
	function onrejected (error     )      { get_status(THIS)===PENDING && flow(THIS, error, REJECTED); }
	var _value        = [];
	var count         = 0;
	var counted                     ;
	for ( var length         = values.length, index         = 0; index<length; ++index ) {
		var value      = values[index];
		if ( isThenable(value) ) {
			prepend(value);
			var _status         = get_status(value);
			if ( _status===PENDING ) {
				++count;
				_value[index] = undefined$1;
				var that          = new Private;
				( function (index        ) {
					set_onfulfilled(that, function onfulfilled (value     )       {
						if ( get_status(THIS)===PENDING ) {
							_value[index] = value;
							if ( !--count && counted ) { flow(THIS, _value, FULFILLED); }
						}
					});
				} )(index);
				set_onrejected(that, onrejected);
				get_dependents(value) .push(that);
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
			_value[index] = undefined$1;
			( function (index        ) {
				var red                     ;
				value.then(
					function onfulfilled (value     )       {
						if ( red ) { return; }
						red = true;
						if ( get_status(THIS)===PENDING ) {
							_value[index] = value;
							if ( !--count && counted ) { flow(THIS, _value, FULFILLED); }
						}
					},
					onrejected
				);
			} )(index);
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

function race (values                )         {
	var THIS          = new Private;
	try { race_try(values, THIS); }
	catch (error) {
		if ( get_status(THIS)===PENDING ) {
			set_value(THIS, error);
			set_status(THIS, REJECTED);
			delete_dependents(THIS);
		}
	}
	return THIS;
}
function race_try (values                , THIS         )       {
	set_dependents(THIS, []);
	function onfulfilled (value     )      { get_status(THIS)===PENDING && flow(THIS, value, FULFILLED); }
	function onrejected (error     )      { get_status(THIS)===PENDING && flow(THIS, error, REJECTED); }
	var that          = new Private;
	set_onfulfilled(that, onfulfilled);
	set_onrejected(that, onrejected);
	for ( var length         = values.length, index         = 0; index<length; ++index ) {
		var value      = values[index];
		if ( isThenable(value) ) {
			prepend(value);
			var _status         = get_status(value);
			if ( _status===PENDING ) { get_dependents(value) .push(that); }
			else {
				set_value(THIS, get_value(value));
				set_status(THIS, _status);
				break;
			}
		}
		else if ( isPromise(value) ) {
			value.then(onfulfilled, onrejected);
			if ( get_status(THIS)!==PENDING ) { break; }
		}
		else {
			set_value(THIS, value);
			set_status(THIS, FULFILLED);
			break;
		}
	}
}

function pend (onthen        )         {
	if ( typeof onthen!=='function' ) { throw TypeError('Thenable.pend(onthen is not a function)'); }
	var THIS          = new Private;
	set_dependents(THIS, []);
	set_onthen(THIS, onthen);
	return THIS;
}

var AWAIT = {
	await: function (value     )      {
		if ( isThenable(value) ) {
			prepend(value);
			switch ( get_status(value) ) {
				case FULFILLED:
					return get_value(value);
				case REJECTED:
					throw get_value(value);
			}
		}
		return value;
	}
}.await;

var prototype = typeof WeakMap==='function'
	? { then: then }
	: {
		_status: PENDING,
		_value: undefined$1,
		_dependents: undefined$1,
		_onfulfilled: undefined$1,
		_onrejected: undefined$1,
		_onthen: undefined$1,
		then: then
	};

function then (               onfulfilled              , onrejected             )          {
	var THIS          = this;
	if ( isThenable(THIS) ) {
		prepend(THIS);
		var thenable          = new Private;
		switch ( get_status(THIS) ) {
			case PENDING:
				set_dependents(thenable, []);
				if ( typeof onfulfilled==='function' ) { set_onfulfilled(thenable, onfulfilled); }
				if ( typeof onrejected==='function' ) { set_onrejected(thenable, onrejected); }
				get_dependents(THIS) .push(thenable);
				return thenable;
			case FULFILLED:
				if ( typeof onfulfilled==='function' ) { onto(THIS, onfulfilled, thenable); }
				else {
					set_value(thenable, get_value(THIS));
					set_status(thenable, FULFILLED);
				}
				return thenable;
			case REJECTED:
				if ( typeof onrejected==='function' ) { onto(THIS, onrejected, thenable); }
				else {
					set_value(thenable, get_value(THIS));
					set_status(thenable, REJECTED);
				}
				return thenable;
		}
	}
	throw TypeError('Method Thenable.prototype.then called on incompatible receiver');
}

function onto (THIS         , on                 , thenable         ) {
	try { onto_try(thenable, on(get_value(THIS))); }
	catch (error) {
		if ( get_status(thenable)===PENDING ) {
			set_value(thenable, error);
			set_status(thenable, REJECTED);
		}
	}
}

function onto_try (thenable         , value     )       {
	if ( isThenable(value) ) {
		prepend(value);
		var status         = get_status(value);
		if ( status===PENDING ) {
			set_dependents(thenable, []);
			get_dependents(value) .push(thenable);
		}
		else {
			set_value(thenable, get_value(value));
			set_status(thenable, status);
		}
	}
	else if ( isPromise(value) ) {
		set_dependents(thenable, []);
		depend(thenable, value);
	}
	else {
		set_value(thenable, value);
		set_status(thenable, FULFILLED);
	}
}

var create = Object.create || (
	/*! j-globals: Object.create (polyfill) */
	/*#__PURE__*/ function () {
		var NULL;
		if ( document.domain ) {
			try { dom = new ActiveXObject('htmlfile'); }
			catch (error) { }
		}
		if ( dom ) {
			dom.write('<script><\/script>');
			dom.close();
			NULL = dom.parentWindow.Object.prototype;
		}
		else {
			dom = document.createElement('iframe');
			dom.setAttribute('style', 'display:none !important;_display:none;');//dom.style.display = 'none';
			var parent = document.body || document.documentElement;
			parent.appendChild(dom);
			dom.src = 'javascript:';
			NULL = dom.contentWindow.Object.prototype;
			parent.removeChild(dom);
		}
		var dom = null;
		delete NULL.constructor;
		delete NULL.hasOwnProperty;
		delete NULL.isPrototypeOf;
		delete NULL.propertyIsEnumerable;
		delete NULL.toLocaleString;
		delete NULL.toString;
		delete NULL.valueOf;
		var Null = function () {};
		Null.prototype = NULL;
		var constructor = function () {};
		function __PURE__ (o, properties) {
			if ( properties!==undefined$1 ) { throw TypeError('CAN NOT defineProperties in ES 3 Object.create polyfill'); }
			if ( o===null ) { return new Null; }
			if ( typeof o!=='object' && typeof o!=='function' ) { throw TypeError('Object prototype may only be an Object or null: '+o); }
			constructor.prototype = o;
			var created = new constructor;
			constructor.prototype = NULL;
			return created;
		}
		return function create (o, properties) {
			return /*#__PURE__*/ __PURE__(o, properties);
		};
	}()
	/*¡ j-globals: Object.create (polyfill) */
);

var assign = Object.assign;

var hasOwnProperty = Object.prototype.hasOwnProperty;

var toStringTag = typeof Symbol!=='undefined' ? Symbol.toStringTag : undefined;

var defineProperty = Object.defineProperty;

var Default = (
	/*! j-globals: default (internal) */
	function Default (exports, addOnOrigin) {
		return /*#__PURE__*/ function Module (exports, addOnOrigin) {
			if ( !addOnOrigin ) { addOnOrigin = exports; exports = create(null); }
			if ( assign ) { assign(exports, addOnOrigin); }
			else {
				for ( var key in addOnOrigin ) { if ( hasOwnProperty.call(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } }
				if ( !{ 'toString': null }.propertyIsEnumerable('toString') ) {
					var keys = [ 'constructor', 'propertyIsEnumerable', 'isPrototypeOf', 'hasOwnProperty', 'valueOf', 'toLocaleString', 'toString' ];
					while ( key = keys.pop() ) { if ( hasOwnProperty.call(addOnOrigin, key) ) { exports[key] = addOnOrigin[key]; } }
				}
			}
			exports['default'] = exports;
			if ( seal ) {
				typeof exports==='function' && exports.prototype && seal(exports.prototype);
				if ( toStringTag ) {
					var descriptor = create(null);
					descriptor.value = 'Module';
					defineProperty(exports, toStringTag, descriptor);
				}
				freeze(exports);
			}
			return exports;
		}(exports, addOnOrigin);
	}
	/*¡ j-globals: default (internal) */
);

Public.prototype = Private.prototype = typeof WeakMap==='function' ? /*#__PURE__*/ freeze(prototype) : seal ? /*#__PURE__*/ seal(prototype) : prototype;
var _export = Default(Public, {
	version: version,
	Thenable: Public,
	resolve: resolve,
	reject: reject,
	all: all,
	race: race,
	pend: pend,
	await: AWAIT
});

module.exports = _export;

//# sourceMappingURL=index.js.map