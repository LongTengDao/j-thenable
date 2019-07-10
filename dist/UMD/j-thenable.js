/*!
 * 模块名称：j-thenable
 * 模块功能：模仿 Promise API 的同步防爆栈工具。从属于“简计划”。
   　　　　　Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".
 * 模块版本：1.0.3
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

	var version = '1.0.3';

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
	        if (_status === FULFILLED && isPrivate(_value)) {
	            _status = _value._status;
	            if (_status === PENDING) {
	                THIS._on = [];
	                _value._on.push(THIS);
	            }
	            else {
	                THIS._value = _value._value;
	                THIS._status = _status;
	            }
	        }
	        else if (_status === FULFILLED && isPublic(_value)) {
	            THIS._on = [];
	            onto(THIS, _value);
	        }
	        else {
	            THIS._value = _value;
	            THIS._status = _status;
	        }
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
	                    try {
	                        t(thenable, onfulfilled(THIS._value));
	                    }
	                    catch (error) {
	                        if (thenable._status === PENDING) {
	                            thenable._value = error;
	                            thenable._status = REJECTED;
	                        }
	                    }
	                }
	                else {
	                    thenable._value = THIS._value;
	                    thenable._status = FULFILLED;
	                }
	                return thenable;
	            case REJECTED:
	                if (typeof onrejected === 'function') {
	                    try {
	                        t(thenable, onrejected(THIS._value));
	                    }
	                    catch (error) {
	                        if (thenable._status === PENDING) {
	                            thenable._value = error;
	                            thenable._status = REJECTED;
	                        }
	                    }
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
	function all(values) {
	    var THIS = new Private;
	    THIS._on = [];
	    var _value = [];
	    var count = 0;
	    function _onrejected(error) { THIS._status === PENDING && r(THIS, error, REJECTED); }
	    var counted;
	    try {
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
	    catch (error) {
	        if (THIS._status === PENDING) {
	            THIS._value = error;
	            THIS._status = REJECTED;
	            THIS._on = null;
	        }
	    }
	    return THIS;
	}
	function race(values) {
	    var THIS = new Private;
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
	    try {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMS4wLjMnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IGZyZWV6ZSBmcm9tICcuT2JqZWN0LmZyZWV6ZSc7XG5pbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxudmFyIFBFTkRJTkcgOjAgPSAwO1xudmFyIEZVTEZJTExFRCA6MSA9IDE7XG52YXIgUkVKRUNURUQgOjIgPSAyO1xudHlwZSBTdGF0dXMgPSAwIHwgMSB8IDI7XG5cbnZhciBQcml2YXRlID0gZnVuY3Rpb24gVGhlbmFibGUgKCkge30gYXMgdW5rbm93biBhcyB7IG5ldyAoKSA6UHJpdmF0ZSB9O1xuXG5mdW5jdGlvbiBpc1ByaXZhdGUgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBQcml2YXRlIHtcblx0cmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUHJpdmF0ZTtcbn1cblxuZnVuY3Rpb24gaXNQdWJsaWMgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyB7IHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOmFueSB9IHtcblx0cmV0dXJuIHZhbHVlIT1udWxsICYmIHR5cGVvZiB2YWx1ZS50aGVuPT09J2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gb250byAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDp7IHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOmFueSB9KSA6dm9pZCB7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhbHVlLnRoZW4oXG5cdFx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRyKHRoZW5hYmxlLCB2YWx1ZSwgRlVMRklMTEVEKTtcblx0XHR9LFxuXHRcdGZ1bmN0aW9uIG9ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRyKHRoZW5hYmxlLCBlcnJvciwgUkVKRUNURUQpO1xuXHRcdH1cblx0KTtcbn1cblxudHlwZSBTdGFjayA9IHsgbmV4dFN0YWNrIDpTdGFjaywgdGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnksIHN0YXR1cyA6U3RhdHVzIH0gfCBudWxsO1xudmFyIHN0YWNrIDpTdGFjayA9IG51bGw7XG5mdW5jdGlvbiByICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBzdGFjayApIHtcblx0XHRzdGFjayA9IHsgbmV4dFN0YWNrOiBzdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZvciAoIDsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGlmICggdGhlbmFibGUuX29ucmVqZWN0ZWQgKSB7IHRoZW5hYmxlLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29uZnVsZmlsbGVkO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29uZnVsZmlsbGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUuX29uIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRvbnRvKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggdGhlbmFibGUuX3N0YXR1cyE9PVBFTkRJTkcgKSB7IGJyZWFrIHN0YWNrOyB9XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fb25mdWxmaWxsZWQgKSB7IHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfVxuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29ucmVqZWN0ZWQ7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdG9udG8odGhlbmFibGUsIHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHsgc3RhdHVzID0gRlVMRklMTEVEOyB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fc3RhdHVzIT09UEVORElORyApIHsgYnJlYWsgc3RhY2s7IH1cblx0XHRcdFx0XHRcdHZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBzdGF0dXM7XG5cdFx0XHR2YXIgX29uIDpQcml2YXRlW10gfCBudWxsID0gdGhlbmFibGUuX29uO1xuXHRcdFx0aWYgKCBfb24gKSB7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbiA9IG51bGw7XG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA6bnVtYmVyID0gX29uLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdHN0YWNrID0geyBuZXh0U3RhY2s6IHN0YWNrLCB0aGVuYWJsZTogX29uWy0taW5kZXhdLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCAhc3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBzdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IHN0YWNrLnZhbHVlO1xuXHRcdHN0YXR1cyA9IHN0YWNrLnN0YXR1cztcblx0XHRzdGFjayA9IHN0YWNrLm5leHRTdGFjaztcblx0fVxufVxuXG52YXIgUHVibGljIDp7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0gPSBmdW5jdGlvbiBUaGVuYWJsZSAodGhpcyA6UHJpdmF0ZSwgZXhlY3V0b3IgOkV4ZWN1dG9yKSA6dm9pZCB7XG5cdGlmICggdHlwZW9mIGV4ZWN1dG9yIT09J2Z1bmN0aW9uJyApIHsgdGhyb3cgVHlwZUVycm9yKCdUaGVuYWJsZSBleGVjdXRvciBpcyBub3QgYSBmdW5jdGlvbicpOyB9XG5cdHZhciBleGVjdXRlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFyIHJlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFyIF92YWx1ZSA6YW55O1xuXHR2YXIgX3N0YXR1cyA6U3RhdHVzIHwgdW5kZWZpbmVkO1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IHRoaXM7XG5cdHRyeSB7XG5cdFx0ZXhlY3V0b3IoXG5cdFx0XHRmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSB7XG5cdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCBleGVjdXRlZCApIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRfc3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgdmFsdWUuX29uIS5wdXNoKFRISVMpOyB9XG5cdFx0XHRcdFx0XHRcdGVsc2UgeyByKFRISVMsIHZhbHVlLl92YWx1ZSwgX3N0YXR1cyk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7IG9udG8oVEhJUywgdmFsdWUpOyB9XG5cdFx0XHRcdFx0XHRlbHNlIHsgcihUSElTLCB2YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHsgaWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkgeyByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH0gfVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdF92YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdF9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiByZWplY3QgKGVycm9yIDphbnkpIHtcblx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoIGV4ZWN1dGVkICkgeyByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0X3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0X3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0XHRpZiAoICFyZWQgKSB7XG5cdFx0XHRleGVjdXRlZCA9IHRydWU7XG5cdFx0XHRUSElTLl9vbiA9IFtdO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoICFyZWQgKSB7XG5cdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHR0cnkge1xuXHRcdGlmICggX3N0YXR1cz09PUZVTEZJTExFRCAmJiBpc1ByaXZhdGUoX3ZhbHVlKSApIHtcblx0XHRcdF9zdGF0dXMgPSBfdmFsdWUuX3N0YXR1cztcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFRISVMuX29uID0gW107XG5cdFx0XHRcdF92YWx1ZS5fb24hLnB1c2goVEhJUyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0VEhJUy5fdmFsdWUgPSBfdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmICggX3N0YXR1cz09PUZVTEZJTExFRCAmJiBpc1B1YmxpYyhfdmFsdWUpICkge1xuXHRcdFx0VEhJUy5fb24gPSBbXTtcblx0XHRcdG9udG8oVEhJUywgX3ZhbHVlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IF92YWx1ZTtcblx0XHRcdFRISVMuX3N0YXR1cyA9IF9zdGF0dXMhO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRUSElTLl9vbiA9IG51bGw7XG5cdFx0fVxuXHR9XG59IGFzIHVua25vd24gYXMgeyBuZXcgKGV4ZWN1dG9yIDpFeGVjdXRvcikgOlB1YmxpYyB9O1xuXG5mdW5jdGlvbiB0ICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSkgOnZvaWQge1xuXHRpZiAoIGlzUHJpdmF0ZSh2YWx1ZSkgKSB7XG5cdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdHRoZW5hYmxlLl9vbiA9IFtdO1xuXHRcdFx0dmFsdWUuX29uIS5wdXNoKHRoZW5hYmxlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gX3N0YXR1cztcblx0XHR9XG5cdH1cblx0ZWxzZSBpZiAoIGlzUHVibGljKHZhbHVlKSApIHtcblx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRvbnRvKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0dGhlbmFibGUuX3ZhbHVlID0gdmFsdWU7XG5cdFx0dGhlbmFibGUuX3N0YXR1cyA9IEZVTEZJTExFRDtcblx0fVxufVxuXG5Qcml2YXRlLnByb3RvdHlwZSA9IFB1YmxpYy5wcm90b3R5cGUgPSB7XG5cdF9zdGF0dXM6IFBFTkRJTkcsXG5cdF92YWx1ZTogdW5kZWZpbmVkLFxuXHRfb246IG51bGwsXG5cdF9vbmZ1bGZpbGxlZDogdW5kZWZpbmVkLFxuXHRfb25yZWplY3RlZDogdW5kZWZpbmVkLFxuXHR0aGVuOiBmdW5jdGlvbiB0aGVuICh0aGlzIDpQcml2YXRlLCBvbmZ1bGZpbGxlZD8gOkZ1bmN0aW9uLCBvbnJlamVjdGVkPyA6RnVuY3Rpb24pIDpQcml2YXRlIHtcblx0XHR2YXIgVEhJUyA6UHJpdmF0ZSA9IHRoaXM7XG5cdFx0dmFyIHRoZW5hYmxlIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFx0c3dpdGNoICggVEhJUy5fc3RhdHVzICkge1xuXHRcdFx0Y2FzZSBQRU5ESU5HOlxuXHRcdFx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRcdFx0dGhlbmFibGUuX29uZnVsZmlsbGVkID0gb25mdWxmaWxsZWQ7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbnJlamVjdGVkID0gb25yZWplY3RlZDtcblx0XHRcdFx0VEhJUy5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0XHRjYXNlIEZVTEZJTExFRDpcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25mdWxmaWxsZWQ9PT0nZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdHRyeSB7IHQodGhlbmFibGUsIG9uZnVsZmlsbGVkKFRISVMuX3ZhbHVlKSk7IH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggdGhlbmFibGUuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IFRISVMuX3ZhbHVlO1xuXHRcdFx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdFx0Y2FzZSBSRUpFQ1RFRDpcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25yZWplY3RlZD09PSdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0dHJ5IHsgdCh0aGVuYWJsZSwgb25yZWplY3RlZChUSElTLl92YWx1ZSkpOyB9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRpZiAoIHRoZW5hYmxlLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdH1cblx0XHR0aHJvdyBUeXBlRXJyb3IoJ01ldGhvZCBUaGVuYWJsZS5wcm90b3R5cGUudGhlbiBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG5cdH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0dHJ5IHsgdChUSElTLCB2YWx1ZSk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlamVjdCAoZXJyb3IgOmFueSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRyZXR1cm4gVEhJUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFsbCAodmFsdWVzIDpyZWFkb25seSBhbnlbXSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFRISVMuX29uID0gW107XG5cdHZhciBfdmFsdWUgOmFueVtdID0gW107XG5cdHZhciBjb3VudCA6bnVtYmVyID0gMDtcblx0ZnVuY3Rpb24gX29ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHsgVEhJUy5fc3RhdHVzPT09UEVORElORyAmJiByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0dmFyIGNvdW50ZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHRyeSB7XG5cdFx0Zm9yICggdmFyIGxlbmd0aCA6bnVtYmVyID0gdmFsdWVzLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHRcdHZhciB2YWx1ZSA6YW55ID0gdmFsdWVzW2luZGV4XTtcblx0XHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0Kytjb3VudDtcblx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdHZhbHVlLl9vbiEucHVzaCh7XG5cdFx0XHRcdFx0XHRfc3RhdHVzOiAwLFxuXHRcdFx0XHRcdFx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdFx0XHRcdFx0XHRfb246IG51bGwsXG5cdFx0XHRcdFx0XHRfb25mdWxmaWxsZWQ6IGZ1bmN0aW9uIChpbmRleCA6bnVtYmVyKSA6RnVuY3Rpb24ge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoICEtLWNvdW50ICYmIGNvdW50ZWQgKSB7IHIoVEhJUywgX3ZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fShpbmRleCksXG5cdFx0XHRcdFx0XHRfb25yZWplY3RlZDogX29ucmVqZWN0ZWRcblx0XHRcdFx0XHR9IGFzIFByaXZhdGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKCBfc3RhdHVzPT09UkVKRUNURUQgKSB7XG5cdFx0XHRcdFx0VEhJUy5fdmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSB2YWx1ZS5fdmFsdWU7IH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0XHRcdCsrY291bnQ7XG5cdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHZhbHVlLnRoZW4oXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKGluZGV4IDpudW1iZXIpIDpGdW5jdGlvbiB7XG5cdFx0XHRcdFx0XHR2YXIgcmVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdFx0XHRcdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoICEtLWNvdW50ICYmIGNvdW50ZWQgKSB7IHIoVEhJUywgX3ZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fShpbmRleCksXG5cdFx0XHRcdFx0X29ucmVqZWN0ZWRcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgeyBfdmFsdWVbaW5kZXhdID0gdmFsdWU7IH1cblx0XHR9XG5cdFx0Y291bnRlZCA9IHRydWU7XG5cdFx0aWYgKCAhY291bnQgJiYgVEhJUy5fc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFRISVMuX3ZhbHVlID0gX3ZhbHVlO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0VEhJUy5fb24gPSBudWxsO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRUSElTLl9vbiA9IG51bGw7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFjZSAodmFsdWVzIDpyZWFkb25seSBhbnlbXSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFRISVMuX29uID0gW107XG5cdGZ1bmN0aW9uIF9vbmZ1bGZpbGxlZCAodmFsdWUgOmFueSkgOnZvaWQgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIHIoVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0ZnVuY3Rpb24gX29ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHsgVEhJUy5fc3RhdHVzPT09UEVORElORyAmJiByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0dmFyIHRoYXQgOlByaXZhdGUgPSB7XG5cdFx0X3N0YXR1czogMCxcblx0XHRfdmFsdWU6IHVuZGVmaW5lZCxcblx0XHRfb246IG51bGwsXG5cdFx0X29uZnVsZmlsbGVkOiBfb25mdWxmaWxsZWQsXG5cdFx0X29ucmVqZWN0ZWQ6IF9vbnJlamVjdGVkXG5cdH0gYXMgUHJpdmF0ZTtcblx0dHJ5IHtcblx0XHRmb3IgKCB2YXIgbGVuZ3RoIDpudW1iZXIgPSB2YWx1ZXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdFx0dmFyIHZhbHVlIDphbnkgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdFx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgdmFsdWUuX29uIS5wdXNoKHRoYXQpOyB9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFRISVMuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0XHRcdHZhbHVlLnRoZW4oX29uZnVsZmlsbGVkLCBfb25yZWplY3RlZCk7XG5cdFx0XHRcdGlmICggVEhJUy5fc3RhdHVzIT09UEVORElORyApIHsgYnJlYWs7IH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRUSElTLl92YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRUSElTLl9vbiA9IG51bGw7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufVxuXG5pbXBvcnQgRGVmYXVsdCBmcm9tICcuZGVmYXVsdD89JztcbmV4cG9ydCBkZWZhdWx0IERlZmF1bHQoUHVibGljLCB7XG5cdHZlcnNpb246IHZlcnNpb24sXG5cdFRoZW5hYmxlOiBQdWJsaWMsXG5cdHJlc29sdmU6IHJlc29sdmUsXG5cdHJlamVjdDogcmVqZWN0LFxuXHRhbGw6IGFsbCxcblx0cmFjZTogcmFjZVxufSk7XG5cbmV4cG9ydCB2YXIgVGhlbmFibGUgOlJlYWRvbmx5PHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfT4gPSBmcmVlemVcblx0PyAvKiNfX1BVUkVfXyovIGZ1bmN0aW9uICgpIHtcblx0XHRmcmVlemUoUHVibGljLnByb3RvdHlwZSk7XG5cdFx0ZnJlZXplKFB1YmxpYyk7XG5cdFx0cmV0dXJuIFB1YmxpYztcblx0fSgpXG5cdDogUHVibGljO1xuXG50eXBlIEZ1bmN0aW9uID0gKHZhbHVlIDphbnkpID0+IHZvaWQ7XG50eXBlIEV4ZWN1dG9yID0gKHJlc29sdmUgOkZ1bmN0aW9uLCByZWplY3QgOkZ1bmN0aW9uKSA9PiB2b2lkO1xudHlwZSBQcml2YXRlID0ge1xuXHRfc3RhdHVzIDpTdGF0dXMsXG5cdF92YWx1ZSA6YW55LFxuXHRfb24gOlByaXZhdGVbXSB8IG51bGwsXG5cdF9vbmZ1bGZpbGxlZCA6RnVuY3Rpb24gfCB1bmRlZmluZWQsXG5cdF9vbnJlamVjdGVkIDpGdW5jdGlvbiB8IHVuZGVmaW5lZCxcblx0dGhlbiAob25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHJpdmF0ZSxcbn07XG50eXBlIFB1YmxpYyA9IFJlYWRvbmx5PG9iamVjdCAmIHtcblx0dGhlbiAodGhpcyA6UHVibGljLCBvbmZ1bGZpbGxlZD8gOkZ1bmN0aW9uLCBvbnJlamVjdGVkPyA6RnVuY3Rpb24pIDpQdWJsaWMsXG59PjsiXSwibmFtZXMiOlsidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGVBQWUsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBQyx0QkNPdkIsSUFBSSxPQUFPLEdBQU0sQ0FBQyxDQUFDO0NBQ25CLElBQUksU0FBUyxHQUFNLENBQUMsQ0FBQztDQUNyQixJQUFJLFFBQVEsR0FBTSxDQUFDLENBQUM7Q0FHcEIsSUFBSSxPQUFPLEdBQUcsU0FBUyxRQUFRLE1BQXdDLENBQUM7Q0FFeEUsU0FBUyxTQUFT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