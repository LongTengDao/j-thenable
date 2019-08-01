/*!
 * 模块名称：j-thenable
 * 模块功能：模仿 Promise API 的同步防爆栈工具。从属于“简计划”。
   　　　　　Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".
 * 模块版本：4.4.0
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-thenable/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-thenable/
 */

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

var Thenable                                                 = freeze ? /*#__PURE__*/ freeze(Public) : Public;

export default _export;
export { Thenable, all, AWAIT as await, pend, race, reject, resolve, version };

/*¡ j-thenable */

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsIl8udHMiLCJUaGVuYWJsZS50cyIsInJlc29sdmUudHMiLCJyZWplY3QudHMiLCJhbGwudHMiLCJyYWNlLnRzIiwicGVuZC50cyIsImF3YWl0LnRzIiwiVGhlbmFibGUucHJvdG90eXBlLnRzIiwiZXhwb3J0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0ICc0LjQuMCc7IiwiaW1wb3J0IFByb21pc2UgZnJvbSAnLlByb21pc2UnO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLldlYWtNYXAnO1xuaW1wb3J0IGdldFByb3RvdHlwZU9mIGZyb20gJy5PYmplY3QuZ2V0UHJvdG90eXBlT2YnO1xuaW1wb3J0IHByZXZlbnRFeHRlbnNpb25zIGZyb20gJy5PYmplY3QucHJldmVudEV4dGVuc2lvbnMnO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxuZXhwb3J0IHZhciBFeGVjdXRvciAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuZXhwb3J0IHZhciBPbmZ1bGZpbGxlZCAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5leHBvcnQgdmFyIE9ucmVqZWN0ZWQgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5leHBvcnQgdmFyIE9udGhlbiAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5leHBvcnQgdmFyIFN0YXR1cyAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgIFxuXHQgICAgICAgICAgICAgICAgXG5cdCAgICAgICAgICAgIFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIFxuXG5leHBvcnQgdmFyIFBFTkRJTkcgICAgPSAwO1xuZXhwb3J0IHZhciBGVUxGSUxMRUQgICAgPSAxO1xuZXhwb3J0IHZhciBSRUpFQ1RFRCAgICA9IDI7XG5cbmV4cG9ydCB2YXIgUHJpdmF0ZV9jYWxsICAgICAgICAgICAgICAgICAgICAgICAgIDtcbmV4cG9ydCB2YXIgUHJpdmF0ZSAgICAgICAgICAgICAgICAgICAgICA9IGZ1bmN0aW9uIFByaXZhdGUgKCAgICAgICAgICAgICApICAgICAgIHsgUHJpdmF0ZV9jYWxsKHRoaXMpOyB9ICAgICAgIDtcbmV4cG9ydCB2YXIgaXNUaGVuYWJsZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG5cbmV4cG9ydCB2YXIgZGVsZXRlX2RlcGVuZGVudHMgICAgICAgICAgICAgICAgICAgICAgICAgO1xudmFyIGRlbGV0ZV9vbnJlamVjdGVkICAgICAgICAgICAgICAgICAgICAgICAgIDtcbnZhciBkZWxldGVfb25mdWxmaWxsZWQgICAgICAgICAgICAgICAgICAgICAgICAgO1xudmFyIGRlbGV0ZV9vbnRoZW4gICAgICAgICAgICAgICAgICAgICAgICAgO1xudmFyIGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXMgICAgICAgICAgICAgICAgICAgICAgICAgO1xudmFyIGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyAgICAgICAgICAgICAgICAgICAgICAgICA7XG5cbmV4cG9ydCB2YXIgZ2V0X3N0YXR1cyAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbmV4cG9ydCB2YXIgZ2V0X3ZhbHVlICAgICAgICAgICAgICAgICAgICAgICAgO1xuZXhwb3J0IHZhciBnZXRfZGVwZW5kZW50cyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbnZhciBnZXRfb25mdWxmaWxsZWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbnZhciBnZXRfb25yZWplY3RlZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG52YXIgZ2V0X29udGhlbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcblxuZXhwb3J0IHZhciBzZXRfc3RhdHVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG5leHBvcnQgdmFyIHNldF92YWx1ZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG5leHBvcnQgdmFyIHNldF9kZXBlbmRlbnRzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xuZXhwb3J0IHZhciBzZXRfb25mdWxmaWxsZWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG5leHBvcnQgdmFyIHNldF9vbnJlamVjdGVkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbmV4cG9ydCB2YXIgc2V0X29udGhlbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xuXG5pZiAoIHR5cGVvZiBXZWFrTWFwPT09J2Z1bmN0aW9uJyApIHtcblx0dmFyIFNUQVRVUyAgICAgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IFdlYWtNYXA7XG5cdHZhciBWQUxVRSAgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IFdlYWtNYXA7XG5cdHZhciBERVBFTkRFTlRTICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgV2Vha01hcDtcblx0dmFyIE9ORlVMRklMTEVEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IG5ldyBXZWFrTWFwO1xuXHR2YXIgT05SRUpFQ1RFRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IG5ldyBXZWFrTWFwO1xuXHR2YXIgT05USEVOICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgV2Vha01hcDtcblx0XG5cdFByaXZhdGVfY2FsbCA9IHByZXZlbnRFeHRlbnNpb25zICYmIC8qI19fUFVSRV9fKi8gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBvICAgICAgPSBwcmV2ZW50RXh0ZW5zaW9ucyh7fSk7XG5cdFx0VkFMVUUuc2V0KG8sIG8pO1xuXHRcdHJldHVybiBWQUxVRS5oYXMobyk7XG5cdH0oKVxuXHRcdD8gZnVuY3Rpb24gUHJpdmF0ZV9jYWxsIChUSElTICAgICAgICAgKSAgICAgICB7IFNUQVRVUy5zZXQocHJldmVudEV4dGVuc2lvbnMoVEhJUyksIFBFTkRJTkcpOyB9XG5cdFx0OiBmdW5jdGlvbiBQcml2YXRlX2NhbGwgKFRISVMgICAgICAgICApICAgICAgIHsgU1RBVFVTLnNldChUSElTLCBQRU5ESU5HKTsgfTtcblx0aXNUaGVuYWJsZSA9IGZ1bmN0aW9uIGlzVGhlbmFibGUgKHZhbHVlICAgICApICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIFNUQVRVUy5oYXModmFsdWUpOyB9O1xuXHRcblx0LyogZGVsZXRlOiAqL1xuXHRkZWxldGVfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGRlbGV0ZV9kZXBlbmRlbnRzIChUSElTICAgICAgICAgKSAgICAgICB7IERFUEVOREVOVFNbJ2RlbGV0ZSddKFRISVMpOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBkZWxldGVfb25mdWxmaWxsZWQgKFRISVMgICAgICAgICApICAgICAgIHsgT05GVUxGSUxMRURbJ2RlbGV0ZSddKFRISVMpOyB9O1xuXHRkZWxldGVfb25yZWplY3RlZCA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnJlamVjdGVkIChUSElTICAgICAgICAgKSAgICAgICB7IE9OUkVKRUNURURbJ2RlbGV0ZSddKFRISVMpOyB9O1xuXHRkZWxldGVfb250aGVuID0gZnVuY3Rpb24gZGVsZXRlX29udGhlbiAoVEhJUyAgICAgICAgICkgICAgICAgeyBPTlRIRU5bJ2RlbGV0ZSddKFRISVMpOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzID0gZGVsZXRlX29uZnVsZmlsbGVkO1xuXHRkZWxldGVfb25yZWplY3RlZF9pZl9oYXMgPSBkZWxldGVfb25yZWplY3RlZDsvKiovXG5cdC8qIHNldCB1bmRlZmluZWQ6ICogL1xuXHRkZWxldGVfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGRlbGV0ZV9kZXBlbmRlbnRzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IERFUEVOREVOVFMuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBkZWxldGVfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05GVUxGSUxMRUQuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb25yZWplY3RlZCA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnJlamVjdGVkIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9OUkVKRUNURUQuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb250aGVuID0gZnVuY3Rpb24gZGVsZXRlX29udGhlbiAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTlRIRU4uc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzID0gZnVuY3Rpb24gZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTkZVTEZJTExFRC5oYXMoVEhJUykgJiYgT05GVUxGSUxMRUQuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb25yZWplY3RlZF9pZl9oYXMgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZF9pZl9oYXMgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05SRUpFQ1RFRC5oYXMoVEhJUykgJiYgT05SRUpFQ1RFRC5zZXQoVEhJUywgdW5kZWZpbmVkISk7IH07LyoqL1xuXHRcblx0Z2V0X3N0YXR1cyA9IGZ1bmN0aW9uIGdldF9zdGF0dXMgKFRISVMgICAgICAgICApICAgICAgICAgeyByZXR1cm4gU1RBVFVTLmdldChUSElTKSA7IH07XG5cdGdldF92YWx1ZSA9IGZ1bmN0aW9uIGdldF92YWx1ZSAoVEhJUyAgICAgICAgICkgICAgICB7IHJldHVybiBWQUxVRS5nZXQoVEhJUyk7IH07XG5cdGdldF9kZXBlbmRlbnRzID0gZnVuY3Rpb24gZ2V0X2RlcGVuZGVudHMgKFRISVMgICAgICAgICApICAgICAgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gREVQRU5ERU5UUy5nZXQoVEhJUyk7IH07XG5cdGdldF9vbmZ1bGZpbGxlZCA9IGZ1bmN0aW9uIGdldF9vbmZ1bGZpbGxlZCAoVEhJUyAgICAgICAgICkgICAgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIE9ORlVMRklMTEVELmdldChUSElTKTsgfTtcblx0Z2V0X29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBnZXRfb25yZWplY3RlZCAoVEhJUyAgICAgICAgICkgICAgICAgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gT05SRUpFQ1RFRC5nZXQoVEhJUyk7IH07XG5cdGdldF9vbnRoZW4gPSBmdW5jdGlvbiBnZXRfb250aGVuIChUSElTICAgICAgICAgKSAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIE9OVEhFTi5nZXQoVEhJUyk7IH07XG5cdFxuXHRzZXRfc3RhdHVzID0gZnVuY3Rpb24gc2V0X3N0YXR1cyAoVEhJUyAgICAgICAgICwgc3RhdHVzICAgICAgICApICAgICAgIHsgU1RBVFVTLnNldChUSElTLCBzdGF0dXMpOyB9O1xuXHRzZXRfdmFsdWUgPSBmdW5jdGlvbiBzZXRfdmFsdWUgKFRISVMgICAgICAgICAsIHZhbHVlICAgICApICAgICAgIHsgVkFMVUUuc2V0KFRISVMsIHZhbHVlKTsgfTtcblx0c2V0X2RlcGVuZGVudHMgPSBmdW5jdGlvbiBzZXRfZGVwZW5kZW50cyAoVEhJUyAgICAgICAgICwgZGVwZW5kZW50cyAgICAgICAgICAgKSAgICAgICB7IERFUEVOREVOVFMuc2V0KFRISVMsIGRlcGVuZGVudHMpOyB9O1xuXHRzZXRfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBzZXRfb25mdWxmaWxsZWQgKFRISVMgICAgICAgICAsIG9uZnVsZmlsbGVkICAgICAgICAgICAgICkgICAgICAgeyBPTkZVTEZJTExFRC5zZXQoVEhJUywgb25mdWxmaWxsZWQpOyB9O1xuXHRzZXRfb25yZWplY3RlZCA9IGZ1bmN0aW9uIHNldF9vbnJlamVjdGVkIChUSElTICAgICAgICAgLCBvbnJlamVjdGVkICAgICAgICAgICAgKSAgICAgICB7IE9OUkVKRUNURUQuc2V0KFRISVMsIG9ucmVqZWN0ZWQpOyB9O1xuXHRzZXRfb250aGVuID0gZnVuY3Rpb24gc2V0X29udGhlbiAoVEhJUyAgICAgICAgICwgb250aGVuICAgICAgICApICAgICAgIHsgT05USEVOLnNldChUSElTLCBvbnRoZW4pOyB9O1xufVxuZWxzZSB7XG5cdFByaXZhdGVfY2FsbCA9IGZ1bmN0aW9uIFByaXZhdGVfY2FsbCAoKSAgICAgICB7IH07XG5cdGlzVGhlbmFibGUgPSBnZXRQcm90b3R5cGVPZlxuXHRcdD8gZnVuY3Rpb24gKHZhbHVlICAgICApICAgICAgICAgICAgICAgICAgIHtcblx0XHRcdHZhciBQcml2YXRlX3Byb3RvdHlwZSAgICAgICAgICA9IFByaXZhdGUucHJvdG90eXBlO1xuXHRcdFx0aXNUaGVuYWJsZSA9IGZ1bmN0aW9uIGlzVGhlbmFibGUgKHZhbHVlICAgICApICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHZhbHVlIT1udWxsICYmIGdldFByb3RvdHlwZU9mKHZhbHVlKT09PVByaXZhdGVfcHJvdG90eXBlOyB9O1xuXHRcdFx0cmV0dXJuIGlzVGhlbmFibGUodmFsdWUpO1xuXHRcdH1cblx0XHQ6IGZ1bmN0aW9uIGlzVGhlbmFibGUgKHZhbHVlICAgICApICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUHJpdmF0ZTsgfTtcblx0XG5cdC8qIHNldCB1bmRlZmluZWQ6ICovXG5cdGRlbGV0ZV9kZXBlbmRlbnRzID0gZnVuY3Rpb24gZGVsZXRlX2RlcGVuZGVudHMgKFRISVMgICAgICAgICApICAgICAgIHsgVEhJUy5fZGVwZW5kZW50cyA9IHVuZGVmaW5lZDsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkID0gZnVuY3Rpb24gZGVsZXRlX29uZnVsZmlsbGVkIChUSElTICAgICAgICAgKSAgICAgICB7IFRISVMuX29uZnVsZmlsbGVkID0gdW5kZWZpbmVkOyB9O1xuXHRkZWxldGVfb25yZWplY3RlZCA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnJlamVjdGVkIChUSElTICAgICAgICAgKSAgICAgICB7IFRISVMuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7IH07XG5cdGRlbGV0ZV9vbnRoZW4gPSBmdW5jdGlvbiBkZWxldGVfb250aGVuIChUSElTICAgICAgICAgKSAgICAgICB7IFRISVMuX29udGhlbiA9IHVuZGVmaW5lZDsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyA9IGZ1bmN0aW9uIGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXMgKFRISVMgICAgICAgICApICAgICAgIHsgaWYgKCBUSElTLl9vbmZ1bGZpbGxlZCApIHsgVEhJUy5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7IH0gfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzID0gZnVuY3Rpb24gZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzIChUSElTICAgICAgICAgKSAgICAgICB7IGlmICggVEhJUy5fb25yZWplY3RlZCApIHsgVEhJUy5fb25yZWplY3RlZCA9IHVuZGVmaW5lZDsgfSB9Oy8qKi9cblx0XG5cdGdldF9zdGF0dXMgPSBmdW5jdGlvbiBnZXRfc3RhdHVzIChUSElTICAgICAgICAgKSAgICAgICAgIHsgcmV0dXJuIFRISVMuX3N0YXR1czsgfTtcblx0Z2V0X3ZhbHVlID0gZnVuY3Rpb24gZ2V0X3ZhbHVlIChUSElTICAgICAgICAgKSAgICAgIHsgcmV0dXJuIFRISVMuX3ZhbHVlOyB9O1xuXHRnZXRfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGdldF9kZXBlbmRlbnRzIChUSElTICAgICAgICAgKSAgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIFRISVMuX2RlcGVuZGVudHM7IH07XG5cdGdldF9vbmZ1bGZpbGxlZCA9IGZ1bmN0aW9uIGdldF9vbmZ1bGZpbGxlZCAoVEhJUyAgICAgICAgICkgICAgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIFRISVMuX29uZnVsZmlsbGVkOyB9O1xuXHRnZXRfb25yZWplY3RlZCA9IGZ1bmN0aW9uIGdldF9vbnJlamVjdGVkIChUSElTICAgICAgICAgKSAgICAgICAgICAgICAgICAgICAgICAgICB7IHJldHVybiBUSElTLl9vbnJlamVjdGVkOyB9O1xuXHRnZXRfb250aGVuID0gZnVuY3Rpb24gZ2V0X29udGhlbiAoVEhJUyAgICAgICAgICkgICAgICAgICAgICAgICAgICAgICB7IHJldHVybiBUSElTLl9vbnRoZW47IH07XG5cdFxuXHRzZXRfc3RhdHVzID0gZnVuY3Rpb24gc2V0X3N0YXR1cyAoVEhJUyAgICAgICAgICwgc3RhdHVzICAgICAgICApICAgICAgIHsgVEhJUy5fc3RhdHVzID0gc3RhdHVzOyB9O1xuXHRzZXRfdmFsdWUgPSBmdW5jdGlvbiBzZXRfdmFsdWUgKFRISVMgICAgICAgICAsIHZhbHVlICAgICApICAgICAgIHsgVEhJUy5fdmFsdWUgPSB2YWx1ZTsgfTtcblx0c2V0X2RlcGVuZGVudHMgPSBmdW5jdGlvbiBzZXRfZGVwZW5kZW50cyAoVEhJUyAgICAgICAgICwgZGVwZW5kZW50cyAgICAgICAgICAgKSAgICAgICB7IFRISVMuX2RlcGVuZGVudHMgPSBkZXBlbmRlbnRzOyB9O1xuXHRzZXRfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBzZXRfb25mdWxmaWxsZWQgKFRISVMgICAgICAgICAsIG9uZnVsZmlsbGVkICAgICAgICAgICAgICkgICAgICAgeyBUSElTLl9vbmZ1bGZpbGxlZCA9IG9uZnVsZmlsbGVkOyB9O1xuXHRzZXRfb25yZWplY3RlZCA9IGZ1bmN0aW9uIHNldF9vbnJlamVjdGVkIChUSElTICAgICAgICAgLCBvbnJlamVjdGVkICAgICAgICAgICAgKSAgICAgICB7IFRISVMuX29ucmVqZWN0ZWQgPSBvbnJlamVjdGVkOyB9O1xuXHRzZXRfb250aGVuID0gZnVuY3Rpb24gc2V0X29udGhlbiAoVEhJUyAgICAgICAgICwgb250aGVuICAgICAgICApICAgICAgIHsgVEhJUy5fb250aGVuID0gb250aGVuOyB9O1xufVxuXG5leHBvcnQgdmFyIGlzUHJvbWlzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB0eXBlb2YgUHJvbWlzZT09PSdmdW5jdGlvbidcblx0PyBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKCBnZXRQcm90b3R5cGVPZiApIHtcblx0XHRcdHZhciBwcm90b3R5cGUgPSBQcm9taXNlLnByb3RvdHlwZTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiBpc1Byb21pc2UgKHZhbHVlICAgICApICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHZhbHVlIT1udWxsICYmIGdldFByb3RvdHlwZU9mKHZhbHVlKT09PXByb3RvdHlwZTsgfTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2YXIgY29uc3RydWN0b3IgPSBQcm9taXNlO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIGlzUHJvbWlzZSAodmFsdWUgICAgICkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBjb25zdHJ1Y3RvcjsgfTtcblx0XHR9XG5cdH0oKVxuXHQ6IGZ1bmN0aW9uIGlzUHJvbWlzZSAoKSB7IHJldHVybiBmYWxzZTsgfSAgICAgICA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxudmFyIHByZXBlbmRTdGFjayAgICAgICAgICAgICAgICAgICAgICA9IG51bGw7XG52YXIgcHJlcGVuZGluZyAgICAgICAgICA9IGZhbHNlO1xuZXhwb3J0IGZ1bmN0aW9uIHByZXBlbmQgKHRoZW5hYmxlICAgICAgICAgKSAgICAgICB7XG5cdHZhciBfb250aGVuICAgICAgICAgICAgICAgICAgICAgPSBnZXRfb250aGVuKHRoZW5hYmxlKTtcblx0aWYgKCAhX29udGhlbiApIHsgcmV0dXJuOyB9XG5cdGRlbGV0ZV9vbnRoZW4odGhlbmFibGUpO1xuXHRpZiAoIHByZXBlbmRpbmcgKSB7XG5cdFx0cHJlcGVuZFN0YWNrID0geyBuZXh0U3RhY2s6IHByZXBlbmRTdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCBvbnRoZW46IF9vbnRoZW4gfTtcblx0XHRyZXR1cm47XG5cdH1cblx0cHJlcGVuZGluZyA9IHRydWU7XG5cdGZvciAoIDsgOyApIHtcblx0XHR0cnkge1xuXHRcdFx0dmFyIHZhbHVlICAgICAgPSBfb250aGVuKCk7XG5cdFx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0XHRfb250aGVuID0gZ2V0X29udGhlbih2YWx1ZSk7XG5cdFx0XHRcdGlmICggX29udGhlbiApIHtcblx0XHRcdFx0XHRkZWxldGVfb250aGVuKHZhbHVlKTtcblx0XHRcdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkgLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdHByZXBlbmRTdGFjayA9IHsgbmV4dFN0YWNrOiBwcmVwZW5kU3RhY2ssIHRoZW5hYmxlOiB2YWx1ZSwgb250aGVuOiBfb250aGVuIH07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHN0YXR1cyAgICAgICAgID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKCBzdGF0dXM9PT1QRU5ESU5HICkgeyBnZXRfZGVwZW5kZW50cyh2YWx1ZSkgLnB1c2godGhlbmFibGUpOyB9XG5cdFx0XHRcdFx0ZWxzZSB7IGZsb3codGhlbmFibGUsIGdldF92YWx1ZSh2YWx1ZSksIHN0YXR1cyk7IH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7IGRlcGVuZCh0aGVuYWJsZSwgdmFsdWUpOyB9XG5cdFx0XHRlbHNlIHsgZmxvdyh0aGVuYWJsZSwgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHR9XG5cdFx0Y2F0Y2ggKGVycm9yKSB7IGZsb3codGhlbmFibGUsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0XHRpZiAoICFwcmVwZW5kU3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBwcmVwZW5kU3RhY2sudGhlbmFibGU7XG5cdFx0X29udGhlbiA9IHByZXBlbmRTdGFjay5vbnRoZW47XG5cdFx0cHJlcGVuZFN0YWNrID0gcHJlcGVuZFN0YWNrLm5leHRTdGFjaztcblx0fVxuXHRwcmVwZW5kaW5nID0gZmFsc2U7XG59XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxudmFyIGZsb3dTdGFjayAgICAgICAgICAgICAgICAgICA9IG51bGw7XG52YXIgZmxvd2luZyAgICAgICAgICA9IGZhbHNlO1xuZXhwb3J0IGZ1bmN0aW9uIGZsb3cgKHRoZW5hYmxlICAgICAgICAgLCB2YWx1ZSAgICAgLCBzdGF0dXMgICAgICAgICkgICAgICAge1xuXHRpZiAoIGZsb3dpbmcgKSB7XG5cdFx0Zmxvd1N0YWNrID0geyBuZXh0U3RhY2s6IGZsb3dTdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZsb3dpbmcgPSB0cnVlO1xuXHRmb3IgKCB2YXIgX3N0YXR1cyAgICAgICAgOyA7ICkge1xuXHRcdHN0YWNrOiB7XG5cdFx0XHRpZiAoIHN0YXR1cz09PUZVTEZJTExFRCApIHtcblx0XHRcdFx0ZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzKHRoZW5hYmxlKTtcblx0XHRcdFx0dmFyIF9vbmZ1bGZpbGxlZCAgICAgICAgICAgICAgICAgICAgICAgICAgPSBnZXRfb25mdWxmaWxsZWQodGhlbmFibGUpO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHRkZWxldGVfb25mdWxmaWxsZWQodGhlbmFibGUpO1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IF9vbmZ1bGZpbGxlZCh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0X3N0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdGdldF9kZXBlbmRlbnRzKHZhbHVlKSAucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSBnZXRfdmFsdWUodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRkZXBlbmQodGhlbmFibGUsIHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0aWYgKCBnZXRfc3RhdHVzKHRoZW5hYmxlKSE9PVBFTkRJTkcgKSB7IGJyZWFrIHN0YWNrOyB9XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyh0aGVuYWJsZSk7XG5cdFx0XHRcdHZhciBfb25yZWplY3RlZCAgICAgICAgICAgICAgICAgICAgICAgICA9IGdldF9vbnJlamVjdGVkKHRoZW5hYmxlKTtcblx0XHRcdFx0aWYgKCBfb25yZWplY3RlZCApIHtcblx0XHRcdFx0XHRkZWxldGVfb25yZWplY3RlZCh0aGVuYWJsZSk7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0cHJlcGVuZCh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdF9zdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkgLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gZ2V0X3ZhbHVlKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQcm9taXNlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0ZGVwZW5kKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7IHN0YXR1cyA9IEZVTEZJTExFRDsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyh0aGVuYWJsZSkhPT1QRU5ESU5HICkgeyBicmVhayBzdGFjazsgfVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgdmFsdWUpO1xuXHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgc3RhdHVzKTtcblx0XHRcdHZhciBfZGVwZW5kZW50cyAgICAgICAgICAgICAgICAgICAgICAgID0gZ2V0X2RlcGVuZGVudHModGhlbmFibGUpO1xuXHRcdFx0aWYgKCBfZGVwZW5kZW50cyApIHtcblx0XHRcdFx0ZGVsZXRlX2RlcGVuZGVudHModGhlbmFibGUpO1xuXHRcdFx0XHRmb3IgKCB2YXIgaW5kZXggICAgICAgICA9IF9kZXBlbmRlbnRzLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdGZsb3dTdGFjayA9IHsgbmV4dFN0YWNrOiBmbG93U3RhY2ssIHRoZW5hYmxlOiBfZGVwZW5kZW50c1stLWluZGV4XSwgdmFsdWU6IHZhbHVlLCBzdGF0dXM6IHN0YXR1cyB9O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICggIWZsb3dTdGFjayApIHsgYnJlYWs7IH1cblx0XHR0aGVuYWJsZSA9IGZsb3dTdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IGZsb3dTdGFjay52YWx1ZTtcblx0XHRzdGF0dXMgPSBmbG93U3RhY2suc3RhdHVzO1xuXHRcdGZsb3dTdGFjayA9IGZsb3dTdGFjay5uZXh0U3RhY2s7XG5cdH1cblx0Zmxvd2luZyA9IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVwZW5kICh0aGVuYWJsZSAgICAgICAgICwgdmFsdWUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApICAgICAgIHtcblx0dmFyIHJlZCAgICAgICAgICAgICAgICAgICAgIDtcblx0dmFsdWUudGhlbihcblx0XHRmdW5jdGlvbiBvbmZ1bGZpbGxlZCAodmFsdWUgICAgICkgICAgICAge1xuXHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdGZsb3codGhlbmFibGUsIHZhbHVlLCBGVUxGSUxMRUQpO1xuXHRcdH0sXG5cdFx0ZnVuY3Rpb24gb25yZWplY3RlZCAoZXJyb3IgICAgICkgICAgICAge1xuXHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdGZsb3codGhlbmFibGUsIGVycm9yLCBSRUpFQ1RFRCk7XG5cdFx0fVxuXHQpO1xufVxuIiwiaW1wb3J0IFR5cGVFcnJvciBmcm9tICcuVHlwZUVycm9yJztcblxuaW1wb3J0IHsgUEVORElORywgRlVMRklMTEVELCBSRUpFQ1RFRCwgU3RhdHVzLCBQcml2YXRlLCBpc1RoZW5hYmxlLCBpc1Byb21pc2UsIGZsb3csIGRlcGVuZCwgcHJlcGVuZCwgRXhlY3V0b3IsIE9uZnVsZmlsbGVkLCBPbnJlamVjdGVkLCBQcml2YXRlX2NhbGwsIGdldF9zdGF0dXMsIGdldF9kZXBlbmRlbnRzLCBnZXRfdmFsdWUsIHNldF9kZXBlbmRlbnRzLCBzZXRfdmFsdWUsIHNldF9zdGF0dXMsIGRlbGV0ZV9kZXBlbmRlbnRzIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IHsgUHVibGljIGFzIGRlZmF1bHQgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICBcblxudmFyIFB1YmxpYyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gZnVuY3Rpb24gVGhlbmFibGUgKCAgICAgICAgICAgICAgIGV4ZWN1dG9yICAgICAgICAgICkgICAgICAge1xuXHRpZiAoIHR5cGVvZiBleGVjdXRvciE9PSdmdW5jdGlvbicgKSB7IHRocm93IFR5cGVFcnJvcignbmV3IFRoZW5hYmxlKGV4ZWN1dG9yIGlzIG5vdCBhIGZ1bmN0aW9uKScpOyB9XG5cdHZhciBleGVjdXRlZCAgICAgICAgICAgICAgICAgICAgIDtcblx0dmFyIHJlZCAgICAgICAgICAgICAgICAgICAgIDtcblx0dmFyIF92YWx1ZSAgICAgO1xuXHR2YXIgX3N0YXR1cyAgICAgICAgICAgICAgICAgICAgO1xuXHR2YXIgVEhJUyAgICAgICAgICA9IHRoaXM7XG5cdC8vdGhpcyBpbnN0YW5jZW9mIFRoZW5hYmxlIHx8IHRocm93KFR5cGVFcnJvcigpKTtcblx0UHJpdmF0ZV9jYWxsKFRISVMpO1xuXHR0cnkge1xuXHRcdGV4ZWN1dG9yKFxuXHRcdFx0ZnVuY3Rpb24gcmVzb2x2ZSAodmFsdWUgICAgICkge1xuXHRcdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdGlmICggZXhlY3V0ZWQgKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRfc3RhdHVzID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7IGdldF9kZXBlbmRlbnRzKHZhbHVlKSAucHVzaChUSElTKTsgfVxuXHRcdFx0XHRcdFx0XHRlbHNlIHsgZmxvdyhUSElTLCBnZXRfdmFsdWUodmFsdWUpLCBfc3RhdHVzICk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkgeyBkZXBlbmQoVEhJUywgdmFsdWUpOyB9XG5cdFx0XHRcdFx0XHRlbHNlIHsgZmxvdyhUSElTLCB2YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHsgaWYgKCBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHsgZmxvdyhUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9IH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRfdmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHRfc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZnVuY3Rpb24gcmVqZWN0IChlcnJvciAgICAgKSB7XG5cdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCBleGVjdXRlZCApIHsgZmxvdyhUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdF92YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdF9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0aWYgKCAhcmVkICkge1xuXHRcdFx0ZXhlY3V0ZWQgPSB0cnVlO1xuXHRcdFx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoICFyZWQgKSB7XG5cdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIGVycm9yKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgUkVKRUNURUQpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHR0cnkgeyByRWQoVEhJUywgX3N0YXR1cyAsIF92YWx1ZSk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdGRlbGV0ZV9kZXBlbmRlbnRzKFRISVMpO1xuXHRcdH1cblx0fVxufSAgICAgICA7XG5cbmZ1bmN0aW9uIHJFZCAoVEhJUyAgICAgICAgICwgc3RhdHVzICAgICAgICAsIHZhbHVlICAgICApICAgICAgIHtcblx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0c3RhdHVzID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRpZiAoIHN0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0XHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIC5wdXNoKFRISVMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHNldF92YWx1ZShUSElTLCBnZXRfdmFsdWUodmFsdWUpKTtcblx0XHRcdFx0c2V0X3N0YXR1cyhUSElTLCBzdGF0dXMpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0XHRzZXRfZGVwZW5kZW50cyhUSElTLCBbXSk7XG5cdFx0XHRkZXBlbmQoVEhJUywgdmFsdWUpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRzZXRfdmFsdWUoVEhJUywgdmFsdWUpO1xuXHRzZXRfc3RhdHVzKFRISVMsIHN0YXR1cyk7XG59XG4iLCJpbXBvcnQgeyBpc1RoZW5hYmxlLCBpc1Byb21pc2UsIGRlcGVuZCwgRlVMRklMTEVELCBSRUpFQ1RFRCwgUEVORElORywgUHJpdmF0ZSwgc2V0X2RlcGVuZGVudHMsIHNldF92YWx1ZSwgc2V0X3N0YXR1cywgZ2V0X3N0YXR1cyB9IGZyb20gJy4vXyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc29sdmUgKHZhbHVlICAgICAgKSAgICAgICAgIHtcblx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHsgcmV0dXJuIHZhbHVlOyB9XG5cdHZhciBUSElTICAgICAgICAgID0gbmV3IFByaXZhdGU7XG5cdGlmICggaXNQcm9taXNlKHZhbHVlKSApIHtcblx0XHRzZXRfZGVwZW5kZW50cyhUSElTLCBbXSk7XG5cdFx0dHJ5X2RlcGVuZChUSElTLCB2YWx1ZSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0c2V0X3ZhbHVlKFRISVMsIHZhbHVlKTtcblx0XHRzZXRfc3RhdHVzKFRISVMsIEZVTEZJTExFRCk7XG5cdH1cblx0cmV0dXJuIFRISVM7XG59O1xuXG5mdW5jdGlvbiB0cnlfZGVwZW5kIChUSElTICAgICAgICAgLCB2YWx1ZSAgICAgKSB7XG5cdHRyeSB7IGRlcGVuZChUSElTLCB2YWx1ZSk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHR9XG5cdH1cbn1cblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgeyBSRUpFQ1RFRCwgUHJpdmF0ZSwgc2V0X3N0YXR1cywgc2V0X3ZhbHVlIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVqZWN0IChlcnJvciAgICAgICkgICAgICAgICB7XG5cdHZhciBUSElTICAgICAgICAgID0gbmV3IFByaXZhdGU7XG5cdHNldF9zdGF0dXMoVEhJUywgUkVKRUNURUQpO1xuXHRzZXRfdmFsdWUoVEhJUywgZXJyb3IpO1xuXHRyZXR1cm4gVEhJUztcbn07XG5cbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7IiwiaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxuaW1wb3J0IHsgUEVORElORywgUkVKRUNURUQsIEZVTEZJTExFRCwgZmxvdywgcHJlcGVuZCwgaXNUaGVuYWJsZSwgaXNQcm9taXNlLCBTdGF0dXMsIFByaXZhdGUsIGdldF9zdGF0dXMsIHNldF92YWx1ZSwgc2V0X3N0YXR1cywgZGVsZXRlX2RlcGVuZGVudHMsIHNldF9kZXBlbmRlbnRzLCBnZXRfZGVwZW5kZW50cywgZ2V0X3ZhbHVlLCBzZXRfb25mdWxmaWxsZWQsIHNldF9vbnJlamVjdGVkIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWxsICh2YWx1ZXMgICAgICAgICAgICAgICAgKSAgICAgICAgIHtcblx0dmFyIFRISVMgICAgICAgICAgPSBuZXcgUHJpdmF0ZTtcblx0dHJ5IHsgYWxsX3RyeSh2YWx1ZXMsIFRISVMpOyB9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRzZXRfdmFsdWUoVEhJUywgZXJyb3IpO1xuXHRcdFx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdFx0XHRkZWxldGVfZGVwZW5kZW50cyhUSElTKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIFRISVM7XG59O1xuXG5mdW5jdGlvbiBhbGxfdHJ5ICh2YWx1ZXMgICAgICAgICAgICAgICAgLCBUSElTICAgICAgICAgKSAgICAgICB7XG5cdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0ZnVuY3Rpb24gb25yZWplY3RlZCAoZXJyb3IgICAgICkgICAgICB7IGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICYmIGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR2YXIgX3ZhbHVlICAgICAgICA9IFtdO1xuXHR2YXIgY291bnQgICAgICAgICA9IDA7XG5cdHZhciBjb3VudGVkICAgICAgICAgICAgICAgICAgICAgO1xuXHRmb3IgKCB2YXIgbGVuZ3RoICAgICAgICAgPSB2YWx1ZXMubGVuZ3RoLCBpbmRleCAgICAgICAgID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdHZhciB2YWx1ZSAgICAgID0gdmFsdWVzW2luZGV4XTtcblx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0cHJlcGVuZCh2YWx1ZSk7XG5cdFx0XHR2YXIgX3N0YXR1cyAgICAgICAgID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHQrK2NvdW50O1xuXHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR2YXIgdGhhdCAgICAgICAgICA9IG5ldyBQcml2YXRlO1xuXHRcdFx0XHQoIGZ1bmN0aW9uIChpbmRleCAgICAgICAgKSB7XG5cdFx0XHRcdFx0c2V0X29uZnVsZmlsbGVkKHRoYXQsIGZ1bmN0aW9uIG9uZnVsZmlsbGVkICh2YWx1ZSAgICAgKSAgICAgICB7XG5cdFx0XHRcdFx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdGlmICggIS0tY291bnQgJiYgY291bnRlZCApIHsgZmxvdyhUSElTLCBfdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSApKGluZGV4KTtcblx0XHRcdFx0c2V0X29ucmVqZWN0ZWQodGhhdCwgb25yZWplY3RlZCk7XG5cdFx0XHRcdGdldF9kZXBlbmRlbnRzKHZhbHVlKSAucHVzaCh0aGF0KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBfc3RhdHVzPT09UkVKRUNURUQgKSB7XG5cdFx0XHRcdHNldF92YWx1ZShUSElTLCBnZXRfdmFsdWUodmFsdWUpKTtcblx0XHRcdFx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSBnZXRfdmFsdWUodmFsdWUpOyB9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdFx0Kytjb3VudDtcblx0XHRcdF92YWx1ZVtpbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0XHQoIGZ1bmN0aW9uIChpbmRleCAgICAgICAgKSB7XG5cdFx0XHRcdHZhciByZWQgICAgICAgICAgICAgICAgICAgICA7XG5cdFx0XHRcdHZhbHVlLnRoZW4oXG5cdFx0XHRcdFx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlICAgICApICAgICAgIHtcblx0XHRcdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdGlmICggIS0tY291bnQgJiYgY291bnRlZCApIHsgZmxvdyhUSElTLCBfdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG9ucmVqZWN0ZWRcblx0XHRcdFx0KTtcblx0XHRcdH0gKShpbmRleCk7XG5cdFx0fVxuXHRcdGVsc2UgeyBfdmFsdWVbaW5kZXhdID0gdmFsdWU7IH1cblx0fVxuXHRjb3VudGVkID0gdHJ1ZTtcblx0aWYgKCAhY291bnQgJiYgZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0c2V0X3ZhbHVlKFRISVMsIF92YWx1ZSk7XG5cdFx0c2V0X3N0YXR1cyhUSElTLCBGVUxGSUxMRUQpO1xuXHRcdGRlbGV0ZV9kZXBlbmRlbnRzKFRISVMpO1xuXHR9XG59XG5cbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7IiwiaW1wb3J0IHsgZmxvdywgcHJlcGVuZCwgUEVORElORywgRlVMRklMTEVELCBSRUpFQ1RFRCwgU3RhdHVzLCBpc1RoZW5hYmxlLCBpc1Byb21pc2UsIFByaXZhdGUsIGdldF9zdGF0dXMsIHNldF92YWx1ZSwgc2V0X3N0YXR1cywgZGVsZXRlX2RlcGVuZGVudHMsIHNldF9kZXBlbmRlbnRzLCBnZXRfZGVwZW5kZW50cywgZ2V0X3ZhbHVlLCBzZXRfb25mdWxmaWxsZWQsIHNldF9vbnJlamVjdGVkIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmFjZSAodmFsdWVzICAgICAgICAgICAgICAgICkgICAgICAgICB7XG5cdHZhciBUSElTICAgICAgICAgID0gbmV3IFByaXZhdGU7XG5cdHRyeSB7IHJhY2VfdHJ5KHZhbHVlcywgVEhJUyk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdGRlbGV0ZV9kZXBlbmRlbnRzKFRISVMpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn07XG5cbmZ1bmN0aW9uIHJhY2VfdHJ5ICh2YWx1ZXMgICAgICAgICAgICAgICAgLCBUSElTICAgICAgICAgKSAgICAgICB7XG5cdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlICAgICApICAgICAgeyBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyAmJiBmbG93KFRISVMsIHZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdGZ1bmN0aW9uIG9ucmVqZWN0ZWQgKGVycm9yICAgICApICAgICAgeyBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyAmJiBmbG93KFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0dmFyIHRoYXQgICAgICAgICAgPSBuZXcgUHJpdmF0ZTtcblx0c2V0X29uZnVsZmlsbGVkKHRoYXQsIG9uZnVsZmlsbGVkKTtcblx0c2V0X29ucmVqZWN0ZWQodGhhdCwgb25yZWplY3RlZCk7XG5cdGZvciAoIHZhciBsZW5ndGggICAgICAgICA9IHZhbHVlcy5sZW5ndGgsIGluZGV4ICAgICAgICAgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0dmFyIHZhbHVlICAgICAgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdHZhciBfc3RhdHVzICAgICAgICAgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7IGdldF9kZXBlbmRlbnRzKHZhbHVlKSAucHVzaCh0aGF0KTsgfVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHNldF92YWx1ZShUSElTLCBnZXRfdmFsdWUodmFsdWUpKTtcblx0XHRcdFx0c2V0X3N0YXR1cyhUSElTLCBfc3RhdHVzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdFx0dmFsdWUudGhlbihvbmZ1bGZpbGxlZCwgb25yZWplY3RlZCk7XG5cdFx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUykhPT1QRU5ESU5HICkgeyBicmVhazsgfVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCB2YWx1ZSk7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIEZVTEZJTExFRCk7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuXG5pbXBvcnQgeyBQcml2YXRlLCBPbnRoZW4sIHNldF9kZXBlbmRlbnRzLCBzZXRfb250aGVuIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGVuZCAob250aGVuICAgICAgICApICAgICAgICAge1xuXHRpZiAoIHR5cGVvZiBvbnRoZW4hPT0nZnVuY3Rpb24nICkgeyB0aHJvdyBUeXBlRXJyb3IoJ1RoZW5hYmxlLnBlbmQob250aGVuIGlzIG5vdCBhIGZ1bmN0aW9uKScpOyB9XG5cdHZhciBUSElTICAgICAgICAgID0gbmV3IFByaXZhdGU7XG5cdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0c2V0X29udGhlbihUSElTLCBvbnRoZW4pO1xuXHRyZXR1cm4gVEhJUztcbn07XG5cbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7IiwiaW1wb3J0IHsgaXNUaGVuYWJsZSwgRlVMRklMTEVELCBSRUpFQ1RFRCwgcHJlcGVuZCwgZ2V0X3N0YXR1cywgZ2V0X3ZhbHVlIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRhd2FpdDogZnVuY3Rpb24gKHZhbHVlICAgICApICAgICAge1xuXHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdHN3aXRjaCAoIGdldF9zdGF0dXModmFsdWUpICkge1xuXHRcdFx0XHRjYXNlIEZVTEZJTExFRDpcblx0XHRcdFx0XHRyZXR1cm4gZ2V0X3ZhbHVlKHZhbHVlKTtcblx0XHRcdFx0Y2FzZSBSRUpFQ1RFRDpcblx0XHRcdFx0XHR0aHJvdyBnZXRfdmFsdWUodmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cbn0uYXdhaXQ7XG4iLCJpbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLldlYWtNYXAnO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxuaW1wb3J0IHsgUEVORElORywgUkVKRUNURUQsIEZVTEZJTExFRCwgUHJpdmF0ZSwgaXNUaGVuYWJsZSwgaXNQcm9taXNlLCBTdGF0dXMsIGRlcGVuZCwgcHJlcGVuZCwgT25mdWxmaWxsZWQsIE9ucmVqZWN0ZWQsIGdldF9zdGF0dXMsIHNldF9kZXBlbmRlbnRzLCBzZXRfb25mdWxmaWxsZWQsIHNldF9vbnJlamVjdGVkLCBnZXRfZGVwZW5kZW50cywgc2V0X3ZhbHVlLCBnZXRfdmFsdWUsIHNldF9zdGF0dXMgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCB0eXBlb2YgV2Vha01hcD09PSdmdW5jdGlvbidcblx0PyB7IHRoZW46IHRoZW4gfVxuXHQ6IHtcblx0XHRfc3RhdHVzOiBQRU5ESU5HLFxuXHRcdF92YWx1ZTogdW5kZWZpbmVkLFxuXHRcdF9kZXBlbmRlbnRzOiB1bmRlZmluZWQsXG5cdFx0X29uZnVsZmlsbGVkOiB1bmRlZmluZWQsXG5cdFx0X29ucmVqZWN0ZWQ6IHVuZGVmaW5lZCxcblx0XHRfb250aGVuOiB1bmRlZmluZWQsXG5cdFx0dGhlbjogdGhlblxuXHR9O1xuXG5mdW5jdGlvbiB0aGVuICggICAgICAgICAgICAgICBvbmZ1bGZpbGxlZCAgICAgICAgICAgICAgLCBvbnJlamVjdGVkICAgICAgICAgICAgICkgICAgICAgICAge1xuXHR2YXIgVEhJUyAgICAgICAgICA9IHRoaXM7XG5cdGlmICggaXNUaGVuYWJsZShUSElTKSApIHtcblx0XHRwcmVwZW5kKFRISVMpO1xuXHRcdHZhciB0aGVuYWJsZSAgICAgICAgICA9IG5ldyBQcml2YXRlO1xuXHRcdHN3aXRjaCAoIGdldF9zdGF0dXMoVEhJUykgKSB7XG5cdFx0XHRjYXNlIFBFTkRJTkc6XG5cdFx0XHRcdHNldF9kZXBlbmRlbnRzKHRoZW5hYmxlLCBbXSk7XG5cdFx0XHRcdGlmICggdHlwZW9mIG9uZnVsZmlsbGVkPT09J2Z1bmN0aW9uJyApIHsgc2V0X29uZnVsZmlsbGVkKHRoZW5hYmxlLCBvbmZ1bGZpbGxlZCk7IH1cblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25yZWplY3RlZD09PSdmdW5jdGlvbicgKSB7IHNldF9vbnJlamVjdGVkKHRoZW5hYmxlLCBvbnJlamVjdGVkKTsgfVxuXHRcdFx0XHRnZXRfZGVwZW5kZW50cyhUSElTKSAucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0XHRcdGNhc2UgRlVMRklMTEVEOlxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvbmZ1bGZpbGxlZD09PSdmdW5jdGlvbicgKSB7IG9udG8oVEhJUywgb25mdWxmaWxsZWQsIHRoZW5hYmxlKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRzZXRfdmFsdWUodGhlbmFibGUsIGdldF92YWx1ZShUSElTKSk7XG5cdFx0XHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgRlVMRklMTEVEKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0XHRjYXNlIFJFSkVDVEVEOlxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvbnJlamVjdGVkPT09J2Z1bmN0aW9uJyApIHsgb250byhUSElTLCBvbnJlamVjdGVkLCB0aGVuYWJsZSk7IH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0c2V0X3ZhbHVlKHRoZW5hYmxlLCBnZXRfdmFsdWUoVEhJUykpO1xuXHRcdFx0XHRcdHNldF9zdGF0dXModGhlbmFibGUsIFJFSkVDVEVEKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0fVxuXHR9XG5cdHRocm93IFR5cGVFcnJvcignTWV0aG9kIFRoZW5hYmxlLnByb3RvdHlwZS50aGVuIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgcmVjZWl2ZXInKTtcbn1cblxuZnVuY3Rpb24gb250byAoVEhJUyAgICAgICAgICwgb24gICAgICAgICAgICAgICAgICwgdGhlbmFibGUgICAgICAgICApIHtcblx0dHJ5IHsgb250b190cnkodGhlbmFibGUsIG9uKGdldF92YWx1ZShUSElTKSkpOyB9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggZ2V0X3N0YXR1cyh0aGVuYWJsZSk9PT1QRU5ESU5HICkge1xuXHRcdFx0c2V0X3ZhbHVlKHRoZW5hYmxlLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKHRoZW5hYmxlLCBSRUpFQ1RFRCk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIG9udG9fdHJ5ICh0aGVuYWJsZSAgICAgICAgICwgdmFsdWUgICAgICkgICAgICAge1xuXHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdHZhciBzdGF0dXMgICAgICAgICA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdGlmICggc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdHNldF9kZXBlbmRlbnRzKHRoZW5hYmxlLCBbXSk7XG5cdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkgLnB1c2godGhlbmFibGUpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgZ2V0X3ZhbHVlKHZhbHVlKSk7XG5cdFx0XHRzZXRfc3RhdHVzKHRoZW5hYmxlLCBzdGF0dXMpO1xuXHRcdH1cblx0fVxuXHRlbHNlIGlmICggaXNQcm9taXNlKHZhbHVlKSApIHtcblx0XHRzZXRfZGVwZW5kZW50cyh0aGVuYWJsZSwgW10pO1xuXHRcdGRlcGVuZCh0aGVuYWJsZSwgdmFsdWUpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgdmFsdWUpO1xuXHRcdHNldF9zdGF0dXModGhlbmFibGUsIEZVTEZJTExFRCk7XG5cdH1cbn1cbiIsImltcG9ydCBXZWFrTWFwIGZyb20gJy5XZWFrTWFwJztcbmltcG9ydCBmcmVlemUgZnJvbSAnLk9iamVjdC5mcmVlemUnO1xuaW1wb3J0IHNlYWwgZnJvbSAnLk9iamVjdC5zZWFsJztcblxuaW1wb3J0IHZlcnNpb24gZnJvbSAnLi92ZXJzaW9uP3RleHQnO1xuZXhwb3J0IHsgdmVyc2lvbiB9O1xuXG5pbXBvcnQgcmVzb2x2ZSBmcm9tICcuL3Jlc29sdmUnO1xuaW1wb3J0IHJlamVjdCBmcm9tICcuL3JlamVjdCc7XG5pbXBvcnQgYWxsIGZyb20gJy4vYWxsJztcbmltcG9ydCByYWNlIGZyb20gJy4vcmFjZSc7XG5pbXBvcnQgcGVuZCBmcm9tICcuL3BlbmQnO1xuaW1wb3J0IEFXQUlUIGZyb20gJy4vYXdhaXQnO1xuZXhwb3J0IHtcblx0cmVzb2x2ZSxcblx0cmVqZWN0LFxuXHRhbGwsXG5cdHJhY2UsXG5cdHBlbmQsXG5cdEFXQUlUIGFzIGF3YWl0LFxufTtcblxuaW1wb3J0IHsgUHJpdmF0ZSwgRXhlY3V0b3IgfSBmcm9tICcuL18nO1xuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJztcbmltcG9ydCBwcm90b3R5cGUgZnJvbSAnLi9UaGVuYWJsZS5wcm90b3R5cGUnO1xuUHVibGljLnByb3RvdHlwZSA9IFByaXZhdGUucHJvdG90eXBlID0gdHlwZW9mIFdlYWtNYXA9PT0nZnVuY3Rpb24nID8gLyojX19QVVJFX18qLyBmcmVlemUocHJvdG90eXBlKSA6IHNlYWwgPyAvKiNfX1BVUkVfXyovIHNlYWwocHJvdG90eXBlKSA6IHByb3RvdHlwZTtcblxuaW1wb3J0IERlZmF1bHQgZnJvbSAnLmRlZmF1bHQ/PSc7XG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0KFB1YmxpYywge1xuXHR2ZXJzaW9uOiB2ZXJzaW9uLFxuXHRUaGVuYWJsZTogUHVibGljLFxuXHRyZXNvbHZlOiByZXNvbHZlLFxuXHRyZWplY3Q6IHJlamVjdCxcblx0YWxsOiBhbGwsXG5cdHJhY2U6IHJhY2UsXG5cdHBlbmQ6IHBlbmQsXG5cdGF3YWl0OiBBV0FJVFxufSk7XG5cbnZhciBUaGVuYWJsZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IGZyZWV6ZSA/IC8qI19fUFVSRV9fKi8gZnJlZXplKFB1YmxpYykgOiBQdWJsaWM7XG4gICAgICAgICAgICAgICAgICAgICAgIFxuZXhwb3J0IHsgVGhlbmFibGUgfTtcbiJdLCJuYW1lcyI6WyJ1bmRlZmluZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGNBQWUsT0FBTzs7Ozs7Ozs7c0JBQUMsdEJDMEJoQixJQUFJLE9BQU8sTUFBTSxDQUFDLENBQUM7QUFDMUIsQUFBTyxJQUFJLFNBQVMsTUFBTSxDQUFDLENBQUM7QUFDNUIsQUFBTyxJQUFJLFFBQVEsTUFBTSxDQUFDLENBQUM7O0FBRTNCLEFBQU8sSUFBSSxZQUFZLDBCQUEwQjtBQUNqRCxBQUFPLElBQUksT0FBTyx3QkFBd0IsU0FBUyxPQUFPLHVCQUF1QixFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFFBQVE7QUFDaEgsQUFBTyxJQUFJLFVBQVUsbUNBQW1DOztBQUV4RCxBQUFPLElBQUksaUJBQWlCLDBCQUEwQjtBQUN0RCxJQUFJLGlCQUFpQiwwQkFBMEI7QUFDL0MsSUFBSSxrQkFBa0IsMEJBQTBCO0FBQ2hELElBQUksYUFBYSwwQkFBMEI7QUFDM0MsSUFBSSx5QkFBeUIsMEJBQTBCO0FBQ3ZELElBQUksd0JBQXdCLDBCQUEwQjs7QUFFdEQsQUFBTyxJQUFJLFVBQVUsNEJBQTRCO0FBQ2pELEFBQU8sSUFBSSxTQUFTLHlCQUF5QjtBQUM3QyxBQUFPLElBQUksY0FBYywyQ0FBMkM7QUFDcEUsSUFBSSxlQUFlLDZDQUE2QztBQUNoRSxJQUFJLGNBQWMsNENBQTRDO0FBQzlELElBQUksVUFBVSx3Q0FBd0M7O0FBRXRELEFBQU8sSUFBSSxVQUFVLDBDQUEwQztBQUMvRCxBQUFPLElBQUksU0FBUyxzQ0FBc0M7QUFDMUQsQUFBTyxJQUFJLGNBQWMsaURBQWlEO0FBQzFFLEFBQU8sSUFBSSxlQUFlLG9EQUFvRDtBQUM5RSxBQUFPLElBQUksY0FBYyxrREFBa0Q7QUFDM0UsQUFBTyxJQUFJLFVBQVUsMENBQTBDOztBQUUvRCxLQUFLLE9BQU8sT0FBTyxHQUFHLFVBQVUsR0FB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