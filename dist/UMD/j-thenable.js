/*!
 * 模块名称：j-thenable
 * 模块功能：模仿 Promise API 的同步防爆栈工具。从属于“简计划”。
   　　　　　Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".
 * 模块版本：1.0.1
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

	var version = '1.0.1';

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
	function isThenable(value) {
	    return value instanceof Private;
	}
	function t(thenable, value) {
	    if (isThenable(value)) {
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
	    else {
	        thenable._value = value;
	        thenable._status = FULFILLED;
	    }
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
	                        if (isThenable(value)) {
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
	                    }
	                    catch (error) {
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
	                        if (isThenable(value)) {
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
	                        else {
	                            status = FULFILLED;
	                        }
	                    }
	                    catch (error) {
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
	    THIS._on = [];
	    try {
	        executor(function resolve(value) {
	            if (red) {
	                return;
	            }
	            red = true;
	            if (executed) {
	                if (isThenable(value)) {
	                    _status = value._status;
	                    if (_status === PENDING) {
	                        value._on.push(THIS);
	                    }
	                    else {
	                        r(THIS, value._value, _status);
	                    }
	                }
	                else {
	                    r(THIS, value, FULFILLED);
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
	            return;
	        }
	    }
	    catch (error) {
	        if (!red) {
	            red = true;
	            THIS._value = error;
	            THIS._status = REJECTED;
	            THIS._on = null;
	            return;
	        }
	    }
	    if (_status === FULFILLED && isThenable(_value)) {
	        _status = _value._status;
	        if (_status === PENDING) {
	            _value._on.push(THIS);
	            return;
	        }
	        _value = _value._value;
	    }
	    THIS._value = _value;
	    THIS._status = _status;
	    THIS._on = null;
	};
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
	                        thenable._value = error;
	                        thenable._status = REJECTED;
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
	                        thenable._value = error;
	                        thenable._status = REJECTED;
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
	    t(THIS, value);
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
	    for (var length = values.length, index = 0; index < length; ++index) {
	        var value = values[index];
	        if (isThenable(value)) {
	            var _status = value._status;
	            if (_status === PENDING) {
	                ++count;
	                _value[index] = undefined$1;
	                value._on.push({
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
	        else {
	            _value[index] = value;
	        }
	    }
	    return THIS;
	}
	function race(values) {
	    var THIS = new Private;
	    THIS._on = [];
	    var that = {
	        _onfulfilled: function (value) { THIS._status === PENDING && r(THIS, value, FULFILLED); },
	        _onrejected: function (error) { THIS._status === PENDING && r(THIS, error, REJECTED); }
	    };
	    for (var length = values.length, index = 0; index < length; ++index) {
	        var value = values[index];
	        if (isThenable(value)) {
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
	        else {
	            THIS._value = value;
	            THIS._status = FULFILLED;
	            break;
	        }
	    }
	    return THIS;
	}
	var _export = Default(Public, {
	    version: version,
	    Thenable: Public,
	    isThenable: isThenable,
	    resolve: resolve,
	    reject: reject,
	    all: all,
	    race: race
	});

	return _export;

}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMS4wLjEnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IGZyZWV6ZSBmcm9tICcuT2JqZWN0LmZyZWV6ZSc7XG5pbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxudmFyIFBFTkRJTkcgOjAgPSAwO1xudmFyIEZVTEZJTExFRCA6MSA9IDE7XG52YXIgUkVKRUNURUQgOjIgPSAyO1xudHlwZSBTdGF0dXMgPSAwIHwgMSB8IDI7XG5cbnZhciBQcml2YXRlID0gZnVuY3Rpb24gVGhlbmFibGUgKCkge30gYXMgdW5rbm93biBhcyB7IG5ldyAoKSA6UHJpdmF0ZSB9O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNUaGVuYWJsZSAodmFsdWUgOmFueSkgOnZhbHVlIGlzIFB1YmxpYyB7XG5cdHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFByaXZhdGU7XG59XG5cbmZ1bmN0aW9uIHQgKHRoZW5hYmxlIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdGlmICggKCBpc1RoZW5hYmxlIGFzICh2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlICkodmFsdWUpICkge1xuXHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRcdHZhbHVlLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0fVxuXHR9XG5cdGVsc2Uge1xuXHRcdHRoZW5hYmxlLl92YWx1ZSA9IHZhbHVlO1xuXHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdH1cbn1cblxudHlwZSBTdGFjayA9IHsgbmV4dFN0YWNrIDpTdGFjaywgdGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnksIHN0YXR1cyA6U3RhdHVzIH0gfCBudWxsO1xudmFyIHN0YWNrIDpTdGFjayA9IG51bGw7XG5mdW5jdGlvbiByICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBzdGFjayApIHtcblx0XHRzdGFjayA9IHsgbmV4dFN0YWNrOiBzdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZvciAoIDsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGlmICggdGhlbmFibGUuX29ucmVqZWN0ZWQgKSB7IHRoZW5hYmxlLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29uZnVsZmlsbGVkO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29uZnVsZmlsbGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggKCBpc1RoZW5hYmxlIGFzICh2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlICkodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fb25mdWxmaWxsZWQgKSB7IHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfVxuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29ucmVqZWN0ZWQ7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCAoIGlzVGhlbmFibGUgYXMgKHZhbHVlIDphbnkpID0+IHZhbHVlIGlzIFByaXZhdGUgKSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0c3RhdHVzID0gX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7IHN0YXR1cyA9IEZVTEZJTExFRDsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHsgdmFsdWUgPSBlcnJvcjsgfVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBzdGF0dXM7XG5cdFx0XHR2YXIgX29uIDpQcml2YXRlW10gfCBudWxsID0gdGhlbmFibGUuX29uO1xuXHRcdFx0aWYgKCBfb24gKSB7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbiA9IG51bGw7XG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA6bnVtYmVyID0gX29uLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdHN0YWNrID0geyBuZXh0U3RhY2s6IHN0YWNrLCB0aGVuYWJsZTogX29uWy0taW5kZXhdLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCAhc3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBzdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IHN0YWNrLnZhbHVlO1xuXHRcdHN0YXR1cyA9IHN0YWNrLnN0YXR1cztcblx0XHRzdGFjayA9IHN0YWNrLm5leHRTdGFjaztcblx0fVxufVxuXG52YXIgUHVibGljIDp7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0gPSBmdW5jdGlvbiBUaGVuYWJsZSAodGhpcyA6UHJpdmF0ZSwgZXhlY3V0b3IgOkV4ZWN1dG9yKSA6dm9pZCB7XG5cdGlmICggdHlwZW9mIGV4ZWN1dG9yIT09J2Z1bmN0aW9uJyApIHsgdGhyb3cgVHlwZUVycm9yKCdUaGVuYWJsZSBleGVjdXRvciBpcyBub3QgYSBmdW5jdGlvbicpOyB9XG5cdHZhciBleGVjdXRlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFyIHJlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFyIF92YWx1ZSA6YW55O1xuXHR2YXIgX3N0YXR1cyA6U3RhdHVzIHwgdW5kZWZpbmVkO1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IHRoaXM7XG5cdFRISVMuX29uID0gW107XG5cdHRyeSB7XG5cdFx0ZXhlY3V0b3IoXG5cdFx0XHRmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSB7XG5cdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCBleGVjdXRlZCApIHtcblx0XHRcdFx0XHRpZiAoICggaXNUaGVuYWJsZSBhcyAodmFsdWUgOmFueSkgPT4gdmFsdWUgaXMgUHJpdmF0ZSApKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdF9zdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgdmFsdWUuX29uIS5wdXNoKFRISVMpOyB9XG5cdFx0XHRcdFx0XHRlbHNlIHsgcihUSElTLCB2YWx1ZS5fdmFsdWUsIF9zdGF0dXMpOyB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgeyByKFRISVMsIHZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0X3ZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdFx0X3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uIHJlamVjdCAoZXJyb3IgOmFueSkge1xuXHRcdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdGlmICggZXhlY3V0ZWQgKSB7IHIoVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRfdmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRfc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHRcdGlmICggIXJlZCApIHtcblx0XHRcdGV4ZWN1dGVkID0gdHJ1ZTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCAhcmVkICkge1xuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFRISVMuX3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFRISVMuX29uID0gbnVsbDtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0aWYgKCBfc3RhdHVzPT09RlVMRklMTEVEICYmICggaXNUaGVuYWJsZSBhcyAodmFsdWUgOmFueSkgPT4gdmFsdWUgaXMgUHJpdmF0ZSApKF92YWx1ZSkgKSB7XG5cdFx0X3N0YXR1cyA9IF92YWx1ZS5fc3RhdHVzO1xuXHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRfdmFsdWUuX29uIS5wdXNoKFRISVMpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRfdmFsdWUgPSBfdmFsdWUuX3ZhbHVlO1xuXHR9XG5cdFRISVMuX3ZhbHVlID0gX3ZhbHVlO1xuXHRUSElTLl9zdGF0dXMgPSBfc3RhdHVzITtcblx0VEhJUy5fb24gPSBudWxsO1xufSBhcyB1bmtub3duIGFzIHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfTtcblxuUHJpdmF0ZS5wcm90b3R5cGUgPSBQdWJsaWMucHJvdG90eXBlID0ge1xuXHRfc3RhdHVzOiBQRU5ESU5HLFxuXHRfdmFsdWU6IHVuZGVmaW5lZCxcblx0X29uOiBudWxsLFxuXHRfb25mdWxmaWxsZWQ6IHVuZGVmaW5lZCxcblx0X29ucmVqZWN0ZWQ6IHVuZGVmaW5lZCxcblx0dGhlbjogZnVuY3Rpb24gdGhlbiAodGhpcyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHJpdmF0ZSB7XG5cdFx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHRcdHZhciB0aGVuYWJsZSA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRcdHN3aXRjaCAoIFRISVMuX3N0YXR1cyApIHtcblx0XHRcdGNhc2UgUEVORElORzpcblx0XHRcdFx0dGhlbmFibGUuX29uID0gW107XG5cdFx0XHRcdHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IG9uZnVsZmlsbGVkO1xuXHRcdFx0XHR0aGVuYWJsZS5fb25yZWplY3RlZCA9IG9ucmVqZWN0ZWQ7XG5cdFx0XHRcdFRISVMuX29uIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdFx0Y2FzZSBGVUxGSUxMRUQ6XG5cdFx0XHRcdGlmICggdHlwZW9mIG9uZnVsZmlsbGVkPT09J2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHR0cnkgeyB0KHRoZW5hYmxlLCBvbmZ1bGZpbGxlZChUSElTLl92YWx1ZSkpOyB9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gVEhJUy5fdmFsdWU7XG5cdFx0XHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0XHRjYXNlIFJFSkVDVEVEOlxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvbnJlamVjdGVkPT09J2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHR0cnkgeyB0KHRoZW5hYmxlLCBvbnJlamVjdGVkKFRISVMuX3ZhbHVlKSk7IH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdH1cblx0XHR0aHJvdyBUeXBlRXJyb3IoJ01ldGhvZCBUaGVuYWJsZS5wcm90b3R5cGUudGhlbiBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG5cdH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0dChUSElTLCB2YWx1ZSk7XG5cdHJldHVybiBUSElTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVqZWN0IChlcnJvciA6YW55KSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFRISVMuX3ZhbHVlID0gZXJyb3I7XG5cdHJldHVybiBUSElTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWxsICh2YWx1ZXMgOnJlYWRvbmx5IGFueVtdKSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0VEhJUy5fb24gPSBbXTtcblx0dmFyIF92YWx1ZSA6YW55W10gPSBbXTtcblx0dmFyIGNvdW50IDpudW1iZXIgPSAwO1xuXHRmdW5jdGlvbiBfb25yZWplY3RlZCAoZXJyb3IgOmFueSkgOnZvaWQgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIHIoVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHRmb3IgKCB2YXIgbGVuZ3RoIDpudW1iZXIgPSB2YWx1ZXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdHZhciB2YWx1ZSA6YW55ID0gdmFsdWVzW2luZGV4XTtcblx0XHRpZiAoICggaXNUaGVuYWJsZSBhcyAodmFsdWUgOmFueSkgPT4gdmFsdWUgaXMgUHJpdmF0ZSApKHZhbHVlKSApIHtcblx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0Kytjb3VudDtcblx0XHRcdFx0X3ZhbHVlW2luZGV4XSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0dmFsdWUuX29uIS5wdXNoKHtcblx0XHRcdFx0XHRfb25mdWxmaWxsZWQ6IGZ1bmN0aW9uIChpbmRleCA6bnVtYmVyKSA6RnVuY3Rpb24ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdFx0XHRcdFx0XHRcdGlmICggVEhJUy5fc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBjb3VudD4xICkgeyAtLWNvdW50OyB9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSB7IHIoVEhJUywgX3ZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fShpbmRleCksXG5cdFx0XHRcdFx0X29ucmVqZWN0ZWQ6IF9vbnJlamVjdGVkXG5cdFx0XHRcdH0gYXMgUHJpdmF0ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICggX3N0YXR1cz09PVJFSkVDVEVEICkge1xuXHRcdFx0XHRUSElTLl92YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSB2YWx1ZS5fdmFsdWU7IH1cblx0XHR9XG5cdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSB2YWx1ZTsgfVxuXHR9XG5cdHJldHVybiBUSElTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFjZSAodmFsdWVzIDpyZWFkb25seSBhbnlbXSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFRISVMuX29uID0gW107XG5cdHZhciB0aGF0IDpQcml2YXRlID0ge1xuXHRcdF9vbmZ1bGZpbGxlZDogZnVuY3Rpb24gKHZhbHVlIDphbnkpIDp2b2lkIHsgVEhJUy5fc3RhdHVzPT09UEVORElORyAmJiByKFRISVMsIHZhbHVlLCBGVUxGSUxMRUQpOyB9LFxuXHRcdF9vbnJlamVjdGVkOiBmdW5jdGlvbiAoZXJyb3IgOmFueSkgOnZvaWQgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIHIoVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR9IGFzIFByaXZhdGU7XG5cdGZvciAoIHZhciBsZW5ndGggOm51bWJlciA9IHZhbHVlcy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0dmFyIHZhbHVlIDphbnkgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdGlmICggKCBpc1RoZW5hYmxlIGFzICh2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlICkodmFsdWUpICkge1xuXHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkgeyB2YWx1ZS5fb24hLnB1c2godGhhdCk7IH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRUSElTLl92YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdFx0VEhJUy5fc3RhdHVzID0gX3N0YXR1cztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdFRISVMuX3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn1cblxuaW1wb3J0IERlZmF1bHQgZnJvbSAnLmRlZmF1bHQ/PSc7XG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0KFB1YmxpYywge1xuXHR2ZXJzaW9uOiB2ZXJzaW9uLFxuXHRUaGVuYWJsZTogUHVibGljLFxuXHRpc1RoZW5hYmxlOiBpc1RoZW5hYmxlLFxuXHRyZXNvbHZlOiByZXNvbHZlLFxuXHRyZWplY3Q6IHJlamVjdCxcblx0YWxsOiBhbGwsXG5cdHJhY2U6IHJhY2Vcbn0pO1xuXG5leHBvcnQgdmFyIFRoZW5hYmxlIDpSZWFkb25seTx7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0+ID0gZnJlZXplXG5cdD8gLyojX19QVVJFX18qLyBmdW5jdGlvbiAoKSB7XG5cdFx0ZnJlZXplKFB1YmxpYy5wcm90b3R5cGUpO1xuXHRcdGZyZWV6ZShQdWJsaWMpO1xuXHRcdHJldHVybiBQdWJsaWM7XG5cdH0oKVxuXHQ6IFB1YmxpYztcblxudHlwZSBGdW5jdGlvbiA9ICh2YWx1ZSA6YW55KSA9PiB2b2lkO1xudHlwZSBFeGVjdXRvciA9IChyZXNvbHZlIDpGdW5jdGlvbiwgcmVqZWN0IDpGdW5jdGlvbikgPT4gdm9pZDtcbnR5cGUgUHJpdmF0ZSA9IHtcblx0X3N0YXR1cyA6U3RhdHVzLFxuXHRfdmFsdWUgOmFueSxcblx0X29uIDpQcml2YXRlW10gfCBudWxsLFxuXHRfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkLFxuXHRfb25yZWplY3RlZCA6RnVuY3Rpb24gfCB1bmRlZmluZWQsXG5cdHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOlByaXZhdGUsXG59O1xudHlwZSBQdWJsaWMgPSBSZWFkb25seTxvYmplY3QgJiB7XG5cdHRoZW4gKHRoaXMgOlB1YmxpYywgb25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHVibGljLFxufT47Il0sIm5hbWVzIjpbInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxlQUFlLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBQUMsdEJDT3ZCLElBQUksT0FBTyxHQUFNLENBQUMsQ0FBQztDQUNuQixJQUFJLFNBQVMsR0FBTSxDQUFDLENBQUM7Q0FDckIsSUFBSSxRQUFRLEdBQU0sQ0FBQyxDQUFDO0NBR3BCLElBQUksT0FBTyxHQUFHLFNBQVMsUUFBUSxNQUF3QyxDQUFDO0FBRXhFLFVBQWdCLFVBQVUsQ0FBRSxLQUFVO0tBQ3JDLE9BQU8sS0FBSyxZQUFZLE9BQU8sQ0FBQztDQUNqQyxDQUFDO0NBRUQsU0FBUyxDQUFDLENBQUUsUUFBaUIsRUFBRSxLQUFVO0tBQ3hDLElBQU8sVUFBZ0QsQ0FBQyxLQUFLLENBQUMsRUFBRztTQUNoRSxJQUFJLE9BQU8sR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFDO1NBQ3BDLElBQUssT0FBTyxLQUFHLE9BQU8sRUFBRzthQUN4QixRQUFRLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQzthQUNsQixLQUFLLENBQUMsR0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztVQUMxQjtjQUNJO2FBQ0osUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO2FBQy9CLFFBQVEsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1VBQzNCO01BQ0Q7VUFDSTtTQUNKLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxD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