/*!
 * 模块名称：j-thenable
 * 模块功能：模仿 Promise API 的同步防爆栈工具。从属于“简计划”。
   　　　　　Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".
 * 模块版本：1.0.2
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

	var version = '1.0.2';

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
	            r(THIS, error, REJECTED);
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
	                                    if (count > 1) {
	                                        --count;
	                                    }
	                                    else {
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
	                            if (count > 1) {
	                                --count;
	                            }
	                            else {
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
	    }
	    catch (error) {
	        if (THIS._status === PENDING) {
	            r(THIS, error, REJECTED);
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
	            r(THIS, error, REJECTED);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMS4wLjInOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IGZyZWV6ZSBmcm9tICcuT2JqZWN0LmZyZWV6ZSc7XG5pbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxudmFyIFBFTkRJTkcgOjAgPSAwO1xudmFyIEZVTEZJTExFRCA6MSA9IDE7XG52YXIgUkVKRUNURUQgOjIgPSAyO1xudHlwZSBTdGF0dXMgPSAwIHwgMSB8IDI7XG5cbnZhciBQcml2YXRlID0gZnVuY3Rpb24gVGhlbmFibGUgKCkge30gYXMgdW5rbm93biBhcyB7IG5ldyAoKSA6UHJpdmF0ZSB9O1xuXG5mdW5jdGlvbiBpc1ByaXZhdGUgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBQcml2YXRlIHtcblx0cmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUHJpdmF0ZTtcbn1cblxuZnVuY3Rpb24gaXNQdWJsaWMgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyB7IHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOmFueSB9IHtcblx0cmV0dXJuIHZhbHVlIT1udWxsICYmIHR5cGVvZiB2YWx1ZS50aGVuPT09J2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gb250byAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDp7IHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOmFueSB9KSA6dm9pZCB7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhbHVlLnRoZW4oXG5cdFx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRyKHRoZW5hYmxlLCB2YWx1ZSwgRlVMRklMTEVEKTtcblx0XHR9LFxuXHRcdGZ1bmN0aW9uIG9ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRyKHRoZW5hYmxlLCBlcnJvciwgUkVKRUNURUQpO1xuXHRcdH1cblx0KTtcbn1cblxudHlwZSBTdGFjayA9IHsgbmV4dFN0YWNrIDpTdGFjaywgdGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnksIHN0YXR1cyA6U3RhdHVzIH0gfCBudWxsO1xudmFyIHN0YWNrIDpTdGFjayA9IG51bGw7XG5mdW5jdGlvbiByICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBzdGFjayApIHtcblx0XHRzdGFjayA9IHsgbmV4dFN0YWNrOiBzdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZvciAoIDsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGlmICggdGhlbmFibGUuX29ucmVqZWN0ZWQgKSB7IHRoZW5hYmxlLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29uZnVsZmlsbGVkO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29uZnVsZmlsbGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUuX29uIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRvbnRvKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggdGhlbmFibGUuX3N0YXR1cyE9PVBFTkRJTkcgKSB7IGJyZWFrIHN0YWNrOyB9XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fb25mdWxmaWxsZWQgKSB7IHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfVxuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29ucmVqZWN0ZWQ7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdG9udG8odGhlbmFibGUsIHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHsgc3RhdHVzID0gRlVMRklMTEVEOyB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fc3RhdHVzIT09UEVORElORyApIHsgYnJlYWsgc3RhY2s7IH1cblx0XHRcdFx0XHRcdHZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBzdGF0dXM7XG5cdFx0XHR2YXIgX29uIDpQcml2YXRlW10gfCBudWxsID0gdGhlbmFibGUuX29uO1xuXHRcdFx0aWYgKCBfb24gKSB7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbiA9IG51bGw7XG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA6bnVtYmVyID0gX29uLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdHN0YWNrID0geyBuZXh0U3RhY2s6IHN0YWNrLCB0aGVuYWJsZTogX29uWy0taW5kZXhdLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCAhc3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBzdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IHN0YWNrLnZhbHVlO1xuXHRcdHN0YXR1cyA9IHN0YWNrLnN0YXR1cztcblx0XHRzdGFjayA9IHN0YWNrLm5leHRTdGFjaztcblx0fVxufVxuXG52YXIgUHVibGljIDp7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0gPSBmdW5jdGlvbiBUaGVuYWJsZSAodGhpcyA6UHJpdmF0ZSwgZXhlY3V0b3IgOkV4ZWN1dG9yKSA6dm9pZCB7XG5cdGlmICggdHlwZW9mIGV4ZWN1dG9yIT09J2Z1bmN0aW9uJyApIHsgdGhyb3cgVHlwZUVycm9yKCdUaGVuYWJsZSBleGVjdXRvciBpcyBub3QgYSBmdW5jdGlvbicpOyB9XG5cdHZhciBleGVjdXRlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFyIHJlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFyIF92YWx1ZSA6YW55O1xuXHR2YXIgX3N0YXR1cyA6U3RhdHVzIHwgdW5kZWZpbmVkO1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IHRoaXM7XG5cdHRyeSB7XG5cdFx0ZXhlY3V0b3IoXG5cdFx0XHRmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSB7XG5cdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCBleGVjdXRlZCApIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRfc3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgdmFsdWUuX29uIS5wdXNoKFRISVMpOyB9XG5cdFx0XHRcdFx0XHRcdGVsc2UgeyByKFRISVMsIHZhbHVlLl92YWx1ZSwgX3N0YXR1cyk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7IG9udG8oVEhJUywgdmFsdWUpOyB9XG5cdFx0XHRcdFx0XHRlbHNlIHsgcihUSElTLCB2YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHsgaWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkgeyByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH0gfVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdF92YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdF9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiByZWplY3QgKGVycm9yIDphbnkpIHtcblx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoIGV4ZWN1dGVkICkgeyByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0X3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0X3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0XHRpZiAoICFyZWQgKSB7XG5cdFx0XHRleGVjdXRlZCA9IHRydWU7XG5cdFx0XHRUSElTLl9vbiA9IFtdO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoICFyZWQgKSB7XG5cdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHR0cnkge1xuXHRcdGlmICggX3N0YXR1cz09PUZVTEZJTExFRCAmJiBpc1ByaXZhdGUoX3ZhbHVlKSApIHtcblx0XHRcdF9zdGF0dXMgPSBfdmFsdWUuX3N0YXR1cztcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFRISVMuX29uID0gW107XG5cdFx0XHRcdF92YWx1ZS5fb24hLnB1c2goVEhJUyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0VEhJUy5fdmFsdWUgPSBfdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmICggX3N0YXR1cz09PUZVTEZJTExFRCAmJiBpc1B1YmxpYyhfdmFsdWUpICkge1xuXHRcdFx0VEhJUy5fb24gPSBbXTtcblx0XHRcdG9udG8oVEhJUywgX3ZhbHVlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IF92YWx1ZTtcblx0XHRcdFRISVMuX3N0YXR1cyA9IF9zdGF0dXMhO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHsgaWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkgeyByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH0gfVxufSBhcyB1bmtub3duIGFzIHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfTtcblxuZnVuY3Rpb24gdCAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnkpIDp2b2lkIHtcblx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRcdHZhbHVlLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0fVxuXHR9XG5cdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0dGhlbmFibGUuX29uID0gW107XG5cdFx0b250byh0aGVuYWJsZSwgdmFsdWUpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHRoZW5hYmxlLl92YWx1ZSA9IHZhbHVlO1xuXHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdH1cbn1cblxuUHJpdmF0ZS5wcm90b3R5cGUgPSBQdWJsaWMucHJvdG90eXBlID0ge1xuXHRfc3RhdHVzOiBQRU5ESU5HLFxuXHRfdmFsdWU6IHVuZGVmaW5lZCxcblx0X29uOiBudWxsLFxuXHRfb25mdWxmaWxsZWQ6IHVuZGVmaW5lZCxcblx0X29ucmVqZWN0ZWQ6IHVuZGVmaW5lZCxcblx0dGhlbjogZnVuY3Rpb24gdGhlbiAodGhpcyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHJpdmF0ZSB7XG5cdFx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHRcdHZhciB0aGVuYWJsZSA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRcdHN3aXRjaCAoIFRISVMuX3N0YXR1cyApIHtcblx0XHRcdGNhc2UgUEVORElORzpcblx0XHRcdFx0dGhlbmFibGUuX29uID0gW107XG5cdFx0XHRcdHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IG9uZnVsZmlsbGVkO1xuXHRcdFx0XHR0aGVuYWJsZS5fb25yZWplY3RlZCA9IG9ucmVqZWN0ZWQ7XG5cdFx0XHRcdFRISVMuX29uIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdFx0Y2FzZSBGVUxGSUxMRUQ6XG5cdFx0XHRcdGlmICggdHlwZW9mIG9uZnVsZmlsbGVkPT09J2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHR0cnkgeyB0KHRoZW5hYmxlLCBvbmZ1bGZpbGxlZChUSElTLl92YWx1ZSkpOyB9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRpZiAoIHRoZW5hYmxlLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0XHRcdGNhc2UgUkVKRUNURUQ6XG5cdFx0XHRcdGlmICggdHlwZW9mIG9ucmVqZWN0ZWQ9PT0nZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdHRyeSB7IHQodGhlbmFibGUsIG9ucmVqZWN0ZWQoVEhJUy5fdmFsdWUpKTsgfVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gVEhJUy5fdmFsdWU7XG5cdFx0XHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0XHR9XG5cdFx0dGhyb3cgVHlwZUVycm9yKCdNZXRob2QgVGhlbmFibGUucHJvdG90eXBlLnRoZW4gY2FsbGVkIG9uIGluY29tcGF0aWJsZSByZWNlaXZlcicpO1xuXHR9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZSAodmFsdWUgOmFueSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdHRyeSB7IHQoVEhJUywgdmFsdWUpOyB9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggVEhJUy5fc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFRISVMuX3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIFRISVM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWplY3QgKGVycm9yIDphbnkpIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0cmV0dXJuIFRISVM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGwgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10pIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRUSElTLl9vbiA9IFtdO1xuXHR2YXIgX3ZhbHVlIDphbnlbXSA9IFtdO1xuXHR2YXIgY291bnQgOm51bWJlciA9IDA7XG5cdGZ1bmN0aW9uIF9vbnJlamVjdGVkIChlcnJvciA6YW55KSA6dm9pZCB7IFRISVMuX3N0YXR1cz09PVBFTkRJTkcgJiYgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdHRyeSB7XG5cdFx0Zm9yICggdmFyIGxlbmd0aCA6bnVtYmVyID0gdmFsdWVzLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHRcdHZhciB2YWx1ZSA6YW55ID0gdmFsdWVzW2luZGV4XTtcblx0XHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0Kytjb3VudDtcblx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdHZhbHVlLl9vbiEucHVzaCh7XG5cdFx0XHRcdFx0XHRfc3RhdHVzOiAwLFxuXHRcdFx0XHRcdFx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdFx0XHRcdFx0XHRfb246IG51bGwsXG5cdFx0XHRcdFx0XHRfb25mdWxmaWxsZWQ6IGZ1bmN0aW9uIChpbmRleCA6bnVtYmVyKSA6RnVuY3Rpb24ge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIGNvdW50PjEgKSB7IC0tY291bnQ7IH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgeyByKFRISVMsIF92YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH0oaW5kZXgpLFxuXHRcdFx0XHRcdFx0X29ucmVqZWN0ZWQ6IF9vbnJlamVjdGVkXG5cdFx0XHRcdFx0fSBhcyBQcml2YXRlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICggX3N0YXR1cz09PVJFSkVDVEVEICkge1xuXHRcdFx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgeyBfdmFsdWVbaW5kZXhdID0gdmFsdWUuX3ZhbHVlOyB9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkge1xuXHRcdFx0XHQrK2NvdW50O1xuXHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR2YWx1ZS50aGVuKFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChpbmRleCA6bnVtYmVyKSA6RnVuY3Rpb24ge1xuXHRcdFx0XHRcdFx0dmFyIHJlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodmFsdWUgOmFueSkgOnZvaWQge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdGlmICggVEhJUy5fc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBjb3VudD4xICkgeyAtLWNvdW50OyB9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSB7IHIoVEhJUywgX3ZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fShpbmRleCksXG5cdFx0XHRcdFx0X29ucmVqZWN0ZWRcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgeyBfdmFsdWVbaW5kZXhdID0gdmFsdWU7IH1cblx0XHR9XG5cdH1cblx0Y2F0Y2ggKGVycm9yKSB7IGlmICggVEhJUy5fc3RhdHVzPT09UEVORElORyApIHsgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9IH1cblx0cmV0dXJuIFRISVM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYWNlICh2YWx1ZXMgOnJlYWRvbmx5IGFueVtdKSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0VEhJUy5fb24gPSBbXTtcblx0ZnVuY3Rpb24gX29uZnVsZmlsbGVkICh2YWx1ZSA6YW55KSA6dm9pZCB7IFRISVMuX3N0YXR1cz09PVBFTkRJTkcgJiYgcihUSElTLCB2YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRmdW5jdGlvbiBfb25yZWplY3RlZCAoZXJyb3IgOmFueSkgOnZvaWQgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIHIoVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR2YXIgdGhhdCA6UHJpdmF0ZSA9IHtcblx0XHRfc3RhdHVzOiAwLFxuXHRcdF92YWx1ZTogdW5kZWZpbmVkLFxuXHRcdF9vbjogbnVsbCxcblx0XHRfb25mdWxmaWxsZWQ6IF9vbmZ1bGZpbGxlZCxcblx0XHRfb25yZWplY3RlZDogX29ucmVqZWN0ZWRcblx0fSBhcyBQcml2YXRlO1xuXHR0cnkge1xuXHRcdGZvciAoIHZhciBsZW5ndGggOm51bWJlciA9IHZhbHVlcy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0XHR2YXIgdmFsdWUgOmFueSA9IHZhbHVlc1tpbmRleF07XG5cdFx0XHRpZiAoIGlzUHJpdmF0ZSh2YWx1ZSkgKSB7XG5cdFx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkgeyB2YWx1ZS5fb24hLnB1c2godGhhdCk7IH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0VEhJUy5fdmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHRcdFx0VEhJUy5fc3RhdHVzID0gX3N0YXR1cztcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIGlzUHVibGljKHZhbHVlKSApIHtcblx0XHRcdFx0dmFsdWUudGhlbihfb25mdWxmaWxsZWQsIF9vbnJlamVjdGVkKTtcblx0XHRcdFx0aWYgKCBUSElTLl9zdGF0dXMhPT1QRU5ESU5HICkgeyBicmVhazsgfVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdFRISVMuX3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGNhdGNoIChlcnJvcikgeyBpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7IHIoVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfSB9XG5cdHJldHVybiBUSElTO1xufVxuXG5pbXBvcnQgRGVmYXVsdCBmcm9tICcuZGVmYXVsdD89JztcbmV4cG9ydCBkZWZhdWx0IERlZmF1bHQoUHVibGljLCB7XG5cdHZlcnNpb246IHZlcnNpb24sXG5cdFRoZW5hYmxlOiBQdWJsaWMsXG5cdHJlc29sdmU6IHJlc29sdmUsXG5cdHJlamVjdDogcmVqZWN0LFxuXHRhbGw6IGFsbCxcblx0cmFjZTogcmFjZVxufSk7XG5cbmV4cG9ydCB2YXIgVGhlbmFibGUgOlJlYWRvbmx5PHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfT4gPSBmcmVlemVcblx0PyAvKiNfX1BVUkVfXyovIGZ1bmN0aW9uICgpIHtcblx0XHRmcmVlemUoUHVibGljLnByb3RvdHlwZSk7XG5cdFx0ZnJlZXplKFB1YmxpYyk7XG5cdFx0cmV0dXJuIFB1YmxpYztcblx0fSgpXG5cdDogUHVibGljO1xuXG50eXBlIEZ1bmN0aW9uID0gKHZhbHVlIDphbnkpID0+IHZvaWQ7XG50eXBlIEV4ZWN1dG9yID0gKHJlc29sdmUgOkZ1bmN0aW9uLCByZWplY3QgOkZ1bmN0aW9uKSA9PiB2b2lkO1xudHlwZSBQcml2YXRlID0ge1xuXHRfc3RhdHVzIDpTdGF0dXMsXG5cdF92YWx1ZSA6YW55LFxuXHRfb24gOlByaXZhdGVbXSB8IG51bGwsXG5cdF9vbmZ1bGZpbGxlZCA6RnVuY3Rpb24gfCB1bmRlZmluZWQsXG5cdF9vbnJlamVjdGVkIDpGdW5jdGlvbiB8IHVuZGVmaW5lZCxcblx0dGhlbiAob25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHJpdmF0ZSxcbn07XG50eXBlIFB1YmxpYyA9IFJlYWRvbmx5PG9iamVjdCAmIHtcblx0dGhlbiAodGhpcyA6UHVibGljLCBvbmZ1bGZpbGxlZD8gOkZ1bmN0aW9uLCBvbnJlamVjdGVkPyA6RnVuY3Rpb24pIDpQdWJsaWMsXG59PjsiXSwibmFtZXMiOlsidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGVBQWUsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBQyx0QkNPdkIsSUFBSSxPQUFPLEdBQU0sQ0FBQyxDQUFDO0NBQ25CLElBQUksU0FBUyxHQUFNLENBQUMsQ0FBQztDQUNyQixJQUFJLFFBQVEsR0FBTSxDQUFDLENBQUM7Q0FHcEIsSUFBSSxPQUFPLEdBQUcsU0FBUyxRQUFRLE1BQXdDLENBQUM7Q0FFeEUsU0FBUyxTQUFTLENBQUUsS0FBVTtLQUM3QixPQUFPLEtBQUssWUFBWSxPQUFPLENBQUM7Q0FDakMsQ0FBQztDQUVELFNBQVMsUUFBUSxDQUFFLEtBQVU7S0FDNUIsT0FBTyxLQUFLLElBQUUsSUFBSSxJQUFJLE9BQU8sS0FBSyxDQUFDLElBQUksS0FBRyxVQUFVLENBQUM7Q0FDdEQsQ0FBQztDQUVELFNBQVMsSUFBSSxDQUFFLFFBQWlCLEVBQUUsS0FBb0U7S0FDckcsSUFBSSxHQUF3QixDQUFDO0tBQzdCLEtBQUssQ0FBQyxJQUFJLENBQ1QsU0FBUyxXQUFXLENBQUUsS0FBVTtTQUMvQixJQUFLLEdBQUcsRUFBRzthQUFFLE9BQU87VUFBRTtTQUN0QixHQUFHLEdBQUcsSUFBSSxDQUFDO1NBQ1gsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsU0FBUyxD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