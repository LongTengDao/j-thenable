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

import freeze from '.Object.freeze';
import TypeError from '.TypeError';
import undefined$1 from '.undefined';
import Default from '.default?=';

var version = '1.0.3';

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
var Thenable = freeze
    ? /*#__PURE__*/ function () {
        freeze(Public.prototype);
        freeze(Public);
        return Public;
    }()
    : Public;

export default _export;
export { Thenable, all, race, reject, resolve, version };

/*¡ j-thenable */

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMS4wLjMnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IGZyZWV6ZSBmcm9tICcuT2JqZWN0LmZyZWV6ZSc7XG5pbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxudmFyIFBFTkRJTkcgOjAgPSAwO1xudmFyIEZVTEZJTExFRCA6MSA9IDE7XG52YXIgUkVKRUNURUQgOjIgPSAyO1xudHlwZSBTdGF0dXMgPSAwIHwgMSB8IDI7XG5cbnZhciBQcml2YXRlID0gZnVuY3Rpb24gVGhlbmFibGUgKCkge30gYXMgdW5rbm93biBhcyB7IG5ldyAoKSA6UHJpdmF0ZSB9O1xuXG5mdW5jdGlvbiBpc1ByaXZhdGUgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBQcml2YXRlIHtcblx0cmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUHJpdmF0ZTtcbn1cblxuZnVuY3Rpb24gaXNQdWJsaWMgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyB7IHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOmFueSB9IHtcblx0cmV0dXJuIHZhbHVlIT1udWxsICYmIHR5cGVvZiB2YWx1ZS50aGVuPT09J2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gb250byAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDp7IHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOmFueSB9KSA6dm9pZCB7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhbHVlLnRoZW4oXG5cdFx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRyKHRoZW5hYmxlLCB2YWx1ZSwgRlVMRklMTEVEKTtcblx0XHR9LFxuXHRcdGZ1bmN0aW9uIG9ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRyKHRoZW5hYmxlLCBlcnJvciwgUkVKRUNURUQpO1xuXHRcdH1cblx0KTtcbn1cblxudHlwZSBTdGFjayA9IHsgbmV4dFN0YWNrIDpTdGFjaywgdGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnksIHN0YXR1cyA6U3RhdHVzIH0gfCBudWxsO1xudmFyIHN0YWNrIDpTdGFjayA9IG51bGw7XG5mdW5jdGlvbiByICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBzdGFjayApIHtcblx0XHRzdGFjayA9IHsgbmV4dFN0YWNrOiBzdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZvciAoIDsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGlmICggdGhlbmFibGUuX29ucmVqZWN0ZWQgKSB7IHRoZW5hYmxlLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29uZnVsZmlsbGVkO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29uZnVsZmlsbGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUuX29uIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRvbnRvKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggdGhlbmFibGUuX3N0YXR1cyE9PVBFTkRJTkcgKSB7IGJyZWFrIHN0YWNrOyB9XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fb25mdWxmaWxsZWQgKSB7IHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfVxuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29ucmVqZWN0ZWQ7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdG9udG8odGhlbmFibGUsIHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHsgc3RhdHVzID0gRlVMRklMTEVEOyB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fc3RhdHVzIT09UEVORElORyApIHsgYnJlYWsgc3RhY2s7IH1cblx0XHRcdFx0XHRcdHZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBzdGF0dXM7XG5cdFx0XHR2YXIgX29uIDpQcml2YXRlW10gfCBudWxsID0gdGhlbmFibGUuX29uO1xuXHRcdFx0aWYgKCBfb24gKSB7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbiA9IG51bGw7XG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA6bnVtYmVyID0gX29uLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdHN0YWNrID0geyBuZXh0U3RhY2s6IHN0YWNrLCB0aGVuYWJsZTogX29uWy0taW5kZXhdLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCAhc3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBzdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IHN0YWNrLnZhbHVlO1xuXHRcdHN0YXR1cyA9IHN0YWNrLnN0YXR1cztcblx0XHRzdGFjayA9IHN0YWNrLm5leHRTdGFjaztcblx0fVxufVxuXG52YXIgUHVibGljIDp7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0gPSBmdW5jdGlvbiBUaGVuYWJsZSAodGhpcyA6UHJpdmF0ZSwgZXhlY3V0b3IgOkV4ZWN1dG9yKSA6dm9pZCB7XG5cdGlmICggdHlwZW9mIGV4ZWN1dG9yIT09J2Z1bmN0aW9uJyApIHsgdGhyb3cgVHlwZUVycm9yKCdUaGVuYWJsZSBleGVjdXRvciBpcyBub3QgYSBmdW5jdGlvbicpOyB9XG5cdHZhciBleGVjdXRlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFyIHJlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFyIF92YWx1ZSA6YW55O1xuXHR2YXIgX3N0YXR1cyA6U3RhdHVzIHwgdW5kZWZpbmVkO1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IHRoaXM7XG5cdHRyeSB7XG5cdFx0ZXhlY3V0b3IoXG5cdFx0XHRmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSB7XG5cdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCBleGVjdXRlZCApIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRfc3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgdmFsdWUuX29uIS5wdXNoKFRISVMpOyB9XG5cdFx0XHRcdFx0XHRcdGVsc2UgeyByKFRISVMsIHZhbHVlLl92YWx1ZSwgX3N0YXR1cyk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7IG9udG8oVEhJUywgdmFsdWUpOyB9XG5cdFx0XHRcdFx0XHRlbHNlIHsgcihUSElTLCB2YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHsgaWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkgeyByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH0gfVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdF92YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdF9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiByZWplY3QgKGVycm9yIDphbnkpIHtcblx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoIGV4ZWN1dGVkICkgeyByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0X3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0X3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0XHRpZiAoICFyZWQgKSB7XG5cdFx0XHRleGVjdXRlZCA9IHRydWU7XG5cdFx0XHRUSElTLl9vbiA9IFtdO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoICFyZWQgKSB7XG5cdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHR0cnkge1xuXHRcdGlmICggX3N0YXR1cz09PUZVTEZJTExFRCAmJiBpc1ByaXZhdGUoX3ZhbHVlKSApIHtcblx0XHRcdF9zdGF0dXMgPSBfdmFsdWUuX3N0YXR1cztcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFRISVMuX29uID0gW107XG5cdFx0XHRcdF92YWx1ZS5fb24hLnB1c2goVEhJUyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0VEhJUy5fdmFsdWUgPSBfdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmICggX3N0YXR1cz09PUZVTEZJTExFRCAmJiBpc1B1YmxpYyhfdmFsdWUpICkge1xuXHRcdFx0VEhJUy5fb24gPSBbXTtcblx0XHRcdG9udG8oVEhJUywgX3ZhbHVlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IF92YWx1ZTtcblx0XHRcdFRISVMuX3N0YXR1cyA9IF9zdGF0dXMhO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRUSElTLl9vbiA9IG51bGw7XG5cdFx0fVxuXHR9XG59IGFzIHVua25vd24gYXMgeyBuZXcgKGV4ZWN1dG9yIDpFeGVjdXRvcikgOlB1YmxpYyB9O1xuXG5mdW5jdGlvbiB0ICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSkgOnZvaWQge1xuXHRpZiAoIGlzUHJpdmF0ZSh2YWx1ZSkgKSB7XG5cdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdHRoZW5hYmxlLl9vbiA9IFtdO1xuXHRcdFx0dmFsdWUuX29uIS5wdXNoKHRoZW5hYmxlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gX3N0YXR1cztcblx0XHR9XG5cdH1cblx0ZWxzZSBpZiAoIGlzUHVibGljKHZhbHVlKSApIHtcblx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRvbnRvKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0dGhlbmFibGUuX3ZhbHVlID0gdmFsdWU7XG5cdFx0dGhlbmFibGUuX3N0YXR1cyA9IEZVTEZJTExFRDtcblx0fVxufVxuXG5Qcml2YXRlLnByb3RvdHlwZSA9IFB1YmxpYy5wcm90b3R5cGUgPSB7XG5cdF9zdGF0dXM6IFBFTkRJTkcsXG5cdF92YWx1ZTogdW5kZWZpbmVkLFxuXHRfb246IG51bGwsXG5cdF9vbmZ1bGZpbGxlZDogdW5kZWZpbmVkLFxuXHRfb25yZWplY3RlZDogdW5kZWZpbmVkLFxuXHR0aGVuOiBmdW5jdGlvbiB0aGVuICh0aGlzIDpQcml2YXRlLCBvbmZ1bGZpbGxlZD8gOkZ1bmN0aW9uLCBvbnJlamVjdGVkPyA6RnVuY3Rpb24pIDpQcml2YXRlIHtcblx0XHR2YXIgVEhJUyA6UHJpdmF0ZSA9IHRoaXM7XG5cdFx0dmFyIHRoZW5hYmxlIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFx0c3dpdGNoICggVEhJUy5fc3RhdHVzICkge1xuXHRcdFx0Y2FzZSBQRU5ESU5HOlxuXHRcdFx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRcdFx0dGhlbmFibGUuX29uZnVsZmlsbGVkID0gb25mdWxmaWxsZWQ7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbnJlamVjdGVkID0gb25yZWplY3RlZDtcblx0XHRcdFx0VEhJUy5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0XHRjYXNlIEZVTEZJTExFRDpcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25mdWxmaWxsZWQ9PT0nZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdHRyeSB7IHQodGhlbmFibGUsIG9uZnVsZmlsbGVkKFRISVMuX3ZhbHVlKSk7IH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggdGhlbmFibGUuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoZW5hYmxlLl92YWx1ZSA9IFRISVMuX3ZhbHVlO1xuXHRcdFx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdFx0Y2FzZSBSRUpFQ1RFRDpcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25yZWplY3RlZD09PSdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0dHJ5IHsgdCh0aGVuYWJsZSwgb25yZWplY3RlZChUSElTLl92YWx1ZSkpOyB9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRpZiAoIHRoZW5hYmxlLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdH1cblx0XHR0aHJvdyBUeXBlRXJyb3IoJ01ldGhvZCBUaGVuYWJsZS5wcm90b3R5cGUudGhlbiBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG5cdH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0dHJ5IHsgdChUSElTLCB2YWx1ZSk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlamVjdCAoZXJyb3IgOmFueSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRyZXR1cm4gVEhJUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFsbCAodmFsdWVzIDpyZWFkb25seSBhbnlbXSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFRISVMuX29uID0gW107XG5cdHZhciBfdmFsdWUgOmFueVtdID0gW107XG5cdHZhciBjb3VudCA6bnVtYmVyID0gMDtcblx0ZnVuY3Rpb24gX29ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHsgVEhJUy5fc3RhdHVzPT09UEVORElORyAmJiByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0dmFyIGNvdW50ZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHRyeSB7XG5cdFx0Zm9yICggdmFyIGxlbmd0aCA6bnVtYmVyID0gdmFsdWVzLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHRcdHZhciB2YWx1ZSA6YW55ID0gdmFsdWVzW2luZGV4XTtcblx0XHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0Kytjb3VudDtcblx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdHZhbHVlLl9vbiEucHVzaCh7XG5cdFx0XHRcdFx0XHRfc3RhdHVzOiAwLFxuXHRcdFx0XHRcdFx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdFx0XHRcdFx0XHRfb246IG51bGwsXG5cdFx0XHRcdFx0XHRfb25mdWxmaWxsZWQ6IGZ1bmN0aW9uIChpbmRleCA6bnVtYmVyKSA6RnVuY3Rpb24ge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoICEtLWNvdW50ICYmIGNvdW50ZWQgKSB7IHIoVEhJUywgX3ZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fShpbmRleCksXG5cdFx0XHRcdFx0XHRfb25yZWplY3RlZDogX29ucmVqZWN0ZWRcblx0XHRcdFx0XHR9IGFzIFByaXZhdGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKCBfc3RhdHVzPT09UkVKRUNURUQgKSB7XG5cdFx0XHRcdFx0VEhJUy5fdmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSB2YWx1ZS5fdmFsdWU7IH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0XHRcdCsrY291bnQ7XG5cdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHZhbHVlLnRoZW4oXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKGluZGV4IDpudW1iZXIpIDpGdW5jdGlvbiB7XG5cdFx0XHRcdFx0XHR2YXIgcmVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdFx0XHRcdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoICEtLWNvdW50ICYmIGNvdW50ZWQgKSB7IHIoVEhJUywgX3ZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fShpbmRleCksXG5cdFx0XHRcdFx0X29ucmVqZWN0ZWRcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgeyBfdmFsdWVbaW5kZXhdID0gdmFsdWU7IH1cblx0XHR9XG5cdFx0Y291bnRlZCA9IHRydWU7XG5cdFx0aWYgKCAhY291bnQgJiYgVEhJUy5fc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFRISVMuX3ZhbHVlID0gX3ZhbHVlO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0VEhJUy5fb24gPSBudWxsO1xuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRUSElTLl9vbiA9IG51bGw7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFjZSAodmFsdWVzIDpyZWFkb25seSBhbnlbXSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFRISVMuX29uID0gW107XG5cdGZ1bmN0aW9uIF9vbmZ1bGZpbGxlZCAodmFsdWUgOmFueSkgOnZvaWQgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIHIoVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0ZnVuY3Rpb24gX29ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHsgVEhJUy5fc3RhdHVzPT09UEVORElORyAmJiByKFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0dmFyIHRoYXQgOlByaXZhdGUgPSB7XG5cdFx0X3N0YXR1czogMCxcblx0XHRfdmFsdWU6IHVuZGVmaW5lZCxcblx0XHRfb246IG51bGwsXG5cdFx0X29uZnVsZmlsbGVkOiBfb25mdWxmaWxsZWQsXG5cdFx0X29ucmVqZWN0ZWQ6IF9vbnJlamVjdGVkXG5cdH0gYXMgUHJpdmF0ZTtcblx0dHJ5IHtcblx0XHRmb3IgKCB2YXIgbGVuZ3RoIDpudW1iZXIgPSB2YWx1ZXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdFx0dmFyIHZhbHVlIDphbnkgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdFx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgdmFsdWUuX29uIS5wdXNoKHRoYXQpOyB9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFRISVMuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0XHRcdHZhbHVlLnRoZW4oX29uZnVsZmlsbGVkLCBfb25yZWplY3RlZCk7XG5cdFx0XHRcdGlmICggVEhJUy5fc3RhdHVzIT09UEVORElORyApIHsgYnJlYWs7IH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRUSElTLl92YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRUSElTLl9vbiA9IG51bGw7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufVxuXG5pbXBvcnQgRGVmYXVsdCBmcm9tICcuZGVmYXVsdD89JztcbmV4cG9ydCBkZWZhdWx0IERlZmF1bHQoUHVibGljLCB7XG5cdHZlcnNpb246IHZlcnNpb24sXG5cdFRoZW5hYmxlOiBQdWJsaWMsXG5cdHJlc29sdmU6IHJlc29sdmUsXG5cdHJlamVjdDogcmVqZWN0LFxuXHRhbGw6IGFsbCxcblx0cmFjZTogcmFjZVxufSk7XG5cbmV4cG9ydCB2YXIgVGhlbmFibGUgOlJlYWRvbmx5PHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfT4gPSBmcmVlemVcblx0PyAvKiNfX1BVUkVfXyovIGZ1bmN0aW9uICgpIHtcblx0XHRmcmVlemUoUHVibGljLnByb3RvdHlwZSk7XG5cdFx0ZnJlZXplKFB1YmxpYyk7XG5cdFx0cmV0dXJuIFB1YmxpYztcblx0fSgpXG5cdDogUHVibGljO1xuXG50eXBlIEZ1bmN0aW9uID0gKHZhbHVlIDphbnkpID0+IHZvaWQ7XG50eXBlIEV4ZWN1dG9yID0gKHJlc29sdmUgOkZ1bmN0aW9uLCByZWplY3QgOkZ1bmN0aW9uKSA9PiB2b2lkO1xudHlwZSBQcml2YXRlID0ge1xuXHRfc3RhdHVzIDpTdGF0dXMsXG5cdF92YWx1ZSA6YW55LFxuXHRfb24gOlByaXZhdGVbXSB8IG51bGwsXG5cdF9vbmZ1bGZpbGxlZCA6RnVuY3Rpb24gfCB1bmRlZmluZWQsXG5cdF9vbnJlamVjdGVkIDpGdW5jdGlvbiB8IHVuZGVmaW5lZCxcblx0dGhlbiAob25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHJpdmF0ZSxcbn07XG50eXBlIFB1YmxpYyA9IFJlYWRvbmx5PG9iamVjdCAmIHtcblx0dGhlbiAodGhpcyA6UHVibGljLCBvbmZ1bGZpbGxlZD8gOkZ1bmN0aW9uLCBvbnJlamVjdGVkPyA6RnVuY3Rpb24pIDpQdWJsaWMsXG59PjsiXSwibmFtZXMiOlsidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsY0FBZSxPQUFPOztzQkFBQyx0QkNPdkIsSUFBSSxPQUFPLEdBQU0sQ0FBQyxDQUFDO0FBQ25CLElBQUksU0FBUyxHQUFNLENBQUMsQ0FBQztBQUNyQixJQUFJLFFBQVEsR0FBTSxDQUFDLENBQUM7QUFHcEIsSUFBSSxPQUFPLEdBQUcsU0FBUyxRQUFRLE1BQXdDLENBQUM7QUFFeEUsU0FBUyxTQUFTLENBQUUsS0FBVTtJQUM3QixPQUFPLEtBQUssWUFBWSxPQUFPLENBQUM7Q0FDaEM7QUFFRCxTQUFTLFFBQVEsQ0FBRSxLQUFVO0lBQzVCLE9BQU8sS0FBSyxJ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