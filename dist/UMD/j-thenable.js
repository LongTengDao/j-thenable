/*!
 * 模块名称：j-thenable
 * 模块功能：模仿 Promise API 的同步防爆栈工具。从属于“简计划”。
   　　　　　Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".
 * 模块版本：3.0.0
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

    var version = '3.0.0';

    var undefined$1 = void 0;

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
                                wait(thenable, value);
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
                                wait(thenable, value);
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
    function wait(thenable, value) {
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

    function resolve(value) {
        if (isPrivate(value)) {
            return value;
        }
        var THIS = new Private;
        try {
            if (isPublic(value)) {
                THIS._on = [];
                wait(THIS, value);
            }
            else {
                THIS._value = value;
                THIS._status = FULFILLED;
            }
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
        try {
            all_try(values, THIS);
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
    function all_try(values, THIS) {
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

    function race(values) {
        var THIS = new Private;
        try {
            race_try(values, THIS);
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
    function race_try(values, THIS) {
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
                            wait(THIS, value);
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
                wait(THIS, _value);
                return;
            }
        }
        THIS._value = _value;
        THIS._status = _status;
    }

    function then(onfulfilled, onrejected) {
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
        if (isPrivate(value)) {
            var status = value._status;
            if (status === PENDING) {
                thenable._on = [];
                value._on.push(thenable);
            }
            else {
                thenable._value = value._value;
                thenable._status = status;
            }
        }
        else if (isPublic(value)) {
            thenable._on = [];
            wait(thenable, value);
        }
        else {
            thenable._value = value;
            thenable._status = FULFILLED;
        }
    }

    var prototype = {
        _status: PENDING,
        _value: undefined$1,
        _on: null,
        _onfulfilled: undefined$1,
        _onrejected: undefined$1,
        then: then
    };

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
        race: race
    });

    return _export;

}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsIl8udHMiLCJyZXNvbHZlLnRzIiwicmVqZWN0LnRzIiwiYWxsLnRzIiwicmFjZS50cyIsIlRoZW5hYmxlLnRzIiwiVGhlbmFibGUucHJvdG90eXBlLnRoZW4udHMiLCJUaGVuYWJsZS5wcm90b3R5cGUudHMiLCJleHBvcnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgJzMuMC4wJzsiLCJpbXBvcnQgdW5kZWZpbmVkIGZyb20gJy51bmRlZmluZWQnO1xuXG5leHBvcnQgdmFyIFBFTkRJTkcgOjAgPSAwO1xuZXhwb3J0IHZhciBGVUxGSUxMRUQgOjEgPSAxO1xuZXhwb3J0IHZhciBSRUpFQ1RFRCA6MiA9IDI7XG5cbmV4cG9ydCB2YXIgUHJpdmF0ZSA6eyBuZXcgKCkgOlByaXZhdGUgfSA9IGZ1bmN0aW9uIFRoZW5hYmxlICgpIHt9IGFzIGFueTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJpdmF0ZSAodmFsdWUgOmFueSkgOnZhbHVlIGlzIFByaXZhdGUge1xuXHRyZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQcml2YXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQdWJsaWMgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyB7IHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOmFueSB9IHtcblx0cmV0dXJuIHZhbHVlIT1udWxsICYmIHR5cGVvZiB2YWx1ZS50aGVuPT09J2Z1bmN0aW9uJztcbn1cblxudmFyIHN0YWNrIDpTdGFjayA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiByICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBzdGFjayApIHtcblx0XHRzdGFjayA9IHsgbmV4dFN0YWNrOiBzdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZvciAoIDsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGlmICggdGhlbmFibGUuX29ucmVqZWN0ZWQgKSB7IHRoZW5hYmxlLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29uZnVsZmlsbGVkO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29uZnVsZmlsbGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUuX29uIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHR3YWl0KHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggdGhlbmFibGUuX3N0YXR1cyE9PVBFTkRJTkcgKSB7IGJyZWFrIHN0YWNrOyB9XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fb25mdWxmaWxsZWQgKSB7IHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfVxuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29ucmVqZWN0ZWQ7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdHdhaXQodGhlbmFibGUsIHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHsgc3RhdHVzID0gRlVMRklMTEVEOyB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fc3RhdHVzIT09UEVORElORyApIHsgYnJlYWsgc3RhY2s7IH1cblx0XHRcdFx0XHRcdHZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBzdGF0dXM7XG5cdFx0XHR2YXIgX29uIDpQcml2YXRlW10gfCBudWxsID0gdGhlbmFibGUuX29uO1xuXHRcdFx0aWYgKCBfb24gKSB7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbiA9IG51bGw7XG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA6bnVtYmVyID0gX29uLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdHN0YWNrID0geyBuZXh0U3RhY2s6IHN0YWNrLCB0aGVuYWJsZTogX29uWy0taW5kZXhdLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCAhc3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBzdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IHN0YWNrLnZhbHVlO1xuXHRcdHN0YXR1cyA9IHN0YWNrLnN0YXR1cztcblx0XHRzdGFjayA9IHN0YWNrLm5leHRTdGFjaztcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd2FpdCAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDp7IHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOmFueSB9KSA6dm9pZCB7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhbHVlLnRoZW4oXG5cdFx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRyKHRoZW5hYmxlLCB2YWx1ZSwgRlVMRklMTEVEKTtcblx0XHR9LFxuXHRcdGZ1bmN0aW9uIG9ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRyKHRoZW5hYmxlLCBlcnJvciwgUkVKRUNURUQpO1xuXHRcdH1cblx0KTtcbn1cblxudHlwZSBTdGFjayA9IHsgbmV4dFN0YWNrIDpTdGFjaywgdGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnksIHN0YXR1cyA6U3RhdHVzIH0gfCBudWxsO1xuXG5leHBvcnQgdHlwZSBQcml2YXRlID0ge1xuXHRfc3RhdHVzIDpTdGF0dXMsXG5cdF92YWx1ZSA6YW55LFxuXHRfb24gOlByaXZhdGVbXSB8IG51bGwsXG5cdF9vbmZ1bGZpbGxlZCA6RnVuY3Rpb24gfCB1bmRlZmluZWQsXG5cdF9vbnJlamVjdGVkIDpGdW5jdGlvbiB8IHVuZGVmaW5lZCxcblx0dGhlbiAob25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHJpdmF0ZSxcbn07XG5cbmV4cG9ydCB0eXBlIFN0YXR1cyA9IDAgfCAxIHwgMjtcblxuZXhwb3J0IHR5cGUgRXhlY3V0b3IgPSAocmVzb2x2ZSA6RnVuY3Rpb24sIHJlamVjdCA6RnVuY3Rpb24pID0+IHZvaWQ7XG5cbmV4cG9ydCB0eXBlIEZ1bmN0aW9uID0gKHZhbHVlIDphbnkpID0+IHZvaWQ7XG4iLCJpbXBvcnQgeyBpc1ByaXZhdGUsIGlzUHVibGljLCB3YWl0LCBGVUxGSUxMRUQsIFJFSkVDVEVELCBQRU5ESU5HLCBQcml2YXRlIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzb2x2ZSAodmFsdWUgOmFueSkgOlB1YmxpYyB7XG5cdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHsgcmV0dXJuIHZhbHVlOyB9XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdHRyeSB7XG5cdFx0aWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0XHRUSElTLl9vbiA9IFtdO1xuXHRcdFx0d2FpdChUSElTLCB2YWx1ZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdFRISVMuX3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHR9XG5cdH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn07XG5cbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7IiwiaW1wb3J0IHsgUkVKRUNURUQsIFByaXZhdGUgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWplY3QgKGVycm9yIDphbnkpIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0cmV0dXJuIFRISVM7XG59O1xuXG5pbXBvcnQgUHVibGljIGZyb20gJy4vVGhlbmFibGUnOyIsImltcG9ydCB1bmRlZmluZWQgZnJvbSAnLnVuZGVmaW5lZCc7XG5cbmltcG9ydCB7IFBFTkRJTkcsIFJFSkVDVEVELCBGVUxGSUxMRUQsIHIsIGlzUHJpdmF0ZSwgaXNQdWJsaWMsIFN0YXR1cywgRnVuY3Rpb24sIFByaXZhdGUgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhbGwgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10pIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHR0cnkgeyBhbGxfdHJ5KHZhbHVlcywgVEhJUyk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0VEhJUy5fb24gPSBudWxsO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn07XG5cbmZ1bmN0aW9uIGFsbF90cnkgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10sIFRISVMgOlByaXZhdGUpIDp2b2lkIHtcblx0VEhJUy5fb24gPSBbXTtcblx0ZnVuY3Rpb24gX29ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHsgVEhJUy5fc3RhdHVzPT09UEVORElORyAmJiByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0dmFyIF92YWx1ZSA6YW55W10gPSBbXTtcblx0dmFyIGNvdW50IDpudW1iZXIgPSAwO1xuXHR2YXIgY291bnRlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0Zm9yICggdmFyIGxlbmd0aCA6bnVtYmVyID0gdmFsdWVzLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHR2YXIgdmFsdWUgOmFueSA9IHZhbHVlc1tpbmRleF07XG5cdFx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHQrK2NvdW50O1xuXHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR2YWx1ZS5fb24hLnB1c2goe1xuXHRcdFx0XHRcdF9zdGF0dXM6IDAsXG5cdFx0XHRcdFx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdFx0XHRcdFx0X29uOiBudWxsLFxuXHRcdFx0XHRcdF9vbmZ1bGZpbGxlZDogZnVuY3Rpb24gKGluZGV4IDpudW1iZXIpIDpGdW5jdGlvbiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoICEtLWNvdW50ICYmIGNvdW50ZWQgKSB7IHIoVEhJUywgX3ZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fShpbmRleCksXG5cdFx0XHRcdFx0X29ucmVqZWN0ZWQ6IF9vbnJlamVjdGVkXG5cdFx0XHRcdH0gYXMgUHJpdmF0ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICggX3N0YXR1cz09PVJFSkVDVEVEICkge1xuXHRcdFx0XHRUSElTLl92YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSB2YWx1ZS5fdmFsdWU7IH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGlzUHVibGljKHZhbHVlKSApIHtcblx0XHRcdCsrY291bnQ7XG5cdFx0XHRfdmFsdWVbaW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdFx0dmFsdWUudGhlbihcblx0XHRcdFx0ZnVuY3Rpb24gKGluZGV4IDpudW1iZXIpIDpGdW5jdGlvbiB7XG5cdFx0XHRcdFx0dmFyIHJlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0aWYgKCAhLS1jb3VudCAmJiBjb3VudGVkICkgeyByKFRISVMsIF92YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0oaW5kZXgpLFxuXHRcdFx0XHRfb25yZWplY3RlZFxuXHRcdFx0KTtcblx0XHR9XG5cdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSB2YWx1ZTsgfVxuXHR9XG5cdGNvdW50ZWQgPSB0cnVlO1xuXHRpZiAoICFjb3VudCAmJiBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFRISVMuX3ZhbHVlID0gX3ZhbHVlO1xuXHRcdFRISVMuX3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHRUSElTLl9vbiA9IG51bGw7XG5cdH1cbn1cblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgdW5kZWZpbmVkIGZyb20gJy51bmRlZmluZWQnO1xuXG5pbXBvcnQgeyByLCBQRU5ESU5HLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBTdGF0dXMsIGlzUHJpdmF0ZSwgaXNQdWJsaWMsIFByaXZhdGUgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByYWNlICh2YWx1ZXMgOnJlYWRvbmx5IGFueVtdKSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0dHJ5IHsgcmFjZV90cnkodmFsdWVzLCBUSElTKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRUSElTLl9vbiA9IG51bGw7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufTtcblxuZnVuY3Rpb24gcmFjZV90cnkgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10sIFRISVMgOlByaXZhdGUpIDp2b2lkIHtcblx0VEhJUy5fb24gPSBbXTtcblx0ZnVuY3Rpb24gX29uZnVsZmlsbGVkICh2YWx1ZSA6YW55KSA6dm9pZCB7IFRISVMuX3N0YXR1cz09PVBFTkRJTkcgJiYgcihUSElTLCB2YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRmdW5jdGlvbiBfb25yZWplY3RlZCAoZXJyb3IgOmFueSkgOnZvaWQgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIHIoVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR2YXIgdGhhdCA6UHJpdmF0ZSA9IHtcblx0XHRfc3RhdHVzOiAwLFxuXHRcdF92YWx1ZTogdW5kZWZpbmVkLFxuXHRcdF9vbjogbnVsbCxcblx0XHRfb25mdWxmaWxsZWQ6IF9vbmZ1bGZpbGxlZCxcblx0XHRfb25yZWplY3RlZDogX29ucmVqZWN0ZWRcblx0fSBhcyBQcml2YXRlO1xuXHRmb3IgKCB2YXIgbGVuZ3RoIDpudW1iZXIgPSB2YWx1ZXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdHZhciB2YWx1ZSA6YW55ID0gdmFsdWVzW2luZGV4XTtcblx0XHRpZiAoIGlzUHJpdmF0ZSh2YWx1ZSkgKSB7XG5cdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7IHZhbHVlLl9vbiEucHVzaCh0aGF0KTsgfVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGlzUHVibGljKHZhbHVlKSApIHtcblx0XHRcdHZhbHVlLnRoZW4oX29uZnVsZmlsbGVkLCBfb25yZWplY3RlZCk7XG5cdFx0XHRpZiAoIFRISVMuX3N0YXR1cyE9PVBFTkRJTkcgKSB7IGJyZWFrOyB9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdFRISVMuX3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxufVxuXG5pbXBvcnQgUHVibGljIGZyb20gJy4vVGhlbmFibGUnOyIsImltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5cbmltcG9ydCB7IFN0YXR1cywgUEVORElORywgRlVMRklMTEVELCBSRUpFQ1RFRCwgaXNQcml2YXRlLCBpc1B1YmxpYywgciwgd2FpdCwgRnVuY3Rpb24sIFByaXZhdGUsIEV4ZWN1dG9yIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IHsgUHVibGljIGFzIGRlZmF1bHQgfTtcblxudHlwZSBQdWJsaWMgPSBSZWFkb25seTxvYmplY3QgJiB7XG5cdHRoZW4gKHRoaXMgOlB1YmxpYywgb25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHVibGljLFxufT47XG5cbnZhciBQdWJsaWMgOnsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfSA9IGZ1bmN0aW9uIFRoZW5hYmxlICh0aGlzIDpQcml2YXRlLCBleGVjdXRvciA6RXhlY3V0b3IpIDp2b2lkIHtcblx0aWYgKCB0eXBlb2YgZXhlY3V0b3IhPT0nZnVuY3Rpb24nICkgeyB0aHJvdyBUeXBlRXJyb3IoJ1RoZW5hYmxlIGV4ZWN1dG9yIGlzIG5vdCBhIGZ1bmN0aW9uJyk7IH1cblx0dmFyIGV4ZWN1dGVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHR2YXIgcmVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHR2YXIgX3ZhbHVlIDphbnk7XG5cdHZhciBfc3RhdHVzIDpTdGF0dXMgfCB1bmRlZmluZWQ7XG5cdHZhciBUSElTIDpQcml2YXRlID0gdGhpcztcblx0dHJ5IHtcblx0XHRleGVjdXRvcihcblx0XHRcdGZ1bmN0aW9uIHJlc29sdmUgKHZhbHVlIDphbnkpIHtcblx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoIGV4ZWN1dGVkICkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRpZiAoIGlzUHJpdmF0ZSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdF9zdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkgeyB2YWx1ZS5fb24hLnB1c2goVEhJUyk7IH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7IHIoVEhJUywgdmFsdWUuX3ZhbHVlLCBfc3RhdHVzISk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7IHdhaXQoVEhJUywgdmFsdWUpOyB9XG5cdFx0XHRcdFx0XHRlbHNlIHsgcihUSElTLCB2YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHsgaWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkgeyByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH0gfVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdF92YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdF9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiByZWplY3QgKGVycm9yIDphbnkpIHtcblx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoIGV4ZWN1dGVkICkgeyByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0X3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0X3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0XHRpZiAoICFyZWQgKSB7XG5cdFx0XHRleGVjdXRlZCA9IHRydWU7XG5cdFx0XHRUSElTLl9vbiA9IFtdO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoICFyZWQgKSB7XG5cdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHR0cnkgeyByRWQoVEhJUywgX3N0YXR1cywgX3ZhbHVlKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRUSElTLl9vbiA9IG51bGw7XG5cdFx0fVxuXHR9XG59IGFzIGFueTtcblxuZnVuY3Rpb24gckVkIChUSElTIDpQcml2YXRlLCBfc3RhdHVzIDpTdGF0dXMgfCB1bmRlZmluZWQsIF92YWx1ZSA6YW55KSA6dm9pZCB7XG5cdGlmICggX3N0YXR1cz09PUZVTEZJTExFRCApIHtcblx0XHRpZiAoIGlzUHJpdmF0ZShfdmFsdWUpICkge1xuXHRcdFx0X3N0YXR1cyA9IF92YWx1ZS5fc3RhdHVzO1xuXHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0VEhJUy5fb24gPSBbXTtcblx0XHRcdFx0X3ZhbHVlLl9vbiEucHVzaChUSElTKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRUSElTLl92YWx1ZSA9IF92YWx1ZS5fdmFsdWU7XG5cdFx0XHRcdFRISVMuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICggaXNQdWJsaWMoX3ZhbHVlKSApIHtcblx0XHRcdFRISVMuX29uID0gW107XG5cdFx0XHR3YWl0KFRISVMsIF92YWx1ZSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cdFRISVMuX3ZhbHVlID0gX3ZhbHVlO1xuXHRUSElTLl9zdGF0dXMgPSBfc3RhdHVzITtcbn1cbiIsImltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5cbmltcG9ydCB7IFBFTkRJTkcsIFJFSkVDVEVELCBGVUxGSUxMRUQsIEZ1bmN0aW9uLCBQcml2YXRlLCBpc1ByaXZhdGUsIFN0YXR1cywgaXNQdWJsaWMsIHdhaXQgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0aGVuICh0aGlzIDpQcml2YXRlLCBvbmZ1bGZpbGxlZD8gOkZ1bmN0aW9uLCBvbnJlamVjdGVkPyA6RnVuY3Rpb24pIDpQcml2YXRlIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHR2YXIgdGhlbmFibGUgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0c3dpdGNoICggVEhJUy5fc3RhdHVzICkge1xuXHRcdGNhc2UgUEVORElORzpcblx0XHRcdHRoZW5hYmxlLl9vbiA9IFtdO1xuXHRcdFx0dGhlbmFibGUuX29uZnVsZmlsbGVkID0gb25mdWxmaWxsZWQ7XG5cdFx0XHR0aGVuYWJsZS5fb25yZWplY3RlZCA9IG9ucmVqZWN0ZWQ7XG5cdFx0XHRUSElTLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0Y2FzZSBGVUxGSUxMRUQ6XG5cdFx0XHRpZiAoIHR5cGVvZiBvbmZ1bGZpbGxlZD09PSdmdW5jdGlvbicgKSB7IG9udG8oVEhJUywgb25mdWxmaWxsZWQsIHRoZW5hYmxlKTsgfVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IFRISVMuX3ZhbHVlO1xuXHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdGNhc2UgUkVKRUNURUQ6XG5cdFx0XHRpZiAoIHR5cGVvZiBvbnJlamVjdGVkPT09J2Z1bmN0aW9uJyApIHsgb250byhUSElTLCBvbnJlamVjdGVkLCB0aGVuYWJsZSk7IH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHR9XG5cdHRocm93IFR5cGVFcnJvcignTWV0aG9kIFRoZW5hYmxlLnByb3RvdHlwZS50aGVuIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgcmVjZWl2ZXInKTtcbn07XG5cbmZ1bmN0aW9uIG9udG8gKFRISVMgOlByaXZhdGUsIG9uIDpGdW5jdGlvbiwgdGhlbmFibGUgOlByaXZhdGUpIHtcblx0dHJ5IHsgb250b190cnkodGhlbmFibGUsIG9uKFRISVMuX3ZhbHVlKSk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCB0aGVuYWJsZS5fc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBvbnRvX3RyeSAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnkpIDp2b2lkIHtcblx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdHZhciBzdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0aWYgKCBzdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0dGhlbmFibGUuX29uID0gW107XG5cdFx0XHR2YWx1ZS5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBzdGF0dXM7XG5cdFx0fVxuXHR9XG5cdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0dGhlbmFibGUuX29uID0gW107XG5cdFx0d2FpdCh0aGVuYWJsZSwgdmFsdWUpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHRoZW5hYmxlLl92YWx1ZSA9IHZhbHVlO1xuXHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdH1cbn1cbiIsImltcG9ydCB1bmRlZmluZWQgZnJvbSAnLnVuZGVmaW5lZCc7XG5cbmltcG9ydCB7IFBFTkRJTkcgfSBmcm9tICcuL18nO1xuaW1wb3J0IHRoZW4gZnJvbSAnLi9UaGVuYWJsZS5wcm90b3R5cGUudGhlbic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0X3N0YXR1czogUEVORElORyxcblx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdF9vbjogbnVsbCxcblx0X29uZnVsZmlsbGVkOiB1bmRlZmluZWQsXG5cdF9vbnJlamVjdGVkOiB1bmRlZmluZWQsXG5cdHRoZW46IHRoZW5cbn07XG4iLCJpbXBvcnQgc2VhbCBmcm9tICcuT2JqZWN0LnNlYWwnO1xuaW1wb3J0IGZyZWV6ZSBmcm9tICcuT2JqZWN0LmZyZWV6ZSc7XG5cbmltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IHJlc29sdmUgZnJvbSAnLi9yZXNvbHZlJztcbmltcG9ydCByZWplY3QgZnJvbSAnLi9yZWplY3QnO1xuaW1wb3J0IGFsbCBmcm9tICcuL2FsbCc7XG5pbXBvcnQgcmFjZSBmcm9tICcuL3JhY2UnO1xuZXhwb3J0IHtcblx0cmVzb2x2ZSxcblx0cmVqZWN0LFxuXHRhbGwsXG5cdHJhY2UsXG59O1xuXG5pbXBvcnQgeyBQcml2YXRlLCBFeGVjdXRvciB9IGZyb20gJy4vXyc7XG5pbXBvcnQgUHVibGljIGZyb20gJy4vVGhlbmFibGUnO1xuaW1wb3J0IHByb3RvdHlwZSBmcm9tICcuL1RoZW5hYmxlLnByb3RvdHlwZSc7XG5QdWJsaWMucHJvdG90eXBlID0gUHJpdmF0ZS5wcm90b3R5cGUgPSBzZWFsID8gLyojX19QVVJFX18qLyBzZWFsKHByb3RvdHlwZSkgOiBwcm90b3R5cGU7XG5cbmltcG9ydCBEZWZhdWx0IGZyb20gJy5kZWZhdWx0Pz0nO1xuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdChQdWJsaWMsIHtcblx0dmVyc2lvbjogdmVyc2lvbixcblx0VGhlbmFibGU6IFB1YmxpYyxcblx0cmVzb2x2ZTogcmVzb2x2ZSxcblx0cmVqZWN0OiByZWplY3QsXG5cdGFsbDogYWxsLFxuXHRyYWNlOiByYWNlXG59KTtcblxudmFyIFRoZW5hYmxlIDpSZWFkb25seTx7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0+ID0gZnJlZXplID8gLyojX19QVVJFX18qLyBmcmVlemUoUHVibGljKSA6IFB1YmxpYztcbnR5cGUgVGhlbmFibGUgPSBQdWJsaWM7XG5leHBvcnQgeyBUaGVuYWJsZSB9O1xuIl0sIm5hbWVzIjpbInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0JBQWUsT0FBTzs7OzswQkFBQyx0QkNFaEIsSUFBSSxPQUFPLEdBQU0sQ0FBQyxDQUFDO0FBQzFCLElBQU8sSUFBSSxTQUFTLEdBQU0sQ0FBQyxDQUFDO0FBQzVCLElBQU8sSUFBSSxRQUFRLEdBQU0sQ0FBQyxDQUFDO0FBRTNCLElBQU8sSUFBSSxPQUFPLEdBQXdCLFNBQVMsUUFBUSxNQUFhLENBQUM7QUFFekUsYUFBZ0IsU0FBUyxDQUFFLEtBQVU7UUFDcEMsT0FBTyxLQUFLLFlBQVksT0FBTyxDQUFDO0lBQ2pDLENBQUM7QUFFRCxhQUFnQixRQUFRLENBQUUsS0FBVTtRQUNuQyxPQUFPLEtBQUssSUFBRSxJQUFJLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFHLFVBQVUsQ0FBQztJQUN0RCxDQUFDO0lBRUQsSUFBSSxLQUFLLEdBQVUsSUFBSSxDQUFDO0FBRXhCLGFBQWdC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