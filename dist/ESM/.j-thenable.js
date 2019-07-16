/*!
 * 模块名称：j-thenable
 * 模块功能：模仿 Promise API 的同步防爆栈工具。从属于“简计划”。
   　　　　　Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".
 * 模块版本：4.2.1
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-thenable/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-thenable/
 */

import WeakMap from '.WeakMap';
import freeze from '.Object.freeze';
import seal from '.Object.seal';
import Promise_prototype from '.Promise.prototype?';
import getPrototypeOf from '.Object.getPrototypeOf';
import preventExtensions from '.Object.preventExtensions';
import undefined$1 from '.undefined';
import TypeError from '.TypeError';
import Default from '.default?=';

var version = '4.2.1';

var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var Private_call;
var Private = function Private() { Private_call(this); };
var isThenable;
var delete_dependents;
var delete_onrejected;
var delete_onfulfilled;
var delete_onthen;
var delete_onfulfilled_if_has;
var delete_onrejected_if_has;
var get_status;
var get_value;
var get_dependents;
var get_onfulfilled;
var get_onrejected;
var get_onthen;
var set_status;
var set_value;
var set_dependents;
var set_onfulfilled;
var set_onrejected;
var set_onthen;
if (typeof WeakMap === 'function') {
    var STATUS = new WeakMap;
    var VALUE = new WeakMap;
    var DEPENDENTS = new WeakMap;
    var ONFULFILLED = new WeakMap;
    var ONREJECTED = new WeakMap;
    var ONTHEN = new WeakMap;
    Private_call = preventExtensions && /*#__PURE__*/ function () {
        var o = preventExtensions({});
        VALUE.set(o, o);
        return VALUE.has(o);
    }()
        ? function Private_call(THIS) { STATUS.set(preventExtensions(THIS), PENDING); }
        : function Private_call(THIS) { STATUS.set(THIS, PENDING); };
    isThenable = function isThenable(value) { return STATUS.has(value); };
    /* delete: */
    delete_dependents = function delete_dependents(THIS) { DEPENDENTS['delete'](THIS); };
    delete_onfulfilled = function delete_onfulfilled(THIS) { ONFULFILLED['delete'](THIS); };
    delete_onrejected = function delete_onrejected(THIS) { ONREJECTED['delete'](THIS); };
    delete_onthen = function delete_onthen(THIS) { ONTHEN['delete'](THIS); };
    delete_onfulfilled_if_has = delete_onfulfilled;
    delete_onrejected_if_has = delete_onrejected; /**/
    /* set undefined: * /
    delete_dependents = function delete_dependents (THIS :Private) :void { DEPENDENTS.set(THIS, undefined!); };
    delete_onfulfilled = function delete_onfulfilled (THIS :Private) :void { ONFULFILLED.set(THIS, undefined!); };
    delete_onrejected = function delete_onrejected (THIS :Private) :void { ONREJECTED.set(THIS, undefined!); };
    delete_onthen = function delete_onthen (THIS :Private) :void { ONTHEN.set(THIS, undefined!); };
    delete_onfulfilled_if_has = function delete_onfulfilled_if_has (THIS :Private) :void { ONFULFILLED.has(THIS) && ONFULFILLED.set(THIS, undefined!); };
    delete_onrejected_if_has = function delete_onrejected_if_has (THIS :Private) :void { ONREJECTED.has(THIS) && ONREJECTED.set(THIS, undefined!); };/**/
    get_status = function get_status(THIS) { return STATUS.get(THIS); };
    get_value = function get_value(THIS) { return VALUE.get(THIS); };
    get_dependents = function get_dependents(THIS) { return DEPENDENTS.get(THIS); };
    get_onfulfilled = function get_onfulfilled(THIS) { return ONFULFILLED.get(THIS); };
    get_onrejected = function get_onrejected(THIS) { return ONREJECTED.get(THIS); };
    get_onthen = function get_onthen(THIS) { return ONTHEN.get(THIS); };
    set_status = function set_status(THIS, status) { STATUS.set(THIS, status); };
    set_value = function set_value(THIS, value) { VALUE.set(THIS, value); };
    set_dependents = function set_dependents(THIS, dependents) { DEPENDENTS.set(THIS, dependents); };
    set_onfulfilled = function set_onfulfilled(THIS, onfulfilled) { ONFULFILLED.set(THIS, onfulfilled); };
    set_onrejected = function set_onrejected(THIS, onrejected) { ONREJECTED.set(THIS, onrejected); };
    set_onthen = function set_onthen(THIS, onthen) { ONTHEN.set(THIS, onthen); };
}
else {
    Private_call = function Private_call() { };
    isThenable = getPrototypeOf
        ? function (value) {
            var Private_prototype = Private.prototype;
            isThenable = function isThenable(value) { return value != null && getPrototypeOf(value) === Private_prototype; };
            return isThenable(value);
        }
        : function isThenable(value) { return value instanceof Private; };
    /* set undefined: */
    delete_dependents = function delete_dependents(THIS) { THIS._dependents = undefined$1; };
    delete_onfulfilled = function delete_onfulfilled(THIS) { THIS._onfulfilled = undefined$1; };
    delete_onrejected = function delete_onrejected(THIS) { THIS._onrejected = undefined$1; };
    delete_onthen = function delete_onthen(THIS) { THIS._onthen = undefined$1; };
    delete_onfulfilled_if_has = function delete_onfulfilled_if_has(THIS) { if (THIS._onfulfilled) {
        THIS._onfulfilled = undefined$1;
    } };
    delete_onrejected_if_has = function delete_onrejected_if_has(THIS) { if (THIS._onrejected) {
        THIS._onrejected = undefined$1;
    } }; /**/
    get_status = function get_status(THIS) { return THIS._status; };
    get_value = function get_value(THIS) { return THIS._value; };
    get_dependents = function get_dependents(THIS) { return THIS._dependents; };
    get_onfulfilled = function get_onfulfilled(THIS) { return THIS._onfulfilled; };
    get_onrejected = function get_onrejected(THIS) { return THIS._onrejected; };
    get_onthen = function get_onthen(THIS) { return THIS._onthen; };
    set_status = function set_status(THIS, status) { THIS._status = status; };
    set_value = function set_value(THIS, value) { THIS._value = value; };
    set_dependents = function set_dependents(THIS, dependents) { THIS._dependents = dependents; };
    set_onfulfilled = function set_onfulfilled(THIS, onfulfilled) { THIS._onfulfilled = onfulfilled; };
    set_onrejected = function set_onrejected(THIS, onrejected) { THIS._onrejected = onrejected; };
    set_onthen = function set_onthen(THIS, onthen) { THIS._onthen = onthen; };
}
var isPromise = Promise_prototype
    ? getPrototypeOf
        ? function isPromise(value) { return value != null && getPrototypeOf(value) === Promise_prototype; }
        : function () {
            function Promise() { }
            Promise.prototype = Promise_prototype;
            return function isPromise(value) { return value instanceof Promise; };
        }()
    : function isPromise() { return false; };
var prependStack = null;
var prepending = false;
function prepend(thenable) {
    var _onthen = get_onthen(thenable);
    if (!_onthen) {
        return;
    }
    delete_onthen(thenable);
    if (prepending) {
        prependStack = { nextStack: prependStack, thenable: thenable, onthen: _onthen };
        return;
    }
    prepending = true;
    for (;;) {
        try {
            var value = _onthen();
            if (isThenable(value)) {
                _onthen = get_onthen(value);
                if (_onthen) {
                    delete_onthen(value);
                    get_dependents(value).push(thenable);
                    prependStack = { nextStack: prependStack, thenable: value, onthen: _onthen };
                }
                else {
                    var status = get_status(value);
                    if (status === PENDING) {
                        get_dependents(value).push(thenable);
                    }
                    else {
                        flow(thenable, get_value(value), status);
                    }
                }
            }
            else if (isPromise(value)) {
                depend(thenable, value);
            }
            else {
                flow(thenable, value, FULFILLED);
            }
        }
        catch (error) {
            flow(thenable, error, REJECTED);
        }
        if (!prependStack) {
            break;
        }
        thenable = prependStack.thenable;
        _onthen = prependStack.onthen;
        prependStack = prependStack.nextStack;
    }
    prepending = false;
}
var flowStack = null;
var flowing = false;
function flow(thenable, value, status) {
    if (flowing) {
        flowStack = { nextStack: flowStack, thenable: thenable, value: value, status: status };
        return;
    }
    flowing = true;
    for (var _status;;) {
        stack: {
            if (status === FULFILLED) {
                delete_onrejected_if_has(thenable);
                var _onfulfilled = get_onfulfilled(thenable);
                if (_onfulfilled) {
                    delete_onfulfilled(thenable);
                    try {
                        value = _onfulfilled(value);
                        if (isThenable(value)) {
                            prepend(value);
                            _status = get_status(value);
                            if (_status === PENDING) {
                                get_dependents(value).push(thenable);
                                break stack;
                            }
                            else {
                                value = get_value(value);
                                status = _status;
                            }
                        }
                        else if (isPromise(value)) {
                            depend(thenable, value);
                            break stack;
                        }
                    }
                    catch (error) {
                        if (get_status(thenable) !== PENDING) {
                            break stack;
                        }
                        value = error;
                        status = REJECTED;
                    }
                }
            }
            else {
                delete_onfulfilled_if_has(thenable);
                var _onrejected = get_onrejected(thenable);
                if (_onrejected) {
                    delete_onrejected(thenable);
                    try {
                        value = _onrejected(value);
                        if (isThenable(value)) {
                            prepend(value);
                            _status = get_status(value);
                            if (_status === PENDING) {
                                get_dependents(value).push(thenable);
                                break stack;
                            }
                            else {
                                value = get_value(value);
                                status = _status;
                            }
                        }
                        else if (isPromise(value)) {
                            depend(thenable, value);
                            break stack;
                        }
                        else {
                            status = FULFILLED;
                        }
                    }
                    catch (error) {
                        if (get_status(thenable) !== PENDING) {
                            break stack;
                        }
                        value = error;
                    }
                }
            }
            set_value(thenable, value);
            set_status(thenable, status);
            var _dependents = get_dependents(thenable);
            if (_dependents) {
                delete_dependents(thenable);
                for (var index = _dependents.length; index;) {
                    flowStack = { nextStack: flowStack, thenable: _dependents[--index], value: value, status: status };
                }
            }
        }
        if (!flowStack) {
            break;
        }
        thenable = flowStack.thenable;
        value = flowStack.value;
        status = flowStack.status;
        flowStack = flowStack.nextStack;
    }
    flowing = false;
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
    if (isThenable(value)) {
        return value;
    }
    var THIS = new Private;
    if (isPromise(value)) {
        set_dependents(THIS, []);
        try_depend(THIS, value);
    }
    else {
        set_value(THIS, value);
        set_status(THIS, FULFILLED);
    }
    return THIS;
}
function try_depend(THIS, value) {
    try {
        depend(THIS, value);
    }
    catch (error) {
        if (get_status(THIS) === PENDING) {
            set_value(THIS, error);
            set_status(THIS, REJECTED);
        }
    }
}

function reject(error) {
    var THIS = new Private;
    set_status(THIS, REJECTED);
    set_value(THIS, error);
    return THIS;
}

function all(values) {
    var THIS = new Private;
    try {
        all_try(values, THIS);
    }
    catch (error) {
        if (get_status(THIS) === PENDING) {
            set_value(THIS, error);
            set_status(THIS, REJECTED);
            delete_dependents(THIS);
        }
    }
    return THIS;
}
function all_try(values, THIS) {
    set_dependents(THIS, []);
    function onrejected(error) { get_status(THIS) === PENDING && flow(THIS, error, REJECTED); }
    var _value = [];
    var count = 0;
    var counted;
    for (var length = values.length, index = 0; index < length; ++index) {
        var value = values[index];
        if (isThenable(value)) {
            prepend(value);
            var _status = get_status(value);
            if (_status === PENDING) {
                ++count;
                _value[index] = undefined$1;
                var that = new Private;
                (function (index) {
                    set_onfulfilled(that, function onfulfilled(value) {
                        if (get_status(THIS) === PENDING) {
                            _value[index] = value;
                            if (!--count && counted) {
                                flow(THIS, _value, FULFILLED);
                            }
                        }
                    });
                })(index);
                set_onrejected(that, onrejected);
                get_dependents(value).push(that);
            }
            else if (_status === REJECTED) {
                set_value(THIS, get_value(value));
                set_status(THIS, REJECTED);
                break;
            }
            else {
                _value[index] = get_value(value);
            }
        }
        else if (isPromise(value)) {
            ++count;
            _value[index] = undefined$1;
            (function (index) {
                var red;
                value.then(function onfulfilled(value) {
                    if (red) {
                        return;
                    }
                    red = true;
                    if (get_status(THIS) === PENDING) {
                        _value[index] = value;
                        if (!--count && counted) {
                            flow(THIS, _value, FULFILLED);
                        }
                    }
                }, onrejected);
            })(index);
        }
        else {
            _value[index] = value;
        }
    }
    counted = true;
    if (!count && get_status(THIS) === PENDING) {
        set_value(THIS, _value);
        set_status(THIS, FULFILLED);
        delete_dependents(THIS);
    }
}

function race(values) {
    var THIS = new Private;
    try {
        race_try(values, THIS);
    }
    catch (error) {
        if (get_status(THIS) === PENDING) {
            set_value(THIS, error);
            set_status(THIS, REJECTED);
            delete_dependents(THIS);
        }
    }
    return THIS;
}
function race_try(values, THIS) {
    set_dependents(THIS, []);
    function onfulfilled(value) { get_status(THIS) === PENDING && flow(THIS, value, FULFILLED); }
    function onrejected(error) { get_status(THIS) === PENDING && flow(THIS, error, REJECTED); }
    var that = new Private;
    set_onfulfilled(that, onfulfilled);
    set_onrejected(that, onrejected);
    for (var length = values.length, index = 0; index < length; ++index) {
        var value = values[index];
        if (isThenable(value)) {
            prepend(value);
            var _status = get_status(value);
            if (_status === PENDING) {
                get_dependents(value).push(that);
            }
            else {
                set_value(THIS, get_value(value));
                set_status(THIS, _status);
                break;
            }
        }
        else if (isPromise(value)) {
            value.then(onfulfilled, onrejected);
            if (get_status(THIS) !== PENDING) {
                break;
            }
        }
        else {
            set_value(THIS, value);
            set_status(THIS, FULFILLED);
            break;
        }
    }
}

function pend(onthen) {
    if (typeof onthen !== 'function') {
        throw TypeError('Thenable.pend(onthen is not a function)');
    }
    var THIS = new Private;
    set_dependents(THIS, []);
    set_onthen(THIS, onthen);
    return THIS;
}

var AWAIT = {
    await: function (value) {
        if (isThenable(value)) {
            prepend(value);
            switch (get_status(value)) {
                case FULFILLED:
                    return get_value(value);
                case REJECTED:
                    throw get_value(value);
            }
        }
        return value;
    }
}.await;

var Public = function Thenable(executor) {
    if (typeof executor !== 'function') {
        throw TypeError('new Thenable(executor is not a function)');
    }
    var executed;
    var red;
    var _value;
    var _status;
    var THIS = this;
    //this instanceof Thenable || throw(TypeError());
    Private_call(THIS);
    try {
        executor(function resolve(value) {
            if (red) {
                return;
            }
            red = true;
            if (executed) {
                try {
                    if (isThenable(value)) {
                        prepend(value);
                        _status = get_status(value);
                        if (_status === PENDING) {
                            get_dependents(value).push(THIS);
                        }
                        else {
                            flow(THIS, get_value(value), _status);
                        }
                    }
                    else if (isPromise(value)) {
                        depend(THIS, value);
                    }
                    else {
                        flow(THIS, value, FULFILLED);
                    }
                }
                catch (error) {
                    if (get_status(THIS) === PENDING) {
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
            set_dependents(THIS, []);
            return;
        }
    }
    catch (error) {
        if (!red) {
            red = true;
            set_value(THIS, error);
            set_status(THIS, REJECTED);
            return;
        }
    }
    try {
        rEd(THIS, _status, _value);
    }
    catch (error) {
        if (get_status(THIS) === PENDING) {
            set_value(THIS, error);
            set_status(THIS, REJECTED);
            delete_dependents(THIS);
        }
    }
};
function rEd(THIS, status, value) {
    if (status === FULFILLED) {
        if (isThenable(value)) {
            prepend(value);
            status = get_status(value);
            if (status === PENDING) {
                set_dependents(THIS, []);
                get_dependents(value).push(THIS);
            }
            else {
                set_value(THIS, get_value(value));
                set_status(THIS, status);
            }
            return;
        }
        if (isPromise(value)) {
            set_dependents(THIS, []);
            depend(THIS, value);
            return;
        }
    }
    set_value(THIS, value);
    set_status(THIS, status);
}

var prototype = typeof WeakMap === 'function'
    ? { then: then }
    : {
        _status: PENDING,
        _value: undefined$1,
        _dependents: undefined$1,
        _onfulfilled: undefined$1,
        _onrejected: undefined$1,
        _onthen: undefined$1,
        then: then
    };
function then(onfulfilled, onrejected) {
    var THIS = this;
    if (isThenable(THIS)) {
        prepend(THIS);
        var thenable = new Private;
        switch (get_status(THIS)) {
            case PENDING:
                set_dependents(thenable, []);
                if (typeof onfulfilled === 'function') {
                    set_onfulfilled(thenable, onfulfilled);
                }
                if (typeof onrejected === 'function') {
                    set_onrejected(thenable, onrejected);
                }
                get_dependents(THIS).push(thenable);
                return thenable;
            case FULFILLED:
                if (typeof onfulfilled === 'function') {
                    onto(THIS, onfulfilled, thenable);
                }
                else {
                    set_value(thenable, get_value(THIS));
                    set_status(thenable, FULFILLED);
                }
                return thenable;
            case REJECTED:
                if (typeof onrejected === 'function') {
                    onto(THIS, onrejected, thenable);
                }
                else {
                    set_value(thenable, get_value(THIS));
                    set_status(thenable, REJECTED);
                }
                return thenable;
        }
    }
    throw TypeError('Method Thenable.prototype.then called on incompatible receiver');
}
function onto(THIS, on, thenable) {
    try {
        onto_try(thenable, on(get_value(THIS)));
    }
    catch (error) {
        if (get_status(thenable) === PENDING) {
            set_value(thenable, error);
            set_status(thenable, REJECTED);
        }
    }
}
function onto_try(thenable, value) {
    if (isThenable(value)) {
        prepend(value);
        var status = get_status(value);
        if (status === PENDING) {
            set_dependents(thenable, []);
            get_dependents(value).push(thenable);
        }
        else {
            set_value(thenable, get_value(value));
            set_status(thenable, status);
        }
    }
    else if (isPromise(value)) {
        set_dependents(thenable, []);
        depend(thenable, value);
    }
    else {
        set_value(thenable, value);
        set_status(thenable, FULFILLED);
    }
}

Public.prototype = Private.prototype = typeof WeakMap === 'function' ? /*#__PURE__*/ freeze(prototype) : seal ? /*#__PURE__*/ seal(prototype) : prototype;
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
var Thenable = freeze ? /*#__PURE__*/ freeze(Public) : Public;

export default _export;
export { Thenable, all, AWAIT as await, pend, race, reject, resolve, version };

/*¡ j-thenable */

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsIl8udHMiLCJyZXNvbHZlLnRzIiwicmVqZWN0LnRzIiwiYWxsLnRzIiwicmFjZS50cyIsInBlbmQudHMiLCJhd2FpdC50cyIsIlRoZW5hYmxlLnRzIiwiVGhlbmFibGUucHJvdG90eXBlLnRzIiwiZXhwb3J0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0ICc0LjIuMSc7IiwiaW1wb3J0IFByb21pc2VfcHJvdG90eXBlIGZyb20gJy5Qcm9taXNlLnByb3RvdHlwZT8nO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLldlYWtNYXAnO1xuaW1wb3J0IGdldFByb3RvdHlwZU9mIGZyb20gJy5PYmplY3QuZ2V0UHJvdG90eXBlT2YnO1xuaW1wb3J0IHByZXZlbnRFeHRlbnNpb25zIGZyb20gJy5PYmplY3QucHJldmVudEV4dGVuc2lvbnMnO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxuZXhwb3J0IHR5cGUgRXhlY3V0b3IgPSAocmVzb2x2ZT8gOih2YWx1ZSA6YW55KSA9PiB2b2lkLCByZWplY3Q/IDooZXJyb3IgOmFueSkgPT4gdm9pZCkgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIE9uZnVsZmlsbGVkID0gKHZhbHVlIDphbnkpID0+IGFueTtcbmV4cG9ydCB0eXBlIE9ucmVqZWN0ZWQgPSAoZXJyb3IgOmFueSkgPT4gYW55O1xuZXhwb3J0IHR5cGUgT250aGVuID0gKCkgPT4gYW55O1xuZXhwb3J0IHR5cGUgU3RhdHVzID0gMCB8IDEgfCAyO1xuZXhwb3J0IHR5cGUgUHJpdmF0ZSA9IHtcblx0X3N0YXR1cyA6U3RhdHVzLFxuXHRfdmFsdWUgOmFueSxcblx0X2RlcGVuZGVudHMgOlByaXZhdGVbXSB8IHVuZGVmaW5lZCxcblx0X29uZnVsZmlsbGVkIDpPbmZ1bGZpbGxlZCB8IHVuZGVmaW5lZCxcblx0X29ucmVqZWN0ZWQgOk9ucmVqZWN0ZWQgfCB1bmRlZmluZWQsXG5cdF9vbnRoZW4gOk9udGhlbiB8IHVuZGVmaW5lZCxcblx0dGhlbiAodGhpcyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQ/IDpPbmZ1bGZpbGxlZCwgb25yZWplY3RlZD8gOk9ucmVqZWN0ZWQpIDpQcml2YXRlLFxufTtcblxuZXhwb3J0IHZhciBQRU5ESU5HIDowID0gMDtcbmV4cG9ydCB2YXIgRlVMRklMTEVEIDoxID0gMTtcbmV4cG9ydCB2YXIgUkVKRUNURUQgOjIgPSAyO1xuXG5leHBvcnQgdmFyIFByaXZhdGVfY2FsbCA6KFRISVMgOlByaXZhdGUpID0+IHZvaWQ7XG5leHBvcnQgdmFyIFByaXZhdGUgOnsgbmV3ICgpIDpQcml2YXRlIH0gPSBmdW5jdGlvbiBQcml2YXRlICh0aGlzIDpQcml2YXRlKSA6dm9pZCB7IFByaXZhdGVfY2FsbCh0aGlzKTsgfSBhcyBhbnk7XG5leHBvcnQgdmFyIGlzVGhlbmFibGUgOih2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlO1xuXG5leHBvcnQgdmFyIGRlbGV0ZV9kZXBlbmRlbnRzIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb25yZWplY3RlZCA6KFRISVMgOlByaXZhdGUpID0+IHZvaWQ7XG52YXIgZGVsZXRlX29uZnVsZmlsbGVkIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb250aGVuIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb25yZWplY3RlZF9pZl9oYXMgOihUSElTIDpQcml2YXRlKSA9PiB2b2lkO1xuXG5leHBvcnQgdmFyIGdldF9zdGF0dXMgOihUSElTIDpQcml2YXRlKSA9PiBTdGF0dXM7XG5leHBvcnQgdmFyIGdldF92YWx1ZSA6KFRISVMgOlByaXZhdGUpID0+IGFueTtcbmV4cG9ydCB2YXIgZ2V0X2RlcGVuZGVudHMgOihUSElTIDpQcml2YXRlKSA9PiBQcml2YXRlW10gfCB1bmRlZmluZWQ7XG52YXIgZ2V0X29uZnVsZmlsbGVkIDooVEhJUyA6UHJpdmF0ZSkgPT4gT25mdWxmaWxsZWQgfCB1bmRlZmluZWQ7XG52YXIgZ2V0X29ucmVqZWN0ZWQgOihUSElTIDpQcml2YXRlKSA9PiBPbnJlamVjdGVkIHwgdW5kZWZpbmVkO1xudmFyIGdldF9vbnRoZW4gOihUSElTIDpQcml2YXRlKSA9PiBPbnRoZW4gfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB2YXIgc2V0X3N0YXR1cyA6KFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzKSA9PiB2b2lkO1xuZXhwb3J0IHZhciBzZXRfdmFsdWUgOihUSElTIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA9PiB2b2lkO1xuZXhwb3J0IHZhciBzZXRfZGVwZW5kZW50cyA6KFRISVMgOlByaXZhdGUsIGRlcGVuZGVudHMgOlByaXZhdGVbXSkgPT4gdm9pZDtcbmV4cG9ydCB2YXIgc2V0X29uZnVsZmlsbGVkIDooVEhJUyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQgOk9uZnVsZmlsbGVkKSA9PiB2b2lkO1xuZXhwb3J0IHZhciBzZXRfb25yZWplY3RlZCA6KFRISVMgOlByaXZhdGUsIG9ucmVqZWN0ZWQgOk9ucmVqZWN0ZWQpID0+IHZvaWQ7XG5leHBvcnQgdmFyIHNldF9vbnRoZW4gOihUSElTIDpQcml2YXRlLCBvbnRoZW4gOk9udGhlbikgPT4gdm9pZDtcblxuaWYgKCB0eXBlb2YgV2Vha01hcD09PSdmdW5jdGlvbicgKSB7XG5cdHZhciBTVEFUVVMgOldlYWtNYXA8UHJpdmF0ZSwgU3RhdHVzPiA9IG5ldyBXZWFrTWFwO1xuXHR2YXIgVkFMVUUgOldlYWtNYXA8UHJpdmF0ZSwgYW55PiA9IG5ldyBXZWFrTWFwO1xuXHR2YXIgREVQRU5ERU5UUyA6V2Vha01hcDxQcml2YXRlLCBQcml2YXRlW10+ID0gbmV3IFdlYWtNYXA7XG5cdHZhciBPTkZVTEZJTExFRCA6V2Vha01hcDxQcml2YXRlLCBPbmZ1bGZpbGxlZD4gPSBuZXcgV2Vha01hcDtcblx0dmFyIE9OUkVKRUNURUQgOldlYWtNYXA8UHJpdmF0ZSwgT25yZWplY3RlZD4gPSBuZXcgV2Vha01hcDtcblx0dmFyIE9OVEhFTiA6V2Vha01hcDxQcml2YXRlLCBPbnRoZW4+ID0gbmV3IFdlYWtNYXA7XG5cdFxuXHRQcml2YXRlX2NhbGwgPSBwcmV2ZW50RXh0ZW5zaW9ucyAmJiAvKiNfX1BVUkVfXyovIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbyA6YW55ID0gcHJldmVudEV4dGVuc2lvbnMoe30pO1xuXHRcdFZBTFVFLnNldChvLCBvKTtcblx0XHRyZXR1cm4gVkFMVUUuaGFzKG8pO1xuXHR9KClcblx0XHQ/IGZ1bmN0aW9uIFByaXZhdGVfY2FsbCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBTVEFUVVMuc2V0KHByZXZlbnRFeHRlbnNpb25zKFRISVMpLCBQRU5ESU5HKTsgfVxuXHRcdDogZnVuY3Rpb24gUHJpdmF0ZV9jYWxsIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IFNUQVRVUy5zZXQoVEhJUywgUEVORElORyk7IH07XG5cdGlzVGhlbmFibGUgPSBmdW5jdGlvbiBpc1RoZW5hYmxlICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUHJpdmF0ZSB7IHJldHVybiBTVEFUVVMuaGFzKHZhbHVlKTsgfTtcblx0XG5cdC8qIGRlbGV0ZTogKi9cblx0ZGVsZXRlX2RlcGVuZGVudHMgPSBmdW5jdGlvbiBkZWxldGVfZGVwZW5kZW50cyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBERVBFTkRFTlRTWydkZWxldGUnXShUSElTKTsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkID0gZnVuY3Rpb24gZGVsZXRlX29uZnVsZmlsbGVkIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9ORlVMRklMTEVEWydkZWxldGUnXShUSElTKTsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTlJFSkVDVEVEWydkZWxldGUnXShUSElTKTsgfTtcblx0ZGVsZXRlX29udGhlbiA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnRoZW4gKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05USEVOWydkZWxldGUnXShUSElTKTsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyA9IGRlbGV0ZV9vbmZ1bGZpbGxlZDtcblx0ZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzID0gZGVsZXRlX29ucmVqZWN0ZWQ7LyoqL1xuXHQvKiBzZXQgdW5kZWZpbmVkOiAqIC9cblx0ZGVsZXRlX2RlcGVuZGVudHMgPSBmdW5jdGlvbiBkZWxldGVfZGVwZW5kZW50cyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBERVBFTkRFTlRTLnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkID0gZnVuY3Rpb24gZGVsZXRlX29uZnVsZmlsbGVkIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9ORlVMRklMTEVELnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTlJFSkVDVEVELnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29udGhlbiA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnRoZW4gKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05USEVOLnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyA9IGZ1bmN0aW9uIGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXMgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05GVUxGSUxMRUQuaGFzKFRISVMpICYmIE9ORlVMRklMTEVELnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzID0gZnVuY3Rpb24gZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9OUkVKRUNURUQuaGFzKFRISVMpICYmIE9OUkVKRUNURUQuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9Oy8qKi9cblx0XG5cdGdldF9zdGF0dXMgPSBmdW5jdGlvbiBnZXRfc3RhdHVzIChUSElTIDpQcml2YXRlKSA6U3RhdHVzIHsgcmV0dXJuIFNUQVRVUy5nZXQoVEhJUykhOyB9O1xuXHRnZXRfdmFsdWUgPSBmdW5jdGlvbiBnZXRfdmFsdWUgKFRISVMgOlByaXZhdGUpIDphbnkgeyByZXR1cm4gVkFMVUUuZ2V0KFRISVMpOyB9O1xuXHRnZXRfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGdldF9kZXBlbmRlbnRzIChUSElTIDpQcml2YXRlKSA6UHJpdmF0ZVtdIHwgdW5kZWZpbmVkIHsgcmV0dXJuIERFUEVOREVOVFMuZ2V0KFRISVMpOyB9O1xuXHRnZXRfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBnZXRfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUpIDpPbmZ1bGZpbGxlZCB8IHVuZGVmaW5lZCB7IHJldHVybiBPTkZVTEZJTExFRC5nZXQoVEhJUyk7IH07XG5cdGdldF9vbnJlamVjdGVkID0gZnVuY3Rpb24gZ2V0X29ucmVqZWN0ZWQgKFRISVMgOlByaXZhdGUpIDpPbnJlamVjdGVkIHwgdW5kZWZpbmVkIHsgcmV0dXJuIE9OUkVKRUNURUQuZ2V0KFRISVMpOyB9O1xuXHRnZXRfb250aGVuID0gZnVuY3Rpb24gZ2V0X29udGhlbiAoVEhJUyA6UHJpdmF0ZSkgOk9udGhlbiB8IHVuZGVmaW5lZCB7IHJldHVybiBPTlRIRU4uZ2V0KFRISVMpOyB9O1xuXHRcblx0c2V0X3N0YXR1cyA9IGZ1bmN0aW9uIHNldF9zdGF0dXMgKFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzKSA6dm9pZCB7IFNUQVRVUy5zZXQoVEhJUywgc3RhdHVzKTsgfTtcblx0c2V0X3ZhbHVlID0gZnVuY3Rpb24gc2V0X3ZhbHVlIChUSElTIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA6dm9pZCB7IFZBTFVFLnNldChUSElTLCB2YWx1ZSk7IH07XG5cdHNldF9kZXBlbmRlbnRzID0gZnVuY3Rpb24gc2V0X2RlcGVuZGVudHMgKFRISVMgOlByaXZhdGUsIGRlcGVuZGVudHMgOlByaXZhdGVbXSkgOnZvaWQgeyBERVBFTkRFTlRTLnNldChUSElTLCBkZXBlbmRlbnRzKTsgfTtcblx0c2V0X29uZnVsZmlsbGVkID0gZnVuY3Rpb24gc2V0X29uZnVsZmlsbGVkIChUSElTIDpQcml2YXRlLCBvbmZ1bGZpbGxlZCA6T25mdWxmaWxsZWQpIDp2b2lkIHsgT05GVUxGSUxMRUQuc2V0KFRISVMsIG9uZnVsZmlsbGVkKTsgfTtcblx0c2V0X29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBzZXRfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSwgb25yZWplY3RlZCA6T25yZWplY3RlZCkgOnZvaWQgeyBPTlJFSkVDVEVELnNldChUSElTLCBvbnJlamVjdGVkKTsgfTtcblx0c2V0X29udGhlbiA9IGZ1bmN0aW9uIHNldF9vbnRoZW4gKFRISVMgOlByaXZhdGUsIG9udGhlbiA6T250aGVuKSA6dm9pZCB7IE9OVEhFTi5zZXQoVEhJUywgb250aGVuKTsgfTtcbn1cbmVsc2Uge1xuXHRQcml2YXRlX2NhbGwgPSBmdW5jdGlvbiBQcml2YXRlX2NhbGwgKCkgOnZvaWQgeyB9O1xuXHRpc1RoZW5hYmxlID0gZ2V0UHJvdG90eXBlT2Zcblx0XHQ/IGZ1bmN0aW9uICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUHJpdmF0ZSB7XG5cdFx0XHR2YXIgUHJpdmF0ZV9wcm90b3R5cGUgOlByaXZhdGUgPSBQcml2YXRlLnByb3RvdHlwZTtcblx0XHRcdGlzVGhlbmFibGUgPSBmdW5jdGlvbiBpc1RoZW5hYmxlICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUHJpdmF0ZSB7IHJldHVybiB2YWx1ZSE9bnVsbCAmJiBnZXRQcm90b3R5cGVPZih2YWx1ZSk9PT1Qcml2YXRlX3Byb3RvdHlwZTsgfTtcblx0XHRcdHJldHVybiBpc1RoZW5hYmxlKHZhbHVlKTtcblx0XHR9XG5cdFx0OiBmdW5jdGlvbiBpc1RoZW5hYmxlICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUHJpdmF0ZSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFByaXZhdGU7IH07XG5cdFxuXHQvKiBzZXQgdW5kZWZpbmVkOiAqL1xuXHRkZWxldGVfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGRlbGV0ZV9kZXBlbmRlbnRzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IFRISVMuX2RlcGVuZGVudHMgPSB1bmRlZmluZWQ7IH07XG5cdGRlbGV0ZV9vbmZ1bGZpbGxlZCA9IGZ1bmN0aW9uIGRlbGV0ZV9vbmZ1bGZpbGxlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBUSElTLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBUSElTLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9O1xuXHRkZWxldGVfb250aGVuID0gZnVuY3Rpb24gZGVsZXRlX29udGhlbiAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBUSElTLl9vbnRoZW4gPSB1bmRlZmluZWQ7IH07XG5cdGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXMgPSBmdW5jdGlvbiBkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IGlmICggVEhJUy5fb25mdWxmaWxsZWQgKSB7IFRISVMuX29uZnVsZmlsbGVkID0gdW5kZWZpbmVkOyB9IH07XG5cdGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBpZiAoIFRISVMuX29ucmVqZWN0ZWQgKSB7IFRISVMuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7IH0gfTsvKiovXG5cdFxuXHRnZXRfc3RhdHVzID0gZnVuY3Rpb24gZ2V0X3N0YXR1cyAoVEhJUyA6UHJpdmF0ZSkgOlN0YXR1cyB7IHJldHVybiBUSElTLl9zdGF0dXM7IH07XG5cdGdldF92YWx1ZSA9IGZ1bmN0aW9uIGdldF92YWx1ZSAoVEhJUyA6UHJpdmF0ZSkgOmFueSB7IHJldHVybiBUSElTLl92YWx1ZTsgfTtcblx0Z2V0X2RlcGVuZGVudHMgPSBmdW5jdGlvbiBnZXRfZGVwZW5kZW50cyAoVEhJUyA6UHJpdmF0ZSkgOlByaXZhdGVbXSB8IHVuZGVmaW5lZCB7IHJldHVybiBUSElTLl9kZXBlbmRlbnRzOyB9O1xuXHRnZXRfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBnZXRfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUpIDpPbmZ1bGZpbGxlZCB8IHVuZGVmaW5lZCB7IHJldHVybiBUSElTLl9vbmZ1bGZpbGxlZDsgfTtcblx0Z2V0X29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBnZXRfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOk9ucmVqZWN0ZWQgfCB1bmRlZmluZWQgeyByZXR1cm4gVEhJUy5fb25yZWplY3RlZDsgfTtcblx0Z2V0X29udGhlbiA9IGZ1bmN0aW9uIGdldF9vbnRoZW4gKFRISVMgOlByaXZhdGUpIDpPbnRoZW4gfCB1bmRlZmluZWQgeyByZXR1cm4gVEhJUy5fb250aGVuOyB9O1xuXHRcblx0c2V0X3N0YXR1cyA9IGZ1bmN0aW9uIHNldF9zdGF0dXMgKFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzKSA6dm9pZCB7IFRISVMuX3N0YXR1cyA9IHN0YXR1czsgfTtcblx0c2V0X3ZhbHVlID0gZnVuY3Rpb24gc2V0X3ZhbHVlIChUSElTIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA6dm9pZCB7IFRISVMuX3ZhbHVlID0gdmFsdWU7IH07XG5cdHNldF9kZXBlbmRlbnRzID0gZnVuY3Rpb24gc2V0X2RlcGVuZGVudHMgKFRISVMgOlByaXZhdGUsIGRlcGVuZGVudHMgOlByaXZhdGVbXSkgOnZvaWQgeyBUSElTLl9kZXBlbmRlbnRzID0gZGVwZW5kZW50czsgfTtcblx0c2V0X29uZnVsZmlsbGVkID0gZnVuY3Rpb24gc2V0X29uZnVsZmlsbGVkIChUSElTIDpQcml2YXRlLCBvbmZ1bGZpbGxlZCA6T25mdWxmaWxsZWQpIDp2b2lkIHsgVEhJUy5fb25mdWxmaWxsZWQgPSBvbmZ1bGZpbGxlZDsgfTtcblx0c2V0X29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBzZXRfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSwgb25yZWplY3RlZCA6T25yZWplY3RlZCkgOnZvaWQgeyBUSElTLl9vbnJlamVjdGVkID0gb25yZWplY3RlZDsgfTtcblx0c2V0X29udGhlbiA9IGZ1bmN0aW9uIHNldF9vbnRoZW4gKFRISVMgOlByaXZhdGUsIG9udGhlbiA6T250aGVuKSA6dm9pZCB7IFRISVMuX29udGhlbiA9IG9udGhlbjsgfTtcbn1cblxuZXhwb3J0IHZhciBpc1Byb21pc2UgOih2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBSZWFkb25seTxQcm9taXNlPGFueT4+ID0gUHJvbWlzZV9wcm90b3R5cGVcblx0PyBnZXRQcm90b3R5cGVPZlxuXHRcdD8gZnVuY3Rpb24gaXNQcm9taXNlICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUmVhZG9ubHk8UHJvbWlzZTxhbnk+PiB7IHJldHVybiB2YWx1ZSE9bnVsbCAmJiBnZXRQcm90b3R5cGVPZih2YWx1ZSk9PT1Qcm9taXNlX3Byb3RvdHlwZTsgfVxuXHRcdDogZnVuY3Rpb24gKCkge1xuXHRcdFx0ZnVuY3Rpb24gUHJvbWlzZSAoKSB7fVxuXHRcdFx0UHJvbWlzZS5wcm90b3R5cGUgPSBQcm9taXNlX3Byb3RvdHlwZTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiBpc1Byb21pc2UgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBSZWFkb25seTxQcm9taXNlPGFueT4+IHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZTsgfTtcblx0XHR9KClcblx0OiBmdW5jdGlvbiBpc1Byb21pc2UgKCkgeyByZXR1cm4gZmFsc2U7IH0gYXMgYW55O1xuXG50eXBlIFByZXBlbmRTdGFjayA9IHsgbmV4dFN0YWNrIDpQcmVwZW5kU3RhY2sgfCBudWxsLCB0aGVuYWJsZSA6UHJpdmF0ZSwgb250aGVuIDpPbnRoZW4gfTtcbnZhciBwcmVwZW5kU3RhY2sgOlByZXBlbmRTdGFjayB8IG51bGwgPSBudWxsO1xudmFyIHByZXBlbmRpbmcgOmJvb2xlYW4gPSBmYWxzZTtcbmV4cG9ydCBmdW5jdGlvbiBwcmVwZW5kICh0aGVuYWJsZSA6UHJpdmF0ZSkgOnZvaWQge1xuXHR2YXIgX29udGhlbiA6T250aGVuIHwgdW5kZWZpbmVkID0gZ2V0X29udGhlbih0aGVuYWJsZSk7XG5cdGlmICggIV9vbnRoZW4gKSB7IHJldHVybjsgfVxuXHRkZWxldGVfb250aGVuKHRoZW5hYmxlKTtcblx0aWYgKCBwcmVwZW5kaW5nICkge1xuXHRcdHByZXBlbmRTdGFjayA9IHsgbmV4dFN0YWNrOiBwcmVwZW5kU3RhY2ssIHRoZW5hYmxlOiB0aGVuYWJsZSwgb250aGVuOiBfb250aGVuIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHByZXBlbmRpbmcgPSB0cnVlO1xuXHRmb3IgKCA7IDsgKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHZhciB2YWx1ZSA6YW55ID0gX29udGhlbigpO1xuXHRcdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdFx0X29udGhlbiA9IGdldF9vbnRoZW4odmFsdWUpO1xuXHRcdFx0XHRpZiAoIF9vbnRoZW4gKSB7XG5cdFx0XHRcdFx0ZGVsZXRlX29udGhlbih2YWx1ZSk7XG5cdFx0XHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRwcmVwZW5kU3RhY2sgPSB7IG5leHRTdGFjazogcHJlcGVuZFN0YWNrLCB0aGVuYWJsZTogdmFsdWUsIG9udGhlbjogX29udGhlbiB9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBzdGF0dXMgOlN0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0XHRcdGlmICggc3RhdHVzPT09UEVORElORyApIHsgZ2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTsgfVxuXHRcdFx0XHRcdGVsc2UgeyBmbG93KHRoZW5hYmxlLCBnZXRfdmFsdWUodmFsdWUpLCBzdGF0dXMpOyB9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkgeyBkZXBlbmQodGhlbmFibGUsIHZhbHVlKTsgfVxuXHRcdFx0ZWxzZSB7IGZsb3codGhlbmFibGUsIHZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0fVxuXHRcdGNhdGNoIChlcnJvcikgeyBmbG93KHRoZW5hYmxlLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdFx0aWYgKCAhcHJlcGVuZFN0YWNrICkgeyBicmVhazsgfVxuXHRcdHRoZW5hYmxlID0gcHJlcGVuZFN0YWNrLnRoZW5hYmxlO1xuXHRcdF9vbnRoZW4gPSBwcmVwZW5kU3RhY2sub250aGVuO1xuXHRcdHByZXBlbmRTdGFjayA9IHByZXBlbmRTdGFjay5uZXh0U3RhY2s7XG5cdH1cblx0cHJlcGVuZGluZyA9IGZhbHNlO1xufVxuXG50eXBlIEZsb3dTdGFjayA9IHsgbmV4dFN0YWNrIDpGbG93U3RhY2sgfCBudWxsLCB0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMgfTtcbnZhciBmbG93U3RhY2sgOkZsb3dTdGFjayB8IG51bGwgPSBudWxsO1xudmFyIGZsb3dpbmcgOmJvb2xlYW4gPSBmYWxzZTtcbmV4cG9ydCBmdW5jdGlvbiBmbG93ICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBmbG93aW5nICkge1xuXHRcdGZsb3dTdGFjayA9IHsgbmV4dFN0YWNrOiBmbG93U3RhY2ssIHRoZW5hYmxlOiB0aGVuYWJsZSwgdmFsdWU6IHZhbHVlLCBzdGF0dXM6IHN0YXR1cyB9O1xuXHRcdHJldHVybjtcblx0fVxuXHRmbG93aW5nID0gdHJ1ZTtcblx0Zm9yICggdmFyIF9zdGF0dXMgOlN0YXR1czsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyh0aGVuYWJsZSk7XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOk9uZnVsZmlsbGVkIHwgdW5kZWZpbmVkID0gZ2V0X29uZnVsZmlsbGVkKHRoZW5hYmxlKTtcblx0XHRcdFx0aWYgKCBfb25mdWxmaWxsZWQgKSB7XG5cdFx0XHRcdFx0ZGVsZXRlX29uZnVsZmlsbGVkKHRoZW5hYmxlKTtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBfb25mdWxmaWxsZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0cHJlcGVuZCh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdF9zdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkhLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gZ2V0X3ZhbHVlKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQcm9taXNlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0ZGVwZW5kKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyh0aGVuYWJsZSkhPT1QRU5ESU5HICkgeyBicmVhayBzdGFjazsgfVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRcdHN0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXModGhlbmFibGUpO1xuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOk9ucmVqZWN0ZWQgfCB1bmRlZmluZWQgPSBnZXRfb25yZWplY3RlZCh0aGVuYWJsZSk7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0ZGVsZXRlX29ucmVqZWN0ZWQodGhlbmFibGUpO1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IF9vbnJlamVjdGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRfc3RhdHVzID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IGdldF92YWx1ZSh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0c3RhdHVzID0gX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdGRlcGVuZCh0aGVuYWJsZSwgdmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgeyBzdGF0dXMgPSBGVUxGSUxMRUQ7IH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGdldF9zdGF0dXModGhlbmFibGUpIT09UEVORElORyApIHsgYnJlYWsgc3RhY2s7IH1cblx0XHRcdFx0XHRcdHZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRzZXRfdmFsdWUodGhlbmFibGUsIHZhbHVlKTtcblx0XHRcdHNldF9zdGF0dXModGhlbmFibGUsIHN0YXR1cyk7XG5cdFx0XHR2YXIgX2RlcGVuZGVudHMgOlByaXZhdGVbXSB8IHVuZGVmaW5lZCA9IGdldF9kZXBlbmRlbnRzKHRoZW5hYmxlKTtcblx0XHRcdGlmICggX2RlcGVuZGVudHMgKSB7XG5cdFx0XHRcdGRlbGV0ZV9kZXBlbmRlbnRzKHRoZW5hYmxlKTtcblx0XHRcdFx0Zm9yICggdmFyIGluZGV4IDpudW1iZXIgPSBfZGVwZW5kZW50cy5sZW5ndGg7IGluZGV4OyApIHtcblx0XHRcdFx0XHRmbG93U3RhY2sgPSB7IG5leHRTdGFjazogZmxvd1N0YWNrLCB0aGVuYWJsZTogX2RlcGVuZGVudHNbLS1pbmRleF0sIHZhbHVlOiB2YWx1ZSwgc3RhdHVzOiBzdGF0dXMgfTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoICFmbG93U3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBmbG93U3RhY2sudGhlbmFibGU7XG5cdFx0dmFsdWUgPSBmbG93U3RhY2sudmFsdWU7XG5cdFx0c3RhdHVzID0gZmxvd1N0YWNrLnN0YXR1cztcblx0XHRmbG93U3RhY2sgPSBmbG93U3RhY2submV4dFN0YWNrO1xuXHR9XG5cdGZsb3dpbmcgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcGVuZCAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDpSZWFkb25seTx7IHRoZW4gKC4uLmFyZ3MgOmFueVtdKSA6YW55IH0+KSA6dm9pZCB7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhbHVlLnRoZW4oXG5cdFx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRmbG93KHRoZW5hYmxlLCB2YWx1ZSwgRlVMRklMTEVEKTtcblx0XHR9LFxuXHRcdGZ1bmN0aW9uIG9ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRmbG93KHRoZW5hYmxlLCBlcnJvciwgUkVKRUNURUQpO1xuXHRcdH1cblx0KTtcbn1cbiIsImltcG9ydCB7IGlzVGhlbmFibGUsIGlzUHJvbWlzZSwgZGVwZW5kLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBQRU5ESU5HLCBQcml2YXRlLCBzZXRfZGVwZW5kZW50cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBnZXRfc3RhdHVzIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzb2x2ZSAodmFsdWU/IDphbnkpIDpQdWJsaWMge1xuXHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkgeyByZXR1cm4gdmFsdWU7IH1cblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0aWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0XHR0cnlfZGVwZW5kKFRISVMsIHZhbHVlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRzZXRfdmFsdWUoVEhJUywgdmFsdWUpO1xuXHRcdHNldF9zdGF0dXMoVEhJUywgRlVMRklMTEVEKTtcblx0fVxuXHRyZXR1cm4gVEhJUztcbn07XG5cbmZ1bmN0aW9uIHRyeV9kZXBlbmQgKFRISVMgOlByaXZhdGUsIHZhbHVlIDphbnkpIHtcblx0dHJ5IHsgZGVwZW5kKFRISVMsIHZhbHVlKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkge1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIGVycm9yKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgUkVKRUNURUQpO1xuXHRcdH1cblx0fVxufVxuXG5pbXBvcnQgUHVibGljIGZyb20gJy4vVGhlbmFibGUnOyIsImltcG9ydCB7IFJFSkVDVEVELCBQcml2YXRlLCBzZXRfc3RhdHVzLCBzZXRfdmFsdWUgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWplY3QgKGVycm9yPyA6YW55KSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdHJldHVybiBUSElTO1xufTtcblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgdW5kZWZpbmVkIGZyb20gJy51bmRlZmluZWQnO1xuXG5pbXBvcnQgeyBQRU5ESU5HLCBSRUpFQ1RFRCwgRlVMRklMTEVELCBmbG93LCBwcmVwZW5kLCBpc1RoZW5hYmxlLCBpc1Byb21pc2UsIFN0YXR1cywgUHJpdmF0ZSwgZ2V0X3N0YXR1cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBkZWxldGVfZGVwZW5kZW50cywgc2V0X2RlcGVuZGVudHMsIGdldF9kZXBlbmRlbnRzLCBnZXRfdmFsdWUsIHNldF9vbmZ1bGZpbGxlZCwgc2V0X29ucmVqZWN0ZWQgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhbGwgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10pIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHR0cnkgeyBhbGxfdHJ5KHZhbHVlcywgVEhJUyk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdGRlbGV0ZV9kZXBlbmRlbnRzKFRISVMpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn07XG5cbmZ1bmN0aW9uIGFsbF90cnkgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10sIFRISVMgOlByaXZhdGUpIDp2b2lkIHtcblx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRmdW5jdGlvbiBvbnJlamVjdGVkIChlcnJvciA6YW55KSA6YW55IHsgZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgJiYgZmxvdyhUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdHZhciBfdmFsdWUgOmFueVtdID0gW107XG5cdHZhciBjb3VudCA6bnVtYmVyID0gMDtcblx0dmFyIGNvdW50ZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdGZvciAoIHZhciBsZW5ndGggOm51bWJlciA9IHZhbHVlcy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0dmFyIHZhbHVlIDphbnkgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdCsrY291bnQ7XG5cdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHZhciB0aGF0IDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFx0XHRcdCggZnVuY3Rpb24gKGluZGV4IDpudW1iZXIpIHtcblx0XHRcdFx0XHRzZXRfb25mdWxmaWxsZWQodGhhdCwgZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0aWYgKCAhLS1jb3VudCAmJiBjb3VudGVkICkgeyBmbG93KFRISVMsIF92YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ICkoaW5kZXgpO1xuXHRcdFx0XHRzZXRfb25yZWplY3RlZCh0aGF0LCBvbnJlamVjdGVkKTtcblx0XHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoYXQpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIF9zdGF0dXM9PT1SRUpFQ1RFRCApIHtcblx0XHRcdFx0c2V0X3ZhbHVlKFRISVMsIGdldF92YWx1ZSh2YWx1ZSkpO1xuXHRcdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHsgX3ZhbHVlW2luZGV4XSA9IGdldF92YWx1ZSh2YWx1ZSk7IH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0XHQrK2NvdW50O1xuXHRcdFx0X3ZhbHVlW2luZGV4XSA9IHVuZGVmaW5lZDtcblx0XHRcdCggZnVuY3Rpb24gKGluZGV4IDpudW1iZXIpIHtcblx0XHRcdFx0dmFyIHJlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0XHRcdFx0dmFsdWUudGhlbihcblx0XHRcdFx0XHRmdW5jdGlvbiBvbmZ1bGZpbGxlZCAodmFsdWUgOmFueSkgOnZvaWQge1xuXHRcdFx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0aWYgKCAhLS1jb3VudCAmJiBjb3VudGVkICkgeyBmbG93KFRISVMsIF92YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0b25yZWplY3RlZFxuXHRcdFx0XHQpO1xuXHRcdFx0fSApKGluZGV4KTtcblx0XHR9XG5cdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSB2YWx1ZTsgfVxuXHR9XG5cdGNvdW50ZWQgPSB0cnVlO1xuXHRpZiAoICFjb3VudCAmJiBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRzZXRfdmFsdWUoVEhJUywgX3ZhbHVlKTtcblx0XHRzZXRfc3RhdHVzKFRISVMsIEZVTEZJTExFRCk7XG5cdFx0ZGVsZXRlX2RlcGVuZGVudHMoVEhJUyk7XG5cdH1cbn1cblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgeyBmbG93LCBwcmVwZW5kLCBQRU5ESU5HLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBTdGF0dXMsIGlzVGhlbmFibGUsIGlzUHJvbWlzZSwgUHJpdmF0ZSwgZ2V0X3N0YXR1cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBkZWxldGVfZGVwZW5kZW50cywgc2V0X2RlcGVuZGVudHMsIGdldF9kZXBlbmRlbnRzLCBnZXRfdmFsdWUsIHNldF9vbmZ1bGZpbGxlZCwgc2V0X29ucmVqZWN0ZWQgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByYWNlICh2YWx1ZXMgOnJlYWRvbmx5IGFueVtdKSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0dHJ5IHsgcmFjZV90cnkodmFsdWVzLCBUSElTKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkge1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIGVycm9yKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgUkVKRUNURUQpO1xuXHRcdFx0ZGVsZXRlX2RlcGVuZGVudHMoVEhJUyk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufTtcblxuZnVuY3Rpb24gcmFjZV90cnkgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10sIFRISVMgOlByaXZhdGUpIDp2b2lkIHtcblx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRmdW5jdGlvbiBvbmZ1bGZpbGxlZCAodmFsdWUgOmFueSkgOmFueSB7IGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICYmIGZsb3coVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0ZnVuY3Rpb24gb25yZWplY3RlZCAoZXJyb3IgOmFueSkgOmFueSB7IGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICYmIGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR2YXIgdGhhdCA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRzZXRfb25mdWxmaWxsZWQodGhhdCwgb25mdWxmaWxsZWQpO1xuXHRzZXRfb25yZWplY3RlZCh0aGF0LCBvbnJlamVjdGVkKTtcblx0Zm9yICggdmFyIGxlbmd0aCA6bnVtYmVyID0gdmFsdWVzLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHR2YXIgdmFsdWUgOmFueSA9IHZhbHVlc1tpbmRleF07XG5cdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgZ2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoYXQpOyB9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2V0X3ZhbHVlKFRISVMsIGdldF92YWx1ZSh2YWx1ZSkpO1xuXHRcdFx0XHRzZXRfc3RhdHVzKFRISVMsIF9zdGF0dXMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0XHR2YWx1ZS50aGVuKG9uZnVsZmlsbGVkLCBvbnJlamVjdGVkKTtcblx0XHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKSE9PVBFTkRJTkcgKSB7IGJyZWFrOyB9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIHZhbHVlKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgRlVMRklMTEVEKTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxufVxuXG5pbXBvcnQgUHVibGljIGZyb20gJy4vVGhlbmFibGUnOyIsImltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5cbmltcG9ydCB7IFByaXZhdGUsIE9udGhlbiwgc2V0X2RlcGVuZGVudHMsIHNldF9vbnRoZW4gfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwZW5kIChvbnRoZW4gOk9udGhlbikgOlB1YmxpYyB7XG5cdGlmICggdHlwZW9mIG9udGhlbiE9PSdmdW5jdGlvbicgKSB7IHRocm93IFR5cGVFcnJvcignVGhlbmFibGUucGVuZChvbnRoZW4gaXMgbm90IGEgZnVuY3Rpb24pJyk7IH1cblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRzZXRfb250aGVuKFRISVMsIG9udGhlbik7XG5cdHJldHVybiBUSElTO1xufTtcblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgeyBpc1RoZW5hYmxlLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBwcmVwZW5kLCBnZXRfc3RhdHVzLCBnZXRfdmFsdWUgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGF3YWl0OiBmdW5jdGlvbiAodmFsdWUgOmFueSkgOmFueSB7XG5cdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0c3dpdGNoICggZ2V0X3N0YXR1cyh2YWx1ZSkgKSB7XG5cdFx0XHRcdGNhc2UgRlVMRklMTEVEOlxuXHRcdFx0XHRcdHJldHVybiBnZXRfdmFsdWUodmFsdWUpO1xuXHRcdFx0XHRjYXNlIFJFSkVDVEVEOlxuXHRcdFx0XHRcdHRocm93IGdldF92YWx1ZSh2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxufS5hd2FpdDtcbiIsImltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5cbmltcG9ydCB7IFBFTkRJTkcsIEZVTEZJTExFRCwgUkVKRUNURUQsIFN0YXR1cywgUHJpdmF0ZSwgaXNUaGVuYWJsZSwgaXNQcm9taXNlLCBmbG93LCBkZXBlbmQsIHByZXBlbmQsIEV4ZWN1dG9yLCBPbmZ1bGZpbGxlZCwgT25yZWplY3RlZCwgUHJpdmF0ZV9jYWxsLCBnZXRfc3RhdHVzLCBnZXRfZGVwZW5kZW50cywgZ2V0X3ZhbHVlLCBzZXRfZGVwZW5kZW50cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBkZWxldGVfZGVwZW5kZW50cyB9IGZyb20gJy4vXyc7XG5cbmV4cG9ydCB7IFB1YmxpYyBhcyBkZWZhdWx0IH07XG5cbnR5cGUgUHVibGljID0gUmVhZG9ubHk8b2JqZWN0ICYge1xuXHR0aGVuICh0aGlzIDpQdWJsaWMsIG9uZnVsZmlsbGVkPyA6T25mdWxmaWxsZWQsIG9ucmVqZWN0ZWQ/IDpPbnJlamVjdGVkKSA6UHVibGljLFxufT47XG5cbnZhciBQdWJsaWMgOnsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfSA9IGZ1bmN0aW9uIFRoZW5hYmxlICh0aGlzIDpQcml2YXRlLCBleGVjdXRvciA6RXhlY3V0b3IpIDp2b2lkIHtcblx0aWYgKCB0eXBlb2YgZXhlY3V0b3IhPT0nZnVuY3Rpb24nICkgeyB0aHJvdyBUeXBlRXJyb3IoJ25ldyBUaGVuYWJsZShleGVjdXRvciBpcyBub3QgYSBmdW5jdGlvbiknKTsgfVxuXHR2YXIgZXhlY3V0ZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhciBfdmFsdWUgOmFueTtcblx0dmFyIF9zdGF0dXMgOlN0YXR1cyB8IHVuZGVmaW5lZDtcblx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHQvL3RoaXMgaW5zdGFuY2VvZiBUaGVuYWJsZSB8fCB0aHJvdyhUeXBlRXJyb3IoKSk7XG5cdFByaXZhdGVfY2FsbChUSElTKTtcblx0dHJ5IHtcblx0XHRleGVjdXRvcihcblx0XHRcdGZ1bmN0aW9uIHJlc29sdmUgKHZhbHVlIDphbnkpIHtcblx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoIGV4ZWN1dGVkICkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0X3N0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkgeyBnZXRfZGVwZW5kZW50cyh2YWx1ZSkhLnB1c2goVEhJUyk7IH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7IGZsb3coVEhJUywgZ2V0X3ZhbHVlKHZhbHVlKSwgX3N0YXR1cyEpOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQcm9taXNlKHZhbHVlKSApIHsgZGVwZW5kKFRISVMsIHZhbHVlKTsgfVxuXHRcdFx0XHRcdFx0ZWxzZSB7IGZsb3coVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7IGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7IGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfSB9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0X3ZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdFx0X3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uIHJlamVjdCAoZXJyb3IgOmFueSkge1xuXHRcdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdGlmICggZXhlY3V0ZWQgKSB7IGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRfdmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRfc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHRcdGlmICggIXJlZCApIHtcblx0XHRcdGV4ZWN1dGVkID0gdHJ1ZTtcblx0XHRcdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCAhcmVkICkge1xuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0dHJ5IHsgckVkKFRISVMsIF9zdGF0dXMhLCBfdmFsdWUpOyB9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRzZXRfdmFsdWUoVEhJUywgZXJyb3IpO1xuXHRcdFx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdFx0XHRkZWxldGVfZGVwZW5kZW50cyhUSElTKTtcblx0XHR9XG5cdH1cbn0gYXMgYW55O1xuXG5mdW5jdGlvbiByRWQgKFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzLCB2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdGlmICggc3RhdHVzPT09RlVMRklMTEVEICkge1xuXHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdHN0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRzZXRfZGVwZW5kZW50cyhUSElTLCBbXSk7XG5cdFx0XHRcdGdldF9kZXBlbmRlbnRzKHZhbHVlKSEucHVzaChUSElTKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzZXRfdmFsdWUoVEhJUywgZ2V0X3ZhbHVlKHZhbHVlKSk7XG5cdFx0XHRcdHNldF9zdGF0dXMoVEhJUywgc3RhdHVzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdFx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRcdFx0ZGVwZW5kKFRISVMsIHZhbHVlKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0c2V0X3ZhbHVlKFRISVMsIHZhbHVlKTtcblx0c2V0X3N0YXR1cyhUSElTLCBzdGF0dXMpO1xufVxuIiwiaW1wb3J0IFR5cGVFcnJvciBmcm9tICcuVHlwZUVycm9yJztcbmltcG9ydCBXZWFrTWFwIGZyb20gJy5XZWFrTWFwJztcbmltcG9ydCB1bmRlZmluZWQgZnJvbSAnLnVuZGVmaW5lZCc7XG5cbmltcG9ydCB7IFBFTkRJTkcsIFJFSkVDVEVELCBGVUxGSUxMRUQsIFByaXZhdGUsIGlzVGhlbmFibGUsIGlzUHJvbWlzZSwgU3RhdHVzLCBkZXBlbmQsIHByZXBlbmQsIE9uZnVsZmlsbGVkLCBPbnJlamVjdGVkLCBnZXRfc3RhdHVzLCBzZXRfZGVwZW5kZW50cywgc2V0X29uZnVsZmlsbGVkLCBzZXRfb25yZWplY3RlZCwgZ2V0X2RlcGVuZGVudHMsIHNldF92YWx1ZSwgZ2V0X3ZhbHVlLCBzZXRfc3RhdHVzIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgdHlwZW9mIFdlYWtNYXA9PT0nZnVuY3Rpb24nXG5cdD8geyB0aGVuOiB0aGVuIH1cblx0OiB7XG5cdFx0X3N0YXR1czogUEVORElORyxcblx0XHRfdmFsdWU6IHVuZGVmaW5lZCxcblx0XHRfZGVwZW5kZW50czogdW5kZWZpbmVkLFxuXHRcdF9vbmZ1bGZpbGxlZDogdW5kZWZpbmVkLFxuXHRcdF9vbnJlamVjdGVkOiB1bmRlZmluZWQsXG5cdFx0X29udGhlbjogdW5kZWZpbmVkLFxuXHRcdHRoZW46IHRoZW5cblx0fTtcblxuZnVuY3Rpb24gdGhlbiAodGhpcyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQ/IDpPbmZ1bGZpbGxlZCwgb25yZWplY3RlZD8gOk9ucmVqZWN0ZWQpIDpQcml2YXRlIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHRpZiAoIGlzVGhlbmFibGUoVEhJUykgKSB7XG5cdFx0cHJlcGVuZChUSElTKTtcblx0XHR2YXIgdGhlbmFibGUgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0XHRzd2l0Y2ggKCBnZXRfc3RhdHVzKFRISVMpICkge1xuXHRcdFx0Y2FzZSBQRU5ESU5HOlxuXHRcdFx0XHRzZXRfZGVwZW5kZW50cyh0aGVuYWJsZSwgW10pO1xuXHRcdFx0XHRpZiAoIHR5cGVvZiBvbmZ1bGZpbGxlZD09PSdmdW5jdGlvbicgKSB7IHNldF9vbmZ1bGZpbGxlZCh0aGVuYWJsZSwgb25mdWxmaWxsZWQpOyB9XG5cdFx0XHRcdGlmICggdHlwZW9mIG9ucmVqZWN0ZWQ9PT0nZnVuY3Rpb24nICkgeyBzZXRfb25yZWplY3RlZCh0aGVuYWJsZSwgb25yZWplY3RlZCk7IH1cblx0XHRcdFx0Z2V0X2RlcGVuZGVudHMoVEhJUykhLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0XHRjYXNlIEZVTEZJTExFRDpcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25mdWxmaWxsZWQ9PT0nZnVuY3Rpb24nICkgeyBvbnRvKFRISVMsIG9uZnVsZmlsbGVkLCB0aGVuYWJsZSk7IH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0c2V0X3ZhbHVlKHRoZW5hYmxlLCBnZXRfdmFsdWUoVEhJUykpO1xuXHRcdFx0XHRcdHNldF9zdGF0dXModGhlbmFibGUsIEZVTEZJTExFRCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdFx0Y2FzZSBSRUpFQ1RFRDpcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25yZWplY3RlZD09PSdmdW5jdGlvbicgKSB7IG9udG8oVEhJUywgb25yZWplY3RlZCwgdGhlbmFibGUpOyB9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgZ2V0X3ZhbHVlKFRISVMpKTtcblx0XHRcdFx0XHRzZXRfc3RhdHVzKHRoZW5hYmxlLCBSRUpFQ1RFRCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdH1cblx0fVxuXHR0aHJvdyBUeXBlRXJyb3IoJ01ldGhvZCBUaGVuYWJsZS5wcm90b3R5cGUudGhlbiBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG59XG5cbmZ1bmN0aW9uIG9udG8gKFRISVMgOlByaXZhdGUsIG9uIDooXyA6YW55KSA9PiBhbnksIHRoZW5hYmxlIDpQcml2YXRlKSB7XG5cdHRyeSB7IG9udG9fdHJ5KHRoZW5hYmxlLCBvbihnZXRfdmFsdWUoVEhJUykpKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIGdldF9zdGF0dXModGhlbmFibGUpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgZXJyb3IpO1xuXHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgUkVKRUNURUQpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBvbnRvX3RyeSAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnkpIDp2b2lkIHtcblx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHR2YXIgc3RhdHVzIDpTdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRpZiAoIHN0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRzZXRfZGVwZW5kZW50cyh0aGVuYWJsZSwgW10pO1xuXHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRzZXRfdmFsdWUodGhlbmFibGUsIGdldF92YWx1ZSh2YWx1ZSkpO1xuXHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgc3RhdHVzKTtcblx0XHR9XG5cdH1cblx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0c2V0X2RlcGVuZGVudHModGhlbmFibGUsIFtdKTtcblx0XHRkZXBlbmQodGhlbmFibGUsIHZhbHVlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRzZXRfdmFsdWUodGhlbmFibGUsIHZhbHVlKTtcblx0XHRzZXRfc3RhdHVzKHRoZW5hYmxlLCBGVUxGSUxMRUQpO1xuXHR9XG59XG4iLCJpbXBvcnQgV2Vha01hcCBmcm9tICcuV2Vha01hcCc7XG5pbXBvcnQgZnJlZXplIGZyb20gJy5PYmplY3QuZnJlZXplJztcbmltcG9ydCBzZWFsIGZyb20gJy5PYmplY3Quc2VhbCc7XG5cbmltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IHJlc29sdmUgZnJvbSAnLi9yZXNvbHZlJztcbmltcG9ydCByZWplY3QgZnJvbSAnLi9yZWplY3QnO1xuaW1wb3J0IGFsbCBmcm9tICcuL2FsbCc7XG5pbXBvcnQgcmFjZSBmcm9tICcuL3JhY2UnO1xuaW1wb3J0IHBlbmQgZnJvbSAnLi9wZW5kJztcbmltcG9ydCBBV0FJVCBmcm9tICcuL2F3YWl0JztcbmV4cG9ydCB7XG5cdHJlc29sdmUsXG5cdHJlamVjdCxcblx0YWxsLFxuXHRyYWNlLFxuXHRwZW5kLFxuXHRBV0FJVCBhcyBhd2FpdCxcbn07XG5cbmltcG9ydCB7IFByaXZhdGUsIEV4ZWN1dG9yIH0gZnJvbSAnLi9fJztcbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7XG5pbXBvcnQgcHJvdG90eXBlIGZyb20gJy4vVGhlbmFibGUucHJvdG90eXBlJztcblB1YmxpYy5wcm90b3R5cGUgPSBQcml2YXRlLnByb3RvdHlwZSA9IHR5cGVvZiBXZWFrTWFwPT09J2Z1bmN0aW9uJyA/IC8qI19fUFVSRV9fKi8gZnJlZXplKHByb3RvdHlwZSkgOiBzZWFsID8gLyojX19QVVJFX18qLyBzZWFsKHByb3RvdHlwZSkgOiBwcm90b3R5cGU7XG5cbmltcG9ydCBEZWZhdWx0IGZyb20gJy5kZWZhdWx0Pz0nO1xuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdChQdWJsaWMsIHtcblx0dmVyc2lvbjogdmVyc2lvbixcblx0VGhlbmFibGU6IFB1YmxpYyxcblx0cmVzb2x2ZTogcmVzb2x2ZSxcblx0cmVqZWN0OiByZWplY3QsXG5cdGFsbDogYWxsLFxuXHRyYWNlOiByYWNlLFxuXHRwZW5kOiBwZW5kLFxuXHRhd2FpdDogQVdBSVRcbn0pO1xuXG52YXIgVGhlbmFibGUgOlJlYWRvbmx5PHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfT4gPSBmcmVlemUgPyAvKiNfX1BVUkVfXyovIGZyZWV6ZShQdWJsaWMpIDogUHVibGljO1xudHlwZSBUaGVuYWJsZSA9IFB1YmxpYztcbmV4cG9ydCB7IFRoZW5hYmxlIH07XG4iXSwibmFtZXMiOlsidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxjQUFlLE9BQU87O3NCQUFDLHRCQ3FCaEIsSUFBSSxPQUFPLEdBQU0sQ0FBQyxD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UUFBUSxDQUFFLFFBQWlCLEVBQUUsS0FBVTtJQUMvQyxJQUFLLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRztRQUN4QixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDZixJQUFJLE1BQU0sR0FBVyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsSUFBSyxNQUFNLEtBQUcsT0FBTyxFQUFHO1lBQ3ZCLGNBQWMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDN0IsY0FBYyxDQUFDLEtBQUssQ0FBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN0QzthQUNJO1lBQ0osU0FBUyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN0QyxVQUFVLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzdCO0tBQ0Q7U0FDSSxJQUFLLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRztRQUM1QixjQUFjLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDeEI7U0FDSTtRQUNKLFNBQVMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0IsVUFBVSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztLQUNoQztDQUNEOztBQ3ZERCxNQUFNLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxPQUFPLEtBQUcsVUFBVSxpQkFBaUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksaUJBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUM7QUFFeEosQUFDQSxjQUFlLE9BQU8sQ0FBQyxNQUFNLEVBQUU7SUFDOUIsT0FBTyxFQUFFLE9BQU87SUFDaEIsUUFBUSxFQUFFLE1BQU07SUFDaEIsT0FBTyxFQUFFLE9BQU87SUFDaEIsTUFBTSxFQUFFLE1BQU07SUFDZCxHQUFHLEVBQUUsR0FBRztJQUNSLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixLQUFLLEVBQUUsS0FBSztDQUNaLENBQUMsQ0FBQztBQUVILElBQUksUUFBUSxHQUFtRCxNQUFNLGlCQUFpQixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTTs7Ozs7Ozs7OyIsInNvdXJjZVJvb3QiOiIuLi8uLi9zcmMvIn0=