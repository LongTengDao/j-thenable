/*!
 * 模块名称：j-thenable
 * 模块功能：模仿 Promise API 的同步防爆栈工具。从属于“简计划”。
   　　　　　Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".
 * 模块版本：4.0.0
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

    var seal = Object.seal;

    var freeze = Object.freeze;

    var version = '4.0.0';

    var undefined$1 = void 0;

    var PENDING = 0;
    var FULFILLED = 1;
    var REJECTED = 2;
    var THENABLE = 1;
    var PROMISE = 2;
    var Private = function Thenable() { };
    function isThenable(value) {
        return value instanceof Private;
    }
    var Type = typeof Promise === 'function'
        ? function () {
            var Native = function () { };
            Native.prototype = Promise.prototype;
            return function Type(value) {
                return isThenable(value) ? THENABLE : value instanceof Native ? PROMISE : 0;
            };
        }()
        : function Type(value) {
            return isThenable(value) ? THENABLE : 0;
        };
    var stack = null;
    function flow(thenable, value, status) {
        if (stack) {
            stack = { nextStack: stack, thenable: thenable, value: value, status: status };
            return;
        }
        for (var type, _status;;) {
            stack: {
                if (status === FULFILLED) {
                    if (thenable._onrejected) {
                        thenable._onrejected = undefined$1;
                    }
                    var _onfulfilled = thenable._onfulfilled;
                    if (_onfulfilled) {
                        thenable._onfulfilled = undefined$1;
                        try {
                            type = Type(value = _onfulfilled(value));
                            if (type === THENABLE) {
                                _status = value._status;
                                if (_status === PENDING) {
                                    value._dependents.push(thenable);
                                    break stack;
                                }
                                else {
                                    value = value._value;
                                    status = _status;
                                }
                            }
                            else if (type === PROMISE) {
                                depend(thenable, value);
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
                            type = Type(value = _onrejected(value));
                            if (type === THENABLE) {
                                _status = value._status;
                                if (_status === PENDING) {
                                    value._dependents.push(thenable);
                                    break stack;
                                }
                                else {
                                    value = value._value;
                                    status = _status;
                                }
                            }
                            else if (type === PROMISE) {
                                depend(thenable, value);
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
                var _dependents = thenable._dependents;
                if (_dependents) {
                    thenable._dependents = null;
                    for (var index = _dependents.length; index;) {
                        stack = { nextStack: stack, thenable: _dependents[--index], value: value, status: status };
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
    function depend(thenable, value) {
        var red;
        value.then(function onfulfilled(value) {
            if (red) {
                return;
            }
            red = true;
            flow(thenable, value, FULFILLED);
        }, function onrejected(error) {
            if (red) {
                return;
            }
            red = true;
            flow(thenable, error, REJECTED);
        });
    }

    function resolve(value) {
        var type = Type(value);
        if (type === THENABLE) {
            return value;
        }
        var THIS = new Private;
        if (type === PROMISE) {
            THIS._dependents = [];
            try_depend(THIS, value);
        }
        else {
            THIS._value = value;
            THIS._status = FULFILLED;
        }
        return THIS;
    }
    function try_depend(THIS, value) {
        try {
            depend(THIS, value);
        }
        catch (error) {
            if (THIS._status === PENDING) {
                THIS._value = error;
                THIS._status = REJECTED;
            }
        }
    }

    function reject(error) {
        var THIS = new Private;
        THIS._status = REJECTED;
        THIS._value = error;
        return THIS;
    }

    function all(values) {
        var THIS = new Private;
        try {
            all_try(values, THIS);
        }
        catch (error) {
            if (THIS._status === PENDING) {
                THIS._value = error;
                THIS._status = REJECTED;
                THIS._dependents = null;
            }
        }
        return THIS;
    }
    function all_try(values, THIS) {
        THIS._dependents = [];
        function _onrejected(error) { THIS._status === PENDING && flow(THIS, error, REJECTED); }
        var _value = [];
        var count = 0;
        var counted;
        for (var length = values.length, index = 0; index < length; ++index) {
            var value = values[index];
            var type = Type(value);
            if (type === THENABLE) {
                var _status = value._status;
                if (_status === PENDING) {
                    ++count;
                    _value[index] = undefined$1;
                    value._dependents.push({
                        _status: 0,
                        _value: undefined$1,
                        _dependents: null,
                        _onfulfilled: function (index) {
                            return function (value) {
                                if (THIS._status === PENDING) {
                                    _value[index] = value;
                                    if (!--count && counted) {
                                        flow(THIS, _value, FULFILLED);
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
            else if (type === PROMISE) {
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
                                flow(THIS, _value, FULFILLED);
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
            THIS._dependents = null;
        }
    }

    function race(values) {
        var THIS = new Private;
        try {
            race_try(values, THIS);
        }
        catch (error) {
            if (THIS._status === PENDING) {
                THIS._value = error;
                THIS._status = REJECTED;
                THIS._dependents = null;
            }
        }
        return THIS;
    }
    function race_try(values, THIS) {
        THIS._dependents = [];
        function _onfulfilled(value) { THIS._status === PENDING && flow(THIS, value, FULFILLED); }
        function _onrejected(error) { THIS._status === PENDING && flow(THIS, error, REJECTED); }
        var that = {
            _status: 0,
            _value: undefined$1,
            _dependents: null,
            _onfulfilled: _onfulfilled,
            _onrejected: _onrejected
        };
        for (var length = values.length, index = 0; index < length; ++index) {
            var value = values[index];
            var type = Type(value);
            if (type === THENABLE) {
                var _status = value._status;
                if (_status === PENDING) {
                    value._dependents.push(that);
                }
                else {
                    THIS._value = value._value;
                    THIS._status = _status;
                    break;
                }
            }
            else if (type === PROMISE) {
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

    function pend(callbackfn) {
        var THIS = new Private;
        THIS._dependents = [];
        THIS._Value = callbackfn;
        return THIS;
    }

    var AWAIT = {
        await: function (value) {
            if (isThenable(value)) {
                switch (value._status) {
                    case FULFILLED:
                        return value._value;
                    case REJECTED:
                        throw value._value;
                }
            }
            return value;
        }
    }.await;

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
                        var type = Type(value);
                        if (type === THENABLE) {
                            _status = value._status;
                            if (_status === PENDING) {
                                value._dependents.push(THIS);
                            }
                            else {
                                flow(THIS, value._value, _status);
                            }
                        }
                        else if (type === PROMISE) {
                            depend(THIS, value);
                        }
                        else {
                            flow(THIS, value, FULFILLED);
                        }
                    }
                    catch (error) {
                        if (THIS._status === PENDING) {
                            flow(THIS, error, REJECTED);
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
                    flow(THIS, error, REJECTED);
                }
                else {
                    _value = error;
                    _status = REJECTED;
                }
            });
            if (!red) {
                executed = true;
                THIS._dependents = [];
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
                THIS._dependents = null;
            }
        }
    };
    function rEd(THIS, _status, _value) {
        if (_status === FULFILLED) {
            var type = Type(_value);
            if (type === THENABLE) {
                _status = _value._status;
                if (_status === PENDING) {
                    THIS._dependents = [];
                    _value._dependents.push(THIS);
                }
                else {
                    THIS._value = _value._value;
                    THIS._status = _status;
                }
                return;
            }
            if (type === PROMISE) {
                THIS._dependents = [];
                depend(THIS, _value);
                return;
            }
        }
        THIS._value = _value;
        THIS._status = _status;
    }

    var prototype = {
        _status: PENDING,
        _value: undefined$1,
        _dependents: null,
        _onfulfilled: undefined$1,
        _onrejected: undefined$1,
        _Value: undefined$1,
        then: function then(onfulfilled, onrejected) {
            var THIS = this;
            var callbackfn = THIS._Value;
            if (callbackfn) {
                THIS._Value = undefined$1;
                callbackAs(callbackfn, THIS);
            }
            var thenable = new Private;
            switch (THIS._status) {
                case PENDING:
                    thenable._dependents = [];
                    thenable._onfulfilled = onfulfilled;
                    thenable._onrejected = onrejected;
                    THIS._dependents.push(thenable);
                    return thenable;
                case FULFILLED:
                    if (typeof onfulfilled === 'function') {
                        onto(THIS, onfulfilled, thenable);
                    }
                    else {
                        thenable._value = THIS._value;
                        thenable._status = FULFILLED;
                    }
                    return thenable;
                case REJECTED:
                    if (typeof onrejected === 'function') {
                        onto(THIS, onrejected, thenable);
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
    function callbackAs(callbackfn, THIS) {
        try {
            flow(THIS, callbackfn(), FULFILLED);
        }
        catch (error) {
            flow(THIS, error, REJECTED);
        }
    }
    function onto(THIS, on, thenable) {
        try {
            onto_try(thenable, on(THIS._value));
        }
        catch (error) {
            if (thenable._status === PENDING) {
                thenable._value = error;
                thenable._status = REJECTED;
            }
        }
    }
    function onto_try(thenable, value) {
        var type = Type(value);
        if (type === THENABLE) {
            var status = value._status;
            if (status === PENDING) {
                thenable._dependents = [];
                value._dependents.push(thenable);
            }
            else {
                thenable._value = value._value;
                thenable._status = status;
            }
        }
        else if (value === PROMISE) {
            thenable._dependents = [];
            depend(thenable, value);
        }
        else {
            thenable._value = value;
            thenable._status = FULFILLED;
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

    Public.prototype = Private.prototype = seal ? /*#__PURE__*/ seal(prototype) : prototype;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsIl8udHMiLCJyZXNvbHZlLnRzIiwicmVqZWN0LnRzIiwiYWxsLnRzIiwicmFjZS50cyIsInBlbmQudHMiLCJhd2FpdC50cyIsIlRoZW5hYmxlLnRzIiwiVGhlbmFibGUucHJvdG90eXBlLnRzIiwiZXhwb3J0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0ICc0LjAuMCc7IiwiaW1wb3J0IFByb21pc2UgZnJvbSAnLlByb21pc2UnO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxuZXhwb3J0IHZhciBQRU5ESU5HIDowID0gMDtcbmV4cG9ydCB2YXIgRlVMRklMTEVEIDoxID0gMTtcbmV4cG9ydCB2YXIgUkVKRUNURUQgOjIgPSAyO1xuXG5leHBvcnQgdmFyIFRIRU5BQkxFIDoxID0gMTtcbmV4cG9ydCB2YXIgUFJPTUlTRSA6MiA9IDI7XG5cbmV4cG9ydCB2YXIgUHJpdmF0ZSA6eyBuZXcgKCkgOlByaXZhdGUgfSA9IGZ1bmN0aW9uIFRoZW5hYmxlICgpIHt9IGFzIGFueTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGhlbmFibGUgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBQcml2YXRlIHtcblx0cmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUHJpdmF0ZTtcbn1cblxuZXhwb3J0IHZhciBUeXBlIDoodmFsdWUgOmFueSkgPT4gdHlwZW9mIHZhbHVlIGV4dGVuZHMgUHJpdmF0ZSA/IDEgOiB0eXBlb2YgdmFsdWUgZXh0ZW5kcyBQcm9taXNlPGFueT4gPyAyIDogMCA9XG5cdFxuXHR0eXBlb2YgUHJvbWlzZT09PSdmdW5jdGlvbidcblx0XHRcblx0XHQ/IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBOYXRpdmUgPSBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdE5hdGl2ZS5wcm90b3R5cGUgPSBQcm9taXNlLnByb3RvdHlwZTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiBUeXBlICh2YWx1ZSA6YW55KSA6YW55IHtcblx0XHRcdFx0cmV0dXJuIGlzVGhlbmFibGUodmFsdWUpID8gVEhFTkFCTEUgOiB2YWx1ZSBpbnN0YW5jZW9mIE5hdGl2ZSA/IFBST01JU0UgOiAwO1xuXHRcdFx0fTtcblx0XHR9KClcblx0XHRcblx0XHQ6IGZ1bmN0aW9uIFR5cGUgKHZhbHVlIDphbnkpIDphbnkge1xuXHRcdFx0cmV0dXJuIGlzVGhlbmFibGUodmFsdWUpID8gVEhFTkFCTEUgOiAwO1xuXHRcdH07XG5cbnZhciBzdGFjayA6U3RhY2sgfCBudWxsID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGZsb3cgKHRoZW5hYmxlIDpQcml2YXRlLCB2YWx1ZSA6YW55LCBzdGF0dXMgOlN0YXR1cykgOnZvaWQge1xuXHRpZiAoIHN0YWNrICkge1xuXHRcdHN0YWNrID0geyBuZXh0U3RhY2s6IHN0YWNrLCB0aGVuYWJsZTogdGhlbmFibGUsIHZhbHVlOiB2YWx1ZSwgc3RhdHVzOiBzdGF0dXMgfTtcblx0XHRyZXR1cm47XG5cdH1cblx0Zm9yICggdmFyIHR5cGUgOlR5cGUsIF9zdGF0dXMgOlN0YXR1czsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGlmICggdGhlbmFibGUuX29ucmVqZWN0ZWQgKSB7IHRoZW5hYmxlLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOk9uZnVsZmlsbGVkIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29uZnVsZmlsbGVkO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHR5cGUgPSBUeXBlKHZhbHVlID0gX29uZnVsZmlsbGVkKHZhbHVlKSk7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGU9PT1USEVOQUJMRSApIHtcblx0XHRcdFx0XHRcdFx0X3N0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUuX2RlcGVuZGVudHMhLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCB0eXBlPT09UFJPTUlTRSApIHtcblx0XHRcdFx0XHRcdFx0ZGVwZW5kKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggdGhlbmFibGUuX3N0YXR1cyE9PVBFTkRJTkcgKSB7IGJyZWFrIHN0YWNrOyB9XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fb25mdWxmaWxsZWQgKSB7IHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfVxuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOk9ucmVqZWN0ZWQgfCB1bmRlZmluZWQgPSB0aGVuYWJsZS5fb25yZWplY3RlZDtcblx0XHRcdFx0aWYgKCBfb25yZWplY3RlZCApIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fb25yZWplY3RlZCA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0dHlwZSA9IFR5cGUodmFsdWUgPSBfb25yZWplY3RlZCh2YWx1ZSkpO1xuXHRcdFx0XHRcdFx0aWYgKCB0eXBlPT09VEhFTkFCTEUgKSB7XG5cdFx0XHRcdFx0XHRcdF9zdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlLl9kZXBlbmRlbnRzIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggdHlwZT09PVBST01JU0UgKSB7XG5cdFx0XHRcdFx0XHRcdGRlcGVuZCh0aGVuYWJsZSwgdmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgeyBzdGF0dXMgPSBGVUxGSUxMRUQ7IH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRpZiAoIHRoZW5hYmxlLl9zdGF0dXMhPT1QRU5ESU5HICkgeyBicmVhayBzdGFjazsgfVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IHZhbHVlO1xuXHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IHN0YXR1cztcblx0XHRcdHZhciBfZGVwZW5kZW50cyA6UHJpdmF0ZVtdIHwgbnVsbCA9IHRoZW5hYmxlLl9kZXBlbmRlbnRzO1xuXHRcdFx0aWYgKCBfZGVwZW5kZW50cyApIHtcblx0XHRcdFx0dGhlbmFibGUuX2RlcGVuZGVudHMgPSBudWxsO1xuXHRcdFx0XHRmb3IgKCB2YXIgaW5kZXggOm51bWJlciA9IF9kZXBlbmRlbnRzLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdHN0YWNrID0geyBuZXh0U3RhY2s6IHN0YWNrLCB0aGVuYWJsZTogX2RlcGVuZGVudHNbLS1pbmRleF0sIHZhbHVlOiB2YWx1ZSwgc3RhdHVzOiBzdGF0dXMgfTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoICFzdGFjayApIHsgYnJlYWs7IH1cblx0XHR0aGVuYWJsZSA9IHN0YWNrLnRoZW5hYmxlO1xuXHRcdHZhbHVlID0gc3RhY2sudmFsdWU7XG5cdFx0c3RhdHVzID0gc3RhY2suc3RhdHVzO1xuXHRcdHN0YWNrID0gc3RhY2submV4dFN0YWNrO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXBlbmQgKHRoZW5hYmxlIDpQcml2YXRlLCB2YWx1ZSA6UmVhZG9ubHk8eyB0aGVuICguLi5hcmdzIDphbnlbXSkgOmFueSB9PikgOnZvaWQge1xuXHR2YXIgcmVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHR2YWx1ZS50aGVuKFxuXHRcdGZ1bmN0aW9uIG9uZnVsZmlsbGVkICh2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0Zmxvdyh0aGVuYWJsZSwgdmFsdWUsIEZVTEZJTExFRCk7XG5cdFx0fSxcblx0XHRmdW5jdGlvbiBvbnJlamVjdGVkIChlcnJvciA6YW55KSA6dm9pZCB7XG5cdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0Zmxvdyh0aGVuYWJsZSwgZXJyb3IsIFJFSkVDVEVEKTtcblx0XHR9XG5cdCk7XG59XG5cbnR5cGUgU3RhY2sgPSB7IG5leHRTdGFjayA6U3RhY2sgfCBudWxsLCB0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMgfTtcblxuZXhwb3J0IHR5cGUgUHJpdmF0ZSA9IHtcblx0X3N0YXR1cyA6U3RhdHVzLFxuXHRfdmFsdWUgOmFueSxcblx0X2RlcGVuZGVudHMgOlByaXZhdGVbXSB8IG51bGwsXG5cdF9vbmZ1bGZpbGxlZCA6T25mdWxmaWxsZWQgfCB1bmRlZmluZWQsXG5cdF9vbnJlamVjdGVkIDpPbnJlamVjdGVkIHwgdW5kZWZpbmVkLFxuXHRfVmFsdWUgOiggKCkgPT4gYW55ICkgfCB1bmRlZmluZWQsXG5cdHRoZW4gKHRoaXMgOlByaXZhdGUsIG9uZnVsZmlsbGVkPyA6T25mdWxmaWxsZWQsIG9ucmVqZWN0ZWQ/IDpPbnJlamVjdGVkKSA6UHJpdmF0ZSxcbn07XG5cbmV4cG9ydCB0eXBlIE9uZnVsZmlsbGVkID0gKHZhbHVlIDphbnkpID0+IGFueTtcblxuZXhwb3J0IHR5cGUgT25yZWplY3RlZCA9IChlcnJvciA6YW55KSA9PiBhbnk7XG5cbmV4cG9ydCB0eXBlIFN0YXR1cyA9IDAgfCAxIHwgMjtcblxuZXhwb3J0IHR5cGUgVHlwZSA9IDAgfCAxIHwgMjtcblxuZXhwb3J0IHR5cGUgRXhlY3V0b3IgPSAocmVzb2x2ZT8gOih2YWx1ZSA6YW55KSA9PiB2b2lkLCByZWplY3Q/IDooZXJyb3IgOmFueSkgPT4gdm9pZCkgPT4gdm9pZDtcbiIsImltcG9ydCB7IFR5cGUsIFRIRU5BQkxFLCBQUk9NSVNFLCBUeXBlLCBkZXBlbmQsIEZVTEZJTExFRCwgUkVKRUNURUQsIFBFTkRJTkcsIFByaXZhdGUgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXNvbHZlICh2YWx1ZT8gOmFueSkgOlB1YmxpYyB7XG5cdHZhciB0eXBlIDpUeXBlID0gVHlwZSh2YWx1ZSk7XG5cdGlmICggdHlwZT09PVRIRU5BQkxFICkgeyByZXR1cm4gdmFsdWU7IH1cblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0aWYgKCB0eXBlPT09UFJPTUlTRSApIHtcblx0XHRUSElTLl9kZXBlbmRlbnRzID0gW107XG5cdFx0dHJ5X2RlcGVuZChUSElTLCB2YWx1ZSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0VEhJUy5fdmFsdWUgPSB2YWx1ZTtcblx0XHRUSElTLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdH1cblx0cmV0dXJuIFRISVM7XG59O1xuXG5mdW5jdGlvbiB0cnlfZGVwZW5kIChUSElTIDpQcml2YXRlLCB2YWx1ZSA6YW55KSB7XG5cdHRyeSB7IGRlcGVuZChUSElTLCB2YWx1ZSk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdH1cblx0fVxufVxuXG5pbXBvcnQgUHVibGljIGZyb20gJy4vVGhlbmFibGUnOyIsImltcG9ydCB7IFJFSkVDVEVELCBQcml2YXRlIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVqZWN0IChlcnJvcj8gOmFueSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRyZXR1cm4gVEhJUztcbn07XG5cbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7IiwiaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxuaW1wb3J0IHsgUEVORElORywgUkVKRUNURUQsIEZVTEZJTExFRCwgZmxvdywgVHlwZSwgVEhFTkFCTEUsIFBST01JU0UsIFR5cGUsIFN0YXR1cywgUHJpdmF0ZSwgT25mdWxmaWxsZWQgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhbGwgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10pIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHR0cnkgeyBhbGxfdHJ5KHZhbHVlcywgVEhJUyk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0VEhJUy5fZGVwZW5kZW50cyA9IG51bGw7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufTtcblxuZnVuY3Rpb24gYWxsX3RyeSAodmFsdWVzIDpyZWFkb25seSBhbnlbXSwgVEhJUyA6UHJpdmF0ZSkgOnZvaWQge1xuXHRUSElTLl9kZXBlbmRlbnRzID0gW107XG5cdGZ1bmN0aW9uIF9vbnJlamVjdGVkIChlcnJvciA6YW55KSA6YW55IHsgVEhJUy5fc3RhdHVzPT09UEVORElORyAmJiBmbG93KFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0dmFyIF92YWx1ZSA6YW55W10gPSBbXTtcblx0dmFyIGNvdW50IDpudW1iZXIgPSAwO1xuXHR2YXIgY291bnRlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0Zm9yICggdmFyIGxlbmd0aCA6bnVtYmVyID0gdmFsdWVzLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHR2YXIgdmFsdWUgOmFueSA9IHZhbHVlc1tpbmRleF07XG5cdFx0dmFyIHR5cGUgOlR5cGUgPSBUeXBlKHZhbHVlKTtcblx0XHRpZiAoIHR5cGU9PT1USEVOQUJMRSApIHtcblx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0Kytjb3VudDtcblx0XHRcdFx0X3ZhbHVlW2luZGV4XSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0dmFsdWUuX2RlcGVuZGVudHMhLnB1c2goe1xuXHRcdFx0XHRcdF9zdGF0dXM6IDAsXG5cdFx0XHRcdFx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdFx0XHRcdFx0X2RlcGVuZGVudHM6IG51bGwsXG5cdFx0XHRcdFx0X29uZnVsZmlsbGVkOiBmdW5jdGlvbiAoaW5kZXggOm51bWJlcikgOk9uZnVsZmlsbGVkIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodmFsdWUgOmFueSkgOnZvaWQge1xuXHRcdFx0XHRcdFx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0X3ZhbHVlW2luZGV4XSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdGlmICggIS0tY291bnQgJiYgY291bnRlZCApIHsgZmxvdyhUSElTLCBfdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KGluZGV4KSxcblx0XHRcdFx0XHRfb25yZWplY3RlZDogX29ucmVqZWN0ZWRcblx0XHRcdFx0fSBhcyBQcml2YXRlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBfc3RhdHVzPT09UkVKRUNURUQgKSB7XG5cdFx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHsgX3ZhbHVlW2luZGV4XSA9IHZhbHVlLl92YWx1ZTsgfVxuXHRcdH1cblx0XHRlbHNlIGlmICggdHlwZT09PVBST01JU0UgKSB7XG5cdFx0XHQrK2NvdW50O1xuXHRcdFx0X3ZhbHVlW2luZGV4XSA9IHVuZGVmaW5lZDtcblx0XHRcdHZhbHVlLnRoZW4oXG5cdFx0XHRcdGZ1bmN0aW9uIChpbmRleCA6bnVtYmVyKSA6T25mdWxmaWxsZWQge1xuXHRcdFx0XHRcdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdFx0XHRcdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdGlmICggIS0tY291bnQgJiYgY291bnRlZCApIHsgZmxvdyhUSElTLCBfdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9KGluZGV4KSxcblx0XHRcdFx0X29ucmVqZWN0ZWRcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGVsc2UgeyBfdmFsdWVbaW5kZXhdID0gdmFsdWU7IH1cblx0fVxuXHRjb3VudGVkID0gdHJ1ZTtcblx0aWYgKCAhY291bnQgJiYgVEhJUy5fc3RhdHVzPT09UEVORElORyApIHtcblx0XHRUSElTLl92YWx1ZSA9IF92YWx1ZTtcblx0XHRUSElTLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdFx0VEhJUy5fZGVwZW5kZW50cyA9IG51bGw7XG5cdH1cbn1cblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgdW5kZWZpbmVkIGZyb20gJy51bmRlZmluZWQnO1xuXG5pbXBvcnQgeyBmbG93LCBQRU5ESU5HLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBTdGF0dXMsIFR5cGUsIFRIRU5BQkxFLCBQUk9NSVNFLCBUeXBlLCBQcml2YXRlIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmFjZSAodmFsdWVzIDpyZWFkb25seSBhbnlbXSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdHRyeSB7IHJhY2VfdHJ5KHZhbHVlcywgVEhJUyk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0VEhJUy5fZGVwZW5kZW50cyA9IG51bGw7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufTtcblxuZnVuY3Rpb24gcmFjZV90cnkgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10sIFRISVMgOlByaXZhdGUpIDp2b2lkIHtcblx0VEhJUy5fZGVwZW5kZW50cyA9IFtdO1xuXHRmdW5jdGlvbiBfb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDphbnkgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIGZsb3coVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0ZnVuY3Rpb24gX29ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDphbnkgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR2YXIgdGhhdCA6UHJpdmF0ZSA9IHtcblx0XHRfc3RhdHVzOiAwLFxuXHRcdF92YWx1ZTogdW5kZWZpbmVkLFxuXHRcdF9kZXBlbmRlbnRzOiBudWxsLFxuXHRcdF9vbmZ1bGZpbGxlZDogX29uZnVsZmlsbGVkLFxuXHRcdF9vbnJlamVjdGVkOiBfb25yZWplY3RlZFxuXHR9IGFzIFByaXZhdGU7XG5cdGZvciAoIHZhciBsZW5ndGggOm51bWJlciA9IHZhbHVlcy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0dmFyIHZhbHVlIDphbnkgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdHZhciB0eXBlIDpUeXBlID0gVHlwZSh2YWx1ZSk7XG5cdFx0aWYgKCB0eXBlPT09VEhFTkFCTEUgKSB7XG5cdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7IHZhbHVlLl9kZXBlbmRlbnRzIS5wdXNoKHRoYXQpOyB9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0VEhJUy5fdmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHRcdFRISVMuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmICggdHlwZT09PVBST01JU0UgKSB7XG5cdFx0XHR2YWx1ZS50aGVuKF9vbmZ1bGZpbGxlZCwgX29ucmVqZWN0ZWQpO1xuXHRcdFx0aWYgKCBUSElTLl9zdGF0dXMhPT1QRU5ESU5HICkgeyBicmVhazsgfVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWU7XG5cdFx0XHRUSElTLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgeyBQcml2YXRlIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGVuZCAoY2FsbGJhY2tmbiA6KCkgPT4gYW55KSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0VEhJUy5fZGVwZW5kZW50cyA9IFtdO1xuXHRUSElTLl9WYWx1ZSA9IGNhbGxiYWNrZm47XG5cdHJldHVybiBUSElTO1xufTtcblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgeyBpc1RoZW5hYmxlLCBGVUxGSUxMRUQsIFJFSkVDVEVEIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRhd2FpdDogZnVuY3Rpb24gKHZhbHVlIDphbnkpIDphbnkge1xuXHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRzd2l0Y2ggKCB2YWx1ZS5fc3RhdHVzICkge1xuXHRcdFx0XHRjYXNlIEZVTEZJTExFRDpcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRjYXNlIFJFSkVDVEVEOlxuXHRcdFx0XHRcdHRocm93IHZhbHVlLl92YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG59LmF3YWl0O1xuIiwiaW1wb3J0IFR5cGVFcnJvciBmcm9tICcuVHlwZUVycm9yJztcblxuaW1wb3J0IHsgU3RhdHVzLCBQRU5ESU5HLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBUeXBlLCBUSEVOQUJMRSwgUFJPTUlTRSwgVHlwZSwgZmxvdywgZGVwZW5kLCBQcml2YXRlLCBFeGVjdXRvciwgT25mdWxmaWxsZWQsIE9ucmVqZWN0ZWQgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgeyBQdWJsaWMgYXMgZGVmYXVsdCB9O1xuXG50eXBlIFB1YmxpYyA9IFJlYWRvbmx5PG9iamVjdCAmIHtcblx0dGhlbiAodGhpcyA6UHVibGljLCBvbmZ1bGZpbGxlZD8gOk9uZnVsZmlsbGVkLCBvbnJlamVjdGVkPyA6T25yZWplY3RlZCkgOlB1YmxpYyxcbn0+O1xuXG52YXIgUHVibGljIDp7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0gPSBmdW5jdGlvbiBUaGVuYWJsZSAodGhpcyA6UHJpdmF0ZSwgZXhlY3V0b3IgOkV4ZWN1dG9yKSA6dm9pZCB7XG5cdGlmICggdHlwZW9mIGV4ZWN1dG9yIT09J2Z1bmN0aW9uJyApIHsgdGhyb3cgVHlwZUVycm9yKCdUaGVuYWJsZSBleGVjdXRvciBpcyBub3QgYSBmdW5jdGlvbicpOyB9XG5cdHZhciBleGVjdXRlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFyIHJlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFyIF92YWx1ZSA6YW55O1xuXHR2YXIgX3N0YXR1cyA6U3RhdHVzIHwgdW5kZWZpbmVkO1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IHRoaXM7XG5cdHRyeSB7XG5cdFx0ZXhlY3V0b3IoXG5cdFx0XHRmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSB7XG5cdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCBleGVjdXRlZCApIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0dmFyIHR5cGUgOlR5cGUgPSBUeXBlKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggdHlwZT09PVRIRU5BQkxFICkge1xuXHRcdFx0XHRcdFx0XHRfc3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgdmFsdWUuX2RlcGVuZGVudHMhLnB1c2goVEhJUyk7IH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7IGZsb3coVEhJUywgdmFsdWUuX3ZhbHVlLCBfc3RhdHVzISk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCB0eXBlPT09UFJPTUlTRSApIHsgZGVwZW5kKFRISVMsIHZhbHVlKTsgfVxuXHRcdFx0XHRcdFx0ZWxzZSB7IGZsb3coVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7IGlmICggVEhJUy5fc3RhdHVzPT09UEVORElORyApIHsgZmxvdyhUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9IH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRfdmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHRfc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZnVuY3Rpb24gcmVqZWN0IChlcnJvciA6YW55KSB7XG5cdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCBleGVjdXRlZCApIHsgZmxvdyhUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdF92YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdF9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0aWYgKCAhcmVkICkge1xuXHRcdFx0ZXhlY3V0ZWQgPSB0cnVlO1xuXHRcdFx0VEhJUy5fZGVwZW5kZW50cyA9IFtdO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoICFyZWQgKSB7XG5cdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHR0cnkgeyByRWQoVEhJUywgX3N0YXR1cywgX3ZhbHVlKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRUSElTLl9kZXBlbmRlbnRzID0gbnVsbDtcblx0XHR9XG5cdH1cbn0gYXMgYW55O1xuXG5mdW5jdGlvbiByRWQgKFRISVMgOlByaXZhdGUsIF9zdGF0dXMgOlN0YXR1cyB8IHVuZGVmaW5lZCwgX3ZhbHVlIDphbnkpIDp2b2lkIHtcblx0aWYgKCBfc3RhdHVzPT09RlVMRklMTEVEICkge1xuXHRcdHZhciB0eXBlIDpUeXBlID0gVHlwZShfdmFsdWUpO1xuXHRcdGlmICggdHlwZT09PVRIRU5BQkxFICkge1xuXHRcdFx0X3N0YXR1cyA9IF92YWx1ZS5fc3RhdHVzO1xuXHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0VEhJUy5fZGVwZW5kZW50cyA9IFtdO1xuXHRcdFx0XHRfdmFsdWUuX2RlcGVuZGVudHMhLnB1c2goVEhJUyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0VEhJUy5fdmFsdWUgPSBfdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoIHR5cGU9PT1QUk9NSVNFICkge1xuXHRcdFx0VEhJUy5fZGVwZW5kZW50cyA9IFtdO1xuXHRcdFx0ZGVwZW5kKFRISVMsIF92YWx1ZSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cdFRISVMuX3ZhbHVlID0gX3ZhbHVlO1xuXHRUSElTLl9zdGF0dXMgPSBfc3RhdHVzITtcbn1cbiIsImltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5pbXBvcnQgdW5kZWZpbmVkIGZyb20gJy51bmRlZmluZWQnO1xuXG5pbXBvcnQgeyBQRU5ESU5HLCBSRUpFQ1RFRCwgRlVMRklMTEVELCBQcml2YXRlLCBUeXBlLCBUSEVOQUJMRSwgUFJPTUlTRSwgVHlwZSwgU3RhdHVzLCBkZXBlbmQsIGZsb3csIE9uZnVsZmlsbGVkLCBPbnJlamVjdGVkIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRfc3RhdHVzOiBQRU5ESU5HLFxuXHRfdmFsdWU6IHVuZGVmaW5lZCxcblx0X2RlcGVuZGVudHM6IG51bGwsXG5cdF9vbmZ1bGZpbGxlZDogdW5kZWZpbmVkLFxuXHRfb25yZWplY3RlZDogdW5kZWZpbmVkLFxuXHRfVmFsdWU6IHVuZGVmaW5lZCxcblx0dGhlbjogZnVuY3Rpb24gdGhlbiAodGhpcyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQ/IDpPbmZ1bGZpbGxlZCwgb25yZWplY3RlZD8gOk9ucmVqZWN0ZWQpIDpQcml2YXRlIHtcblx0XHR2YXIgVEhJUyA6UHJpdmF0ZSA9IHRoaXM7XG5cdFx0dmFyIGNhbGxiYWNrZm4gOiggKCkgPT4gYW55ICkgfCB1bmRlZmluZWQgPSBUSElTLl9WYWx1ZTtcblx0XHRpZiAoIGNhbGxiYWNrZm4gKSB7XG5cdFx0XHRUSElTLl9WYWx1ZSA9IHVuZGVmaW5lZDtcblx0XHRcdGNhbGxiYWNrQXMoY2FsbGJhY2tmbiwgVEhJUyk7XG5cdFx0fVxuXHRcdHZhciB0aGVuYWJsZSA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRcdHN3aXRjaCAoIFRISVMuX3N0YXR1cyApIHtcblx0XHRcdGNhc2UgUEVORElORzpcblx0XHRcdFx0dGhlbmFibGUuX2RlcGVuZGVudHMgPSBbXTtcblx0XHRcdFx0dGhlbmFibGUuX29uZnVsZmlsbGVkID0gb25mdWxmaWxsZWQ7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbnJlamVjdGVkID0gb25yZWplY3RlZDtcblx0XHRcdFx0VEhJUy5fZGVwZW5kZW50cyEucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0XHRcdGNhc2UgRlVMRklMTEVEOlxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvbmZ1bGZpbGxlZD09PSdmdW5jdGlvbicgKSB7IG9udG8oVEhJUywgb25mdWxmaWxsZWQsIHRoZW5hYmxlKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0XHRcdGNhc2UgUkVKRUNURUQ6XG5cdFx0XHRcdGlmICggdHlwZW9mIG9ucmVqZWN0ZWQ9PT0nZnVuY3Rpb24nICkgeyBvbnRvKFRISVMsIG9ucmVqZWN0ZWQsIHRoZW5hYmxlKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdH1cblx0XHR0aHJvdyBUeXBlRXJyb3IoJ01ldGhvZCBUaGVuYWJsZS5wcm90b3R5cGUudGhlbiBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIGNhbGxiYWNrQXMgKGNhbGxiYWNrZm4gOigpID0+IGFueSwgVEhJUyA6UHJpdmF0ZSkgOnZvaWQge1xuXHR0cnkgeyBmbG93KFRISVMsIGNhbGxiYWNrZm4oKSwgRlVMRklMTEVEKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHsgZmxvdyhUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG59XG5cbmZ1bmN0aW9uIG9udG8gKFRISVMgOlByaXZhdGUsIG9uIDooXyA6YW55KSA9PiBhbnksIHRoZW5hYmxlIDpQcml2YXRlKSB7XG5cdHRyeSB7IG9udG9fdHJ5KHRoZW5hYmxlLCBvbihUSElTLl92YWx1ZSkpOyB9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggdGhlbmFibGUuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gb250b190cnkgKHRoZW5hYmxlIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdHZhciB0eXBlIDpUeXBlID0gVHlwZSh2YWx1ZSk7XG5cdGlmICggdHlwZT09PVRIRU5BQkxFICkge1xuXHRcdHZhciBzdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0aWYgKCBzdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0dGhlbmFibGUuX2RlcGVuZGVudHMgPSBbXTtcblx0XHRcdHZhbHVlLl9kZXBlbmRlbnRzIS5wdXNoKHRoZW5hYmxlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gc3RhdHVzO1xuXHRcdH1cblx0fVxuXHRlbHNlIGlmICggdmFsdWU9PT1QUk9NSVNFICkge1xuXHRcdHRoZW5hYmxlLl9kZXBlbmRlbnRzID0gW107XG5cdFx0ZGVwZW5kKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0dGhlbmFibGUuX3ZhbHVlID0gdmFsdWU7XG5cdFx0dGhlbmFibGUuX3N0YXR1cyA9IEZVTEZJTExFRDtcblx0fVxufVxuIiwiaW1wb3J0IHNlYWwgZnJvbSAnLk9iamVjdC5zZWFsJztcbmltcG9ydCBmcmVlemUgZnJvbSAnLk9iamVjdC5mcmVlemUnO1xuXG5pbXBvcnQgdmVyc2lvbiBmcm9tICcuL3ZlcnNpb24/dGV4dCc7XG5leHBvcnQgeyB2ZXJzaW9uIH07XG5cbmltcG9ydCByZXNvbHZlIGZyb20gJy4vcmVzb2x2ZSc7XG5pbXBvcnQgcmVqZWN0IGZyb20gJy4vcmVqZWN0JztcbmltcG9ydCBhbGwgZnJvbSAnLi9hbGwnO1xuaW1wb3J0IHJhY2UgZnJvbSAnLi9yYWNlJztcbmltcG9ydCBwZW5kIGZyb20gJy4vcGVuZCc7XG5pbXBvcnQgQVdBSVQgZnJvbSAnLi9hd2FpdCc7XG5leHBvcnQge1xuXHRyZXNvbHZlLFxuXHRyZWplY3QsXG5cdGFsbCxcblx0cmFjZSxcblx0cGVuZCxcblx0QVdBSVQgYXMgYXdhaXQsXG59O1xuXG5pbXBvcnQgeyBQcml2YXRlLCBFeGVjdXRvciB9IGZyb20gJy4vXyc7XG5pbXBvcnQgUHVibGljIGZyb20gJy4vVGhlbmFibGUnO1xuaW1wb3J0IHByb3RvdHlwZSBmcm9tICcuL1RoZW5hYmxlLnByb3RvdHlwZSc7XG5QdWJsaWMucHJvdG90eXBlID0gUHJpdmF0ZS5wcm90b3R5cGUgPSBzZWFsID8gLyojX19QVVJFX18qLyBzZWFsKHByb3RvdHlwZSkgOiBwcm90b3R5cGU7XG5cbmltcG9ydCBEZWZhdWx0IGZyb20gJy5kZWZhdWx0Pz0nO1xuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdChQdWJsaWMsIHtcblx0dmVyc2lvbjogdmVyc2lvbixcblx0VGhlbmFibGU6IFB1YmxpYyxcblx0cmVzb2x2ZTogcmVzb2x2ZSxcblx0cmVqZWN0OiByZWplY3QsXG5cdGFsbDogYWxsLFxuXHRyYWNlOiByYWNlLFxuXHRwZW5kOiBwZW5kLFxuXHRhd2FpdDogQVdBSVRcbn0pO1xuXG52YXIgVGhlbmFibGUgOlJlYWRvbmx5PHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfT4gPSBmcmVlemUgPyAvKiNfX1BVUkVfXyovIGZyZWV6ZShQdWJsaWMpIDogUHVibGljO1xudHlwZSBUaGVuYWJsZSA9IFB1YmxpYztcbmV4cG9ydCB7IFRoZW5hYmxlIH07XG4iXSwibmFtZXMiOlsidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrQkFBZSxPQUFPOzs7OzBCQUFDLHRCQ0doQixJQUFJLE9BQU8sR0FBTSxDQUFDLENBQUM7QUFDMUIsSUFBTyxJQUFJLFNBQVMsR0FBTSxDQUFDLENBQUM7QUFDNUIsSUFBTyxJQUFJLFFBQVEsR0FBTSxDQUFDLENBQUM7QUFFM0IsSUFBTyxJQUFJLFFBQVEsR0FBTSxDQUFDLENBQUM7QUFDM0IsSUFBTyxJQUFJLE9BQU8sR0FBTSxDQUFDLENBQUM7QUFFMUIsSUFBTyxJQUFJLE9BQU8sR0FBd0IsU0FBUyxRQUFRLE1BQWEsQ0FBQztBQUV6RSxhQUFnQixVQUFVLENBQUUsS0FBVTtRQUNyQyxPQUFPLEtBQUssWUFBWSxPQUFPLENBQUM7SUFDakMsQ0FBQztBQUVELElBQU8sSUFBSSxJQUFJLEdBRWQsT0FBTyxPQUFPLEtBQUcsVUFBVTtVQUV4QjtZQUNELElBQUksTUFBTSxHQUFHLGVBQWMsQ0FBQztZQUM1QixNQUFNLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDckMsT0FBTyxTQUFTLElBQUksQ0FBRSxLQUFVO2dCQUMvQixPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLEdBQUcsS0FBSyxZQUFZLE1BQU0sR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDO2FBQzVFLENBQUM7U0FDRixFQUFFO1VBRUQsU0FBUyxJQUFJLENBQUUsS0FBVTtZQUMxQixPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1NBQ3hDLENBQUM7SUFFSixJQUFJLEtBQUssR0FBaUIsSUFBSSxDQUFDO0FBRS9CLGFBQWdCLElBQUksQ0FBRSxRQUFpQixFQUFFLEtBQVUsRUFBRSxNQUFjO1FBQ2xFLElBQUssS0FBSyxFQUFH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QUFNLENBQUMsQ0FBQyxDQUFDO1NBQUU7UUFDNUMsT0FBTyxLQUFLLEVBQUU7WUFDYixJQUFLLFFBQVEsQ0FBQyxPQUFPLEtBQUcsT0FBTyxFQUFHO2dCQUNqQyxRQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDeEIsUUFBUSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7YUFDNUI7U0FDRDtJQUNGLENBQUM7SUFFRCxTQUFTLFFBQVEsQ0FBRSxRQUFpQixFQUFFLEtBQVU7UUFDL0MsSUFBSSxJQUFJLEdBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLElBQUssSUFBSSxLQUFHLFFBQVEsRUFBRztZQUN0QixJQUFJLE1BQU0sR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQ25DLElBQUssTUFBTSxLQUFHLE9BQU8sRUFBRztnQkFDdkIsUUFBUSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Z0JBQzFCLEtBQUssQ0FBQyxXQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ2xDO2lCQUNJO2dCQUNKLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQkFDL0IsUUFBUSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7YUFDMUI7U0FDRDthQUNJLElBQUssS0FBSyxLQUFHLE9BQU8sRUFBRztZQUMzQixRQUFRLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUMxQixNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3hCO2FBQ0k7WUFDSixRQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUN4QixRQUFRLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztTQUM3QjtJQUNGLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUMxREQsTUFBTSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksaUJBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUM7QUFFeEYsQUFDQSxrQkFBZSxPQUFPLENBQUMsTUFBTSxFQUFFO1FBQzlCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLE1BQU0sRUFBRSxNQUFNO1FBQ2QsR0FBRyxFQUFFLEdBQUc7UUFDUixJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxJQUFJO1FBQ1YsS0FBSyxFQUFFLEtBQUs7S0FDWixDQUFDLENBQUM7Ozs7Ozs7OyIsInNvdXJjZVJvb3QiOiIuLi8uLi9zcmMvIn0=