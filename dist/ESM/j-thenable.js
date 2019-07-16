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

var freeze = Object.freeze;

var seal = Object.seal;

var version = '4.2.1';

var Promise_prototype = typeof Promise!=='undefined' ? Promise.prototype : undefined;

var getPrototypeOf = Object.getPrototypeOf;

var preventExtensions = Object.preventExtensions;

var undefined$1 = void 0;

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
			dom.setAttribute('style', 'display:none !important;_display:none;');//dom.style.display = 'none';
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsIl8udHMiLCJyZXNvbHZlLnRzIiwicmVqZWN0LnRzIiwiYWxsLnRzIiwicmFjZS50cyIsInBlbmQudHMiLCJhd2FpdC50cyIsIlRoZW5hYmxlLnRzIiwiVGhlbmFibGUucHJvdG90eXBlLnRzIiwiZXhwb3J0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0ICc0LjIuMSc7IiwiaW1wb3J0IFByb21pc2VfcHJvdG90eXBlIGZyb20gJy5Qcm9taXNlLnByb3RvdHlwZT8nO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLldlYWtNYXAnO1xuaW1wb3J0IGdldFByb3RvdHlwZU9mIGZyb20gJy5PYmplY3QuZ2V0UHJvdG90eXBlT2YnO1xuaW1wb3J0IHByZXZlbnRFeHRlbnNpb25zIGZyb20gJy5PYmplY3QucHJldmVudEV4dGVuc2lvbnMnO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxuZXhwb3J0IHR5cGUgRXhlY3V0b3IgPSAocmVzb2x2ZT8gOih2YWx1ZSA6YW55KSA9PiB2b2lkLCByZWplY3Q/IDooZXJyb3IgOmFueSkgPT4gdm9pZCkgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIE9uZnVsZmlsbGVkID0gKHZhbHVlIDphbnkpID0+IGFueTtcbmV4cG9ydCB0eXBlIE9ucmVqZWN0ZWQgPSAoZXJyb3IgOmFueSkgPT4gYW55O1xuZXhwb3J0IHR5cGUgT250aGVuID0gKCkgPT4gYW55O1xuZXhwb3J0IHR5cGUgU3RhdHVzID0gMCB8IDEgfCAyO1xuZXhwb3J0IHR5cGUgUHJpdmF0ZSA9IHtcblx0X3N0YXR1cyA6U3RhdHVzLFxuXHRfdmFsdWUgOmFueSxcblx0X2RlcGVuZGVudHMgOlByaXZhdGVbXSB8IHVuZGVmaW5lZCxcblx0X29uZnVsZmlsbGVkIDpPbmZ1bGZpbGxlZCB8IHVuZGVmaW5lZCxcblx0X29ucmVqZWN0ZWQgOk9ucmVqZWN0ZWQgfCB1bmRlZmluZWQsXG5cdF9vbnRoZW4gOk9udGhlbiB8IHVuZGVmaW5lZCxcblx0dGhlbiAodGhpcyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQ/IDpPbmZ1bGZpbGxlZCwgb25yZWplY3RlZD8gOk9ucmVqZWN0ZWQpIDpQcml2YXRlLFxufTtcblxuZXhwb3J0IHZhciBQRU5ESU5HIDowID0gMDtcbmV4cG9ydCB2YXIgRlVMRklMTEVEIDoxID0gMTtcbmV4cG9ydCB2YXIgUkVKRUNURUQgOjIgPSAyO1xuXG5leHBvcnQgdmFyIFByaXZhdGVfY2FsbCA6KFRISVMgOlByaXZhdGUpID0+IHZvaWQ7XG5leHBvcnQgdmFyIFByaXZhdGUgOnsgbmV3ICgpIDpQcml2YXRlIH0gPSBmdW5jdGlvbiBQcml2YXRlICh0aGlzIDpQcml2YXRlKSA6dm9pZCB7IFByaXZhdGVfY2FsbCh0aGlzKTsgfSBhcyBhbnk7XG5leHBvcnQgdmFyIGlzVGhlbmFibGUgOih2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlO1xuXG5leHBvcnQgdmFyIGRlbGV0ZV9kZXBlbmRlbnRzIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb25yZWplY3RlZCA6KFRISVMgOlByaXZhdGUpID0+IHZvaWQ7XG52YXIgZGVsZXRlX29uZnVsZmlsbGVkIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb250aGVuIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb25yZWplY3RlZF9pZl9oYXMgOihUSElTIDpQcml2YXRlKSA9PiB2b2lkO1xuXG5leHBvcnQgdmFyIGdldF9zdGF0dXMgOihUSElTIDpQcml2YXRlKSA9PiBTdGF0dXM7XG5leHBvcnQgdmFyIGdldF92YWx1ZSA6KFRISVMgOlByaXZhdGUpID0+IGFueTtcbmV4cG9ydCB2YXIgZ2V0X2RlcGVuZGVudHMgOihUSElTIDpQcml2YXRlKSA9PiBQcml2YXRlW10gfCB1bmRlZmluZWQ7XG52YXIgZ2V0X29uZnVsZmlsbGVkIDooVEhJUyA6UHJpdmF0ZSkgPT4gT25mdWxmaWxsZWQgfCB1bmRlZmluZWQ7XG52YXIgZ2V0X29ucmVqZWN0ZWQgOihUSElTIDpQcml2YXRlKSA9PiBPbnJlamVjdGVkIHwgdW5kZWZpbmVkO1xudmFyIGdldF9vbnRoZW4gOihUSElTIDpQcml2YXRlKSA9PiBPbnRoZW4gfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB2YXIgc2V0X3N0YXR1cyA6KFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzKSA9PiB2b2lkO1xuZXhwb3J0IHZhciBzZXRfdmFsdWUgOihUSElTIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA9PiB2b2lkO1xuZXhwb3J0IHZhciBzZXRfZGVwZW5kZW50cyA6KFRISVMgOlByaXZhdGUsIGRlcGVuZGVudHMgOlByaXZhdGVbXSkgPT4gdm9pZDtcbmV4cG9ydCB2YXIgc2V0X29uZnVsZmlsbGVkIDooVEhJUyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQgOk9uZnVsZmlsbGVkKSA9PiB2b2lkO1xuZXhwb3J0IHZhciBzZXRfb25yZWplY3RlZCA6KFRISVMgOlByaXZhdGUsIG9ucmVqZWN0ZWQgOk9ucmVqZWN0ZWQpID0+IHZvaWQ7XG5leHBvcnQgdmFyIHNldF9vbnRoZW4gOihUSElTIDpQcml2YXRlLCBvbnRoZW4gOk9udGhlbikgPT4gdm9pZDtcblxuaWYgKCB0eXBlb2YgV2Vha01hcD09PSdmdW5jdGlvbicgKSB7XG5cdHZhciBTVEFUVVMgOldlYWtNYXA8UHJpdmF0ZSwgU3RhdHVzPiA9IG5ldyBXZWFrTWFwO1xuXHR2YXIgVkFMVUUgOldlYWtNYXA8UHJpdmF0ZSwgYW55PiA9IG5ldyBXZWFrTWFwO1xuXHR2YXIgREVQRU5ERU5UUyA6V2Vha01hcDxQcml2YXRlLCBQcml2YXRlW10+ID0gbmV3IFdlYWtNYXA7XG5cdHZhciBPTkZVTEZJTExFRCA6V2Vha01hcDxQcml2YXRlLCBPbmZ1bGZpbGxlZD4gPSBuZXcgV2Vha01hcDtcblx0dmFyIE9OUkVKRUNURUQgOldlYWtNYXA8UHJpdmF0ZSwgT25yZWplY3RlZD4gPSBuZXcgV2Vha01hcDtcblx0dmFyIE9OVEhFTiA6V2Vha01hcDxQcml2YXRlLCBPbnRoZW4+ID0gbmV3IFdlYWtNYXA7XG5cdFxuXHRQcml2YXRlX2NhbGwgPSBwcmV2ZW50RXh0ZW5zaW9ucyAmJiAvKiNfX1BVUkVfXyovIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbyA6YW55ID0gcHJldmVudEV4dGVuc2lvbnMoe30pO1xuXHRcdFZBTFVFLnNldChvLCBvKTtcblx0XHRyZXR1cm4gVkFMVUUuaGFzKG8pO1xuXHR9KClcblx0XHQ/IGZ1bmN0aW9uIFByaXZhdGVfY2FsbCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBTVEFUVVMuc2V0KHByZXZlbnRFeHRlbnNpb25zKFRISVMpLCBQRU5ESU5HKTsgfVxuXHRcdDogZnVuY3Rpb24gUHJpdmF0ZV9jYWxsIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IFNUQVRVUy5zZXQoVEhJUywgUEVORElORyk7IH07XG5cdGlzVGhlbmFibGUgPSBmdW5jdGlvbiBpc1RoZW5hYmxlICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUHJpdmF0ZSB7IHJldHVybiBTVEFUVVMuaGFzKHZhbHVlKTsgfTtcblx0XG5cdC8qIGRlbGV0ZTogKi9cblx0ZGVsZXRlX2RlcGVuZGVudHMgPSBmdW5jdGlvbiBkZWxldGVfZGVwZW5kZW50cyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBERVBFTkRFTlRTWydkZWxldGUnXShUSElTKTsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkID0gZnVuY3Rpb24gZGVsZXRlX29uZnVsZmlsbGVkIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9ORlVMRklMTEVEWydkZWxldGUnXShUSElTKTsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTlJFSkVDVEVEWydkZWxldGUnXShUSElTKTsgfTtcblx0ZGVsZXRlX29udGhlbiA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnRoZW4gKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05USEVOWydkZWxldGUnXShUSElTKTsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyA9IGRlbGV0ZV9vbmZ1bGZpbGxlZDtcblx0ZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzID0gZGVsZXRlX29ucmVqZWN0ZWQ7LyoqL1xuXHQvKiBzZXQgdW5kZWZpbmVkOiAqIC9cblx0ZGVsZXRlX2RlcGVuZGVudHMgPSBmdW5jdGlvbiBkZWxldGVfZGVwZW5kZW50cyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBERVBFTkRFTlRTLnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkID0gZnVuY3Rpb24gZGVsZXRlX29uZnVsZmlsbGVkIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9ORlVMRklMTEVELnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTlJFSkVDVEVELnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29udGhlbiA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnRoZW4gKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05USEVOLnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyA9IGZ1bmN0aW9uIGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXMgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05GVUxGSUxMRUQuaGFzKFRISVMpICYmIE9ORlVMRklMTEVELnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzID0gZnVuY3Rpb24gZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9OUkVKRUNURUQuaGFzKFRISVMpICYmIE9OUkVKRUNURUQuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9Oy8qKi9cblx0XG5cdGdldF9zdGF0dXMgPSBmdW5jdGlvbiBnZXRfc3RhdHVzIChUSElTIDpQcml2YXRlKSA6U3RhdHVzIHsgcmV0dXJuIFNUQVRVUy5nZXQoVEhJUykhOyB9O1xuXHRnZXRfdmFsdWUgPSBmdW5jdGlvbiBnZXRfdmFsdWUgKFRISVMgOlByaXZhdGUpIDphbnkgeyByZXR1cm4gVkFMVUUuZ2V0KFRISVMpOyB9O1xuXHRnZXRfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGdldF9kZXBlbmRlbnRzIChUSElTIDpQcml2YXRlKSA6UHJpdmF0ZVtdIHwgdW5kZWZpbmVkIHsgcmV0dXJuIERFUEVOREVOVFMuZ2V0KFRISVMpOyB9O1xuXHRnZXRfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBnZXRfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUpIDpPbmZ1bGZpbGxlZCB8IHVuZGVmaW5lZCB7IHJldHVybiBPTkZVTEZJTExFRC5nZXQoVEhJUyk7IH07XG5cdGdldF9vbnJlamVjdGVkID0gZnVuY3Rpb24gZ2V0X29ucmVqZWN0ZWQgKFRISVMgOlByaXZhdGUpIDpPbnJlamVjdGVkIHwgdW5kZWZpbmVkIHsgcmV0dXJuIE9OUkVKRUNURUQuZ2V0KFRISVMpOyB9O1xuXHRnZXRfb250aGVuID0gZnVuY3Rpb24gZ2V0X29udGhlbiAoVEhJUyA6UHJpdmF0ZSkgOk9udGhlbiB8IHVuZGVmaW5lZCB7IHJldHVybiBPTlRIRU4uZ2V0KFRISVMpOyB9O1xuXHRcblx0c2V0X3N0YXR1cyA9IGZ1bmN0aW9uIHNldF9zdGF0dXMgKFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzKSA6dm9pZCB7IFNUQVRVUy5zZXQoVEhJUywgc3RhdHVzKTsgfTtcblx0c2V0X3ZhbHVlID0gZnVuY3Rpb24gc2V0X3ZhbHVlIChUSElTIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA6dm9pZCB7IFZBTFVFLnNldChUSElTLCB2YWx1ZSk7IH07XG5cdHNldF9kZXBlbmRlbnRzID0gZnVuY3Rpb24gc2V0X2RlcGVuZGVudHMgKFRISVMgOlByaXZhdGUsIGRlcGVuZGVudHMgOlByaXZhdGVbXSkgOnZvaWQgeyBERVBFTkRFTlRTLnNldChUSElTLCBkZXBlbmRlbnRzKTsgfTtcblx0c2V0X29uZnVsZmlsbGVkID0gZnVuY3Rpb24gc2V0X29uZnVsZmlsbGVkIChUSElTIDpQcml2YXRlLCBvbmZ1bGZpbGxlZCA6T25mdWxmaWxsZWQpIDp2b2lkIHsgT05GVUxGSUxMRUQuc2V0KFRISVMsIG9uZnVsZmlsbGVkKTsgfTtcblx0c2V0X29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBzZXRfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSwgb25yZWplY3RlZCA6T25yZWplY3RlZCkgOnZvaWQgeyBPTlJFSkVDVEVELnNldChUSElTLCBvbnJlamVjdGVkKTsgfTtcblx0c2V0X29udGhlbiA9IGZ1bmN0aW9uIHNldF9vbnRoZW4gKFRISVMgOlByaXZhdGUsIG9udGhlbiA6T250aGVuKSA6dm9pZCB7IE9OVEhFTi5zZXQoVEhJUywgb250aGVuKTsgfTtcbn1cbmVsc2Uge1xuXHRQcml2YXRlX2NhbGwgPSBmdW5jdGlvbiBQcml2YXRlX2NhbGwgKCkgOnZvaWQgeyB9O1xuXHRpc1RoZW5hYmxlID0gZ2V0UHJvdG90eXBlT2Zcblx0XHQ/IGZ1bmN0aW9uICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUHJpdmF0ZSB7XG5cdFx0XHR2YXIgUHJpdmF0ZV9wcm90b3R5cGUgOlByaXZhdGUgPSBQcml2YXRlLnByb3RvdHlwZTtcblx0XHRcdGlzVGhlbmFibGUgPSBmdW5jdGlvbiBpc1RoZW5hYmxlICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUHJpdmF0ZSB7IHJldHVybiB2YWx1ZSE9bnVsbCAmJiBnZXRQcm90b3R5cGVPZih2YWx1ZSk9PT1Qcml2YXRlX3Byb3RvdHlwZTsgfTtcblx0XHRcdHJldHVybiBpc1RoZW5hYmxlKHZhbHVlKTtcblx0XHR9XG5cdFx0OiBmdW5jdGlvbiBpc1RoZW5hYmxlICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUHJpdmF0ZSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFByaXZhdGU7IH07XG5cdFxuXHQvKiBzZXQgdW5kZWZpbmVkOiAqL1xuXHRkZWxldGVfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGRlbGV0ZV9kZXBlbmRlbnRzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IFRISVMuX2RlcGVuZGVudHMgPSB1bmRlZmluZWQ7IH07XG5cdGRlbGV0ZV9vbmZ1bGZpbGxlZCA9IGZ1bmN0aW9uIGRlbGV0ZV9vbmZ1bGZpbGxlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBUSElTLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBUSElTLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9O1xuXHRkZWxldGVfb250aGVuID0gZnVuY3Rpb24gZGVsZXRlX29udGhlbiAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBUSElTLl9vbnRoZW4gPSB1bmRlZmluZWQ7IH07XG5cdGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXMgPSBmdW5jdGlvbiBkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IGlmICggVEhJUy5fb25mdWxmaWxsZWQgKSB7IFRISVMuX29uZnVsZmlsbGVkID0gdW5kZWZpbmVkOyB9IH07XG5cdGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBpZiAoIFRISVMuX29ucmVqZWN0ZWQgKSB7IFRISVMuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7IH0gfTsvKiovXG5cdFxuXHRnZXRfc3RhdHVzID0gZnVuY3Rpb24gZ2V0X3N0YXR1cyAoVEhJUyA6UHJpdmF0ZSkgOlN0YXR1cyB7IHJldHVybiBUSElTLl9zdGF0dXM7IH07XG5cdGdldF92YWx1ZSA9IGZ1bmN0aW9uIGdldF92YWx1ZSAoVEhJUyA6UHJpdmF0ZSkgOmFueSB7IHJldHVybiBUSElTLl92YWx1ZTsgfTtcblx0Z2V0X2RlcGVuZGVudHMgPSBmdW5jdGlvbiBnZXRfZGVwZW5kZW50cyAoVEhJUyA6UHJpdmF0ZSkgOlByaXZhdGVbXSB8IHVuZGVmaW5lZCB7IHJldHVybiBUSElTLl9kZXBlbmRlbnRzOyB9O1xuXHRnZXRfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBnZXRfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUpIDpPbmZ1bGZpbGxlZCB8IHVuZGVmaW5lZCB7IHJldHVybiBUSElTLl9vbmZ1bGZpbGxlZDsgfTtcblx0Z2V0X29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBnZXRfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOk9ucmVqZWN0ZWQgfCB1bmRlZmluZWQgeyByZXR1cm4gVEhJUy5fb25yZWplY3RlZDsgfTtcblx0Z2V0X29udGhlbiA9IGZ1bmN0aW9uIGdldF9vbnRoZW4gKFRISVMgOlByaXZhdGUpIDpPbnRoZW4gfCB1bmRlZmluZWQgeyByZXR1cm4gVEhJUy5fb250aGVuOyB9O1xuXHRcblx0c2V0X3N0YXR1cyA9IGZ1bmN0aW9uIHNldF9zdGF0dXMgKFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzKSA6dm9pZCB7IFRISVMuX3N0YXR1cyA9IHN0YXR1czsgfTtcblx0c2V0X3ZhbHVlID0gZnVuY3Rpb24gc2V0X3ZhbHVlIChUSElTIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA6dm9pZCB7IFRISVMuX3ZhbHVlID0gdmFsdWU7IH07XG5cdHNldF9kZXBlbmRlbnRzID0gZnVuY3Rpb24gc2V0X2RlcGVuZGVudHMgKFRISVMgOlByaXZhdGUsIGRlcGVuZGVudHMgOlByaXZhdGVbXSkgOnZvaWQgeyBUSElTLl9kZXBlbmRlbnRzID0gZGVwZW5kZW50czsgfTtcblx0c2V0X29uZnVsZmlsbGVkID0gZnVuY3Rpb24gc2V0X29uZnVsZmlsbGVkIChUSElTIDpQcml2YXRlLCBvbmZ1bGZpbGxlZCA6T25mdWxmaWxsZWQpIDp2b2lkIHsgVEhJUy5fb25mdWxmaWxsZWQgPSBvbmZ1bGZpbGxlZDsgfTtcblx0c2V0X29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBzZXRfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSwgb25yZWplY3RlZCA6T25yZWplY3RlZCkgOnZvaWQgeyBUSElTLl9vbnJlamVjdGVkID0gb25yZWplY3RlZDsgfTtcblx0c2V0X29udGhlbiA9IGZ1bmN0aW9uIHNldF9vbnRoZW4gKFRISVMgOlByaXZhdGUsIG9udGhlbiA6T250aGVuKSA6dm9pZCB7IFRISVMuX29udGhlbiA9IG9udGhlbjsgfTtcbn1cblxuZXhwb3J0IHZhciBpc1Byb21pc2UgOih2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBSZWFkb25seTxQcm9taXNlPGFueT4+ID0gUHJvbWlzZV9wcm90b3R5cGVcblx0PyBnZXRQcm90b3R5cGVPZlxuXHRcdD8gZnVuY3Rpb24gaXNQcm9taXNlICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUmVhZG9ubHk8UHJvbWlzZTxhbnk+PiB7IHJldHVybiB2YWx1ZSE9bnVsbCAmJiBnZXRQcm90b3R5cGVPZih2YWx1ZSk9PT1Qcm9taXNlX3Byb3RvdHlwZTsgfVxuXHRcdDogZnVuY3Rpb24gKCkge1xuXHRcdFx0ZnVuY3Rpb24gUHJvbWlzZSAoKSB7fVxuXHRcdFx0UHJvbWlzZS5wcm90b3R5cGUgPSBQcm9taXNlX3Byb3RvdHlwZTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiBpc1Byb21pc2UgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBSZWFkb25seTxQcm9taXNlPGFueT4+IHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZTsgfTtcblx0XHR9KClcblx0OiBmdW5jdGlvbiBpc1Byb21pc2UgKCkgeyByZXR1cm4gZmFsc2U7IH0gYXMgYW55O1xuXG50eXBlIFByZXBlbmRTdGFjayA9IHsgbmV4dFN0YWNrIDpQcmVwZW5kU3RhY2sgfCBudWxsLCB0aGVuYWJsZSA6UHJpdmF0ZSwgb250aGVuIDpPbnRoZW4gfTtcbnZhciBwcmVwZW5kU3RhY2sgOlByZXBlbmRTdGFjayB8IG51bGwgPSBudWxsO1xudmFyIHByZXBlbmRpbmcgOmJvb2xlYW4gPSBmYWxzZTtcbmV4cG9ydCBmdW5jdGlvbiBwcmVwZW5kICh0aGVuYWJsZSA6UHJpdmF0ZSkgOnZvaWQge1xuXHR2YXIgX29udGhlbiA6T250aGVuIHwgdW5kZWZpbmVkID0gZ2V0X29udGhlbih0aGVuYWJsZSk7XG5cdGlmICggIV9vbnRoZW4gKSB7IHJldHVybjsgfVxuXHRkZWxldGVfb250aGVuKHRoZW5hYmxlKTtcblx0aWYgKCBwcmVwZW5kaW5nICkge1xuXHRcdHByZXBlbmRTdGFjayA9IHsgbmV4dFN0YWNrOiBwcmVwZW5kU3RhY2ssIHRoZW5hYmxlOiB0aGVuYWJsZSwgb250aGVuOiBfb250aGVuIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHByZXBlbmRpbmcgPSB0cnVlO1xuXHRmb3IgKCA7IDsgKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHZhciB2YWx1ZSA6YW55ID0gX29udGhlbigpO1xuXHRcdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdFx0X29udGhlbiA9IGdldF9vbnRoZW4odmFsdWUpO1xuXHRcdFx0XHRpZiAoIF9vbnRoZW4gKSB7XG5cdFx0XHRcdFx0ZGVsZXRlX29udGhlbih2YWx1ZSk7XG5cdFx0XHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRwcmVwZW5kU3RhY2sgPSB7IG5leHRTdGFjazogcHJlcGVuZFN0YWNrLCB0aGVuYWJsZTogdmFsdWUsIG9udGhlbjogX29udGhlbiB9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBzdGF0dXMgOlN0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0XHRcdGlmICggc3RhdHVzPT09UEVORElORyApIHsgZ2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTsgfVxuXHRcdFx0XHRcdGVsc2UgeyBmbG93KHRoZW5hYmxlLCBnZXRfdmFsdWUodmFsdWUpLCBzdGF0dXMpOyB9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkgeyBkZXBlbmQodGhlbmFibGUsIHZhbHVlKTsgfVxuXHRcdFx0ZWxzZSB7IGZsb3codGhlbmFibGUsIHZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0fVxuXHRcdGNhdGNoIChlcnJvcikgeyBmbG93KHRoZW5hYmxlLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdFx0aWYgKCAhcHJlcGVuZFN0YWNrICkgeyBicmVhazsgfVxuXHRcdHRoZW5hYmxlID0gcHJlcGVuZFN0YWNrLnRoZW5hYmxlO1xuXHRcdF9vbnRoZW4gPSBwcmVwZW5kU3RhY2sub250aGVuO1xuXHRcdHByZXBlbmRTdGFjayA9IHByZXBlbmRTdGFjay5uZXh0U3RhY2s7XG5cdH1cblx0cHJlcGVuZGluZyA9IGZhbHNlO1xufVxuXG50eXBlIEZsb3dTdGFjayA9IHsgbmV4dFN0YWNrIDpGbG93U3RhY2sgfCBudWxsLCB0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMgfTtcbnZhciBmbG93U3RhY2sgOkZsb3dTdGFjayB8IG51bGwgPSBudWxsO1xudmFyIGZsb3dpbmcgOmJvb2xlYW4gPSBmYWxzZTtcbmV4cG9ydCBmdW5jdGlvbiBmbG93ICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBmbG93aW5nICkge1xuXHRcdGZsb3dTdGFjayA9IHsgbmV4dFN0YWNrOiBmbG93U3RhY2ssIHRoZW5hYmxlOiB0aGVuYWJsZSwgdmFsdWU6IHZhbHVlLCBzdGF0dXM6IHN0YXR1cyB9O1xuXHRcdHJldHVybjtcblx0fVxuXHRmbG93aW5nID0gdHJ1ZTtcblx0Zm9yICggdmFyIF9zdGF0dXMgOlN0YXR1czsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyh0aGVuYWJsZSk7XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOk9uZnVsZmlsbGVkIHwgdW5kZWZpbmVkID0gZ2V0X29uZnVsZmlsbGVkKHRoZW5hYmxlKTtcblx0XHRcdFx0aWYgKCBfb25mdWxmaWxsZWQgKSB7XG5cdFx0XHRcdFx0ZGVsZXRlX29uZnVsZmlsbGVkKHRoZW5hYmxlKTtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBfb25mdWxmaWxsZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0cHJlcGVuZCh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdF9zdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkhLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gZ2V0X3ZhbHVlKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQcm9taXNlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0ZGVwZW5kKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyh0aGVuYWJsZSkhPT1QRU5ESU5HICkgeyBicmVhayBzdGFjazsgfVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRcdHN0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXModGhlbmFibGUpO1xuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOk9ucmVqZWN0ZWQgfCB1bmRlZmluZWQgPSBnZXRfb25yZWplY3RlZCh0aGVuYWJsZSk7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0ZGVsZXRlX29ucmVqZWN0ZWQodGhlbmFibGUpO1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IF9vbnJlamVjdGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRfc3RhdHVzID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IGdldF92YWx1ZSh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0c3RhdHVzID0gX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdGRlcGVuZCh0aGVuYWJsZSwgdmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgeyBzdGF0dXMgPSBGVUxGSUxMRUQ7IH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGdldF9zdGF0dXModGhlbmFibGUpIT09UEVORElORyApIHsgYnJlYWsgc3RhY2s7IH1cblx0XHRcdFx0XHRcdHZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRzZXRfdmFsdWUodGhlbmFibGUsIHZhbHVlKTtcblx0XHRcdHNldF9zdGF0dXModGhlbmFibGUsIHN0YXR1cyk7XG5cdFx0XHR2YXIgX2RlcGVuZGVudHMgOlByaXZhdGVbXSB8IHVuZGVmaW5lZCA9IGdldF9kZXBlbmRlbnRzKHRoZW5hYmxlKTtcblx0XHRcdGlmICggX2RlcGVuZGVudHMgKSB7XG5cdFx0XHRcdGRlbGV0ZV9kZXBlbmRlbnRzKHRoZW5hYmxlKTtcblx0XHRcdFx0Zm9yICggdmFyIGluZGV4IDpudW1iZXIgPSBfZGVwZW5kZW50cy5sZW5ndGg7IGluZGV4OyApIHtcblx0XHRcdFx0XHRmbG93U3RhY2sgPSB7IG5leHRTdGFjazogZmxvd1N0YWNrLCB0aGVuYWJsZTogX2RlcGVuZGVudHNbLS1pbmRleF0sIHZhbHVlOiB2YWx1ZSwgc3RhdHVzOiBzdGF0dXMgfTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoICFmbG93U3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBmbG93U3RhY2sudGhlbmFibGU7XG5cdFx0dmFsdWUgPSBmbG93U3RhY2sudmFsdWU7XG5cdFx0c3RhdHVzID0gZmxvd1N0YWNrLnN0YXR1cztcblx0XHRmbG93U3RhY2sgPSBmbG93U3RhY2submV4dFN0YWNrO1xuXHR9XG5cdGZsb3dpbmcgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcGVuZCAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDpSZWFkb25seTx7IHRoZW4gKC4uLmFyZ3MgOmFueVtdKSA6YW55IH0+KSA6dm9pZCB7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhbHVlLnRoZW4oXG5cdFx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRmbG93KHRoZW5hYmxlLCB2YWx1ZSwgRlVMRklMTEVEKTtcblx0XHR9LFxuXHRcdGZ1bmN0aW9uIG9ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRmbG93KHRoZW5hYmxlLCBlcnJvciwgUkVKRUNURUQpO1xuXHRcdH1cblx0KTtcbn1cbiIsImltcG9ydCB7IGlzVGhlbmFibGUsIGlzUHJvbWlzZSwgZGVwZW5kLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBQRU5ESU5HLCBQcml2YXRlLCBzZXRfZGVwZW5kZW50cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBnZXRfc3RhdHVzIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzb2x2ZSAodmFsdWU/IDphbnkpIDpQdWJsaWMge1xuXHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkgeyByZXR1cm4gdmFsdWU7IH1cblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0aWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0XHR0cnlfZGVwZW5kKFRISVMsIHZhbHVlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRzZXRfdmFsdWUoVEhJUywgdmFsdWUpO1xuXHRcdHNldF9zdGF0dXMoVEhJUywgRlVMRklMTEVEKTtcblx0fVxuXHRyZXR1cm4gVEhJUztcbn07XG5cbmZ1bmN0aW9uIHRyeV9kZXBlbmQgKFRISVMgOlByaXZhdGUsIHZhbHVlIDphbnkpIHtcblx0dHJ5IHsgZGVwZW5kKFRISVMsIHZhbHVlKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkge1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIGVycm9yKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgUkVKRUNURUQpO1xuXHRcdH1cblx0fVxufVxuXG5pbXBvcnQgUHVibGljIGZyb20gJy4vVGhlbmFibGUnOyIsImltcG9ydCB7IFJFSkVDVEVELCBQcml2YXRlLCBzZXRfc3RhdHVzLCBzZXRfdmFsdWUgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWplY3QgKGVycm9yPyA6YW55KSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdHJldHVybiBUSElTO1xufTtcblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgdW5kZWZpbmVkIGZyb20gJy51bmRlZmluZWQnO1xuXG5pbXBvcnQgeyBQRU5ESU5HLCBSRUpFQ1RFRCwgRlVMRklMTEVELCBmbG93LCBwcmVwZW5kLCBpc1RoZW5hYmxlLCBpc1Byb21pc2UsIFN0YXR1cywgUHJpdmF0ZSwgZ2V0X3N0YXR1cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBkZWxldGVfZGVwZW5kZW50cywgc2V0X2RlcGVuZGVudHMsIGdldF9kZXBlbmRlbnRzLCBnZXRfdmFsdWUsIHNldF9vbmZ1bGZpbGxlZCwgc2V0X29ucmVqZWN0ZWQgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhbGwgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10pIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHR0cnkgeyBhbGxfdHJ5KHZhbHVlcywgVEhJUyk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdGRlbGV0ZV9kZXBlbmRlbnRzKFRISVMpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn07XG5cbmZ1bmN0aW9uIGFsbF90cnkgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10sIFRISVMgOlByaXZhdGUpIDp2b2lkIHtcblx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRmdW5jdGlvbiBvbnJlamVjdGVkIChlcnJvciA6YW55KSA6YW55IHsgZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgJiYgZmxvdyhUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdHZhciBfdmFsdWUgOmFueVtdID0gW107XG5cdHZhciBjb3VudCA6bnVtYmVyID0gMDtcblx0dmFyIGNvdW50ZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdGZvciAoIHZhciBsZW5ndGggOm51bWJlciA9IHZhbHVlcy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0dmFyIHZhbHVlIDphbnkgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdCsrY291bnQ7XG5cdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHZhciB0aGF0IDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFx0XHRcdCggZnVuY3Rpb24gKGluZGV4IDpudW1iZXIpIHtcblx0XHRcdFx0XHRzZXRfb25mdWxmaWxsZWQodGhhdCwgZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0aWYgKCAhLS1jb3VudCAmJiBjb3VudGVkICkgeyBmbG93KFRISVMsIF92YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ICkoaW5kZXgpO1xuXHRcdFx0XHRzZXRfb25yZWplY3RlZCh0aGF0LCBvbnJlamVjdGVkKTtcblx0XHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoYXQpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIF9zdGF0dXM9PT1SRUpFQ1RFRCApIHtcblx0XHRcdFx0c2V0X3ZhbHVlKFRISVMsIGdldF92YWx1ZSh2YWx1ZSkpO1xuXHRcdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHsgX3ZhbHVlW2luZGV4XSA9IGdldF92YWx1ZSh2YWx1ZSk7IH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0XHQrK2NvdW50O1xuXHRcdFx0X3ZhbHVlW2luZGV4XSA9IHVuZGVmaW5lZDtcblx0XHRcdCggZnVuY3Rpb24gKGluZGV4IDpudW1iZXIpIHtcblx0XHRcdFx0dmFyIHJlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0XHRcdFx0dmFsdWUudGhlbihcblx0XHRcdFx0XHRmdW5jdGlvbiBvbmZ1bGZpbGxlZCAodmFsdWUgOmFueSkgOnZvaWQge1xuXHRcdFx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0aWYgKCAhLS1jb3VudCAmJiBjb3VudGVkICkgeyBmbG93KFRISVMsIF92YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0b25yZWplY3RlZFxuXHRcdFx0XHQpO1xuXHRcdFx0fSApKGluZGV4KTtcblx0XHR9XG5cdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSB2YWx1ZTsgfVxuXHR9XG5cdGNvdW50ZWQgPSB0cnVlO1xuXHRpZiAoICFjb3VudCAmJiBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRzZXRfdmFsdWUoVEhJUywgX3ZhbHVlKTtcblx0XHRzZXRfc3RhdHVzKFRISVMsIEZVTEZJTExFRCk7XG5cdFx0ZGVsZXRlX2RlcGVuZGVudHMoVEhJUyk7XG5cdH1cbn1cblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgeyBmbG93LCBwcmVwZW5kLCBQRU5ESU5HLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBTdGF0dXMsIGlzVGhlbmFibGUsIGlzUHJvbWlzZSwgUHJpdmF0ZSwgZ2V0X3N0YXR1cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBkZWxldGVfZGVwZW5kZW50cywgc2V0X2RlcGVuZGVudHMsIGdldF9kZXBlbmRlbnRzLCBnZXRfdmFsdWUsIHNldF9vbmZ1bGZpbGxlZCwgc2V0X29ucmVqZWN0ZWQgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByYWNlICh2YWx1ZXMgOnJlYWRvbmx5IGFueVtdKSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0dHJ5IHsgcmFjZV90cnkodmFsdWVzLCBUSElTKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkge1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIGVycm9yKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgUkVKRUNURUQpO1xuXHRcdFx0ZGVsZXRlX2RlcGVuZGVudHMoVEhJUyk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufTtcblxuZnVuY3Rpb24gcmFjZV90cnkgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10sIFRISVMgOlByaXZhdGUpIDp2b2lkIHtcblx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRmdW5jdGlvbiBvbmZ1bGZpbGxlZCAodmFsdWUgOmFueSkgOmFueSB7IGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICYmIGZsb3coVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0ZnVuY3Rpb24gb25yZWplY3RlZCAoZXJyb3IgOmFueSkgOmFueSB7IGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICYmIGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR2YXIgdGhhdCA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRzZXRfb25mdWxmaWxsZWQodGhhdCwgb25mdWxmaWxsZWQpO1xuXHRzZXRfb25yZWplY3RlZCh0aGF0LCBvbnJlamVjdGVkKTtcblx0Zm9yICggdmFyIGxlbmd0aCA6bnVtYmVyID0gdmFsdWVzLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHR2YXIgdmFsdWUgOmFueSA9IHZhbHVlc1tpbmRleF07XG5cdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgZ2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoYXQpOyB9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2V0X3ZhbHVlKFRISVMsIGdldF92YWx1ZSh2YWx1ZSkpO1xuXHRcdFx0XHRzZXRfc3RhdHVzKFRISVMsIF9zdGF0dXMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0XHR2YWx1ZS50aGVuKG9uZnVsZmlsbGVkLCBvbnJlamVjdGVkKTtcblx0XHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKSE9PVBFTkRJTkcgKSB7IGJyZWFrOyB9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIHZhbHVlKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgRlVMRklMTEVEKTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxufVxuXG5pbXBvcnQgUHVibGljIGZyb20gJy4vVGhlbmFibGUnOyIsImltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5cbmltcG9ydCB7IFByaXZhdGUsIE9udGhlbiwgc2V0X2RlcGVuZGVudHMsIHNldF9vbnRoZW4gfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwZW5kIChvbnRoZW4gOk9udGhlbikgOlB1YmxpYyB7XG5cdGlmICggdHlwZW9mIG9udGhlbiE9PSdmdW5jdGlvbicgKSB7IHRocm93IFR5cGVFcnJvcignVGhlbmFibGUucGVuZChvbnRoZW4gaXMgbm90IGEgZnVuY3Rpb24pJyk7IH1cblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRzZXRfb250aGVuKFRISVMsIG9udGhlbik7XG5cdHJldHVybiBUSElTO1xufTtcblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgeyBpc1RoZW5hYmxlLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBwcmVwZW5kLCBnZXRfc3RhdHVzLCBnZXRfdmFsdWUgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGF3YWl0OiBmdW5jdGlvbiAodmFsdWUgOmFueSkgOmFueSB7XG5cdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0c3dpdGNoICggZ2V0X3N0YXR1cyh2YWx1ZSkgKSB7XG5cdFx0XHRcdGNhc2UgRlVMRklMTEVEOlxuXHRcdFx0XHRcdHJldHVybiBnZXRfdmFsdWUodmFsdWUpO1xuXHRcdFx0XHRjYXNlIFJFSkVDVEVEOlxuXHRcdFx0XHRcdHRocm93IGdldF92YWx1ZSh2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxufS5hd2FpdDtcbiIsImltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5cbmltcG9ydCB7IFBFTkRJTkcsIEZVTEZJTExFRCwgUkVKRUNURUQsIFN0YXR1cywgUHJpdmF0ZSwgaXNUaGVuYWJsZSwgaXNQcm9taXNlLCBmbG93LCBkZXBlbmQsIHByZXBlbmQsIEV4ZWN1dG9yLCBPbmZ1bGZpbGxlZCwgT25yZWplY3RlZCwgUHJpdmF0ZV9jYWxsLCBnZXRfc3RhdHVzLCBnZXRfZGVwZW5kZW50cywgZ2V0X3ZhbHVlLCBzZXRfZGVwZW5kZW50cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBkZWxldGVfZGVwZW5kZW50cyB9IGZyb20gJy4vXyc7XG5cbmV4cG9ydCB7IFB1YmxpYyBhcyBkZWZhdWx0IH07XG5cbnR5cGUgUHVibGljID0gUmVhZG9ubHk8b2JqZWN0ICYge1xuXHR0aGVuICh0aGlzIDpQdWJsaWMsIG9uZnVsZmlsbGVkPyA6T25mdWxmaWxsZWQsIG9ucmVqZWN0ZWQ/IDpPbnJlamVjdGVkKSA6UHVibGljLFxufT47XG5cbnZhciBQdWJsaWMgOnsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfSA9IGZ1bmN0aW9uIFRoZW5hYmxlICh0aGlzIDpQcml2YXRlLCBleGVjdXRvciA6RXhlY3V0b3IpIDp2b2lkIHtcblx0aWYgKCB0eXBlb2YgZXhlY3V0b3IhPT0nZnVuY3Rpb24nICkgeyB0aHJvdyBUeXBlRXJyb3IoJ25ldyBUaGVuYWJsZShleGVjdXRvciBpcyBub3QgYSBmdW5jdGlvbiknKTsgfVxuXHR2YXIgZXhlY3V0ZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhciBfdmFsdWUgOmFueTtcblx0dmFyIF9zdGF0dXMgOlN0YXR1cyB8IHVuZGVmaW5lZDtcblx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHQvL3RoaXMgaW5zdGFuY2VvZiBUaGVuYWJsZSB8fCB0aHJvdyhUeXBlRXJyb3IoKSk7XG5cdFByaXZhdGVfY2FsbChUSElTKTtcblx0dHJ5IHtcblx0XHRleGVjdXRvcihcblx0XHRcdGZ1bmN0aW9uIHJlc29sdmUgKHZhbHVlIDphbnkpIHtcblx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoIGV4ZWN1dGVkICkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0X3N0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkgeyBnZXRfZGVwZW5kZW50cyh2YWx1ZSkhLnB1c2goVEhJUyk7IH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7IGZsb3coVEhJUywgZ2V0X3ZhbHVlKHZhbHVlKSwgX3N0YXR1cyEpOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQcm9taXNlKHZhbHVlKSApIHsgZGVwZW5kKFRISVMsIHZhbHVlKTsgfVxuXHRcdFx0XHRcdFx0ZWxzZSB7IGZsb3coVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7IGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7IGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfSB9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0X3ZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdFx0X3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uIHJlamVjdCAoZXJyb3IgOmFueSkge1xuXHRcdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdGlmICggZXhlY3V0ZWQgKSB7IGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRfdmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRfc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHRcdGlmICggIXJlZCApIHtcblx0XHRcdGV4ZWN1dGVkID0gdHJ1ZTtcblx0XHRcdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCAhcmVkICkge1xuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0dHJ5IHsgckVkKFRISVMsIF9zdGF0dXMhLCBfdmFsdWUpOyB9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRzZXRfdmFsdWUoVEhJUywgZXJyb3IpO1xuXHRcdFx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdFx0XHRkZWxldGVfZGVwZW5kZW50cyhUSElTKTtcblx0XHR9XG5cdH1cbn0gYXMgYW55O1xuXG5mdW5jdGlvbiByRWQgKFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzLCB2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdGlmICggc3RhdHVzPT09RlVMRklMTEVEICkge1xuXHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdHN0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRzZXRfZGVwZW5kZW50cyhUSElTLCBbXSk7XG5cdFx0XHRcdGdldF9kZXBlbmRlbnRzKHZhbHVlKSEucHVzaChUSElTKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzZXRfdmFsdWUoVEhJUywgZ2V0X3ZhbHVlKHZhbHVlKSk7XG5cdFx0XHRcdHNldF9zdGF0dXMoVEhJUywgc3RhdHVzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdFx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRcdFx0ZGVwZW5kKFRISVMsIHZhbHVlKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0c2V0X3ZhbHVlKFRISVMsIHZhbHVlKTtcblx0c2V0X3N0YXR1cyhUSElTLCBzdGF0dXMpO1xufVxuIiwiaW1wb3J0IFR5cGVFcnJvciBmcm9tICcuVHlwZUVycm9yJztcbmltcG9ydCBXZWFrTWFwIGZyb20gJy5XZWFrTWFwJztcbmltcG9ydCB1bmRlZmluZWQgZnJvbSAnLnVuZGVmaW5lZCc7XG5cbmltcG9ydCB7IFBFTkRJTkcsIFJFSkVDVEVELCBGVUxGSUxMRUQsIFByaXZhdGUsIGlzVGhlbmFibGUsIGlzUHJvbWlzZSwgU3RhdHVzLCBkZXBlbmQsIHByZXBlbmQsIE9uZnVsZmlsbGVkLCBPbnJlamVjdGVkLCBnZXRfc3RhdHVzLCBzZXRfZGVwZW5kZW50cywgc2V0X29uZnVsZmlsbGVkLCBzZXRfb25yZWplY3RlZCwgZ2V0X2RlcGVuZGVudHMsIHNldF92YWx1ZSwgZ2V0X3ZhbHVlLCBzZXRfc3RhdHVzIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgdHlwZW9mIFdlYWtNYXA9PT0nZnVuY3Rpb24nXG5cdD8geyB0aGVuOiB0aGVuIH1cblx0OiB7XG5cdFx0X3N0YXR1czogUEVORElORyxcblx0XHRfdmFsdWU6IHVuZGVmaW5lZCxcblx0XHRfZGVwZW5kZW50czogdW5kZWZpbmVkLFxuXHRcdF9vbmZ1bGZpbGxlZDogdW5kZWZpbmVkLFxuXHRcdF9vbnJlamVjdGVkOiB1bmRlZmluZWQsXG5cdFx0X29udGhlbjogdW5kZWZpbmVkLFxuXHRcdHRoZW46IHRoZW5cblx0fTtcblxuZnVuY3Rpb24gdGhlbiAodGhpcyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQ/IDpPbmZ1bGZpbGxlZCwgb25yZWplY3RlZD8gOk9ucmVqZWN0ZWQpIDpQcml2YXRlIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHRpZiAoIGlzVGhlbmFibGUoVEhJUykgKSB7XG5cdFx0cHJlcGVuZChUSElTKTtcblx0XHR2YXIgdGhlbmFibGUgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0XHRzd2l0Y2ggKCBnZXRfc3RhdHVzKFRISVMpICkge1xuXHRcdFx0Y2FzZSBQRU5ESU5HOlxuXHRcdFx0XHRzZXRfZGVwZW5kZW50cyh0aGVuYWJsZSwgW10pO1xuXHRcdFx0XHRpZiAoIHR5cGVvZiBvbmZ1bGZpbGxlZD09PSdmdW5jdGlvbicgKSB7IHNldF9vbmZ1bGZpbGxlZCh0aGVuYWJsZSwgb25mdWxmaWxsZWQpOyB9XG5cdFx0XHRcdGlmICggdHlwZW9mIG9ucmVqZWN0ZWQ9PT0nZnVuY3Rpb24nICkgeyBzZXRfb25yZWplY3RlZCh0aGVuYWJsZSwgb25yZWplY3RlZCk7IH1cblx0XHRcdFx0Z2V0X2RlcGVuZGVudHMoVEhJUykhLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0XHRjYXNlIEZVTEZJTExFRDpcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25mdWxmaWxsZWQ9PT0nZnVuY3Rpb24nICkgeyBvbnRvKFRISVMsIG9uZnVsZmlsbGVkLCB0aGVuYWJsZSk7IH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0c2V0X3ZhbHVlKHRoZW5hYmxlLCBnZXRfdmFsdWUoVEhJUykpO1xuXHRcdFx0XHRcdHNldF9zdGF0dXModGhlbmFibGUsIEZVTEZJTExFRCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdFx0Y2FzZSBSRUpFQ1RFRDpcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25yZWplY3RlZD09PSdmdW5jdGlvbicgKSB7IG9udG8oVEhJUywgb25yZWplY3RlZCwgdGhlbmFibGUpOyB9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgZ2V0X3ZhbHVlKFRISVMpKTtcblx0XHRcdFx0XHRzZXRfc3RhdHVzKHRoZW5hYmxlLCBSRUpFQ1RFRCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdH1cblx0fVxuXHR0aHJvdyBUeXBlRXJyb3IoJ01ldGhvZCBUaGVuYWJsZS5wcm90b3R5cGUudGhlbiBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG59XG5cbmZ1bmN0aW9uIG9udG8gKFRISVMgOlByaXZhdGUsIG9uIDooXyA6YW55KSA9PiBhbnksIHRoZW5hYmxlIDpQcml2YXRlKSB7XG5cdHRyeSB7IG9udG9fdHJ5KHRoZW5hYmxlLCBvbihnZXRfdmFsdWUoVEhJUykpKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIGdldF9zdGF0dXModGhlbmFibGUpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgZXJyb3IpO1xuXHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgUkVKRUNURUQpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBvbnRvX3RyeSAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnkpIDp2b2lkIHtcblx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHR2YXIgc3RhdHVzIDpTdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRpZiAoIHN0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRzZXRfZGVwZW5kZW50cyh0aGVuYWJsZSwgW10pO1xuXHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRzZXRfdmFsdWUodGhlbmFibGUsIGdldF92YWx1ZSh2YWx1ZSkpO1xuXHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgc3RhdHVzKTtcblx0XHR9XG5cdH1cblx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0c2V0X2RlcGVuZGVudHModGhlbmFibGUsIFtdKTtcblx0XHRkZXBlbmQodGhlbmFibGUsIHZhbHVlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRzZXRfdmFsdWUodGhlbmFibGUsIHZhbHVlKTtcblx0XHRzZXRfc3RhdHVzKHRoZW5hYmxlLCBGVUxGSUxMRUQpO1xuXHR9XG59XG4iLCJpbXBvcnQgV2Vha01hcCBmcm9tICcuV2Vha01hcCc7XG5pbXBvcnQgZnJlZXplIGZyb20gJy5PYmplY3QuZnJlZXplJztcbmltcG9ydCBzZWFsIGZyb20gJy5PYmplY3Quc2VhbCc7XG5cbmltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IHJlc29sdmUgZnJvbSAnLi9yZXNvbHZlJztcbmltcG9ydCByZWplY3QgZnJvbSAnLi9yZWplY3QnO1xuaW1wb3J0IGFsbCBmcm9tICcuL2FsbCc7XG5pbXBvcnQgcmFjZSBmcm9tICcuL3JhY2UnO1xuaW1wb3J0IHBlbmQgZnJvbSAnLi9wZW5kJztcbmltcG9ydCBBV0FJVCBmcm9tICcuL2F3YWl0JztcbmV4cG9ydCB7XG5cdHJlc29sdmUsXG5cdHJlamVjdCxcblx0YWxsLFxuXHRyYWNlLFxuXHRwZW5kLFxuXHRBV0FJVCBhcyBhd2FpdCxcbn07XG5cbmltcG9ydCB7IFByaXZhdGUsIEV4ZWN1dG9yIH0gZnJvbSAnLi9fJztcbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7XG5pbXBvcnQgcHJvdG90eXBlIGZyb20gJy4vVGhlbmFibGUucHJvdG90eXBlJztcblB1YmxpYy5wcm90b3R5cGUgPSBQcml2YXRlLnByb3RvdHlwZSA9IHR5cGVvZiBXZWFrTWFwPT09J2Z1bmN0aW9uJyA/IC8qI19fUFVSRV9fKi8gZnJlZXplKHByb3RvdHlwZSkgOiBzZWFsID8gLyojX19QVVJFX18qLyBzZWFsKHByb3RvdHlwZSkgOiBwcm90b3R5cGU7XG5cbmltcG9ydCBEZWZhdWx0IGZyb20gJy5kZWZhdWx0Pz0nO1xuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdChQdWJsaWMsIHtcblx0dmVyc2lvbjogdmVyc2lvbixcblx0VGhlbmFibGU6IFB1YmxpYyxcblx0cmVzb2x2ZTogcmVzb2x2ZSxcblx0cmVqZWN0OiByZWplY3QsXG5cdGFsbDogYWxsLFxuXHRyYWNlOiByYWNlLFxuXHRwZW5kOiBwZW5kLFxuXHRhd2FpdDogQVdBSVRcbn0pO1xuXG52YXIgVGhlbmFibGUgOlJlYWRvbmx5PHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfT4gPSBmcmVlemUgPyAvKiNfX1BVUkVfXyovIGZyZWV6ZShQdWJsaWMpIDogUHVibGljO1xudHlwZSBUaGVuYWJsZSA9IFB1YmxpYztcbmV4cG9ydCB7IFRoZW5hYmxlIH07XG4iXSwibmFtZXMiOlsidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxjQUFlLE9BQU87Ozs7Ozs7Ozs7c0JBQUMsdEJDcUJoQixJQUFJLE9BQU8sR0FBTSxDQUFD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UyxRQUFRLENBQUUsUUFBaUIsRUFBRSxLQUFVO0lBQy9DLElBQUssVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFHO1FBQ3hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNmLElBQUksTUFBTSxHQUFXLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QyxJQUFLLE1BQU0sS0FBRyxPQUFPLEVBQUc7WUFDdkIsY0FBYyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM3QixjQUFjLENBQUMsS0FBSyxDQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3RDO2FBQ0k7WUFDSixTQUFTLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDN0I7S0FDRDtTQUNJLElBQUssU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFHO1FBQzVCLGNBQWMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN4QjtTQUNJO1FBQ0osU0FBUyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQixVQUFVLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ2hDO0NBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2REQsTUFBTSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sT0FBTyxLQUFHLFVBQVUsaUJBQWlCLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLGlCQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO0FBRXhKLEFBQ0EsY0FBZSxPQUFPLENBQUMsTUFBTSxFQUFFO0lBQzlCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLE1BQU0sRUFBRSxNQUFNO0lBQ2QsR0FBRyxFQUFFLEdBQUc7SUFDUixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsS0FBSyxFQUFFLEtBQUs7Q0FDWixDQUFDLENBQUM7QUFFSCxJQUFJLFFBQVEsR0FBbUQsTUFBTSxpQkFBaUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU07Ozs7Ozs7OzsiLCJzb3VyY2VSb290IjoiLi4vLi4vc3JjLyJ9