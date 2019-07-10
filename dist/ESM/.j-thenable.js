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

import freeze from '.Object.freeze';
import TypeError from '.TypeError';
import undefined$1 from '.undefined';
import Default from '.default?=';

var version = '2.0.0';

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsImV4cG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAnMi4wLjAnOyIsImltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IGZyZWV6ZSBmcm9tICcuT2JqZWN0LmZyZWV6ZSc7XG5pbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxudmFyIFBFTkRJTkcgOjAgPSAwO1xudmFyIEZVTEZJTExFRCA6MSA9IDE7XG52YXIgUkVKRUNURUQgOjIgPSAyO1xudHlwZSBTdGF0dXMgPSAwIHwgMSB8IDI7XG5cbnZhciBQcml2YXRlID0gZnVuY3Rpb24gVGhlbmFibGUgKCkge30gYXMgdW5rbm93biBhcyB7IG5ldyAoKSA6UHJpdmF0ZSB9O1xuXG5mdW5jdGlvbiBpc1ByaXZhdGUgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBQcml2YXRlIHtcblx0cmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUHJpdmF0ZTtcbn1cblxuZnVuY3Rpb24gaXNQdWJsaWMgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyB7IHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOmFueSB9IHtcblx0cmV0dXJuIHZhbHVlIT1udWxsICYmIHR5cGVvZiB2YWx1ZS50aGVuPT09J2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gb250byAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDp7IHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOmFueSB9KSA6dm9pZCB7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhbHVlLnRoZW4oXG5cdFx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRyKHRoZW5hYmxlLCB2YWx1ZSwgRlVMRklMTEVEKTtcblx0XHR9LFxuXHRcdGZ1bmN0aW9uIG9ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRyKHRoZW5hYmxlLCBlcnJvciwgUkVKRUNURUQpO1xuXHRcdH1cblx0KTtcbn1cblxudHlwZSBTdGFjayA9IHsgbmV4dFN0YWNrIDpTdGFjaywgdGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnksIHN0YXR1cyA6U3RhdHVzIH0gfCBudWxsO1xudmFyIHN0YWNrIDpTdGFjayA9IG51bGw7XG5mdW5jdGlvbiByICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBzdGFjayApIHtcblx0XHRzdGFjayA9IHsgbmV4dFN0YWNrOiBzdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZvciAoIDsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGlmICggdGhlbmFibGUuX29ucmVqZWN0ZWQgKSB7IHRoZW5hYmxlLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29uZnVsZmlsbGVkO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29uZnVsZmlsbGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUuX29uIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLl92YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRvbnRvKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggdGhlbmFibGUuX3N0YXR1cyE9PVBFTkRJTkcgKSB7IGJyZWFrIHN0YWNrOyB9XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fb25mdWxmaWxsZWQgKSB7IHRoZW5hYmxlLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfVxuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdGhlbmFibGUuX29ucmVqZWN0ZWQ7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0dGhlbmFibGUuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZS5fb24hLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdG9udG8odGhlbmFibGUsIHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHsgc3RhdHVzID0gRlVMRklMTEVEOyB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0aWYgKCB0aGVuYWJsZS5fc3RhdHVzIT09UEVORElORyApIHsgYnJlYWsgc3RhY2s7IH1cblx0XHRcdFx0XHRcdHZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSB2YWx1ZTtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBzdGF0dXM7XG5cdFx0XHR2YXIgX29uIDpQcml2YXRlW10gfCBudWxsID0gdGhlbmFibGUuX29uO1xuXHRcdFx0aWYgKCBfb24gKSB7XG5cdFx0XHRcdHRoZW5hYmxlLl9vbiA9IG51bGw7XG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA6bnVtYmVyID0gX29uLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdHN0YWNrID0geyBuZXh0U3RhY2s6IHN0YWNrLCB0aGVuYWJsZTogX29uWy0taW5kZXhdLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCAhc3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBzdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IHN0YWNrLnZhbHVlO1xuXHRcdHN0YXR1cyA9IHN0YWNrLnN0YXR1cztcblx0XHRzdGFjayA9IHN0YWNrLm5leHRTdGFjaztcblx0fVxufVxuXG5mdW5jdGlvbiByRWQgKFRISVMgOlByaXZhdGUsIF9zdGF0dXMgOlN0YXR1cyB8IHVuZGVmaW5lZCwgX3ZhbHVlIDphbnkpIDp2b2lkIHtcblx0aWYgKCBfc3RhdHVzPT09RlVMRklMTEVEICkge1xuXHRcdGlmICggaXNQcml2YXRlKF92YWx1ZSkgKSB7XG5cdFx0XHRfc3RhdHVzID0gX3ZhbHVlLl9zdGF0dXM7XG5cdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRUSElTLl9vbiA9IFtdO1xuXHRcdFx0XHRfdmFsdWUuX29uIS5wdXNoKFRISVMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFRISVMuX3ZhbHVlID0gX3ZhbHVlLl92YWx1ZTtcblx0XHRcdFx0VEhJUy5fc3RhdHVzID0gX3N0YXR1cztcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCBpc1B1YmxpYyhfdmFsdWUpICkge1xuXHRcdFx0VEhJUy5fb24gPSBbXTtcblx0XHRcdG9udG8oVEhJUywgX3ZhbHVlKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0VEhJUy5fdmFsdWUgPSBfdmFsdWU7XG5cdFRISVMuX3N0YXR1cyA9IF9zdGF0dXMhO1xufVxudmFyIFB1YmxpYyA6eyBuZXcgKGV4ZWN1dG9yIDpFeGVjdXRvcikgOlB1YmxpYyB9ID0gZnVuY3Rpb24gVGhlbmFibGUgKHRoaXMgOlByaXZhdGUsIGV4ZWN1dG9yIDpFeGVjdXRvcikgOnZvaWQge1xuXHRpZiAoIHR5cGVvZiBleGVjdXRvciE9PSdmdW5jdGlvbicgKSB7IHRocm93IFR5cGVFcnJvcignVGhlbmFibGUgZXhlY3V0b3IgaXMgbm90IGEgZnVuY3Rpb24nKTsgfVxuXHR2YXIgZXhlY3V0ZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhciBfdmFsdWUgOmFueTtcblx0dmFyIF9zdGF0dXMgOlN0YXR1cyB8IHVuZGVmaW5lZDtcblx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHR0cnkge1xuXHRcdGV4ZWN1dG9yKFxuXHRcdFx0ZnVuY3Rpb24gcmVzb2x2ZSAodmFsdWUgOmFueSkge1xuXHRcdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdGlmICggZXhlY3V0ZWQgKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0X3N0YXR1cyA9IHZhbHVlLl9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7IHZhbHVlLl9vbiEucHVzaChUSElTKTsgfVxuXHRcdFx0XHRcdFx0XHRlbHNlIHsgcihUSElTLCB2YWx1ZS5fdmFsdWUsIF9zdGF0dXMpOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkgeyBvbnRvKFRISVMsIHZhbHVlKTsgfVxuXHRcdFx0XHRcdFx0ZWxzZSB7IHIoVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7IGlmICggVEhJUy5fc3RhdHVzPT09UEVORElORyApIHsgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9IH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRfdmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHRfc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZnVuY3Rpb24gcmVqZWN0IChlcnJvciA6YW55KSB7XG5cdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCBleGVjdXRlZCApIHsgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdF92YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdF9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdFx0aWYgKCAhcmVkICkge1xuXHRcdFx0ZXhlY3V0ZWQgPSB0cnVlO1xuXHRcdFx0VEhJUy5fb24gPSBbXTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCAhcmVkICkge1xuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFRISVMuX3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0dHJ5IHsgckVkKFRISVMsIF9zdGF0dXMsIF92YWx1ZSk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0VEhJUy5fb24gPSBudWxsO1xuXHRcdH1cblx0fVxufSBhcyB1bmtub3duIGFzIHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfTtcblxuZnVuY3Rpb24gdCAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnkpIDp2b2lkIHtcblx0aWYgKCBpc1ByaXZhdGUodmFsdWUpICkge1xuXHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHR0aGVuYWJsZS5fb24gPSBbXTtcblx0XHRcdHZhbHVlLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhlbmFibGUuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0dGhlbmFibGUuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0fVxuXHR9XG5cdGVsc2UgaWYgKCBpc1B1YmxpYyh2YWx1ZSkgKSB7XG5cdFx0dGhlbmFibGUuX29uID0gW107XG5cdFx0b250byh0aGVuYWJsZSwgdmFsdWUpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHRoZW5hYmxlLl92YWx1ZSA9IHZhbHVlO1xuXHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFzcyAoVEhJUyA6UHJpdmF0ZSwgb24gOkZ1bmN0aW9uLCB0aGVuYWJsZSA6UHJpdmF0ZSkge1xuXHR0cnkgeyB0KHRoZW5hYmxlLCBvbihUSElTLl92YWx1ZSkpOyB9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggdGhlbmFibGUuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdHRoZW5hYmxlLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHR9XG5cdH1cbn1cblByaXZhdGUucHJvdG90eXBlID0gUHVibGljLnByb3RvdHlwZSA9IHtcblx0X3N0YXR1czogUEVORElORyxcblx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdF9vbjogbnVsbCxcblx0X29uZnVsZmlsbGVkOiB1bmRlZmluZWQsXG5cdF9vbnJlamVjdGVkOiB1bmRlZmluZWQsXG5cdHRoZW46IGZ1bmN0aW9uIHRoZW4gKHRoaXMgOlByaXZhdGUsIG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOlByaXZhdGUge1xuXHRcdHZhciBUSElTIDpQcml2YXRlID0gdGhpcztcblx0XHR2YXIgdGhlbmFibGUgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0XHRzd2l0Y2ggKCBUSElTLl9zdGF0dXMgKSB7XG5cdFx0XHRjYXNlIFBFTkRJTkc6XG5cdFx0XHRcdHRoZW5hYmxlLl9vbiA9IFtdO1xuXHRcdFx0XHR0aGVuYWJsZS5fb25mdWxmaWxsZWQgPSBvbmZ1bGZpbGxlZDtcblx0XHRcdFx0dGhlbmFibGUuX29ucmVqZWN0ZWQgPSBvbnJlamVjdGVkO1xuXHRcdFx0XHRUSElTLl9vbiEucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0XHRcdGNhc2UgRlVMRklMTEVEOlxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvbmZ1bGZpbGxlZD09PSdmdW5jdGlvbicgKSB7IHBhc3MoVEhJUywgb25mdWxmaWxsZWQsIHRoZW5hYmxlKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0XHRcdGNhc2UgUkVKRUNURUQ6XG5cdFx0XHRcdGlmICggdHlwZW9mIG9ucmVqZWN0ZWQ9PT0nZnVuY3Rpb24nICkgeyBwYXNzKFRISVMsIG9ucmVqZWN0ZWQsIHRoZW5hYmxlKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGVuYWJsZS5fdmFsdWUgPSBUSElTLl92YWx1ZTtcblx0XHRcdFx0XHR0aGVuYWJsZS5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdH1cblx0XHR0aHJvdyBUeXBlRXJyb3IoJ01ldGhvZCBUaGVuYWJsZS5wcm90b3R5cGUudGhlbiBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG5cdH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0dHJ5IHsgdChUSElTLCB2YWx1ZSk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlamVjdCAoZXJyb3IgOmFueSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRyZXR1cm4gVEhJUztcbn1cblxuZnVuY3Rpb24gX2FsbCAodmFsdWVzIDpyZWFkb25seSBhbnlbXSwgVEhJUyA6UHJpdmF0ZSkgOnZvaWQge1xuXHRUSElTLl9vbiA9IFtdO1xuXHRmdW5jdGlvbiBfb25yZWplY3RlZCAoZXJyb3IgOmFueSkgOnZvaWQgeyBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICYmIHIoVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR2YXIgX3ZhbHVlIDphbnlbXSA9IFtdO1xuXHR2YXIgY291bnQgOm51bWJlciA9IDA7XG5cdHZhciBjb3VudGVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRmb3IgKCB2YXIgbGVuZ3RoIDpudW1iZXIgPSB2YWx1ZXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdHZhciB2YWx1ZSA6YW55ID0gdmFsdWVzW2luZGV4XTtcblx0XHRpZiAoIGlzUHJpdmF0ZSh2YWx1ZSkgKSB7XG5cdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gdmFsdWUuX3N0YXR1cztcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdCsrY291bnQ7XG5cdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHZhbHVlLl9vbiEucHVzaCh7XG5cdFx0XHRcdFx0X3N0YXR1czogMCxcblx0XHRcdFx0XHRfdmFsdWU6IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRfb246IG51bGwsXG5cdFx0XHRcdFx0X29uZnVsZmlsbGVkOiBmdW5jdGlvbiAoaW5kZXggOm51bWJlcikgOkZ1bmN0aW9uIHtcblx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodmFsdWUgOmFueSkgOnZvaWQge1xuXHRcdFx0XHRcdFx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0X3ZhbHVlW2luZGV4XSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdGlmICggIS0tY291bnQgJiYgY291bnRlZCApIHsgcihUSElTLCBfdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KGluZGV4KSxcblx0XHRcdFx0XHRfb25yZWplY3RlZDogX29ucmVqZWN0ZWRcblx0XHRcdFx0fSBhcyBQcml2YXRlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBfc3RhdHVzPT09UkVKRUNURUQgKSB7XG5cdFx0XHRcdFRISVMuX3ZhbHVlID0gdmFsdWUuX3ZhbHVlO1xuXHRcdFx0XHRUSElTLl9zdGF0dXMgPSBSRUpFQ1RFRDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHsgX3ZhbHVlW2luZGV4XSA9IHZhbHVlLl92YWx1ZTsgfVxuXHRcdH1cblx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkge1xuXHRcdFx0Kytjb3VudDtcblx0XHRcdF92YWx1ZVtpbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0XHR2YWx1ZS50aGVuKFxuXHRcdFx0XHRmdW5jdGlvbiAoaW5kZXggOm51bWJlcikgOkZ1bmN0aW9uIHtcblx0XHRcdFx0XHR2YXIgcmVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodmFsdWUgOmFueSkgOnZvaWQge1xuXHRcdFx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmICggVEhJUy5fc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0X3ZhbHVlW2luZGV4XSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRpZiAoICEtLWNvdW50ICYmIGNvdW50ZWQgKSB7IHIoVEhJUywgX3ZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fShpbmRleCksXG5cdFx0XHRcdF9vbnJlamVjdGVkXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRlbHNlIHsgX3ZhbHVlW2luZGV4XSA9IHZhbHVlOyB9XG5cdH1cblx0Y291bnRlZCA9IHRydWU7XG5cdGlmICggIWNvdW50ICYmIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0VEhJUy5fdmFsdWUgPSBfdmFsdWU7XG5cdFx0VEhJUy5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFRISVMuX29uID0gbnVsbDtcblx0fVxufVxuZXhwb3J0IGZ1bmN0aW9uIGFsbCAodmFsdWVzIDpyZWFkb25seSBhbnlbXSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdHRyeSB7IF9hbGwodmFsdWVzLCBUSElTKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIFRISVMuX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IGVycm9yO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRUSElTLl9vbiA9IG51bGw7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufVxuXG5mdW5jdGlvbiBfcmFjZSAodmFsdWVzIDpyZWFkb25seSBhbnlbXSwgVEhJUyA6UHJpdmF0ZSkgOnZvaWQge1xuXHRUSElTLl9vbiA9IFtdO1xuXHRmdW5jdGlvbiBfb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHsgVEhJUy5fc3RhdHVzPT09UEVORElORyAmJiByKFRISVMsIHZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdGZ1bmN0aW9uIF9vbnJlamVjdGVkIChlcnJvciA6YW55KSA6dm9pZCB7IFRISVMuX3N0YXR1cz09PVBFTkRJTkcgJiYgcihUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdHZhciB0aGF0IDpQcml2YXRlID0ge1xuXHRcdF9zdGF0dXM6IDAsXG5cdFx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdFx0X29uOiBudWxsLFxuXHRcdF9vbmZ1bGZpbGxlZDogX29uZnVsZmlsbGVkLFxuXHRcdF9vbnJlamVjdGVkOiBfb25yZWplY3RlZFxuXHR9IGFzIFByaXZhdGU7XG5cdGZvciAoIHZhciBsZW5ndGggOm51bWJlciA9IHZhbHVlcy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0dmFyIHZhbHVlIDphbnkgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdGlmICggaXNQcml2YXRlKHZhbHVlKSApIHtcblx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSB2YWx1ZS5fc3RhdHVzO1xuXHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgdmFsdWUuX29uIS5wdXNoKHRoYXQpOyB9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0VEhJUy5fdmFsdWUgPSB2YWx1ZS5fdmFsdWU7XG5cdFx0XHRcdFRISVMuX3N0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmICggaXNQdWJsaWModmFsdWUpICkge1xuXHRcdFx0dmFsdWUudGhlbihfb25mdWxmaWxsZWQsIF9vbnJlamVjdGVkKTtcblx0XHRcdGlmICggVEhJUy5fc3RhdHVzIT09UEVORElORyApIHsgYnJlYWs7IH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRUSElTLl92YWx1ZSA9IHZhbHVlO1xuXHRcdFx0VEhJUy5fc3RhdHVzID0gRlVMRklMTEVEO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG59XG5leHBvcnQgZnVuY3Rpb24gcmFjZSAodmFsdWVzIDpyZWFkb25seSBhbnlbXSkgOlB1YmxpYyB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdHRyeSB7IF9yYWNlKHZhbHVlcywgVEhJUyk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBUSElTLl9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0VEhJUy5fdmFsdWUgPSBlcnJvcjtcblx0XHRcdFRISVMuX3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0VEhJUy5fb24gPSBudWxsO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn1cblxuaW1wb3J0IERlZmF1bHQgZnJvbSAnLmRlZmF1bHQ/PSc7XG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0KFB1YmxpYywge1xuXHR2ZXJzaW9uOiB2ZXJzaW9uLFxuXHRUaGVuYWJsZTogUHVibGljLFxuXHRyZXNvbHZlOiByZXNvbHZlLFxuXHRyZWplY3Q6IHJlamVjdCxcblx0YWxsOiBhbGwsXG5cdHJhY2U6IHJhY2Vcbn0pO1xuXG5leHBvcnQgdmFyIFRoZW5hYmxlIDpSZWFkb25seTx7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0+ID0gZnJlZXplXG5cdD8gLyojX19QVVJFX18qLyBmdW5jdGlvbiAoKSB7XG5cdFx0ZnJlZXplKFB1YmxpYy5wcm90b3R5cGUpO1xuXHRcdGZyZWV6ZShQdWJsaWMpO1xuXHRcdHJldHVybiBQdWJsaWM7XG5cdH0oKVxuXHQ6IFB1YmxpYztcblxudHlwZSBGdW5jdGlvbiA9ICh2YWx1ZSA6YW55KSA9PiB2b2lkO1xudHlwZSBFeGVjdXRvciA9IChyZXNvbHZlIDpGdW5jdGlvbiwgcmVqZWN0IDpGdW5jdGlvbikgPT4gdm9pZDtcbnR5cGUgUHJpdmF0ZSA9IHtcblx0X3N0YXR1cyA6U3RhdHVzLFxuXHRfdmFsdWUgOmFueSxcblx0X29uIDpQcml2YXRlW10gfCBudWxsLFxuXHRfb25mdWxmaWxsZWQgOkZ1bmN0aW9uIHwgdW5kZWZpbmVkLFxuXHRfb25yZWplY3RlZCA6RnVuY3Rpb24gfCB1bmRlZmluZWQsXG5cdHRoZW4gKG9uZnVsZmlsbGVkPyA6RnVuY3Rpb24sIG9ucmVqZWN0ZWQ/IDpGdW5jdGlvbikgOlByaXZhdGUsXG59O1xudHlwZSBQdWJsaWMgPSBSZWFkb25seTxvYmplY3QgJiB7XG5cdHRoZW4gKHRoaXMgOlB1YmxpYywgb25mdWxmaWxsZWQ/IDpGdW5jdGlvbiwgb25yZWplY3RlZD8gOkZ1bmN0aW9uKSA6UHVibGljLFxufT47Il0sIm5hbWVzIjpbInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGNBQWUsT0FBTzs7c0JBQUMsdEJDT3ZCLElBQUksT0FBTyxHQUFNLENBQUMsQ0FBQztBQUNuQixJQUFJLFNBQVMsR0FBTSxDQUFDLENBQUM7QUFDckIsSUFBSSxRQUFRLEdBQU0sQ0FBQyxDQUFDO0FBR3BCLElBQUksT0FBTyxHQUFHLFNBQVMsUUFBUSxNQUF3QyxDQUFDO0FBRXhFLFNBQVMsU0FBUyxDQUFFLEtBQVU7SUFDN0IsT0FBTyxLQUFLLFlBQVksT0FBTyxDQUFDO0NBQ2hDO0FBRUQsU0FBUyxRQUFRLENBQUUsS0FBVTtJQUM1QixPQUFPLEtBQUssSUFBRSxJQUFJLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFHLFVBQVUsQ0FBQztDQUNyRDtBQUVELFNBQVMsSUFBSSxDQUFFLFFB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