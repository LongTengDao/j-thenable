/*!
 * 模块名称：j-thenable
 * 模块功能：模仿 Promise API 的同步防爆栈工具。从属于“简计划”。
   　　　　　Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".
 * 模块版本：1.0.0
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

	var version = '1.0.0';

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
	    this._on = [];
	    try {
	        var THIS = this;
	        executor(function resolve(value) {
	            if (isThenable(value)) {
	                var _status = value._status;
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
	        }, function reject(error) { r(THIS, error, REJECTED); });
	    }
	    catch (error) {
	        r(this, error, REJECTED);
	    }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMS4wLjAnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IGZyZWV6ZSBmcm9tICcuT2JqZWN0LmZyZWV6ZSc7XG5pbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxudmFyIFBFTkRJTkcgOjAgPSAwO1xudmFyIEZVTEZJTExFRCA6MSA9IDE7XG52YXIgUkVKRUNURUQgOjIgPSAyO1xudHlwZSBTdGF0dXMgPSAwIHwgMSB8IDI7XG5cbnZhciBQcml2YXRlID0gZnVuY3Rpb24gVGhlbmFibGUgKCkge30gYXMgdW5rbm93biBhcyB7IG5ldyAoKSA6UHJpdmF0ZSB9O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNUaGVuYWJsZSAodmFsdWUgOmFueSkgOnZhbHVlIGlzIFB1YmxpYyB7XG5cdHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFByaXZhdGU7XG59XG5cbmZ1bmN0aW9uIHQgKHRoZW5hYmxlIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdGlmICggKCBpc1RoZW5hYmxlIGFzICh2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlICkodmFsdWUpICkge1xuXHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRcdHZhbHVlLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0fVxuXHR9XG5cdGVsc2Uge1xuXHRcdHRoZW5hYmxlLl92YWx1ZSA9IHZhbHVlO1xuXHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdH1cbn1cblxudHlwZSBTdGFjayA9IHsgbmV4dFN0YWNrIDpTdGFjaywgdGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnksIHN0YXR1cyA6U3RhdHVzIH0gfCBudWxsO1xudmFyIHN0YWNrIDpTdGFjayA9IG51bGw7XG5mdW5jdGlvbiByICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBzdGFjayApIHtcblx0XHRzdGFjayA9IHsgbmV4dFN0YWNrOiBzdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZvciAoIDsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGlmICggdGhlbmFibGUuX29ucmVqZWN0ZWQgKSB7IHRoZW5hYmxlLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29uZnVsZmlsbGVkO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29uZnVsZmlsbGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggKCBpc1RoZW5hYmxlIGFzICh2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlICkodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fb25mdWxmaWxsZWQgKSB7IHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfVxuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29ucmVqZWN0ZWQ7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCAoIGlzVGhlbmFibGUgYXMgKHZhbHVlIDphbnkpID0+IHZhbHVlIGlzIFByaXZhdGUgKSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0c3RhdHVzID0gX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7IHN0YXR1cyA9IEZVTEZJTExFRDsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHsgdmFsdWUgPSBlcnJvcjsgfVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBzdGF0dXM7XG5cdFx0XHR2YXIgX29uIDpQcml2YXRlW10gfCBudWxsID0gdGhlbmFibGUuX29uO1xuXHRcdFx0aWYgKCBfb24gKSB7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbiA9IG51bGw7XG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA6bnVtYmVyID0gX29uLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdHN0YWNrID0geyBuZXh0U3RhY2s6IHN0YWNrLCB0aGVuYWJsZTogX29uWy0taW5kZXhdLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCAhc3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBzdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IHN0YWNrLnZhbHVlO1xuXHRcdHN0YXR1cyA9IHN0YWNrLnN0YXR1cztcblx0XHRzdGFjayA9IHN0YWNrLm5leHRTdGFjaztcblx0fVxufVxuXG52YXIgUHVibGljIDp7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0gPSBmdW5jdGlvbiBUaGVuYWJsZSAodGhpcyA6UHJpdmF0ZSwgZXhlY3V0b3IgOkV4ZWN1dG9yKSA6dm9pZCB7XG5cdGlmICggdHlwZW9mIGV4ZWN1dG9yIT09J2Z1bmN0aW9uJyApIHsgdGhyb3cgVHlwZUVycm9yKCdUaGVuYWJsZSBleGVjdXRvciBpcyBub3QgYSBmdW5jdGlvbicpOyB9XG5cdHRoaXMuX29uID0gW107XG5cdHRyeSB7XG5cdFx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHRcdGV4ZWN1dG9yKFxuXHRcdFx0ZnVuY3Rpb24gcmVzb2x2ZSAodmFsdWUgOmFueSkge1xuXHRcdFx0XHRpZiAoICggaXNUaGVuYWJsZSBhcyAodmFsdWUgOmFueSkgPT4gdmFsdWUgaXMgUHJpdmF0ZSApKHZhbHVlKSApIHtcblx0XHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkgeyB2YWx1ZS5fb24hLnB1c2goVEhJUyk7IH1cblx0XHRcdFx0XHRlbHNlIHsgcihUSElTLCB2YWx1ZS5fdmFsdWUsIF9zdGF0dXMpOyB9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7IHIoVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiByZWplY3QgKGVycm9yIDphbnkpIHsgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdFx0KTtcblx0fVxuXHRjYXRjaCAoZXJyb3IpIHsgcih0aGlzLCBlcnJvciwgUkVKRUNURUQpOyB9XG59IGFzIHVua25vd24gYXMgeyBuZXcgKGV4ZWN1dG9yIDpFeGVjdXRvcikgOlB1YmxpYyB9O1xuXG5Qcml2YXRlLnByb3RvdHlwZSA9IFB1YmxpYy5wcm90b3R5cGUgPSB7XG5cdF9zdGF0dXM6IFBFTkRJTkcsXG5cdF92YWx1ZTogdW5kZWZpbmVkLFxuXHRfb246IG51bGwsXG5cdF9vbmZ1bGZpbGxlZDogdW5kZWZpbmVkLFxuXHRfb25yZWplY3RlZDogdW5kZWZpbmVkLFxuXHR0aGVuOiBmdW5jdGlvbiB0aGVuICh0aGlzIDpQcml2YXRlLCBvbmZ1bGZpbGxlZD8gOkZ1bmN0aW9uLCBvbnJlamVjdGVkPyA6RnVuY3Rpb24pIDpQcml2YXRlIHtcblx0XHR2YXIgVEhJUyA6UHJpdmF0ZSA9IHRoaXM7XG5cdFx0dmFyIHRoZW5hYmxlIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFx0c3dpdGNoICggVEhJUy5fc3RhdHVzICkge1xuXHRcdFx0Y2FzZSBQRU5ESU5HOlxuXHRcdFx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRcdFx0dGhlbmFibGUuX29uZnVsZmlsbGVkID0gb25mdWxmaWxsZWQ7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbnJlamVjdGVkID0gb25yZWplY3RlZDtcblx0XHRcdFx0VEhJUy5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0XHRjYXNlIEZVTEZJTExFRDpcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25mdWxmaWxsZWQ9PT0nZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdHRyeSB7IHQodGhlbmFibGUsIG9uZnVsZmlsbGVkKFRISVMuX3ZhbHVlKSk7IH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0XHRcdGNhc2UgUkVKRUNURUQ6XG5cdFx0XHRcdGlmICggdHlwZW9mIG9ucmVqZWN0ZWQ9PT0nZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdHRyeSB7IHQodGhlbmFibGUsIG9ucmVqZWN0ZWQoVEhJUy5fdmFsdWUpKTsgfVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IFRISVMuX3ZhbHVlO1xuXHRcdFx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0fVxuXHRcdHRocm93IFR5cGVFcnJvcignTWV0aG9kIFRoZW5hYmxlLnByb3RvdHlwZS50aGVuIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgcmVjZWl2ZXInKTtcblx0fVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmUgKHZhbHVlIDphbnkpIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHR0KFRISVMsIHZhbHVlKTtcblx0cmV0dXJuIFRISVM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWplY3QgKGVycm9yIDphbnkpIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0cmV0dXJuIFRISVM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGwgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10pIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRUSElTLl9vbiA9IFtdO1xuXHR2YXIgX3ZhbHVlIDphbnlbXSA9IFtdO1xuXHR2YXIgY291bnQgOm51bWJlciA9IDA7XG5cdGZ1bmN0aW9uIF9vbnJlamVjdGVkIChlcnJvciA6YW55KSA6dm9pZCB7IFRISVMuX3N0YXR1cz09PVBFTkRJTkcgJiYgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdGZvciAoIHZhciBsZW5ndGggOm51bWJlciA9IHZhbHVlcy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0dmFyIHZhbHVlIDphbnkgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdGlmICggKCBpc1RoZW5hYmxlIGFzICh2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlICkodmFsdWUpICkge1xuXHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHQrK2NvdW50O1xuXHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR2YWx1ZS5fb24hLnB1c2goe1xuXHRcdFx0XHRcdF9vbmZ1bGZpbGxlZDogZnVuY3Rpb24gKGluZGV4IDpudW1iZXIpIDpGdW5jdGlvbiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIGNvdW50PjEgKSB7IC0tY291bnQ7IH1cblx0XHRcdFx0XHRcdFx0XHRlbHNlIHsgcihUSElTLCBfdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KGluZGV4KSxcblx0XHRcdFx0XHRfb25yZWplY3RlZDogX29ucmVqZWN0ZWRcblx0XHRcdFx0fSBhcyBQcml2YXRlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBfc3RhdHVzPT09UkVKRUNURUQgKSB7XG5cdFx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHsgX3ZhbHVlW2luZGV4XSA9IHZhbHVlLl92YWx1ZTsgfVxuXHRcdH1cblx0XHRlbHNlIHsgX3ZhbHVlW2luZGV4XSA9IHZhbHVlOyB9XG5cdH1cblx0cmV0dXJuIFRISVM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYWNlICh2YWx1ZXMgOnJlYWRvbmx5IGFueVtdKSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0VEhJUy5fb24gPSBbXTtcblx0dmFyIHRoYXQgOlByaXZhdGUgPSB7XG5cdFx0X29uZnVsZmlsbGVkOiBmdW5jdGlvbiAodmFsdWUgOmFueSkgOnZvaWQgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIHIoVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH0sXG5cdFx0X29ucmVqZWN0ZWQ6IGZ1bmN0aW9uIChlcnJvciA6YW55KSA6dm9pZCB7IFRISVMuX3N0YXR1cz09PVBFTkRJTkcgJiYgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdH0gYXMgUHJpdmF0ZTtcblx0Zm9yICggdmFyIGxlbmd0aCA6bnVtYmVyID0gdmFsdWVzLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHR2YXIgdmFsdWUgOmFueSA9IHZhbHVlc1tpbmRleF07XG5cdFx0aWYgKCAoIGlzVGhlbmFibGUgYXMgKHZhbHVlIDphbnkpID0+IHZhbHVlIGlzIFByaXZhdGUgKSh2YWx1ZSkgKSB7XG5cdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7IHZhbHVlLl9vbiEucHVzaCh0aGF0KTsgfVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IHZhbHVlO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufVxuXG5pbXBvcnQgRGVmYXVsdCBmcm9tICcuZGVmYXVsdD89JztcbmV4cG9ydCBkZWZhdWx0IERlZmF1bHQoUHVibGljLCB7XG5cdHZlcnNpb246IHZlcnNpb24sXG5cdFRoZW5hYmxlOiBQdWJsaWMsXG5cdGlzVGhlbmFibGU6IGlzVGhlbmFibGUsXG5cdHJlc29sdmU6IHJlc29sdmUsXG5cdHJlamVjdDogcmVqZWN0LFxuXHRhbGw6IGFsbCxcblx0cmFjZTogcmFjZVxufSk7XG5cbmV4cG9ydCB2YXIgVGhlbmFibGUgOlJlYWRvbmx5PHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfT4gPSBmcmVlemVcblx0PyAvKiNfX1BVUkVfXyovIGZ1bmN0aW9uICgpIHtcblx0XHRmcmVlemUoUHVibGljLnByb3RvdHlwZSk7XG5cdFx0ZnJlZXplKFB1YmxpYyk7XG5cdFx0cmV0dXJuIFB1YmxpYztcblx0fSgpXG5cdDogUHVibGljO1xuXG50eXBlIEZ1bmN0aW9uID0gKHZhbHVlIDphbnkpID0+IHZvaWQ7XG50eXBlIEV4ZWN1dG9yID0gKHJlc29sdmUgOkZ1bmN0aW9uLCByZWplY3QgOkZ1bmN0aW9uKSA9PiB2b2lkO1xudHlwZSBQcml2YXRlID0ge1xuXHRfc3RhdHVzIDpTdGF0dXMsXG5cdF92YWx1ZSA6YW55LFxuXHRfb24gOlByaXZhdGVbXSB8IG51bGwsXG5cdF9vbmZ1bGZpbGxlZCA6RnVuY3Rpb24gfCB1bmRlZmluZWQsXG5cdF9vbnJlamVjdGVkIDpGdW5jdGlvbiB8IHVuZGVmaW5lZCxcblx0dGhlbiAob25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHJpdmF0ZSxcbn07XG50eXBlIFB1YmxpYyA9IFJlYWRvbmx5PG9iamVjdCAmIHtcblx0dGhlbiAodGhpcyA6UHVibGljLCBvbmZ1bGZpbGxlZD8gOkZ1bmN0aW9uLCBvbnJlamVjdGVkPyA6RnVuY3Rpb24pIDpQdWJsaWMsXG59PjsiXSwibmFtZXMiOlsidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGVBQWUsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBQyx0QkNPdkIsSUFBSSxPQUFPLEdBQU0sQ0FBQyxDQUFDO0NBQ25CLElBQUksU0FBUyxHQUFNLENBQUMsQ0FBQztDQUNyQixJQUFJLFFBQVEsR0FBTSxDQUFDLENBQUM7Q0FHcEIsSUFBSSxPQUFPLEdBQUcsU0FBUyxRQUFRLE1BQXdDLENBQUM7QUFFeEUsVUFBZ0IsVUFBVSxDQUFFLEtBQVU7S0FDckMsT0FBTyxLQUFLLFlBQVksT0FBTyxDQUFDO0NBQ2pDLENBQUM7Q0FFRCxTQUFTLENBQUMsQ0FBRSxRQUFpQixFQUFFLEtBQVU7S0FDeEMsSUFBTyxVQUFnRCxDQUFDLEtBQUssQ0FBQyxFQUFHO1NBQ2hFLElBQUksT0FBTyxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUM7U0FDcEMsSUFBSyxPQUFPLEtBQUcsT0FBTyxFQUFHO2FBQ3hCLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO2FBQ2xCLEtBQUssQ0FBQyxHQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1VBQzFCO2NBQ0k7YUFDSixRQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7YUFDL0IsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7VUFDM0I7TUFDRDtVQUNJO1NBQ0osUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7U0FDeEIsUUFBUSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7TUFDN0I7Q0FDRixDQUFDO0NBR0QsSUFBSSxLQUFLLEdBQVUsSUFB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