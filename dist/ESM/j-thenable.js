﻿/*!
 * 模块名称：j-thenable
 * 模块功能：模仿 Promise API 的同步防爆栈工具。从属于“简计划”。
   　　　　　Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".
 * 模块版本：1.0.0
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-thenable/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-thenable/
 */

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
var Thenable = freeze
    ? /*#__PURE__*/ function () {
        freeze(Public.prototype);
        freeze(Public);
        return Public;
    }()
    : Public;

export default _export;
export { Thenable, all, isThenable, race, reject, resolve, version };

/*¡ j-thenable */

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMS4wLjAnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IGZyZWV6ZSBmcm9tICcuT2JqZWN0LmZyZWV6ZSc7XG5pbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxudmFyIFBFTkRJTkcgOjAgPSAwO1xudmFyIEZVTEZJTExFRCA6MSA9IDE7XG52YXIgUkVKRUNURUQgOjIgPSAyO1xudHlwZSBTdGF0dXMgPSAwIHwgMSB8IDI7XG5cbnZhciBQcml2YXRlID0gZnVuY3Rpb24gVGhlbmFibGUgKCkge30gYXMgdW5rbm93biBhcyB7IG5ldyAoKSA6UHJpdmF0ZSB9O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNUaGVuYWJsZSAodmFsdWUgOmFueSkgOnZhbHVlIGlzIFB1YmxpYyB7XG5cdHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFByaXZhdGU7XG59XG5cbmZ1bmN0aW9uIHQgKHRoZW5hYmxlIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdGlmICggKCBpc1RoZW5hYmxlIGFzICh2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlICkodmFsdWUpICkge1xuXHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRcdHZhbHVlLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0fVxuXHR9XG5cdGVsc2Uge1xuXHRcdHRoZW5hYmxlLl92YWx1ZSA9IHZhbHVlO1xuXHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdH1cbn1cblxudHlwZSBTdGFjayA9IHsgbmV4dFN0YWNrIDpTdGFjaywgdGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnksIHN0YXR1cyA6U3RhdHVzIH0gfCBudWxsO1xudmFyIHN0YWNrIDpTdGFjayA9IG51bGw7XG5mdW5jdGlvbiByICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBzdGFjayApIHtcblx0XHRzdGFjayA9IHsgbmV4dFN0YWNrOiBzdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZvciAoIDsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGlmICggdGhlbmFibGUuX29ucmVqZWN0ZWQgKSB7IHRoZW5hYmxlLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29uZnVsZmlsbGVkO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29uZnVsZmlsbGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggKCBpc1RoZW5hYmxlIGFzICh2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlICkodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fb25mdWxmaWxsZWQgKSB7IHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfVxuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29ucmVqZWN0ZWQ7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCAoIGlzVGhlbmFibGUgYXMgKHZhbHVlIDphbnkpID0+IHZhbHVlIGlzIFByaXZhdGUgKSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0c3RhdHVzID0gX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7IHN0YXR1cyA9IEZVTEZJTExFRDsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHsgdmFsdWUgPSBlcnJvcjsgfVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBzdGF0dXM7XG5cdFx0XHR2YXIgX29uIDpQcml2YXRlW10gfCBudWxsID0gdGhlbmFibGUuX29uO1xuXHRcdFx0aWYgKCBfb24gKSB7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbiA9IG51bGw7XG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA6bnVtYmVyID0gX29uLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdHN0YWNrID0geyBuZXh0U3RhY2s6IHN0YWNrLCB0aGVuYWJsZTogX29uWy0taW5kZXhdLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCAhc3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBzdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IHN0YWNrLnZhbHVlO1xuXHRcdHN0YXR1cyA9IHN0YWNrLnN0YXR1cztcblx0XHRzdGFjayA9IHN0YWNrLm5leHRTdGFjaztcblx0fVxufVxuXG52YXIgUHVibGljIDp7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0gPSBmdW5jdGlvbiBUaGVuYWJsZSAodGhpcyA6UHJpdmF0ZSwgZXhlY3V0b3IgOkV4ZWN1dG9yKSA6dm9pZCB7XG5cdGlmICggdHlwZW9mIGV4ZWN1dG9yIT09J2Z1bmN0aW9uJyApIHsgdGhyb3cgVHlwZUVycm9yKCdUaGVuYWJsZSBleGVjdXRvciBpcyBub3QgYSBmdW5jdGlvbicpOyB9XG5cdHRoaXMuX29uID0gW107XG5cdHRyeSB7XG5cdFx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHRcdGV4ZWN1dG9yKFxuXHRcdFx0ZnVuY3Rpb24gcmVzb2x2ZSAodmFsdWUgOmFueSkge1xuXHRcdFx0XHRpZiAoICggaXNUaGVuYWJsZSBhcyAodmFsdWUgOmFueSkgPT4gdmFsdWUgaXMgUHJpdmF0ZSApKHZhbHVlKSApIHtcblx0XHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkgeyB2YWx1ZS5fb24hLnB1c2goVEhJUyk7IH1cblx0XHRcdFx0XHRlbHNlIHsgcihUSElTLCB2YWx1ZS5fdmFsdWUsIF9zdGF0dXMpOyB9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7IHIoVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiByZWplY3QgKGVycm9yIDphbnkpIHsgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdFx0KTtcblx0fVxuXHRjYXRjaCAoZXJyb3IpIHsgcih0aGlzLCBlcnJvciwgUkVKRUNURUQpOyB9XG59IGFzIHVua25vd24gYXMgeyBuZXcgKGV4ZWN1dG9yIDpFeGVjdXRvcikgOlB1YmxpYyB9O1xuXG5Qcml2YXRlLnByb3RvdHlwZSA9IFB1YmxpYy5wcm90b3R5cGUgPSB7XG5cdF9zdGF0dXM6IFBFTkRJTkcsXG5cdF92YWx1ZTogdW5kZWZpbmVkLFxuXHRfb246IG51bGwsXG5cdF9vbmZ1bGZpbGxlZDogdW5kZWZpbmVkLFxuXHRfb25yZWplY3RlZDogdW5kZWZpbmVkLFxuXHR0aGVuOiBmdW5jdGlvbiB0aGVuICh0aGlzIDpQcml2YXRlLCBvbmZ1bGZpbGxlZD8gOkZ1bmN0aW9uLCBvbnJlamVjdGVkPyA6RnVuY3Rpb24pIDpQcml2YXRlIHtcblx0XHR2YXIgVEhJUyA6UHJpdmF0ZSA9IHRoaXM7XG5cdFx0dmFyIHRoZW5hYmxlIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFx0c3dpdGNoICggVEhJUy5fc3RhdHVzICkge1xuXHRcdFx0Y2FzZSBQRU5ESU5HOlxuXHRcdFx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRcdFx0dGhlbmFibGUuX29uZnVsZmlsbGVkID0gb25mdWxmaWxsZWQ7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbnJlamVjdGVkID0gb25yZWplY3RlZDtcblx0XHRcdFx0VEhJUy5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0XHRjYXNlIEZVTEZJTExFRDpcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25mdWxmaWxsZWQ9PT0nZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdHRyeSB7IHQodGhlbmFibGUsIG9uZnVsZmlsbGVkKFRISVMuX3ZhbHVlKSk7IH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0XHRcdGNhc2UgUkVKRUNURUQ6XG5cdFx0XHRcdGlmICggdHlwZW9mIG9ucmVqZWN0ZWQ9PT0nZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdHRyeSB7IHQodGhlbmFibGUsIG9ucmVqZWN0ZWQoVEhJUy5fdmFsdWUpKTsgfVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IFRISVMuX3ZhbHVlO1xuXHRcdFx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0fVxuXHRcdHRocm93IFR5cGVFcnJvcignTWV0aG9kIFRoZW5hYmxlLnByb3RvdHlwZS50aGVuIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgcmVjZWl2ZXInKTtcblx0fVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmUgKHZhbHVlIDphbnkpIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHR0KFRISVMsIHZhbHVlKTtcblx0cmV0dXJuIFRISVM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWplY3QgKGVycm9yIDphbnkpIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0cmV0dXJuIFRISVM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGwgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10pIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRUSElTLl9vbiA9IFtdO1xuXHR2YXIgX3ZhbHVlIDphbnlbXSA9IFtdO1xuXHR2YXIgY291bnQgOm51bWJlciA9IDA7XG5cdGZ1bmN0aW9uIF9vbnJlamVjdGVkIChlcnJvciA6YW55KSA6dm9pZCB7IFRISVMuX3N0YXR1cz09PVBFTkRJTkcgJiYgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdGZvciAoIHZhciBsZW5ndGggOm51bWJlciA9IHZhbHVlcy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0dmFyIHZhbHVlIDphbnkgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdGlmICggKCBpc1RoZW5hYmxlIGFzICh2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlICkodmFsdWUpICkge1xuXHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHQrK2NvdW50O1xuXHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR2YWx1ZS5fb24hLnB1c2goe1xuXHRcdFx0XHRcdF9vbmZ1bGZpbGxlZDogZnVuY3Rpb24gKGluZGV4IDpudW1iZXIpIDpGdW5jdGlvbiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIGNvdW50PjEgKSB7IC0tY291bnQ7IH1cblx0XHRcdFx0XHRcdFx0XHRlbHNlIHsgcihUSElTLCBfdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KGluZGV4KSxcblx0XHRcdFx0XHRfb25yZWplY3RlZDogX29ucmVqZWN0ZWRcblx0XHRcdFx0fSBhcyBQcml2YXRlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBfc3RhdHVzPT09UkVKRUNURUQgKSB7XG5cdFx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHsgX3ZhbHVlW2luZGV4XSA9IHZhbHVlLl92YWx1ZTsgfVxuXHRcdH1cblx0XHRlbHNlIHsgX3ZhbHVlW2luZGV4XSA9IHZhbHVlOyB9XG5cdH1cblx0cmV0dXJuIFRISVM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYWNlICh2YWx1ZXMgOnJlYWRvbmx5IGFueVtdKSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0VEhJUy5fb24gPSBbXTtcblx0dmFyIHRoYXQgOlByaXZhdGUgPSB7XG5cdFx0X29uZnVsZmlsbGVkOiBmdW5jdGlvbiAodmFsdWUgOmFueSkgOnZvaWQgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIHIoVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH0sXG5cdFx0X29ucmVqZWN0ZWQ6IGZ1bmN0aW9uIChlcnJvciA6YW55KSA6dm9pZCB7IFRISVMuX3N0YXR1cz09PVBFTkRJTkcgJiYgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdH0gYXMgUHJpdmF0ZTtcblx0Zm9yICggdmFyIGxlbmd0aCA6bnVtYmVyID0gdmFsdWVzLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHR2YXIgdmFsdWUgOmFueSA9IHZhbHVlc1tpbmRleF07XG5cdFx0aWYgKCAoIGlzVGhlbmFibGUgYXMgKHZhbHVlIDphbnkpID0+IHZhbHVlIGlzIFByaXZhdGUgKSh2YWx1ZSkgKSB7XG5cdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7IHZhbHVlLl9vbiEucHVzaCh0aGF0KTsgfVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IHZhbHVlO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufVxuXG5pbXBvcnQgRGVmYXVsdCBmcm9tICcuZGVmYXVsdD89JztcbmV4cG9ydCBkZWZhdWx0IERlZmF1bHQoUHVibGljLCB7XG5cdHZlcnNpb246IHZlcnNpb24sXG5cdFRoZW5hYmxlOiBQdWJsaWMsXG5cdGlzVGhlbmFibGU6IGlzVGhlbmFibGUsXG5cdHJlc29sdmU6IHJlc29sdmUsXG5cdHJlamVjdDogcmVqZWN0LFxuXHRhbGw6IGFsbCxcblx0cmFjZTogcmFjZVxufSk7XG5cbmV4cG9ydCB2YXIgVGhlbmFibGUgOlJlYWRvbmx5PHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfT4gPSBmcmVlemVcblx0PyAvKiNfX1BVUkVfXyovIGZ1bmN0aW9uICgpIHtcblx0XHRmcmVlemUoUHVibGljLnByb3RvdHlwZSk7XG5cdFx0ZnJlZXplKFB1YmxpYyk7XG5cdFx0cmV0dXJuIFB1YmxpYztcblx0fSgpXG5cdDogUHVibGljO1xuXG50eXBlIEZ1bmN0aW9uID0gKHZhbHVlIDphbnkpID0+IHZvaWQ7XG50eXBlIEV4ZWN1dG9yID0gKHJlc29sdmUgOkZ1bmN0aW9uLCByZWplY3QgOkZ1bmN0aW9uKSA9PiB2b2lkO1xudHlwZSBQcml2YXRlID0ge1xuXHRfc3RhdHVzIDpTdGF0dXMsXG5cdF92YWx1ZSA6YW55LFxuXHRfb24gOlByaXZhdGVbXSB8IG51bGwsXG5cdF9vbmZ1bGZpbGxlZCA6RnVuY3Rpb24gfCB1bmRlZmluZWQsXG5cdF9vbnJlamVjdGVkIDpGdW5jdGlvbiB8IHVuZGVmaW5lZCxcblx0dGhlbiAob25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHJpdmF0ZSxcbn07XG50eXBlIFB1YmxpYyA9IFJlYWRvbmx5PG9iamVjdCAmIHtcblx0dGhlbiAodGhpcyA6UHVibGljLCBvbmZ1bGZpbGxlZD8gOkZ1bmN0aW9uLCBvbnJlamVjdGVkPyA6RnVuY3Rpb24pIDpQdWJsaWMsXG59PjsiXSwibmFtZXMiOlsidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLGNBQWUsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFBQyx0QkNPdkIsSUFBSSxPQUFPLEdBQU0sQ0FBQyxDQUFDO0FBQ25CLElBQUksU0FBUyxHQUFNLENBQUMsQ0FBQztBQUNyQixJQUFJLFFBQVEsR0FBTSxDQUFDLENBQUM7QUFHcEIsSUFBSSxPQUFPLEdBQUcsU0FBUyxRQUFRLE1BQXdDLENBQUM7QUFFeEUsU0FBZ0IsVUFBVSxDQUFFLEtBQVU7SUFDckMsT0FBTyxLQUFLLFlBQVksT0FBTyxDQUFDO0NBQ2hDO0FBRUQsU0FBUyxDQUFDLENBQUUsUUFBaUIsRUFBRSxLQUFVO0lBQ3hDLElBQU8sVUFBZ0QsQ0FBQyxLQUFLLENBQUMsRUFBRztRQUNoRSxJQUFJLE9BQU8sR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3BDLElBQUssT0FBTyxLQUFHLE9BQU8sRUFBRztZQUN4QixRQUFRLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNsQixLQUFLLENBQUMsR0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMxQjthQUNJO1lBQ0osUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQy9CLFFBQVEsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQzNCO0tBQ0Q7U0FDSTtRQUNKLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLFFBQVEsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0tBQzdCO0NBQ0Q7QUFHRCxJQUFJLEtBQUssR0FBVSxJQUFJLENBQUM7QUFDeEIsU0FB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