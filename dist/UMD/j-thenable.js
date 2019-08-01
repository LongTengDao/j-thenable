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

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.Thenable = factory());
}(this, function () { 'use strict';

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

	return _export;

}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsIl8udHMiLCJUaGVuYWJsZS50cyIsInJlc29sdmUudHMiLCJyZWplY3QudHMiLCJhbGwudHMiLCJyYWNlLnRzIiwicGVuZC50cyIsImF3YWl0LnRzIiwiVGhlbmFibGUucHJvdG90eXBlLnRzIiwiZXhwb3J0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0ICc0LjQuMCc7IiwiaW1wb3J0IFByb21pc2UgZnJvbSAnLlByb21pc2UnO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLldlYWtNYXAnO1xuaW1wb3J0IGdldFByb3RvdHlwZU9mIGZyb20gJy5PYmplY3QuZ2V0UHJvdG90eXBlT2YnO1xuaW1wb3J0IHByZXZlbnRFeHRlbnNpb25zIGZyb20gJy5PYmplY3QucHJldmVudEV4dGVuc2lvbnMnO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxuZXhwb3J0IHZhciBFeGVjdXRvciAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuZXhwb3J0IHZhciBPbmZ1bGZpbGxlZCAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5leHBvcnQgdmFyIE9ucmVqZWN0ZWQgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5leHBvcnQgdmFyIE9udGhlbiAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5leHBvcnQgdmFyIFN0YXR1cyAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgIFxuXHQgICAgICAgICAgICAgICAgXG5cdCAgICAgICAgICAgIFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIFxuXG5leHBvcnQgdmFyIFBFTkRJTkcgICAgPSAwO1xuZXhwb3J0IHZhciBGVUxGSUxMRUQgICAgPSAxO1xuZXhwb3J0IHZhciBSRUpFQ1RFRCAgICA9IDI7XG5cbmV4cG9ydCB2YXIgUHJpdmF0ZV9jYWxsICAgICAgICAgICAgICAgICAgICAgICAgIDtcbmV4cG9ydCB2YXIgUHJpdmF0ZSAgICAgICAgICAgICAgICAgICAgICA9IGZ1bmN0aW9uIFByaXZhdGUgKCAgICAgICAgICAgICApICAgICAgIHsgUHJpdmF0ZV9jYWxsKHRoaXMpOyB9ICAgICAgIDtcbmV4cG9ydCB2YXIgaXNUaGVuYWJsZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG5cbmV4cG9ydCB2YXIgZGVsZXRlX2RlcGVuZGVudHMgICAgICAgICAgICAgICAgICAgICAgICAgO1xudmFyIGRlbGV0ZV9vbnJlamVjdGVkICAgICAgICAgICAgICAgICAgICAgICAgIDtcbnZhciBkZWxldGVfb25mdWxmaWxsZWQgICAgICAgICAgICAgICAgICAgICAgICAgO1xudmFyIGRlbGV0ZV9vbnRoZW4gICAgICAgICAgICAgICAgICAgICAgICAgO1xudmFyIGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXMgICAgICAgICAgICAgICAgICAgICAgICAgO1xudmFyIGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyAgICAgICAgICAgICAgICAgICAgICAgICA7XG5cbmV4cG9ydCB2YXIgZ2V0X3N0YXR1cyAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbmV4cG9ydCB2YXIgZ2V0X3ZhbHVlICAgICAgICAgICAgICAgICAgICAgICAgO1xuZXhwb3J0IHZhciBnZXRfZGVwZW5kZW50cyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbnZhciBnZXRfb25mdWxmaWxsZWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbnZhciBnZXRfb25yZWplY3RlZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG52YXIgZ2V0X29udGhlbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcblxuZXhwb3J0IHZhciBzZXRfc3RhdHVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG5leHBvcnQgdmFyIHNldF92YWx1ZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG5leHBvcnQgdmFyIHNldF9kZXBlbmRlbnRzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xuZXhwb3J0IHZhciBzZXRfb25mdWxmaWxsZWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG5leHBvcnQgdmFyIHNldF9vbnJlamVjdGVkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbmV4cG9ydCB2YXIgc2V0X29udGhlbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgO1xuXG5pZiAoIHR5cGVvZiBXZWFrTWFwPT09J2Z1bmN0aW9uJyApIHtcblx0dmFyIFNUQVRVUyAgICAgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IFdlYWtNYXA7XG5cdHZhciBWQUxVRSAgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IFdlYWtNYXA7XG5cdHZhciBERVBFTkRFTlRTICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgV2Vha01hcDtcblx0dmFyIE9ORlVMRklMTEVEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IG5ldyBXZWFrTWFwO1xuXHR2YXIgT05SRUpFQ1RFRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IG5ldyBXZWFrTWFwO1xuXHR2YXIgT05USEVOICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgV2Vha01hcDtcblx0XG5cdFByaXZhdGVfY2FsbCA9IHByZXZlbnRFeHRlbnNpb25zICYmIC8qI19fUFVSRV9fKi8gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBvICAgICAgPSBwcmV2ZW50RXh0ZW5zaW9ucyh7fSk7XG5cdFx0VkFMVUUuc2V0KG8sIG8pO1xuXHRcdHJldHVybiBWQUxVRS5oYXMobyk7XG5cdH0oKVxuXHRcdD8gZnVuY3Rpb24gUHJpdmF0ZV9jYWxsIChUSElTICAgICAgICAgKSAgICAgICB7IFNUQVRVUy5zZXQocHJldmVudEV4dGVuc2lvbnMoVEhJUyksIFBFTkRJTkcpOyB9XG5cdFx0OiBmdW5jdGlvbiBQcml2YXRlX2NhbGwgKFRISVMgICAgICAgICApICAgICAgIHsgU1RBVFVTLnNldChUSElTLCBQRU5ESU5HKTsgfTtcblx0aXNUaGVuYWJsZSA9IGZ1bmN0aW9uIGlzVGhlbmFibGUgKHZhbHVlICAgICApICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIFNUQVRVUy5oYXModmFsdWUpOyB9O1xuXHRcblx0LyogZGVsZXRlOiAqL1xuXHRkZWxldGVfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGRlbGV0ZV9kZXBlbmRlbnRzIChUSElTICAgICAgICAgKSAgICAgICB7IERFUEVOREVOVFNbJ2RlbGV0ZSddKFRISVMpOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBkZWxldGVfb25mdWxmaWxsZWQgKFRISVMgICAgICAgICApICAgICAgIHsgT05GVUxGSUxMRURbJ2RlbGV0ZSddKFRISVMpOyB9O1xuXHRkZWxldGVfb25yZWplY3RlZCA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnJlamVjdGVkIChUSElTICAgICAgICAgKSAgICAgICB7IE9OUkVKRUNURURbJ2RlbGV0ZSddKFRISVMpOyB9O1xuXHRkZWxldGVfb250aGVuID0gZnVuY3Rpb24gZGVsZXRlX29udGhlbiAoVEhJUyAgICAgICAgICkgICAgICAgeyBPTlRIRU5bJ2RlbGV0ZSddKFRISVMpOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzID0gZGVsZXRlX29uZnVsZmlsbGVkO1xuXHRkZWxldGVfb25yZWplY3RlZF9pZl9oYXMgPSBkZWxldGVfb25yZWplY3RlZDsvKiovXG5cdC8qIHNldCB1bmRlZmluZWQ6ICogL1xuXHRkZWxldGVfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGRlbGV0ZV9kZXBlbmRlbnRzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IERFUEVOREVOVFMuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBkZWxldGVfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05GVUxGSUxMRUQuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb25yZWplY3RlZCA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnJlamVjdGVkIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9OUkVKRUNURUQuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb250aGVuID0gZnVuY3Rpb24gZGVsZXRlX29udGhlbiAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTlRIRU4uc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzID0gZnVuY3Rpb24gZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTkZVTEZJTExFRC5oYXMoVEhJUykgJiYgT05GVUxGSUxMRUQuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb25yZWplY3RlZF9pZl9oYXMgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZF9pZl9oYXMgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05SRUpFQ1RFRC5oYXMoVEhJUykgJiYgT05SRUpFQ1RFRC5zZXQoVEhJUywgdW5kZWZpbmVkISk7IH07LyoqL1xuXHRcblx0Z2V0X3N0YXR1cyA9IGZ1bmN0aW9uIGdldF9zdGF0dXMgKFRISVMgICAgICAgICApICAgICAgICAgeyByZXR1cm4gU1RBVFVTLmdldChUSElTKSA7IH07XG5cdGdldF92YWx1ZSA9IGZ1bmN0aW9uIGdldF92YWx1ZSAoVEhJUyAgICAgICAgICkgICAgICB7IHJldHVybiBWQUxVRS5nZXQoVEhJUyk7IH07XG5cdGdldF9kZXBlbmRlbnRzID0gZnVuY3Rpb24gZ2V0X2RlcGVuZGVudHMgKFRISVMgICAgICAgICApICAgICAgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gREVQRU5ERU5UUy5nZXQoVEhJUyk7IH07XG5cdGdldF9vbmZ1bGZpbGxlZCA9IGZ1bmN0aW9uIGdldF9vbmZ1bGZpbGxlZCAoVEhJUyAgICAgICAgICkgICAgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIE9ORlVMRklMTEVELmdldChUSElTKTsgfTtcblx0Z2V0X29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBnZXRfb25yZWplY3RlZCAoVEhJUyAgICAgICAgICkgICAgICAgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gT05SRUpFQ1RFRC5nZXQoVEhJUyk7IH07XG5cdGdldF9vbnRoZW4gPSBmdW5jdGlvbiBnZXRfb250aGVuIChUSElTICAgICAgICAgKSAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIE9OVEhFTi5nZXQoVEhJUyk7IH07XG5cdFxuXHRzZXRfc3RhdHVzID0gZnVuY3Rpb24gc2V0X3N0YXR1cyAoVEhJUyAgICAgICAgICwgc3RhdHVzICAgICAgICApICAgICAgIHsgU1RBVFVTLnNldChUSElTLCBzdGF0dXMpOyB9O1xuXHRzZXRfdmFsdWUgPSBmdW5jdGlvbiBzZXRfdmFsdWUgKFRISVMgICAgICAgICAsIHZhbHVlICAgICApICAgICAgIHsgVkFMVUUuc2V0KFRISVMsIHZhbHVlKTsgfTtcblx0c2V0X2RlcGVuZGVudHMgPSBmdW5jdGlvbiBzZXRfZGVwZW5kZW50cyAoVEhJUyAgICAgICAgICwgZGVwZW5kZW50cyAgICAgICAgICAgKSAgICAgICB7IERFUEVOREVOVFMuc2V0KFRISVMsIGRlcGVuZGVudHMpOyB9O1xuXHRzZXRfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBzZXRfb25mdWxmaWxsZWQgKFRISVMgICAgICAgICAsIG9uZnVsZmlsbGVkICAgICAgICAgICAgICkgICAgICAgeyBPTkZVTEZJTExFRC5zZXQoVEhJUywgb25mdWxmaWxsZWQpOyB9O1xuXHRzZXRfb25yZWplY3RlZCA9IGZ1bmN0aW9uIHNldF9vbnJlamVjdGVkIChUSElTICAgICAgICAgLCBvbnJlamVjdGVkICAgICAgICAgICAgKSAgICAgICB7IE9OUkVKRUNURUQuc2V0KFRISVMsIG9ucmVqZWN0ZWQpOyB9O1xuXHRzZXRfb250aGVuID0gZnVuY3Rpb24gc2V0X29udGhlbiAoVEhJUyAgICAgICAgICwgb250aGVuICAgICAgICApICAgICAgIHsgT05USEVOLnNldChUSElTLCBvbnRoZW4pOyB9O1xufVxuZWxzZSB7XG5cdFByaXZhdGVfY2FsbCA9IGZ1bmN0aW9uIFByaXZhdGVfY2FsbCAoKSAgICAgICB7IH07XG5cdGlzVGhlbmFibGUgPSBnZXRQcm90b3R5cGVPZlxuXHRcdD8gZnVuY3Rpb24gKHZhbHVlICAgICApICAgICAgICAgICAgICAgICAgIHtcblx0XHRcdHZhciBQcml2YXRlX3Byb3RvdHlwZSAgICAgICAgICA9IFByaXZhdGUucHJvdG90eXBlO1xuXHRcdFx0aXNUaGVuYWJsZSA9IGZ1bmN0aW9uIGlzVGhlbmFibGUgKHZhbHVlICAgICApICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHZhbHVlIT1udWxsICYmIGdldFByb3RvdHlwZU9mKHZhbHVlKT09PVByaXZhdGVfcHJvdG90eXBlOyB9O1xuXHRcdFx0cmV0dXJuIGlzVGhlbmFibGUodmFsdWUpO1xuXHRcdH1cblx0XHQ6IGZ1bmN0aW9uIGlzVGhlbmFibGUgKHZhbHVlICAgICApICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUHJpdmF0ZTsgfTtcblx0XG5cdC8qIHNldCB1bmRlZmluZWQ6ICovXG5cdGRlbGV0ZV9kZXBlbmRlbnRzID0gZnVuY3Rpb24gZGVsZXRlX2RlcGVuZGVudHMgKFRISVMgICAgICAgICApICAgICAgIHsgVEhJUy5fZGVwZW5kZW50cyA9IHVuZGVmaW5lZDsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkID0gZnVuY3Rpb24gZGVsZXRlX29uZnVsZmlsbGVkIChUSElTICAgICAgICAgKSAgICAgICB7IFRISVMuX29uZnVsZmlsbGVkID0gdW5kZWZpbmVkOyB9O1xuXHRkZWxldGVfb25yZWplY3RlZCA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnJlamVjdGVkIChUSElTICAgICAgICAgKSAgICAgICB7IFRISVMuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7IH07XG5cdGRlbGV0ZV9vbnRoZW4gPSBmdW5jdGlvbiBkZWxldGVfb250aGVuIChUSElTICAgICAgICAgKSAgICAgICB7IFRISVMuX29udGhlbiA9IHVuZGVmaW5lZDsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyA9IGZ1bmN0aW9uIGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXMgKFRISVMgICAgICAgICApICAgICAgIHsgaWYgKCBUSElTLl9vbmZ1bGZpbGxlZCApIHsgVEhJUy5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7IH0gfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzID0gZnVuY3Rpb24gZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzIChUSElTICAgICAgICAgKSAgICAgICB7IGlmICggVEhJUy5fb25yZWplY3RlZCApIHsgVEhJUy5fb25yZWplY3RlZCA9IHVuZGVmaW5lZDsgfSB9Oy8qKi9cblx0XG5cdGdldF9zdGF0dXMgPSBmdW5jdGlvbiBnZXRfc3RhdHVzIChUSElTICAgICAgICAgKSAgICAgICAgIHsgcmV0dXJuIFRISVMuX3N0YXR1czsgfTtcblx0Z2V0X3ZhbHVlID0gZnVuY3Rpb24gZ2V0X3ZhbHVlIChUSElTICAgICAgICAgKSAgICAgIHsgcmV0dXJuIFRISVMuX3ZhbHVlOyB9O1xuXHRnZXRfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGdldF9kZXBlbmRlbnRzIChUSElTICAgICAgICAgKSAgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIFRISVMuX2RlcGVuZGVudHM7IH07XG5cdGdldF9vbmZ1bGZpbGxlZCA9IGZ1bmN0aW9uIGdldF9vbmZ1bGZpbGxlZCAoVEhJUyAgICAgICAgICkgICAgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIFRISVMuX29uZnVsZmlsbGVkOyB9O1xuXHRnZXRfb25yZWplY3RlZCA9IGZ1bmN0aW9uIGdldF9vbnJlamVjdGVkIChUSElTICAgICAgICAgKSAgICAgICAgICAgICAgICAgICAgICAgICB7IHJldHVybiBUSElTLl9vbnJlamVjdGVkOyB9O1xuXHRnZXRfb250aGVuID0gZnVuY3Rpb24gZ2V0X29udGhlbiAoVEhJUyAgICAgICAgICkgICAgICAgICAgICAgICAgICAgICB7IHJldHVybiBUSElTLl9vbnRoZW47IH07XG5cdFxuXHRzZXRfc3RhdHVzID0gZnVuY3Rpb24gc2V0X3N0YXR1cyAoVEhJUyAgICAgICAgICwgc3RhdHVzICAgICAgICApICAgICAgIHsgVEhJUy5fc3RhdHVzID0gc3RhdHVzOyB9O1xuXHRzZXRfdmFsdWUgPSBmdW5jdGlvbiBzZXRfdmFsdWUgKFRISVMgICAgICAgICAsIHZhbHVlICAgICApICAgICAgIHsgVEhJUy5fdmFsdWUgPSB2YWx1ZTsgfTtcblx0c2V0X2RlcGVuZGVudHMgPSBmdW5jdGlvbiBzZXRfZGVwZW5kZW50cyAoVEhJUyAgICAgICAgICwgZGVwZW5kZW50cyAgICAgICAgICAgKSAgICAgICB7IFRISVMuX2RlcGVuZGVudHMgPSBkZXBlbmRlbnRzOyB9O1xuXHRzZXRfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBzZXRfb25mdWxmaWxsZWQgKFRISVMgICAgICAgICAsIG9uZnVsZmlsbGVkICAgICAgICAgICAgICkgICAgICAgeyBUSElTLl9vbmZ1bGZpbGxlZCA9IG9uZnVsZmlsbGVkOyB9O1xuXHRzZXRfb25yZWplY3RlZCA9IGZ1bmN0aW9uIHNldF9vbnJlamVjdGVkIChUSElTICAgICAgICAgLCBvbnJlamVjdGVkICAgICAgICAgICAgKSAgICAgICB7IFRISVMuX29ucmVqZWN0ZWQgPSBvbnJlamVjdGVkOyB9O1xuXHRzZXRfb250aGVuID0gZnVuY3Rpb24gc2V0X29udGhlbiAoVEhJUyAgICAgICAgICwgb250aGVuICAgICAgICApICAgICAgIHsgVEhJUy5fb250aGVuID0gb250aGVuOyB9O1xufVxuXG5leHBvcnQgdmFyIGlzUHJvbWlzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB0eXBlb2YgUHJvbWlzZT09PSdmdW5jdGlvbidcblx0PyBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKCBnZXRQcm90b3R5cGVPZiApIHtcblx0XHRcdHZhciBwcm90b3R5cGUgPSBQcm9taXNlLnByb3RvdHlwZTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiBpc1Byb21pc2UgKHZhbHVlICAgICApICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHZhbHVlIT1udWxsICYmIGdldFByb3RvdHlwZU9mKHZhbHVlKT09PXByb3RvdHlwZTsgfTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2YXIgY29uc3RydWN0b3IgPSBQcm9taXNlO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIGlzUHJvbWlzZSAodmFsdWUgICAgICkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBjb25zdHJ1Y3RvcjsgfTtcblx0XHR9XG5cdH0oKVxuXHQ6IGZ1bmN0aW9uIGlzUHJvbWlzZSAoKSB7IHJldHVybiBmYWxzZTsgfSAgICAgICA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxudmFyIHByZXBlbmRTdGFjayAgICAgICAgICAgICAgICAgICAgICA9IG51bGw7XG52YXIgcHJlcGVuZGluZyAgICAgICAgICA9IGZhbHNlO1xuZXhwb3J0IGZ1bmN0aW9uIHByZXBlbmQgKHRoZW5hYmxlICAgICAgICAgKSAgICAgICB7XG5cdHZhciBfb250aGVuICAgICAgICAgICAgICAgICAgICAgPSBnZXRfb250aGVuKHRoZW5hYmxlKTtcblx0aWYgKCAhX29udGhlbiApIHsgcmV0dXJuOyB9XG5cdGRlbGV0ZV9vbnRoZW4odGhlbmFibGUpO1xuXHRpZiAoIHByZXBlbmRpbmcgKSB7XG5cdFx0cHJlcGVuZFN0YWNrID0geyBuZXh0U3RhY2s6IHByZXBlbmRTdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCBvbnRoZW46IF9vbnRoZW4gfTtcblx0XHRyZXR1cm47XG5cdH1cblx0cHJlcGVuZGluZyA9IHRydWU7XG5cdGZvciAoIDsgOyApIHtcblx0XHR0cnkge1xuXHRcdFx0dmFyIHZhbHVlICAgICAgPSBfb250aGVuKCk7XG5cdFx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0XHRfb250aGVuID0gZ2V0X29udGhlbih2YWx1ZSk7XG5cdFx0XHRcdGlmICggX29udGhlbiApIHtcblx0XHRcdFx0XHRkZWxldGVfb250aGVuKHZhbHVlKTtcblx0XHRcdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkgLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdHByZXBlbmRTdGFjayA9IHsgbmV4dFN0YWNrOiBwcmVwZW5kU3RhY2ssIHRoZW5hYmxlOiB2YWx1ZSwgb250aGVuOiBfb250aGVuIH07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHN0YXR1cyAgICAgICAgID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKCBzdGF0dXM9PT1QRU5ESU5HICkgeyBnZXRfZGVwZW5kZW50cyh2YWx1ZSkgLnB1c2godGhlbmFibGUpOyB9XG5cdFx0XHRcdFx0ZWxzZSB7IGZsb3codGhlbmFibGUsIGdldF92YWx1ZSh2YWx1ZSksIHN0YXR1cyk7IH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7IGRlcGVuZCh0aGVuYWJsZSwgdmFsdWUpOyB9XG5cdFx0XHRlbHNlIHsgZmxvdyh0aGVuYWJsZSwgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHR9XG5cdFx0Y2F0Y2ggKGVycm9yKSB7IGZsb3codGhlbmFibGUsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0XHRpZiAoICFwcmVwZW5kU3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBwcmVwZW5kU3RhY2sudGhlbmFibGU7XG5cdFx0X29udGhlbiA9IHByZXBlbmRTdGFjay5vbnRoZW47XG5cdFx0cHJlcGVuZFN0YWNrID0gcHJlcGVuZFN0YWNrLm5leHRTdGFjaztcblx0fVxuXHRwcmVwZW5kaW5nID0gZmFsc2U7XG59XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxudmFyIGZsb3dTdGFjayAgICAgICAgICAgICAgICAgICA9IG51bGw7XG52YXIgZmxvd2luZyAgICAgICAgICA9IGZhbHNlO1xuZXhwb3J0IGZ1bmN0aW9uIGZsb3cgKHRoZW5hYmxlICAgICAgICAgLCB2YWx1ZSAgICAgLCBzdGF0dXMgICAgICAgICkgICAgICAge1xuXHRpZiAoIGZsb3dpbmcgKSB7XG5cdFx0Zmxvd1N0YWNrID0geyBuZXh0U3RhY2s6IGZsb3dTdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZsb3dpbmcgPSB0cnVlO1xuXHRmb3IgKCB2YXIgX3N0YXR1cyAgICAgICAgOyA7ICkge1xuXHRcdHN0YWNrOiB7XG5cdFx0XHRpZiAoIHN0YXR1cz09PUZVTEZJTExFRCApIHtcblx0XHRcdFx0ZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzKHRoZW5hYmxlKTtcblx0XHRcdFx0dmFyIF9vbmZ1bGZpbGxlZCAgICAgICAgICAgICAgICAgICAgICAgICAgPSBnZXRfb25mdWxmaWxsZWQodGhlbmFibGUpO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHRkZWxldGVfb25mdWxmaWxsZWQodGhlbmFibGUpO1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IF9vbmZ1bGZpbGxlZCh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0X3N0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdGdldF9kZXBlbmRlbnRzKHZhbHVlKSAucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSBnZXRfdmFsdWUodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRkZXBlbmQodGhlbmFibGUsIHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0aWYgKCBnZXRfc3RhdHVzKHRoZW5hYmxlKSE9PVBFTkRJTkcgKSB7IGJyZWFrIHN0YWNrOyB9XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyh0aGVuYWJsZSk7XG5cdFx0XHRcdHZhciBfb25yZWplY3RlZCAgICAgICAgICAgICAgICAgICAgICAgICA9IGdldF9vbnJlamVjdGVkKHRoZW5hYmxlKTtcblx0XHRcdFx0aWYgKCBfb25yZWplY3RlZCApIHtcblx0XHRcdFx0XHRkZWxldGVfb25yZWplY3RlZCh0aGVuYWJsZSk7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0cHJlcGVuZCh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdF9zdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkgLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gZ2V0X3ZhbHVlKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQcm9taXNlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0ZGVwZW5kKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7IHN0YXR1cyA9IEZVTEZJTExFRDsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyh0aGVuYWJsZSkhPT1QRU5ESU5HICkgeyBicmVhayBzdGFjazsgfVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgdmFsdWUpO1xuXHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgc3RhdHVzKTtcblx0XHRcdHZhciBfZGVwZW5kZW50cyAgICAgICAgICAgICAgICAgICAgICAgID0gZ2V0X2RlcGVuZGVudHModGhlbmFibGUpO1xuXHRcdFx0aWYgKCBfZGVwZW5kZW50cyApIHtcblx0XHRcdFx0ZGVsZXRlX2RlcGVuZGVudHModGhlbmFibGUpO1xuXHRcdFx0XHRmb3IgKCB2YXIgaW5kZXggICAgICAgICA9IF9kZXBlbmRlbnRzLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdGZsb3dTdGFjayA9IHsgbmV4dFN0YWNrOiBmbG93U3RhY2ssIHRoZW5hYmxlOiBfZGVwZW5kZW50c1stLWluZGV4XSwgdmFsdWU6IHZhbHVlLCBzdGF0dXM6IHN0YXR1cyB9O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICggIWZsb3dTdGFjayApIHsgYnJlYWs7IH1cblx0XHR0aGVuYWJsZSA9IGZsb3dTdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IGZsb3dTdGFjay52YWx1ZTtcblx0XHRzdGF0dXMgPSBmbG93U3RhY2suc3RhdHVzO1xuXHRcdGZsb3dTdGFjayA9IGZsb3dTdGFjay5uZXh0U3RhY2s7XG5cdH1cblx0Zmxvd2luZyA9IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVwZW5kICh0aGVuYWJsZSAgICAgICAgICwgdmFsdWUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApICAgICAgIHtcblx0dmFyIHJlZCAgICAgICAgICAgICAgICAgICAgIDtcblx0dmFsdWUudGhlbihcblx0XHRmdW5jdGlvbiBvbmZ1bGZpbGxlZCAodmFsdWUgICAgICkgICAgICAge1xuXHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdGZsb3codGhlbmFibGUsIHZhbHVlLCBGVUxGSUxMRUQpO1xuXHRcdH0sXG5cdFx0ZnVuY3Rpb24gb25yZWplY3RlZCAoZXJyb3IgICAgICkgICAgICAge1xuXHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdGZsb3codGhlbmFibGUsIGVycm9yLCBSRUpFQ1RFRCk7XG5cdFx0fVxuXHQpO1xufVxuIiwiaW1wb3J0IFR5cGVFcnJvciBmcm9tICcuVHlwZUVycm9yJztcblxuaW1wb3J0IHsgUEVORElORywgRlVMRklMTEVELCBSRUpFQ1RFRCwgU3RhdHVzLCBQcml2YXRlLCBpc1RoZW5hYmxlLCBpc1Byb21pc2UsIGZsb3csIGRlcGVuZCwgcHJlcGVuZCwgRXhlY3V0b3IsIE9uZnVsZmlsbGVkLCBPbnJlamVjdGVkLCBQcml2YXRlX2NhbGwsIGdldF9zdGF0dXMsIGdldF9kZXBlbmRlbnRzLCBnZXRfdmFsdWUsIHNldF9kZXBlbmRlbnRzLCBzZXRfdmFsdWUsIHNldF9zdGF0dXMsIGRlbGV0ZV9kZXBlbmRlbnRzIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IHsgUHVibGljIGFzIGRlZmF1bHQgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICBcblxudmFyIFB1YmxpYyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gZnVuY3Rpb24gVGhlbmFibGUgKCAgICAgICAgICAgICAgIGV4ZWN1dG9yICAgICAgICAgICkgICAgICAge1xuXHRpZiAoIHR5cGVvZiBleGVjdXRvciE9PSdmdW5jdGlvbicgKSB7IHRocm93IFR5cGVFcnJvcignbmV3IFRoZW5hYmxlKGV4ZWN1dG9yIGlzIG5vdCBhIGZ1bmN0aW9uKScpOyB9XG5cdHZhciBleGVjdXRlZCAgICAgICAgICAgICAgICAgICAgIDtcblx0dmFyIHJlZCAgICAgICAgICAgICAgICAgICAgIDtcblx0dmFyIF92YWx1ZSAgICAgO1xuXHR2YXIgX3N0YXR1cyAgICAgICAgICAgICAgICAgICAgO1xuXHR2YXIgVEhJUyAgICAgICAgICA9IHRoaXM7XG5cdC8vdGhpcyBpbnN0YW5jZW9mIFRoZW5hYmxlIHx8IHRocm93KFR5cGVFcnJvcigpKTtcblx0UHJpdmF0ZV9jYWxsKFRISVMpO1xuXHR0cnkge1xuXHRcdGV4ZWN1dG9yKFxuXHRcdFx0ZnVuY3Rpb24gcmVzb2x2ZSAodmFsdWUgICAgICkge1xuXHRcdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdGlmICggZXhlY3V0ZWQgKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRfc3RhdHVzID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7IGdldF9kZXBlbmRlbnRzKHZhbHVlKSAucHVzaChUSElTKTsgfVxuXHRcdFx0XHRcdFx0XHRlbHNlIHsgZmxvdyhUSElTLCBnZXRfdmFsdWUodmFsdWUpLCBfc3RhdHVzICk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkgeyBkZXBlbmQoVEhJUywgdmFsdWUpOyB9XG5cdFx0XHRcdFx0XHRlbHNlIHsgZmxvdyhUSElTLCB2YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHsgaWYgKCBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHsgZmxvdyhUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9IH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRfdmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHRfc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZnVuY3Rpb24gcmVqZWN0IChlcnJvciAgICAgKSB7XG5cdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCBleGVjdXRlZCApIHsgZmxvdyhUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdF92YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdF9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0aWYgKCAhcmVkICkge1xuXHRcdFx0ZXhlY3V0ZWQgPSB0cnVlO1xuXHRcdFx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoICFyZWQgKSB7XG5cdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIGVycm9yKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgUkVKRUNURUQpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHR0cnkgeyByRWQoVEhJUywgX3N0YXR1cyAsIF92YWx1ZSk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdGRlbGV0ZV9kZXBlbmRlbnRzKFRISVMpO1xuXHRcdH1cblx0fVxufSAgICAgICA7XG5cbmZ1bmN0aW9uIHJFZCAoVEhJUyAgICAgICAgICwgc3RhdHVzICAgICAgICAsIHZhbHVlICAgICApICAgICAgIHtcblx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0c3RhdHVzID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRpZiAoIHN0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0XHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIC5wdXNoKFRISVMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHNldF92YWx1ZShUSElTLCBnZXRfdmFsdWUodmFsdWUpKTtcblx0XHRcdFx0c2V0X3N0YXR1cyhUSElTLCBzdGF0dXMpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0XHRzZXRfZGVwZW5kZW50cyhUSElTLCBbXSk7XG5cdFx0XHRkZXBlbmQoVEhJUywgdmFsdWUpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRzZXRfdmFsdWUoVEhJUywgdmFsdWUpO1xuXHRzZXRfc3RhdHVzKFRISVMsIHN0YXR1cyk7XG59XG4iLCJpbXBvcnQgeyBpc1RoZW5hYmxlLCBpc1Byb21pc2UsIGRlcGVuZCwgRlVMRklMTEVELCBSRUpFQ1RFRCwgUEVORElORywgUHJpdmF0ZSwgc2V0X2RlcGVuZGVudHMsIHNldF92YWx1ZSwgc2V0X3N0YXR1cywgZ2V0X3N0YXR1cyB9IGZyb20gJy4vXyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc29sdmUgKHZhbHVlICAgICAgKSAgICAgICAgIHtcblx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHsgcmV0dXJuIHZhbHVlOyB9XG5cdHZhciBUSElTICAgICAgICAgID0gbmV3IFByaXZhdGU7XG5cdGlmICggaXNQcm9taXNlKHZhbHVlKSApIHtcblx0XHRzZXRfZGVwZW5kZW50cyhUSElTLCBbXSk7XG5cdFx0dHJ5X2RlcGVuZChUSElTLCB2YWx1ZSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0c2V0X3ZhbHVlKFRISVMsIHZhbHVlKTtcblx0XHRzZXRfc3RhdHVzKFRISVMsIEZVTEZJTExFRCk7XG5cdH1cblx0cmV0dXJuIFRISVM7XG59O1xuXG5mdW5jdGlvbiB0cnlfZGVwZW5kIChUSElTICAgICAgICAgLCB2YWx1ZSAgICAgKSB7XG5cdHRyeSB7IGRlcGVuZChUSElTLCB2YWx1ZSk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHR9XG5cdH1cbn1cblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgeyBSRUpFQ1RFRCwgUHJpdmF0ZSwgc2V0X3N0YXR1cywgc2V0X3ZhbHVlIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVqZWN0IChlcnJvciAgICAgICkgICAgICAgICB7XG5cdHZhciBUSElTICAgICAgICAgID0gbmV3IFByaXZhdGU7XG5cdHNldF9zdGF0dXMoVEhJUywgUkVKRUNURUQpO1xuXHRzZXRfdmFsdWUoVEhJUywgZXJyb3IpO1xuXHRyZXR1cm4gVEhJUztcbn07XG5cbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7IiwiaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxuaW1wb3J0IHsgUEVORElORywgUkVKRUNURUQsIEZVTEZJTExFRCwgZmxvdywgcHJlcGVuZCwgaXNUaGVuYWJsZSwgaXNQcm9taXNlLCBTdGF0dXMsIFByaXZhdGUsIGdldF9zdGF0dXMsIHNldF92YWx1ZSwgc2V0X3N0YXR1cywgZGVsZXRlX2RlcGVuZGVudHMsIHNldF9kZXBlbmRlbnRzLCBnZXRfZGVwZW5kZW50cywgZ2V0X3ZhbHVlLCBzZXRfb25mdWxmaWxsZWQsIHNldF9vbnJlamVjdGVkIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWxsICh2YWx1ZXMgICAgICAgICAgICAgICAgKSAgICAgICAgIHtcblx0dmFyIFRISVMgICAgICAgICAgPSBuZXcgUHJpdmF0ZTtcblx0dHJ5IHsgYWxsX3RyeSh2YWx1ZXMsIFRISVMpOyB9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRzZXRfdmFsdWUoVEhJUywgZXJyb3IpO1xuXHRcdFx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdFx0XHRkZWxldGVfZGVwZW5kZW50cyhUSElTKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIFRISVM7XG59O1xuXG5mdW5jdGlvbiBhbGxfdHJ5ICh2YWx1ZXMgICAgICAgICAgICAgICAgLCBUSElTICAgICAgICAgKSAgICAgICB7XG5cdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0ZnVuY3Rpb24gb25yZWplY3RlZCAoZXJyb3IgICAgICkgICAgICB7IGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICYmIGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR2YXIgX3ZhbHVlICAgICAgICA9IFtdO1xuXHR2YXIgY291bnQgICAgICAgICA9IDA7XG5cdHZhciBjb3VudGVkICAgICAgICAgICAgICAgICAgICAgO1xuXHRmb3IgKCB2YXIgbGVuZ3RoICAgICAgICAgPSB2YWx1ZXMubGVuZ3RoLCBpbmRleCAgICAgICAgID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdHZhciB2YWx1ZSAgICAgID0gdmFsdWVzW2luZGV4XTtcblx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0cHJlcGVuZCh2YWx1ZSk7XG5cdFx0XHR2YXIgX3N0YXR1cyAgICAgICAgID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHQrK2NvdW50O1xuXHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR2YXIgdGhhdCAgICAgICAgICA9IG5ldyBQcml2YXRlO1xuXHRcdFx0XHQoIGZ1bmN0aW9uIChpbmRleCAgICAgICAgKSB7XG5cdFx0XHRcdFx0c2V0X29uZnVsZmlsbGVkKHRoYXQsIGZ1bmN0aW9uIG9uZnVsZmlsbGVkICh2YWx1ZSAgICAgKSAgICAgICB7XG5cdFx0XHRcdFx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdGlmICggIS0tY291bnQgJiYgY291bnRlZCApIHsgZmxvdyhUSElTLCBfdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSApKGluZGV4KTtcblx0XHRcdFx0c2V0X29ucmVqZWN0ZWQodGhhdCwgb25yZWplY3RlZCk7XG5cdFx0XHRcdGdldF9kZXBlbmRlbnRzKHZhbHVlKSAucHVzaCh0aGF0KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBfc3RhdHVzPT09UkVKRUNURUQgKSB7XG5cdFx0XHRcdHNldF92YWx1ZShUSElTLCBnZXRfdmFsdWUodmFsdWUpKTtcblx0XHRcdFx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSBnZXRfdmFsdWUodmFsdWUpOyB9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdFx0Kytjb3VudDtcblx0XHRcdF92YWx1ZVtpbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0XHQoIGZ1bmN0aW9uIChpbmRleCAgICAgICAgKSB7XG5cdFx0XHRcdHZhciByZWQgICAgICAgICAgICAgICAgICAgICA7XG5cdFx0XHRcdHZhbHVlLnRoZW4oXG5cdFx0XHRcdFx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlICAgICApICAgICAgIHtcblx0XHRcdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdGlmICggIS0tY291bnQgJiYgY291bnRlZCApIHsgZmxvdyhUSElTLCBfdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG9ucmVqZWN0ZWRcblx0XHRcdFx0KTtcblx0XHRcdH0gKShpbmRleCk7XG5cdFx0fVxuXHRcdGVsc2UgeyBfdmFsdWVbaW5kZXhdID0gdmFsdWU7IH1cblx0fVxuXHRjb3VudGVkID0gdHJ1ZTtcblx0aWYgKCAhY291bnQgJiYgZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0c2V0X3ZhbHVlKFRISVMsIF92YWx1ZSk7XG5cdFx0c2V0X3N0YXR1cyhUSElTLCBGVUxGSUxMRUQpO1xuXHRcdGRlbGV0ZV9kZXBlbmRlbnRzKFRISVMpO1xuXHR9XG59XG5cbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7IiwiaW1wb3J0IHsgZmxvdywgcHJlcGVuZCwgUEVORElORywgRlVMRklMTEVELCBSRUpFQ1RFRCwgU3RhdHVzLCBpc1RoZW5hYmxlLCBpc1Byb21pc2UsIFByaXZhdGUsIGdldF9zdGF0dXMsIHNldF92YWx1ZSwgc2V0X3N0YXR1cywgZGVsZXRlX2RlcGVuZGVudHMsIHNldF9kZXBlbmRlbnRzLCBnZXRfZGVwZW5kZW50cywgZ2V0X3ZhbHVlLCBzZXRfb25mdWxmaWxsZWQsIHNldF9vbnJlamVjdGVkIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmFjZSAodmFsdWVzICAgICAgICAgICAgICAgICkgICAgICAgICB7XG5cdHZhciBUSElTICAgICAgICAgID0gbmV3IFByaXZhdGU7XG5cdHRyeSB7IHJhY2VfdHJ5KHZhbHVlcywgVEhJUyk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdGRlbGV0ZV9kZXBlbmRlbnRzKFRISVMpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn07XG5cbmZ1bmN0aW9uIHJhY2VfdHJ5ICh2YWx1ZXMgICAgICAgICAgICAgICAgLCBUSElTICAgICAgICAgKSAgICAgICB7XG5cdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlICAgICApICAgICAgeyBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyAmJiBmbG93KFRISVMsIHZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdGZ1bmN0aW9uIG9ucmVqZWN0ZWQgKGVycm9yICAgICApICAgICAgeyBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyAmJiBmbG93KFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0dmFyIHRoYXQgICAgICAgICAgPSBuZXcgUHJpdmF0ZTtcblx0c2V0X29uZnVsZmlsbGVkKHRoYXQsIG9uZnVsZmlsbGVkKTtcblx0c2V0X29ucmVqZWN0ZWQodGhhdCwgb25yZWplY3RlZCk7XG5cdGZvciAoIHZhciBsZW5ndGggICAgICAgICA9IHZhbHVlcy5sZW5ndGgsIGluZGV4ICAgICAgICAgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0dmFyIHZhbHVlICAgICAgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdHZhciBfc3RhdHVzICAgICAgICAgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7IGdldF9kZXBlbmRlbnRzKHZhbHVlKSAucHVzaCh0aGF0KTsgfVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHNldF92YWx1ZShUSElTLCBnZXRfdmFsdWUodmFsdWUpKTtcblx0XHRcdFx0c2V0X3N0YXR1cyhUSElTLCBfc3RhdHVzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdFx0dmFsdWUudGhlbihvbmZ1bGZpbGxlZCwgb25yZWplY3RlZCk7XG5cdFx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUykhPT1QRU5ESU5HICkgeyBicmVhazsgfVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCB2YWx1ZSk7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIEZVTEZJTExFRCk7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuXG5pbXBvcnQgeyBQcml2YXRlLCBPbnRoZW4sIHNldF9kZXBlbmRlbnRzLCBzZXRfb250aGVuIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGVuZCAob250aGVuICAgICAgICApICAgICAgICAge1xuXHRpZiAoIHR5cGVvZiBvbnRoZW4hPT0nZnVuY3Rpb24nICkgeyB0aHJvdyBUeXBlRXJyb3IoJ1RoZW5hYmxlLnBlbmQob250aGVuIGlzIG5vdCBhIGZ1bmN0aW9uKScpOyB9XG5cdHZhciBUSElTICAgICAgICAgID0gbmV3IFByaXZhdGU7XG5cdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0c2V0X29udGhlbihUSElTLCBvbnRoZW4pO1xuXHRyZXR1cm4gVEhJUztcbn07XG5cbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7IiwiaW1wb3J0IHsgaXNUaGVuYWJsZSwgRlVMRklMTEVELCBSRUpFQ1RFRCwgcHJlcGVuZCwgZ2V0X3N0YXR1cywgZ2V0X3ZhbHVlIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRhd2FpdDogZnVuY3Rpb24gKHZhbHVlICAgICApICAgICAge1xuXHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdHN3aXRjaCAoIGdldF9zdGF0dXModmFsdWUpICkge1xuXHRcdFx0XHRjYXNlIEZVTEZJTExFRDpcblx0XHRcdFx0XHRyZXR1cm4gZ2V0X3ZhbHVlKHZhbHVlKTtcblx0XHRcdFx0Y2FzZSBSRUpFQ1RFRDpcblx0XHRcdFx0XHR0aHJvdyBnZXRfdmFsdWUodmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cbn0uYXdhaXQ7XG4iLCJpbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLldlYWtNYXAnO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxuaW1wb3J0IHsgUEVORElORywgUkVKRUNURUQsIEZVTEZJTExFRCwgUHJpdmF0ZSwgaXNUaGVuYWJsZSwgaXNQcm9taXNlLCBTdGF0dXMsIGRlcGVuZCwgcHJlcGVuZCwgT25mdWxmaWxsZWQsIE9ucmVqZWN0ZWQsIGdldF9zdGF0dXMsIHNldF9kZXBlbmRlbnRzLCBzZXRfb25mdWxmaWxsZWQsIHNldF9vbnJlamVjdGVkLCBnZXRfZGVwZW5kZW50cywgc2V0X3ZhbHVlLCBnZXRfdmFsdWUsIHNldF9zdGF0dXMgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCB0eXBlb2YgV2Vha01hcD09PSdmdW5jdGlvbidcblx0PyB7IHRoZW46IHRoZW4gfVxuXHQ6IHtcblx0XHRfc3RhdHVzOiBQRU5ESU5HLFxuXHRcdF92YWx1ZTogdW5kZWZpbmVkLFxuXHRcdF9kZXBlbmRlbnRzOiB1bmRlZmluZWQsXG5cdFx0X29uZnVsZmlsbGVkOiB1bmRlZmluZWQsXG5cdFx0X29ucmVqZWN0ZWQ6IHVuZGVmaW5lZCxcblx0XHRfb250aGVuOiB1bmRlZmluZWQsXG5cdFx0dGhlbjogdGhlblxuXHR9O1xuXG5mdW5jdGlvbiB0aGVuICggICAgICAgICAgICAgICBvbmZ1bGZpbGxlZCAgICAgICAgICAgICAgLCBvbnJlamVjdGVkICAgICAgICAgICAgICkgICAgICAgICAge1xuXHR2YXIgVEhJUyAgICAgICAgICA9IHRoaXM7XG5cdGlmICggaXNUaGVuYWJsZShUSElTKSApIHtcblx0XHRwcmVwZW5kKFRISVMpO1xuXHRcdHZhciB0aGVuYWJsZSAgICAgICAgICA9IG5ldyBQcml2YXRlO1xuXHRcdHN3aXRjaCAoIGdldF9zdGF0dXMoVEhJUykgKSB7XG5cdFx0XHRjYXNlIFBFTkRJTkc6XG5cdFx0XHRcdHNldF9kZXBlbmRlbnRzKHRoZW5hYmxlLCBbXSk7XG5cdFx0XHRcdGlmICggdHlwZW9mIG9uZnVsZmlsbGVkPT09J2Z1bmN0aW9uJyApIHsgc2V0X29uZnVsZmlsbGVkKHRoZW5hYmxlLCBvbmZ1bGZpbGxlZCk7IH1cblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25yZWplY3RlZD09PSdmdW5jdGlvbicgKSB7IHNldF9vbnJlamVjdGVkKHRoZW5hYmxlLCBvbnJlamVjdGVkKTsgfVxuXHRcdFx0XHRnZXRfZGVwZW5kZW50cyhUSElTKSAucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0XHRcdGNhc2UgRlVMRklMTEVEOlxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvbmZ1bGZpbGxlZD09PSdmdW5jdGlvbicgKSB7IG9udG8oVEhJUywgb25mdWxmaWxsZWQsIHRoZW5hYmxlKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRzZXRfdmFsdWUodGhlbmFibGUsIGdldF92YWx1ZShUSElTKSk7XG5cdFx0XHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgRlVMRklMTEVEKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0XHRjYXNlIFJFSkVDVEVEOlxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvbnJlamVjdGVkPT09J2Z1bmN0aW9uJyApIHsgb250byhUSElTLCBvbnJlamVjdGVkLCB0aGVuYWJsZSk7IH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0c2V0X3ZhbHVlKHRoZW5hYmxlLCBnZXRfdmFsdWUoVEhJUykpO1xuXHRcdFx0XHRcdHNldF9zdGF0dXModGhlbmFibGUsIFJFSkVDVEVEKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0fVxuXHR9XG5cdHRocm93IFR5cGVFcnJvcignTWV0aG9kIFRoZW5hYmxlLnByb3RvdHlwZS50aGVuIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgcmVjZWl2ZXInKTtcbn1cblxuZnVuY3Rpb24gb250byAoVEhJUyAgICAgICAgICwgb24gICAgICAgICAgICAgICAgICwgdGhlbmFibGUgICAgICAgICApIHtcblx0dHJ5IHsgb250b190cnkodGhlbmFibGUsIG9uKGdldF92YWx1ZShUSElTKSkpOyB9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggZ2V0X3N0YXR1cyh0aGVuYWJsZSk9PT1QRU5ESU5HICkge1xuXHRcdFx0c2V0X3ZhbHVlKHRoZW5hYmxlLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKHRoZW5hYmxlLCBSRUpFQ1RFRCk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIG9udG9fdHJ5ICh0aGVuYWJsZSAgICAgICAgICwgdmFsdWUgICAgICkgICAgICAge1xuXHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdHZhciBzdGF0dXMgICAgICAgICA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdGlmICggc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdHNldF9kZXBlbmRlbnRzKHRoZW5hYmxlLCBbXSk7XG5cdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkgLnB1c2godGhlbmFibGUpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgZ2V0X3ZhbHVlKHZhbHVlKSk7XG5cdFx0XHRzZXRfc3RhdHVzKHRoZW5hYmxlLCBzdGF0dXMpO1xuXHRcdH1cblx0fVxuXHRlbHNlIGlmICggaXNQcm9taXNlKHZhbHVlKSApIHtcblx0XHRzZXRfZGVwZW5kZW50cyh0aGVuYWJsZSwgW10pO1xuXHRcdGRlcGVuZCh0aGVuYWJsZSwgdmFsdWUpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgdmFsdWUpO1xuXHRcdHNldF9zdGF0dXModGhlbmFibGUsIEZVTEZJTExFRCk7XG5cdH1cbn1cbiIsImltcG9ydCBXZWFrTWFwIGZyb20gJy5XZWFrTWFwJztcbmltcG9ydCBmcmVlemUgZnJvbSAnLk9iamVjdC5mcmVlemUnO1xuaW1wb3J0IHNlYWwgZnJvbSAnLk9iamVjdC5zZWFsJztcblxuaW1wb3J0IHZlcnNpb24gZnJvbSAnLi92ZXJzaW9uP3RleHQnO1xuZXhwb3J0IHsgdmVyc2lvbiB9O1xuXG5pbXBvcnQgcmVzb2x2ZSBmcm9tICcuL3Jlc29sdmUnO1xuaW1wb3J0IHJlamVjdCBmcm9tICcuL3JlamVjdCc7XG5pbXBvcnQgYWxsIGZyb20gJy4vYWxsJztcbmltcG9ydCByYWNlIGZyb20gJy4vcmFjZSc7XG5pbXBvcnQgcGVuZCBmcm9tICcuL3BlbmQnO1xuaW1wb3J0IEFXQUlUIGZyb20gJy4vYXdhaXQnO1xuZXhwb3J0IHtcblx0cmVzb2x2ZSxcblx0cmVqZWN0LFxuXHRhbGwsXG5cdHJhY2UsXG5cdHBlbmQsXG5cdEFXQUlUIGFzIGF3YWl0LFxufTtcblxuaW1wb3J0IHsgUHJpdmF0ZSwgRXhlY3V0b3IgfSBmcm9tICcuL18nO1xuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJztcbmltcG9ydCBwcm90b3R5cGUgZnJvbSAnLi9UaGVuYWJsZS5wcm90b3R5cGUnO1xuUHVibGljLnByb3RvdHlwZSA9IFByaXZhdGUucHJvdG90eXBlID0gdHlwZW9mIFdlYWtNYXA9PT0nZnVuY3Rpb24nID8gLyojX19QVVJFX18qLyBmcmVlemUocHJvdG90eXBlKSA6IHNlYWwgPyAvKiNfX1BVUkVfXyovIHNlYWwocHJvdG90eXBlKSA6IHByb3RvdHlwZTtcblxuaW1wb3J0IERlZmF1bHQgZnJvbSAnLmRlZmF1bHQ/PSc7XG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0KFB1YmxpYywge1xuXHR2ZXJzaW9uOiB2ZXJzaW9uLFxuXHRUaGVuYWJsZTogUHVibGljLFxuXHRyZXNvbHZlOiByZXNvbHZlLFxuXHRyZWplY3Q6IHJlamVjdCxcblx0YWxsOiBhbGwsXG5cdHJhY2U6IHJhY2UsXG5cdHBlbmQ6IHBlbmQsXG5cdGF3YWl0OiBBV0FJVFxufSk7XG5cbnZhciBUaGVuYWJsZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IGZyZWV6ZSA/IC8qI19fUFVSRV9fKi8gZnJlZXplKFB1YmxpYykgOiBQdWJsaWM7XG4gICAgICAgICAgICAgICAgICAgICAgIFxuZXhwb3J0IHsgVGhlbmFibGUgfTtcbiJdLCJuYW1lcyI6WyJ1bmRlZmluZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGVBQWUsT0FBTzs7Ozs7Ozs7dUJBQUMsdEJDMEJoQixJQUFJLE9BQU8sTUFBTSxDQUFDLENBQUM7QUFDMUIsQ0FBTyxJQUFJLFNBQVMsTUFBTSxDQUFDLENBQUM7QUFDNUIsQ0FBTyxJQUFJLFFBQVEsTUFBTSxDQUFDLENBQUM7O0FBRTNCLENBQU8sSUFBSSxZQUFZLDBCQUEwQjtBQUNqRCxDQUFPLElBQUksT0FBTyx3QkFBd0IsU0FBUyxPQUFPLHVCQUF1QixFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFFBQVE7QUFDaEgsQ0FBTyxJQUFJLFVBQVUsbUNBQW1DOztBQUV4RCxDQUFPLElBQUksaUJBQWlCLDBCQUEwQjtDQUN0RCxJQUFJLGlCQUFpQiwwQkFBMEI7Q0FDL0MsSUFBSSxrQkFBa0IsMEJBQTBCO0NBQ2hELElBQUksYUFBYSwwQkFBMEI7Q0FDM0MsSUFBSSx5QkFBeUIsMEJBQTBCO0NBQ3ZELElBQUksd0JBQXdCLDBCQUEwQjs7QUFFdEQsQ0FBTyxJQUFJLFVBQVUsNEJBQTRCO0FBQ2pELENBQU8sSUFBSSxTQUFTLHlCQUF5QjtBQUM3QyxDQUFPLElBQUksY0FBYywyQ0FBMkM7Q0FDcEUsSUFBSSxlQUFlLDZDQUE2QztDQUNoRSxJQUFJLGNBQWMsNENBQTRDO0NBQzlELElBQUksVUFBVSx3Q0FBd0M7O0FBRXRELENBQU8sSUFBSSxVQUFVLDBDQUEwQztBQUMvRCxDQUFPLElBQUksU0FBUyxzQ0FBc0M7QUFDMUQsQ0FBTyxJQUFJLGNBQWMsaURBQWlEO0FBQzFFLENBQU8sSUFBSSxlQUFlLG9EQUFvRDtBQUM5RSxDQUFPLElBQUksY0FBYyxrREFBa0Q7QUFDM0UsQ0FBTyxJQUFJLFVBQVUsMENBQTBDOztDQUUvRCxLQUFLLE9BQU8sT0FBTyxHQUFHLFVB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