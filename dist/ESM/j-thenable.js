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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMS4wLjEnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IGZyZWV6ZSBmcm9tICcuT2JqZWN0LmZyZWV6ZSc7XG5pbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxudmFyIFBFTkRJTkcgOjAgPSAwO1xudmFyIEZVTEZJTExFRCA6MSA9IDE7XG52YXIgUkVKRUNURUQgOjIgPSAyO1xudHlwZSBTdGF0dXMgPSAwIHwgMSB8IDI7XG5cbnZhciBQcml2YXRlID0gZnVuY3Rpb24gVGhlbmFibGUgKCkge30gYXMgdW5rbm93biBhcyB7IG5ldyAoKSA6UHJpdmF0ZSB9O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNUaGVuYWJsZSAodmFsdWUgOmFueSkgOnZhbHVlIGlzIFB1YmxpYyB7XG5cdHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFByaXZhdGU7XG59XG5cbmZ1bmN0aW9uIHQgKHRoZW5hYmxlIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdGlmICggKCBpc1RoZW5hYmxlIGFzICh2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlICkodmFsdWUpICkge1xuXHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRcdHZhbHVlLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0fVxuXHR9XG5cdGVsc2Uge1xuXHRcdHRoZW5hYmxlLl92YWx1ZSA9IHZhbHVlO1xuXHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdH1cbn1cblxudHlwZSBTdGFjayA9IHsgbmV4dFN0YWNrIDpTdGFjaywgdGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnksIHN0YXR1cyA6U3RhdHVzIH0gfCBudWxsO1xudmFyIHN0YWNrIDpTdGFjayA9IG51bGw7XG5mdW5jdGlvbiByICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBzdGFjayApIHtcblx0XHRzdGFjayA9IHsgbmV4dFN0YWNrOiBzdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZvciAoIDsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGlmICggdGhlbmFibGUuX29ucmVqZWN0ZWQgKSB7IHRoZW5hYmxlLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29uZnVsZmlsbGVkO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29uZnVsZmlsbGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggKCBpc1RoZW5hYmxlIGFzICh2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlICkodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fb25mdWxmaWxsZWQgKSB7IHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfVxuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29ucmVqZWN0ZWQ7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCAoIGlzVGhlbmFibGUgYXMgKHZhbHVlIDphbnkpID0+IHZhbHVlIGlzIFByaXZhdGUgKSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0c3RhdHVzID0gX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7IHN0YXR1cyA9IEZVTEZJTExFRDsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHsgdmFsdWUgPSBlcnJvcjsgfVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBzdGF0dXM7XG5cdFx0XHR2YXIgX29uIDpQcml2YXRlW10gfCBudWxsID0gdGhlbmFibGUuX29uO1xuXHRcdFx0aWYgKCBfb24gKSB7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbiA9IG51bGw7XG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA6bnVtYmVyID0gX29uLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdHN0YWNrID0geyBuZXh0U3RhY2s6IHN0YWNrLCB0aGVuYWJsZTogX29uWy0taW5kZXhdLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCAhc3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBzdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IHN0YWNrLnZhbHVlO1xuXHRcdHN0YXR1cyA9IHN0YWNrLnN0YXR1cztcblx0XHRzdGFjayA9IHN0YWNrLm5leHRTdGFjaztcblx0fVxufVxuXG52YXIgUHVibGljIDp7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0gPSBmdW5jdGlvbiBUaGVuYWJsZSAodGhpcyA6UHJpdmF0ZSwgZXhlY3V0b3IgOkV4ZWN1dG9yKSA6dm9pZCB7XG5cdGlmICggdHlwZW9mIGV4ZWN1dG9yIT09J2Z1bmN0aW9uJyApIHsgdGhyb3cgVHlwZUVycm9yKCdUaGVuYWJsZSBleGVjdXRvciBpcyBub3QgYSBmdW5jdGlvbicpOyB9XG5cdHZhciBleGVjdXRlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFyIHJlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFyIF92YWx1ZSA6YW55O1xuXHR2YXIgX3N0YXR1cyA6U3RhdHVzIHwgdW5kZWZpbmVkO1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IHRoaXM7XG5cdFRISVMuX29uID0gW107XG5cdHRyeSB7XG5cdFx0ZXhlY3V0b3IoXG5cdFx0XHRmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSB7XG5cdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCBleGVjdXRlZCApIHtcblx0XHRcdFx0XHRpZiAoICggaXNUaGVuYWJsZSBhcyAodmFsdWUgOmFueSkgPT4gdmFsdWUgaXMgUHJpdmF0ZSApKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdF9zdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgdmFsdWUuX29uIS5wdXNoKFRISVMpOyB9XG5cdFx0XHRcdFx0XHRlbHNlIHsgcihUSElTLCB2YWx1ZS5fdmFsdWUsIF9zdGF0dXMpOyB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgeyByKFRISVMsIHZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0X3ZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdFx0X3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uIHJlamVjdCAoZXJyb3IgOmFueSkge1xuXHRcdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdGlmICggZXhlY3V0ZWQgKSB7IHIoVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRfdmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRfc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHRcdGlmICggIXJlZCApIHtcblx0XHRcdGV4ZWN1dGVkID0gdHJ1ZTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCAhcmVkICkge1xuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFRISVMuX3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFRISVMuX29uID0gbnVsbDtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0aWYgKCBfc3RhdHVzPT09RlVMRklMTEVEICYmICggaXNUaGVuYWJsZSBhcyAodmFsdWUgOmFueSkgPT4gdmFsdWUgaXMgUHJpdmF0ZSApKF92YWx1ZSkgKSB7XG5cdFx0X3N0YXR1cyA9IF92YWx1ZS5fc3RhdHVzO1xuXHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRfdmFsdWUuX29uIS5wdXNoKFRISVMpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRfdmFsdWUgPSBfdmFsdWUuX3ZhbHVlO1xuXHR9XG5cdFRISVMuX3ZhbHVlID0gX3ZhbHVlO1xuXHRUSElTLl9zdGF0dXMgPSBfc3RhdHVzITtcblx0VEhJUy5fb24gPSBudWxsO1xufSBhcyB1bmtub3duIGFzIHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfTtcblxuUHJpdmF0ZS5wcm90b3R5cGUgPSBQdWJsaWMucHJvdG90eXBlID0ge1xuXHRfc3RhdHVzOiBQRU5ESU5HLFxuXHRfdmFsdWU6IHVuZGVmaW5lZCxcblx0X29uOiBudWxsLFxuXHRfb25mdWxmaWxsZWQ6IHVuZGVmaW5lZCxcblx0X29ucmVqZWN0ZWQ6IHVuZGVmaW5lZCxcblx0dGhlbjogZnVuY3Rpb24gdGhlbiAodGhpcyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHJpdmF0ZSB7XG5cdFx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHRcdHZhciB0aGVuYWJsZSA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRcdHN3aXRjaCAoIFRISVMuX3N0YXR1cyApIHtcblx0XHRcdGNhc2UgUEVORElORzpcblx0XHRcdFx0dGhlbmFibGUuX29uID0gW107XG5cdFx0XHRcdHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IG9uZnVsZmlsbGVkO1xuXHRcdFx0XHR0aGVuYWJsZS5fb25yZWplY3RlZCA9IG9ucmVqZWN0ZWQ7XG5cdFx0XHRcdFRISVMuX29uIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdFx0Y2FzZSBGVUxGSUxMRUQ6XG5cdFx0XHRcdGlmICggdHlwZW9mIG9uZnVsZmlsbGVkPT09J2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHR0cnkgeyB0KHRoZW5hYmxlLCBvbmZ1bGZpbGxlZChUSElTLl92YWx1ZSkpOyB9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gVEhJUy5fdmFsdWU7XG5cdFx0XHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0XHRjYXNlIFJFSkVDVEVEOlxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvbnJlamVjdGVkPT09J2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHR0cnkgeyB0KHRoZW5hYmxlLCBvbnJlamVjdGVkKFRISVMuX3ZhbHVlKSk7IH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdH1cblx0XHR0aHJvdyBUeXBlRXJyb3IoJ01ldGhvZCBUaGVuYWJsZS5wcm90b3R5cGUudGhlbiBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG5cdH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0dChUSElTLCB2YWx1ZSk7XG5cdHJldHVybiBUSElTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVqZWN0IChlcnJvciA6YW55KSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFRISVMuX3ZhbHVlID0gZXJyb3I7XG5cdHJldHVybiBUSElTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWxsICh2YWx1ZXMgOnJlYWRvbmx5IGFueVtdKSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0VEhJUy5fb24gPSBbXTtcblx0dmFyIF92YWx1ZSA6YW55W10gPSBbXTtcblx0dmFyIGNvdW50IDpudW1iZXIgPSAwO1xuXHRmdW5jdGlvbiBfb25yZWplY3RlZCAoZXJyb3IgOmFueSkgOnZvaWQgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIHIoVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHRmb3IgKCB2YXIgbGVuZ3RoIDpudW1iZXIgPSB2YWx1ZXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdHZhciB2YWx1ZSA6YW55ID0gdmFsdWVzW2luZGV4XTtcblx0XHRpZiAoICggaXNUaGVuYWJsZSBhcyAodmFsdWUgOmFueSkgPT4gdmFsdWUgaXMgUHJpdmF0ZSApKHZhbHVlKSApIHtcblx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0Kytjb3VudDtcblx0XHRcdFx0X3ZhbHVlW2luZGV4XSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0dmFsdWUuX29uIS5wdXNoKHtcblx0XHRcdFx0XHRfb25mdWxmaWxsZWQ6IGZ1bmN0aW9uIChpbmRleCA6bnVtYmVyKSA6RnVuY3Rpb24ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdFx0XHRcdFx0XHRcdGlmICggVEhJUy5fc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBjb3VudD4xICkgeyAtLWNvdW50OyB9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSB7IHIoVEhJUywgX3ZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fShpbmRleCksXG5cdFx0XHRcdFx0X29ucmVqZWN0ZWQ6IF9vbnJlamVjdGVkXG5cdFx0XHRcdH0gYXMgUHJpdmF0ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICggX3N0YXR1cz09PVJFSkVDVEVEICkge1xuXHRcdFx0XHRUSElTLl92YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSB2YWx1ZS5fdmFsdWU7IH1cblx0XHR9XG5cdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSB2YWx1ZTsgfVxuXHR9XG5cdHJldHVybiBUSElTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFjZSAodmFsdWVzIDpyZWFkb25seSBhbnlbXSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFRISVMuX29uID0gW107XG5cdHZhciB0aGF0IDpQcml2YXRlID0ge1xuXHRcdF9vbmZ1bGZpbGxlZDogZnVuY3Rpb24gKHZhbHVlIDphbnkpIDp2b2lkIHsgVEhJUy5fc3RhdHVzPT09UEVORElORyAmJiByKFRISVMsIHZhbHVlLCBGVUxGSUxMRUQpOyB9LFxuXHRcdF9vbnJlamVjdGVkOiBmdW5jdGlvbiAoZXJyb3IgOmFueSkgOnZvaWQgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIHIoVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR9IGFzIFByaXZhdGU7XG5cdGZvciAoIHZhciBsZW5ndGggOm51bWJlciA9IHZhbHVlcy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0dmFyIHZhbHVlIDphbnkgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdGlmICggKCBpc1RoZW5hYmxlIGFzICh2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlICkodmFsdWUpICkge1xuXHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkgeyB2YWx1ZS5fb24hLnB1c2godGhhdCk7IH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRUSElTLl92YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdFx0VEhJUy5fc3RhdHVzID0gX3N0YXR1cztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdFRISVMuX3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn1cblxuaW1wb3J0IERlZmF1bHQgZnJvbSAnLmRlZmF1bHQ/PSc7XG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0KFB1YmxpYywge1xuXHR2ZXJzaW9uOiB2ZXJzaW9uLFxuXHRUaGVuYWJsZTogUHVibGljLFxuXHRpc1RoZW5hYmxlOiBpc1RoZW5hYmxlLFxuXHRyZXNvbHZlOiByZXNvbHZlLFxuXHRyZWplY3Q6IHJlamVjdCxcblx0YWxsOiBhbGwsXG5cdHJhY2U6IHJhY2Vcbn0pO1xuXG5leHBvcnQgdmFyIFRoZW5hYmxlIDpSZWFkb25seTx7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0+ID0gZnJlZXplXG5cdD8gLyojX19QVVJFX18qLyBmdW5jdGlvbiAoKSB7XG5cdFx0ZnJlZXplKFB1YmxpYy5wcm90b3R5cGUpO1xuXHRcdGZyZWV6ZShQdWJsaWMpO1xuXHRcdHJldHVybiBQdWJsaWM7XG5cdH0oKVxuXHQ6IFB1YmxpYztcblxudHlwZSBGdW5jdGlvbiA9ICh2YWx1ZSA6YW55KSA9PiB2b2lkO1xudHlwZSBFeGVjdXRvciA9IChyZXNvbHZlIDpGdW5jdGlvbiwgcmVqZWN0IDpGdW5jdGlvbikgPT4gdm9pZDtcbnR5cGUgUHJpdmF0ZSA9IHtcblx0X3N0YXR1cyA6U3RhdHVzLFxuXHRfdmFsdWUgOmFueSxcblx0X29uIDpQcml2YXRlW10gfCBudWxsLFxuXHRfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkLFxuXHRfb25yZWplY3RlZCA6RnVuY3Rpb24gfCB1bmRlZmluZWQsXG5cdHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOlByaXZhdGUsXG59O1xudHlwZSBQdWJsaWMgPSBSZWFkb25seTxvYmplY3QgJiB7XG5cdHRoZW4gKHRoaXMgOlB1YmxpYywgb25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHVibGljLFxufT47Il0sIm5hbWVzIjpbInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxjQUFlLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQUMsdEJDT3ZCLElBQUksT0FBTyxHQUFNLENBQUMsQ0FBQztBQUNuQixJQUFJLFNBQVMsR0FBTSxDQUFDLENBQUM7QUFDckIsSUFBSSxRQUFRLEdBQU0sQ0FBQyxDQUFDO0FBR3BCLElBQUksT0FBTyxHQUFHLFNBQVMsUUFBUSxNQUF3QyxDQUFDO0FBRXhFLFNBQWdCLFVBQVUsQ0FBRSxLQUFVO0lBQ3JDLE9BQU8sS0FBSyxZQUFZLE9BQU8sQ0FBQztDQUNoQztBQUVELFNBQVMsQ0FBQyxDQUFFLFFBQWlCLEVBQUUsS0FBVTtJQUN4QyxJQUFPLFVBQWdELENBQUMsS0FBSyxDQUFDLEVBQUc7UUFDaEUsSUFBSSxPQUFPLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNwQyxJQUFLLE9BQU8sS0FBRyxPQUFPLEVBQUc7WUFDeEIsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDbEIsS0FBSyxDQUFDLEdBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDMUI7YUFDSTtZQUNKLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUMvQixRQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUMzQjtLQUNEO1NBQ0k7UUFDSixRQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUN4QixRQUFRLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztLQUM3QjtDQUNEO0FBR0QsSUFBSSxLQUFLLEdBQVUsSUFBSSxDQUFDO0FBQ3hCLFNBQVMsQ0FBQyxDQUFFLFFBQWlCLEVBQUUsS0FBVSxFQUFFLE1BQWM7SUFDeEQsSUFBSyxLQUFLLEVBQUc7UUFDWixLQUFLLEdBQUcsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDL0UsT0FBTztLQUNQO0lBQ0QsU0FBWTtRQUNYLEtBQUssRUFBRTtZQUNOLElBQUssTUFBTSxLQUFHLFNBQVMsRUFBRztnQkFDekIsSUFBSyxRQUFRLENBQUMsV0FBVyxFQUFHO29CQUFFLFFBQVEsQ0FBQyxXQUFXLEdBQUdBLFdBQVMsQ0FBQztpQkFBRTtnQkFDakUsSUFBSSxZQUFZLEdBQXlCLFFBQVEsQ0FBQyxZQUFZLENBQUM7Z0JBQy9ELElBQUssWUFBWSxFQUFHO29CQUNuQixRQUFRLENBQUMsWUFBWSxHQUFHQSxXQUFTLENBQUM7b0JBQ2xDLElBQUk7d0JBQ0gsS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDNUIsSUFBTyxVQUFnRCxDQUFDLEtBQUssQ0FBQyxFQUFHOzRCQUNoRSxJQUFJLE9BQU8sR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFDOzRCQUNwQyxJQUFLLE9BQU8sS0FBRyxPQUFPLEVBQUc7Z0NBQ3hCLEtBQUssQ0FBQyxHQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dDQUMxQixNQUFNLEtBQUssQ0FBQzs2QkFDWjtpQ0FDSTtnQ0FDSixLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQ0FDckIsTUFBTSxHQUFHLE9BQU8sQ0FBQzs2QkFDakI7eUJBQ0Q7cUJBQ0Q7b0JBQ0QsT0FBTyxLQUFLLEVBQUU7d0JBQ2IsS0FBSyxHQUFHLEtBQUssQ0FBQzt3QkFDZCxNQUFNLEdBQUcsUUFBUSxDQUFDO3FCQUNsQjtpQkFDRDthQUNEO2lCQUNJO2dCQUNKLElBQUssUUFBUSxDQUFDLFlBQVksRUFBRztvQkFBRSxRQUFRLENBQUMsWUFBWSxHQUFHQSxXQUFTLENBQUM7aUJBQUU7Z0JBQ25FLElBQUksV0FBVyxHQUF5QixRQUFRLENBQUMsV0FBVyxDQUFDO2dCQUM3RCxJQUFLLFdBQVcsRUFBRztvQkFDbEIsUUFBUSxDQUFDLFdBQVcsR0FBR0EsV0FBUyxDQUFDO29CQUNqQyxJQUFJO3dCQUNILEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzNCLElBQU8sVUFBZ0QsQ0FBQyxLQUFLLENBQUMsRUFBRzs0QkFDaEUsSUFBSSxPQUFPLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBQzs0QkFDcEMsSUFBSyxPQUFPLEtBQUcsT0FBTyxFQUFHO2dDQUN4QixLQUFLLENBQUMsR0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQ0FDMUIsTUFBTSxLQUFLLENBQUM7NkJBQ1o7aUNBQ0k7Z0NBQ0osS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0NBQ3JCLE1BQU0sR0FBRyxPQUFPLENBQUM7NkJBQ2pCO3lCQUNEOzZCQUNJOzRCQUFFLE1BQU0sR0FBRyxTQUFTLENBQUM7eUJBQUU7cUJBQzVCO29CQUNELE9BQU8sS0FBSyxFQUFFO3dCQUFFLEtBQUssR0FBRyxLQUFLLENBQUM7cUJBQUU7aUJBQ2hDO2FBQ0Q7WUFDRCxRQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUN4QixRQUFRLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUMxQixJQUFJLEdBQUcsR0FBcUIsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUN6QyxJQUFLLEdBQUcsRUFBRztnQkFDVixRQUFRLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztnQkFDcEIsS0FBTSxJQUFJLEtBQUssR0FBVyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssR0FBSTtvQkFDOUMsS0FBSyxHQUFHLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUM7aUJBQ25GO2FBQ0Q7U0FDRDtRQUNELElBQUssQ0FBQyxLQUFLLEVBQUc7WUFBRSxNQUFNO1NBQUU7UUFDeEIsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDMUIsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDcEIsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDdEIsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7S0FDeEI7Q0FDRDtBQUVELElBQUksTUFBTSxHQUF5QyxTQUFTLFFBQVEsQ0FBaUIsUUFBa0I7SUFDdEcsSUFBSyxPQUFPLFFBQVEsS0FBRyxVQUFVLEVBQUc7UUFBRSxNQUFNLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0tBQUU7SUFDL0YsSUFBSSxRQUE2QixDQUFDO0lBQ2xDLElBQUksR0FBd0IsQ0FBQztJQUM3QixJQUFJLE1BQVcsQ0FBQztJQUNoQixJQUFJLE9BQTJCLENBQUM7SUFDaEMsSUFBSSxJQUFJLEdBQVksSUFBSSxDQUFDO0lBQ3pCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2QsSUFBSTtRQUNILFFBQVEsQ0FDUCxTQUFTLE9BQU8sQ0FBRSxLQUFVO1lBQzNCLElBQUssR0FBRyxFQUFHO2dCQUFFLE9BQU87YUFBRTtZQUN0QixHQUFHLEdBQUcsSUFBSSxDQUFDO1lBQ1gsSUFBSyxRQUFRLEVBQUc7Z0JBQ2YsSUFBTyxVQUFnRCxDQUFDLEtBQUssQ0FBQyxFQUFHO29CQUNoRSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztvQkFDeEIsSUFBSyxPQUFPLEtBQUcsT0FBTyxFQUFHO3dCQUFFLEtBQUssQ0FBQyxHQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUFFO3lCQUM5Qzt3QkFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7cUJBQUU7aUJBQ3hDO3FCQUNJO29CQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2lCQUFFO2FBQ25DO2lCQUNJO2dCQUNKLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ2YsT0FBTyxHQUFHLFNBQVMsQ0FBQzthQUNwQjtTQUNELEVBQ0QsU0FBUyxNQUFNLENBQUUsS0FBVTtZQUMxQixJQUFLLEdBQUcsRUFBRztnQkFBRSxPQUFPO2FBQUU7WUFDdEIsR0FBRyxHQUFHLElBQUksQ0FBQztZQUNYLElBQUssUUFBUSxFQUFHO2dCQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQUU7aUJBQ3hDO2dCQUNKLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ2YsT0FBTyxHQUFHLFFBQVEsQ0FBQzthQUNuQjtTQUNELENBQ0QsQ0FBQztRQUNGLElBQUssQ0FBQyxHQUFHLEVBQUc7WUFDWCxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLE9BQU87U0FDUDtLQUNEO0lBQ0QsT0FBTyxLQUFLLEVBQUU7UUFDYixJQUFLLENBQUMsR0FBRyxFQUFHO1lBQ1gsR0FBRyxHQUFHLElBQUksQ0FBQztZQUNYLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLE9BQU87U0FDUDtLQUNEO0lBQ0QsSUFBSyxPQUFPLEtBQUcsU0FBUyxJQUFNLFVBQWdELENBQUMsTUFBTSxDQUFDLEVBQUc7UUFDeEYsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDekIsSUFBSyxPQUFPLEtBQUcsT0FBTyxFQUFHO1lBQ3hCLE1BQU0sQ0FBQyxHQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLE9BQU87U0FDUDtRQUNELE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0tBQ3ZCO0lBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFRLENBQUM7SUFDeEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7Q0FDbUMsQ0FBQztBQUVyRCxPQUFPLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEdBQUc7SUFDdEMsT0FBTyxFQUFFLE9BQU87SUFDaEIsTUFBTSxFQUFFQSxXQUFTO0lBQ2pCLEdBQUcsRUFBRSxJQUFJO0lBQ1QsWUFBWSxFQUFFQSxXQUFTO0lBQ3ZCLFdBQVcsRUFBRUEsV0FBUztJQUN0QixJQUFJLEVBQUUsU0FBUyxJQUFJLENBQWlCLFdBQXNCLEVBQUUsVUFBcUI7UUFDaEYsSUFBSSxJQUFJLEdBQVksSUFBSSxDQUFDO1FBQ3pCLElBQUksUUFBUSxHQUFZLElBQUksT0FBTyxDQUFDO1FBQ3BDLFFBQVMsSUFBSSxDQUFDLE9BQU87WUFDcEIsS0FBSyxPQUFPO2dCQUNYLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNsQixRQUFRLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztnQkFDcEMsUUFBUSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxHQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN6QixPQUFPLFFBQVEsQ0FBQztZQUNqQixLQUFLLFNBQVM7Z0JBQ2IsSUFBSyxPQUFPLFdBQVcsS0FBRyxVQUFVLEVBQUc7b0JBQ3RDLElBQUk7d0JBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7cUJBQUU7b0JBQzlDLE9BQU8sS0FBSyxFQUFFO3dCQUNiLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO3dCQUN4QixRQUFRLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztxQkFDNUI7aUJBQ0Q7cUJBQ0k7b0JBQ0osUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO29CQUM5QixRQUFRLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztpQkFDN0I7Z0JBQ0QsT0FBTyxRQUFRLENBQUM7WUFDakIsS0FBSyxRQUFRO2dCQUNaLElBQUssT0FBTyxVQUFVLEtBQUcsVUFBVSxFQUFHO29CQUNyQyxJQUFJO3dCQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3FCQUFFO29CQUM3QyxPQUFPLEtBQUssRUFBRTt3QkFDYixRQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzt3QkFDeEIsUUFBUSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7cUJBQzVCO2lCQUNEO3FCQUNJO29CQUNKLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztvQkFDOUIsUUFBUSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7aUJBQzVCO2dCQUNELE9BQU8sUUFBUSxDQUFDO1NBQ2pCO1FBQ0QsTUFBTSxTQUFTLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztLQUNsRjtDQUNELENBQUM7QUFFRixTQUFnQixPQUFPLENBQUUsS0FBVTtJQUNsQyxJQUFJLElBQUksR0FBWSxJQUFJLE9BQU8sQ0FBQztJQUNoQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2YsT0FBTyxJQUFJLENBQUM7Q0FDWjtBQUVELFNBQWdCLE1BQU0sQ0FBRSxLQUFVO0lBQ2pDLElBQUksSUFBSSxHQUFZLElBQUksT0FBTyxDQUFDO0lBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLE9BQU8sSUFBSSxDQUFDO0NBQ1o7QUFFRCxTQUFnQixHQUFHLENBQUUsTUFBc0I7SUFDMUMsSUFBSSxJQUFJLEdBQVksSUFBSSxPQUFPLENBQUM7SUFDaEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDZCxJQUFJLE1BQU0sR0FBVSxFQUFFLENBQUM7SUFDdkIsSUFBSSxLQUFLLEdBQVcsQ0FBQyxDQUFDO0lBQ3RCLFNBQVMsV0FBVyxDQUFFLEtBQVUsSUFBVSxJQUFJLENBQUMsT0FBTyxLQUFHLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0lBQy9GLEtBQU0sSUFBSSxNQUFNLEdBQVcsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLEdBQVcsQ0FBQyxFQUFFLEtBQUssR0FBQyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUc7UUFDcEYsSUFBSSxLQUFLLEdBQVEsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLElBQU8sVUFBZ0QsQ0FBQyxLQUFLLENBQUMsRUFBRztZQUNoRSxJQUFJLE9BQU8sR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQ3BDLElBQUssT0FBTyxLQUFHLE9BQU8sRUFBRztnQkFDeEIsRUFBRSxLQUFLLENBQUM7Z0JBQ1IsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHQSxXQUFTLENBQUM7Z0JBQzFCLEtBQUssQ0FBQyxHQUFJLENBQUMsSUFBSSxDQUFDO29CQUNmLFlBQVksRUFBRSxVQUFVLEtBQWE7d0JBQ3BDLE9BQU8sVUFBVSxLQUFVOzRCQUMxQixJQUFLLElBQUksQ0FBQyxPQUFPLEtBQUcsT0FBTyxFQUFHO2dDQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dDQUN0QixJQUFLLEtBQUssR0FBQyxDQUFDLEVBQUc7b0NBQUUsRUFBRSxLQUFLLENBQUM7aUNBQUU7cUNBQ3RCO29DQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2lDQUFFOzZCQUNwQzt5QkFDRCxDQUFDO3FCQUNGLENBQUMsS0FBSyxDQUFDO29CQUNSLFdBQVcsRUFBRSxXQUFXO2lCQUNiLENBQUMsQ0FBQzthQUNkO2lCQUNJLElBQUssT0FBTyxLQUFHLFFBQVEsRUFBRztnQkFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO2dCQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztnQkFDeEIsTUFBTTthQUNOO2lCQUNJO2dCQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO2FBQUU7U0FDdEM7YUFDSTtZQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7U0FBRTtLQUMvQjtJQUNELE9BQU8sSUFBSSxDQUFDO0NBQ1o7QUFFRCxTQUFnQixJQUFJLENBQUUsTUFBc0I7SUFDM0MsSUFBSSxJQUFJLEdBQVksSUFBSSxPQUFPLENBQUM7SUFDaEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDZCxJQUFJLElBQUksR0FBWTtRQUNuQixZQUFZLEVBQUUsVUFBVSxLQUFVLElBQVUsSUFBSSxDQUFDLE9BQU8sS0FBRyxPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRTtRQUNsRyxXQUFXLEVBQUUsVUFBVSxLQUFVLElBQVUsSUFBSSxDQUFDLE9BQU8sS0FBRyxPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtLQUNyRixDQUFDO0lBQ2IsS0FBTSxJQUFJLE1BQU0sR0FBVyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssR0FBVyxDQUFDLEVBQUUsS0FBSyxHQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRztRQUNwRixJQUFJLEtBQUssR0FBUSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsSUFBTyxVQUFnRCxDQUFDLEtBQUssQ0FBQyxFQUFHO1lBQ2hFLElBQUksT0FBTyxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDcEMsSUFBSyxPQUFPLEtBQUcsT0FBTyxFQUFHO2dCQUFFLEtBQUssQ0FBQyxHQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQUU7aUJBQzlDO2dCQUNKLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQkFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Z0JBQ3ZCLE1BQU07YUFDTjtTQUNEO2FBQ0k7WUFDSixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztZQUN6QixNQUFNO1NBQ047S0FDRDtJQUNELE9BQU8sSUFBSSxDQUFDO0NBQ1o7QUFFRCxBQUNBLGNBQWUsT0FBTyxDQUFDLE1BQU0sRUFBRTtJQUM5QixPQUFPLEVBQUUsT0FBTztJQUNoQixRQUFRLEVBQUUsTUFBTTtJQUNoQixVQUFVLEVBQUUsVUFBVTtJQUN0QixPQUFPLEVBQUUsT0FBTztJQUNoQixNQUFNLEVBQUUsTUFBTTtJQUNkLEdBQUcsRUFBRSxHQUFHO0lBQ1IsSUFBSSxFQUFFLElBQUk7Q0FDVixDQUFDLENBQUM7QUFFSCxJQUFXLFFBQVEsR0FBbUQsTUFBTTtvQkFDM0Q7UUFDZixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNmLE9BQU8sTUFBTSxDQUFDO0tBQ2QsRUFBRTtNQUNELE1BQU07Ozs7Ozs7OzsiLCJzb3VyY2VSb290IjoiLi4vLi4vc3JjLyJ9