/*!
 * 模块名称：j-thenable
 * 模块功能：模仿 Promise API 的同步防爆栈工具。从属于“简计划”。
   　　　　　Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".
 * 模块版本：2.0.0
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

	var version = '2.0.0';

	var freeze = Object.freeze;

	var undefined$1 = void 0;

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
				dom.style.display = 'none';
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
				if ( freeze ) {
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

	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var Private = function Thenable() { };
	function isPrivate(value) {
	    return value instanceof Private;
	}
	function isPublic(value) {
	    return value != null && typeof value.then === 'function';
	}
	function onto(thenable, value) {
	    var red;
	    value.then(function onfulfilled(value) {
	        if (red) {
	            return;
	        }
	        red = true;
	        r(thenable, value, FULFILLED);
	    }, function onrejected(error) {
	        if (red) {
	            return;
	        }
	        red = true;
	        r(thenable, error, REJECTED);
	    });
	}
	var stack = null;
	function r(thenable, value, status) {
	    if (stack) {
	        stack = { nextStack: stack, thenable: thenable, value: value, status: status };
	        return;
	    }
	    for (;;) {
	        stack: {
	            if (status === FULFILLED) {
	                if (thenable._onrejected) {
	                    thenable._onrejected = undefined$1;
	                }
	                var _onfulfilled = thenable._onfulfilled;
	                if (_onfulfilled) {
	                    thenable._onfulfilled = undefined$1;
	                    try {
	                        value = _onfulfilled(value);
	                        if (isPrivate(value)) {
	                            var _status = value._status;
	                            if (_status === PENDING) {
	                                value._on.push(thenable);
	                                break stack;
	                            }
	                            else {
	                                value = value._value;
	                                status = _status;
	                            }
	                        }
	                        else if (isPublic(value)) {
	                            onto(thenable, value);
	                            break stack;
	                        }
	                    }
	                    catch (error) {
	                        if (thenable._status !== PENDING) {
	                            break stack;
	                        }
	                        value = error;
	                        status = REJECTED;
	                    }
	                }
	            }
	            else {
	                if (thenable._onfulfilled) {
	                    thenable._onfulfilled = undefined$1;
	                }
	                var _onrejected = thenable._onrejected;
	                if (_onrejected) {
	                    thenable._onrejected = undefined$1;
	                    try {
	                        value = _onrejected(value);
	                        if (isPrivate(value)) {
	                            var _status = value._status;
	                            if (_status === PENDING) {
	                                value._on.push(thenable);
	                                break stack;
	                            }
	                            else {
	                                value = value._value;
	                                status = _status;
	                            }
	                        }
	                        else if (isPublic(value)) {
	                            onto(thenable, value);
	                            break stack;
	                        }
	                        else {
	                            status = FULFILLED;
	                        }
	                    }
	                    catch (error) {
	                        if (thenable._status !== PENDING) {
	                            break stack;
	                        }
	                        value = error;
	                    }
	                }
	            }
	            thenable._value = value;
	            thenable._status = status;
	            var _on = thenable._on;
	            if (_on) {
	                thenable._on = null;
	                for (var index = _on.length; index;) {
	                    stack = { nextStack: stack, thenable: _on[--index], value: value, status: status };
	                }
	            }
	        }
	        if (!stack) {
	            break;
	        }
	        thenable = stack.thenable;
	        value = stack.value;
	        status = stack.status;
	        stack = stack.nextStack;
	    }
	}
	function rEd(THIS, _status, _value) {
	    if (_status === FULFILLED) {
	        if (isPrivate(_value)) {
	            _status = _value._status;
	            if (_status === PENDING) {
	                THIS._on = [];
	                _value._on.push(THIS);
	            }
	            else {
	                THIS._value = _value._value;
	                THIS._status = _status;
	            }
	            return;
	        }
	        if (isPublic(_value)) {
	            THIS._on = [];
	            onto(THIS, _value);
	            return;
	        }
	    }
	    THIS._value = _value;
	    THIS._status = _status;
	}
	var Public = function Thenable(executor) {
	    if (typeof executor !== 'function') {
	        throw TypeError('Thenable executor is not a function');
	    }
	    var executed;
	    var red;
	    var _value;
	    var _status;
	    var THIS = this;
	    try {
	        executor(function resolve(value) {
	            if (red) {
	                return;
	            }
	            red = true;
	            if (executed) {
	                try {
	                    if (isPrivate(value)) {
	                        _status = value._status;
	                        if (_status === PENDING) {
	                            value._on.push(THIS);
	                        }
	                        else {
	                            r(THIS, value._value, _status);
	                        }
	                    }
	                    else if (isPublic(value)) {
	                        onto(THIS, value);
	                    }
	                    else {
	                        r(THIS, value, FULFILLED);
	                    }
	                }
	                catch (error) {
	                    if (THIS._status === PENDING) {
	                        r(THIS, error, REJECTED);
	                    }
	                }
	            }
	            else {
	                _value = value;
	                _status = FULFILLED;
	            }
	        }, function reject(error) {
	            if (red) {
	                return;
	            }
	            red = true;
	            if (executed) {
	                r(THIS, error, REJECTED);
	            }
	            else {
	                _value = error;
	                _status = REJECTED;
	            }
	        });
	        if (!red) {
	            executed = true;
	            THIS._on = [];
	            return;
	        }
	    }
	    catch (error) {
	        if (!red) {
	            red = true;
	            THIS._value = error;
	            THIS._status = REJECTED;
	            return;
	        }
	    }
	    try {
	        rEd(THIS, _status, _value);
	    }
	    catch (error) {
	        if (THIS._status === PENDING) {
	            THIS._value = error;
	            THIS._status = REJECTED;
	            THIS._on = null;
	        }
	    }
	};
	function t(thenable, value) {
	    if (isPrivate(value)) {
	        var _status = value._status;
	        if (_status === PENDING) {
	            thenable._on = [];
	            value._on.push(thenable);
	        }
	        else {
	            thenable._value = value._value;
	            thenable._status = _status;
	        }
	    }
	    else if (isPublic(value)) {
	        thenable._on = [];
	        onto(thenable, value);
	    }
	    else {
	        thenable._value = value;
	        thenable._status = FULFILLED;
	    }
	}
	function pass(THIS, on, thenable) {
	    try {
	        t(thenable, on(THIS._value));
	    }
	    catch (error) {
	        if (thenable._status === PENDING) {
	            thenable._value = error;
	            thenable._status = REJECTED;
	        }
	    }
	}
	Private.prototype = Public.prototype = {
	    _status: PENDING,
	    _value: undefined$1,
	    _on: null,
	    _onfulfilled: undefined$1,
	    _onrejected: undefined$1,
	    then: function then(onfulfilled, onrejected) {
	        var THIS = this;
	        var thenable = new Private;
	        switch (THIS._status) {
	            case PENDING:
	                thenable._on = [];
	                thenable._onfulfilled = onfulfilled;
	                thenable._onrejected = onrejected;
	                THIS._on.push(thenable);
	                return thenable;
	            case FULFILLED:
	                if (typeof onfulfilled === 'function') {
	                    pass(THIS, onfulfilled, thenable);
	                }
	                else {
	                    thenable._value = THIS._value;
	                    thenable._status = FULFILLED;
	                }
	                return thenable;
	            case REJECTED:
	                if (typeof onrejected === 'function') {
	                    pass(THIS, onrejected, thenable);
	                }
	                else {
	                    thenable._value = THIS._value;
	                    thenable._status = REJECTED;
	                }
	                return thenable;
	        }
	        throw TypeError('Method Thenable.prototype.then called on incompatible receiver');
	    }
	};
	function resolve(value) {
	    var THIS = new Private;
	    try {
	        t(THIS, value);
	    }
	    catch (error) {
	        if (THIS._status === PENDING) {
	            THIS._value = error;
	            THIS._status = REJECTED;
	        }
	    }
	    return THIS;
	}
	function reject(error) {
	    var THIS = new Private;
	    THIS._status = REJECTED;
	    THIS._value = error;
	    return THIS;
	}
	function _all(values, THIS) {
	    THIS._on = [];
	    function _onrejected(error) { THIS._status === PENDING && r(THIS, error, REJECTED); }
	    var _value = [];
	    var count = 0;
	    var counted;
	    for (var length = values.length, index = 0; index < length; ++index) {
	        var value = values[index];
	        if (isPrivate(value)) {
	            var _status = value._status;
	            if (_status === PENDING) {
	                ++count;
	                _value[index] = undefined$1;
	                value._on.push({
	                    _status: 0,
	                    _value: undefined$1,
	                    _on: null,
	                    _onfulfilled: function (index) {
	                        return function (value) {
	                            if (THIS._status === PENDING) {
	                                _value[index] = value;
	                                if (!--count && counted) {
	                                    r(THIS, _value, FULFILLED);
	                                }
	                            }
	                        };
	                    }(index),
	                    _onrejected: _onrejected
	                });
	            }
	            else if (_status === REJECTED) {
	                THIS._value = value._value;
	                THIS._status = REJECTED;
	                break;
	            }
	            else {
	                _value[index] = value._value;
	            }
	        }
	        else if (isPublic(value)) {
	            ++count;
	            _value[index] = undefined$1;
	            value.then(function (index) {
	                var red;
	                return function (value) {
	                    if (red) {
	                        return;
	                    }
	                    red = true;
	                    if (THIS._status === PENDING) {
	                        _value[index] = value;
	                        if (!--count && counted) {
	                            r(THIS, _value, FULFILLED);
	                        }
	                    }
	                };
	            }(index), _onrejected);
	        }
	        else {
	            _value[index] = value;
	        }
	    }
	    counted = true;
	    if (!count && THIS._status === PENDING) {
	        THIS._value = _value;
	        THIS._status = FULFILLED;
	        THIS._on = null;
	    }
	}
	function all(values) {
	    var THIS = new Private;
	    try {
	        _all(values, THIS);
	    }
	    catch (error) {
	        if (THIS._status === PENDING) {
	            THIS._value = error;
	            THIS._status = REJECTED;
	            THIS._on = null;
	        }
	    }
	    return THIS;
	}
	function _race(values, THIS) {
	    THIS._on = [];
	    function _onfulfilled(value) { THIS._status === PENDING && r(THIS, value, FULFILLED); }
	    function _onrejected(error) { THIS._status === PENDING && r(THIS, error, REJECTED); }
	    var that = {
	        _status: 0,
	        _value: undefined$1,
	        _on: null,
	        _onfulfilled: _onfulfilled,
	        _onrejected: _onrejected
	    };
	    for (var length = values.length, index = 0; index < length; ++index) {
	        var value = values[index];
	        if (isPrivate(value)) {
	            var _status = value._status;
	            if (_status === PENDING) {
	                value._on.push(that);
	            }
	            else {
	                THIS._value = value._value;
	                THIS._status = _status;
	                break;
	            }
	        }
	        else if (isPublic(value)) {
	            value.then(_onfulfilled, _onrejected);
	            if (THIS._status !== PENDING) {
	                break;
	            }
	        }
	        else {
	            THIS._value = value;
	            THIS._status = FULFILLED;
	            break;
	        }
	    }
	}
	function race(values) {
	    var THIS = new Private;
	    try {
	        _race(values, THIS);
	    }
	    catch (error) {
	        if (THIS._status === PENDING) {
	            THIS._value = error;
	            THIS._status = REJECTED;
	            THIS._on = null;
	        }
	    }
	    return THIS;
	}
	var _export = Default(Public, {
	    version: version,
	    Thenable: Public,
	    resolve: resolve,
	    reject: reject,
	    all: all,
	    race: race
	});

	return _export;

}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMi4wLjAnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IGZyZWV6ZSBmcm9tICcuT2JqZWN0LmZyZWV6ZSc7XG5pbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxudmFyIFBFTkRJTkcgOjAgPSAwO1xudmFyIEZVTEZJTExFRCA6MSA9IDE7XG52YXIgUkVKRUNURUQgOjIgPSAyO1xudHlwZSBTdGF0dXMgPSAwIHwgMSB8IDI7XG5cbnZhciBQcml2YXRlID0gZnVuY3Rpb24gVGhlbmFibGUgKCkge30gYXMgdW5rbm93biBhcyB7IG5ldyAoKSA6UHJpdmF0ZSB9O1xuXG5mdW5jdGlvbiBpc1ByaXZhdGUgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBQcml2YXRlIHtcblx0cmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUHJpdmF0ZTtcbn1cblxuZnVuY3Rpb24gaXNQdWJsaWMgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyB7IHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOmFueSB9IHtcblx0cmV0dXJuIHZhbHVlIT1udWxsICYmIHR5cGVvZiB2YWx1ZS50aGVuPT09J2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gb250byAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDp7IHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOmFueSB9KSA6dm9pZCB7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhbHVlLnRoZW4oXG5cdFx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRyKHRoZW5hYmxlLCB2YWx1ZSwgRlVMRklMTEVEKTtcblx0XHR9LFxuXHRcdGZ1bmN0aW9uIG9ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRyKHRoZW5hYmxlLCBlcnJvciwgUkVKRUNURUQpO1xuXHRcdH1cblx0KTtcbn1cblxudHlwZSBTdGFjayA9IHsgbmV4dFN0YWNrIDpTdGFjaywgdGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnksIHN0YXR1cyA6U3RhdHVzIH0gfCBudWxsO1xudmFyIHN0YWNrIDpTdGFjayA9IG51bGw7XG5mdW5jdGlvbiByICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBzdGFjayApIHtcblx0XHRzdGFjayA9IHsgbmV4dFN0YWNrOiBzdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZvciAoIDsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGlmICggdGhlbmFibGUuX29ucmVqZWN0ZWQgKSB7IHRoZW5hYmxlLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29uZnVsZmlsbGVkO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29uZnVsZmlsbGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUuX29uIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRvbnRvKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggdGhlbmFibGUuX3N0YXR1cyE9PVBFTkRJTkcgKSB7IGJyZWFrIHN0YWNrOyB9XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fb25mdWxmaWxsZWQgKSB7IHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfVxuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29ucmVqZWN0ZWQ7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdG9udG8odGhlbmFibGUsIHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHsgc3RhdHVzID0gRlVMRklMTEVEOyB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fc3RhdHVzIT09UEVORElORyApIHsgYnJlYWsgc3RhY2s7IH1cblx0XHRcdFx0XHRcdHZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBzdGF0dXM7XG5cdFx0XHR2YXIgX29uIDpQcml2YXRlW10gfCBudWxsID0gdGhlbmFibGUuX29uO1xuXHRcdFx0aWYgKCBfb24gKSB7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbiA9IG51bGw7XG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA6bnVtYmVyID0gX29uLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdHN0YWNrID0geyBuZXh0U3RhY2s6IHN0YWNrLCB0aGVuYWJsZTogX29uWy0taW5kZXhdLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCAhc3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBzdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IHN0YWNrLnZhbHVlO1xuXHRcdHN0YXR1cyA9IHN0YWNrLnN0YXR1cztcblx0XHRzdGFjayA9IHN0YWNrLm5leHRTdGFjaztcblx0fVxufVxuXG5mdW5jdGlvbiByRWQgKFRISVMgOlByaXZhdGUsIF9zdGF0dXMgOlN0YXR1cyB8IHVuZGVmaW5lZCwgX3ZhbHVlIDphbnkpIDp2b2lkIHtcblx0aWYgKCBfc3RhdHVzPT09RlVMRklMTEVEICkge1xuXHRcdGlmICggaXNQcml2YXRlKF92YWx1ZSkgKSB7XG5cdFx0XHRfc3RhdHVzID0gX3ZhbHVlLl9zdGF0dXM7XG5cdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRUSElTLl9vbiA9IFtdO1xuXHRcdFx0XHRfdmFsdWUuX29uIS5wdXNoKFRISVMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFRISVMuX3ZhbHVlID0gX3ZhbHVlLl92YWx1ZTtcblx0XHRcdFx0VEhJUy5fc3RhdHVzID0gX3N0YXR1cztcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCBpc1B1YmxpYyhfdmFsdWUpICkge1xuXHRcdFx0VEhJUy5fb24gPSBbXTtcblx0XHRcdG9udG8oVEhJUywgX3ZhbHVlKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0VEhJUy5fdmFsdWUgPSBfdmFsdWU7XG5cdFRISVMuX3N0YXR1cyA9IF9zdGF0dXMhO1xufVxudmFyIFB1YmxpYyA6eyBuZXcgKGV4ZWN1dG9yIDpFeGVjdXRvcikgOlB1YmxpYyB9ID0gZnVuY3Rpb24gVGhlbmFibGUgKHRoaXMgOlByaXZhdGUsIGV4ZWN1dG9yIDpFeGVjdXRvcikgOnZvaWQge1xuXHRpZiAoIHR5cGVvZiBleGVjdXRvciE9PSdmdW5jdGlvbicgKSB7IHRocm93IFR5cGVFcnJvcignVGhlbmFibGUgZXhlY3V0b3IgaXMgbm90IGEgZnVuY3Rpb24nKTsgfVxuXHR2YXIgZXhlY3V0ZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhciBfdmFsdWUgOmFueTtcblx0dmFyIF9zdGF0dXMgOlN0YXR1cyB8IHVuZGVmaW5lZDtcblx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHR0cnkge1xuXHRcdGV4ZWN1dG9yKFxuXHRcdFx0ZnVuY3Rpb24gcmVzb2x2ZSAodmFsdWUgOmFueSkge1xuXHRcdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdGlmICggZXhlY3V0ZWQgKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0X3N0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7IHZhbHVlLl9vbiEucHVzaChUSElTKTsgfVxuXHRcdFx0XHRcdFx0XHRlbHNlIHsgcihUSElTLCB2YWx1ZS5fdmFsdWUsIF9zdGF0dXMpOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkgeyBvbnRvKFRISVMsIHZhbHVlKTsgfVxuXHRcdFx0XHRcdFx0ZWxzZSB7IHIoVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7IGlmICggVEhJUy5fc3RhdHVzPT09UEVORElORyApIHsgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9IH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRfdmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHRfc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZnVuY3Rpb24gcmVqZWN0IChlcnJvciA6YW55KSB7XG5cdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCBleGVjdXRlZCApIHsgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdF92YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdF9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0aWYgKCAhcmVkICkge1xuXHRcdFx0ZXhlY3V0ZWQgPSB0cnVlO1xuXHRcdFx0VEhJUy5fb24gPSBbXTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCAhcmVkICkge1xuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFRISVMuX3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0dHJ5IHsgckVkKFRISVMsIF9zdGF0dXMsIF92YWx1ZSk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0VEhJUy5fb24gPSBudWxsO1xuXHRcdH1cblx0fVxufSBhcyB1bmtub3duIGFzIHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfTtcblxuZnVuY3Rpb24gdCAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnkpIDp2b2lkIHtcblx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRcdHZhbHVlLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0fVxuXHR9XG5cdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0dGhlbmFibGUuX29uID0gW107XG5cdFx0b250byh0aGVuYWJsZSwgdmFsdWUpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHRoZW5hYmxlLl92YWx1ZSA9IHZhbHVlO1xuXHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFzcyAoVEhJUyA6UHJpdmF0ZSwgb24gOkZ1bmN0aW9uLCB0aGVuYWJsZSA6UHJpdmF0ZSkge1xuXHR0cnkgeyB0KHRoZW5hYmxlLCBvbihUSElTLl92YWx1ZSkpOyB9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggdGhlbmFibGUuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHR9XG5cdH1cbn1cblByaXZhdGUucHJvdG90eXBlID0gUHVibGljLnByb3RvdHlwZSA9IHtcblx0X3N0YXR1czogUEVORElORyxcblx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdF9vbjogbnVsbCxcblx0X29uZnVsZmlsbGVkOiB1bmRlZmluZWQsXG5cdF9vbnJlamVjdGVkOiB1bmRlZmluZWQsXG5cdHRoZW46IGZ1bmN0aW9uIHRoZW4gKHRoaXMgOlByaXZhdGUsIG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOlByaXZhdGUge1xuXHRcdHZhciBUSElTIDpQcml2YXRlID0gdGhpcztcblx0XHR2YXIgdGhlbmFibGUgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0XHRzd2l0Y2ggKCBUSElTLl9zdGF0dXMgKSB7XG5cdFx0XHRjYXNlIFBFTkRJTkc6XG5cdFx0XHRcdHRoZW5hYmxlLl9vbiA9IFtdO1xuXHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSBvbmZ1bGZpbGxlZDtcblx0XHRcdFx0dGhlbmFibGUuX29ucmVqZWN0ZWQgPSBvbnJlamVjdGVkO1xuXHRcdFx0XHRUSElTLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0XHRcdGNhc2UgRlVMRklMTEVEOlxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvbmZ1bGZpbGxlZD09PSdmdW5jdGlvbicgKSB7IHBhc3MoVEhJUywgb25mdWxmaWxsZWQsIHRoZW5hYmxlKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0XHRcdGNhc2UgUkVKRUNURUQ6XG5cdFx0XHRcdGlmICggdHlwZW9mIG9ucmVqZWN0ZWQ9PT0nZnVuY3Rpb24nICkgeyBwYXNzKFRISVMsIG9ucmVqZWN0ZWQsIHRoZW5hYmxlKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdH1cblx0XHR0aHJvdyBUeXBlRXJyb3IoJ01ldGhvZCBUaGVuYWJsZS5wcm90b3R5cGUudGhlbiBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG5cdH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0dHJ5IHsgdChUSElTLCB2YWx1ZSk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlamVjdCAoZXJyb3IgOmFueSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRyZXR1cm4gVEhJUztcbn1cblxuZnVuY3Rpb24gX2FsbCAodmFsdWVzIDpyZWFkb25seSBhbnlbXSwgVEhJUyA6UHJpdmF0ZSkgOnZvaWQge1xuXHRUSElTLl9vbiA9IFtdO1xuXHRmdW5jdGlvbiBfb25yZWplY3RlZCAoZXJyb3IgOmFueSkgOnZvaWQgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIHIoVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR2YXIgX3ZhbHVlIDphbnlbXSA9IFtdO1xuXHR2YXIgY291bnQgOm51bWJlciA9IDA7XG5cdHZhciBjb3VudGVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRmb3IgKCB2YXIgbGVuZ3RoIDpudW1iZXIgPSB2YWx1ZXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdHZhciB2YWx1ZSA6YW55ID0gdmFsdWVzW2luZGV4XTtcblx0XHRpZiAoIGlzUHJpdmF0ZSh2YWx1ZSkgKSB7XG5cdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdCsrY291bnQ7XG5cdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHZhbHVlLl9vbiEucHVzaCh7XG5cdFx0XHRcdFx0X3N0YXR1czogMCxcblx0XHRcdFx0XHRfdmFsdWU6IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRfb246IG51bGwsXG5cdFx0XHRcdFx0X29uZnVsZmlsbGVkOiBmdW5jdGlvbiAoaW5kZXggOm51bWJlcikgOkZ1bmN0aW9uIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodmFsdWUgOmFueSkgOnZvaWQge1xuXHRcdFx0XHRcdFx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0X3ZhbHVlW2luZGV4XSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdGlmICggIS0tY291bnQgJiYgY291bnRlZCApIHsgcihUSElTLCBfdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KGluZGV4KSxcblx0XHRcdFx0XHRfb25yZWplY3RlZDogX29ucmVqZWN0ZWRcblx0XHRcdFx0fSBhcyBQcml2YXRlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBfc3RhdHVzPT09UkVKRUNURUQgKSB7XG5cdFx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHsgX3ZhbHVlW2luZGV4XSA9IHZhbHVlLl92YWx1ZTsgfVxuXHRcdH1cblx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkge1xuXHRcdFx0Kytjb3VudDtcblx0XHRcdF92YWx1ZVtpbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0XHR2YWx1ZS50aGVuKFxuXHRcdFx0XHRmdW5jdGlvbiAoaW5kZXggOm51bWJlcikgOkZ1bmN0aW9uIHtcblx0XHRcdFx0XHR2YXIgcmVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodmFsdWUgOmFueSkgOnZvaWQge1xuXHRcdFx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmICggVEhJUy5fc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0X3ZhbHVlW2luZGV4XSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRpZiAoICEtLWNvdW50ICYmIGNvdW50ZWQgKSB7IHIoVEhJUywgX3ZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fShpbmRleCksXG5cdFx0XHRcdF9vbnJlamVjdGVkXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRlbHNlIHsgX3ZhbHVlW2luZGV4XSA9IHZhbHVlOyB9XG5cdH1cblx0Y291bnRlZCA9IHRydWU7XG5cdGlmICggIWNvdW50ICYmIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0VEhJUy5fdmFsdWUgPSBfdmFsdWU7XG5cdFx0VEhJUy5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFRISVMuX29uID0gbnVsbDtcblx0fVxufVxuZXhwb3J0IGZ1bmN0aW9uIGFsbCAodmFsdWVzIDpyZWFkb25seSBhbnlbXSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdHRyeSB7IF9hbGwodmFsdWVzLCBUSElTKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRUSElTLl9vbiA9IG51bGw7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufVxuXG5mdW5jdGlvbiBfcmFjZSAodmFsdWVzIDpyZWFkb25seSBhbnlbXSwgVEhJUyA6UHJpdmF0ZSkgOnZvaWQge1xuXHRUSElTLl9vbiA9IFtdO1xuXHRmdW5jdGlvbiBfb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHsgVEhJUy5fc3RhdHVzPT09UEVORElORyAmJiByKFRISVMsIHZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdGZ1bmN0aW9uIF9vbnJlamVjdGVkIChlcnJvciA6YW55KSA6dm9pZCB7IFRISVMuX3N0YXR1cz09PVBFTkRJTkcgJiYgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdHZhciB0aGF0IDpQcml2YXRlID0ge1xuXHRcdF9zdGF0dXM6IDAsXG5cdFx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdFx0X29uOiBudWxsLFxuXHRcdF9vbmZ1bGZpbGxlZDogX29uZnVsZmlsbGVkLFxuXHRcdF9vbnJlamVjdGVkOiBfb25yZWplY3RlZFxuXHR9IGFzIFByaXZhdGU7XG5cdGZvciAoIHZhciBsZW5ndGggOm51bWJlciA9IHZhbHVlcy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0dmFyIHZhbHVlIDphbnkgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgdmFsdWUuX29uIS5wdXNoKHRoYXQpOyB9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0VEhJUy5fdmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHRcdFRISVMuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkge1xuXHRcdFx0dmFsdWUudGhlbihfb25mdWxmaWxsZWQsIF9vbnJlamVjdGVkKTtcblx0XHRcdGlmICggVEhJUy5fc3RhdHVzIT09UEVORElORyApIHsgYnJlYWs7IH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IHZhbHVlO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG59XG5leHBvcnQgZnVuY3Rpb24gcmFjZSAodmFsdWVzIDpyZWFkb25seSBhbnlbXSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdHRyeSB7IF9yYWNlKHZhbHVlcywgVEhJUyk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0VEhJUy5fb24gPSBudWxsO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn1cblxuaW1wb3J0IERlZmF1bHQgZnJvbSAnLmRlZmF1bHQ/PSc7XG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0KFB1YmxpYywge1xuXHR2ZXJzaW9uOiB2ZXJzaW9uLFxuXHRUaGVuYWJsZTogUHVibGljLFxuXHRyZXNvbHZlOiByZXNvbHZlLFxuXHRyZWplY3Q6IHJlamVjdCxcblx0YWxsOiBhbGwsXG5cdHJhY2U6IHJhY2Vcbn0pO1xuXG5leHBvcnQgdmFyIFRoZW5hYmxlIDpSZWFkb25seTx7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0+ID0gZnJlZXplXG5cdD8gLyojX19QVVJFX18qLyBmdW5jdGlvbiAoKSB7XG5cdFx0ZnJlZXplKFB1YmxpYy5wcm90b3R5cGUpO1xuXHRcdGZyZWV6ZShQdWJsaWMpO1xuXHRcdHJldHVybiBQdWJsaWM7XG5cdH0oKVxuXHQ6IFB1YmxpYztcblxudHlwZSBGdW5jdGlvbiA9ICh2YWx1ZSA6YW55KSA9PiB2b2lkO1xudHlwZSBFeGVjdXRvciA9IChyZXNvbHZlIDpGdW5jdGlvbiwgcmVqZWN0IDpGdW5jdGlvbikgPT4gdm9pZDtcbnR5cGUgUHJpdmF0ZSA9IHtcblx0X3N0YXR1cyA6U3RhdHVzLFxuXHRfdmFsdWUgOmFueSxcblx0X29uIDpQcml2YXRlW10gfCBudWxsLFxuXHRfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkLFxuXHRfb25yZWplY3RlZCA6RnVuY3Rpb24gfCB1bmRlZmluZWQsXG5cdHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOlByaXZhdGUsXG59O1xudHlwZSBQdWJsaWMgPSBSZWFkb25seTxvYmplY3QgJiB7XG5cdHRoZW4gKHRoaXMgOlB1YmxpYywgb25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHVibGljLFxufT47Il0sIm5hbWVzIjpbInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxlQUFlLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBQUMsdEJDT3ZCLElBQUksT0FBTyxHQUFNLENBQUMsQ0FBQztDQUNuQixJQUFJLFNBQVMsR0FBTSxDQUFDLENBQUM7Q0FDckIsSUFBSSxRQUFRLEdBQU0sQ0FBQyxDQUFDO0NBR3BCLElBQUksT0FBTyxHQUFHLFNBQVMsUUFBUSxNQUF3QyxDQUFDO0NBRXhFLFNBQVMsU0FBUyxDQUFFLEtBQVU7S0FDN0IsT0FBTyxLQUFLLFlBQVksT0FBTyxDQUFDO0NBQ2pDLENBQUM7Q0FFRCxTQUFTLFFBQVEsQ0FBRSxLQUFV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