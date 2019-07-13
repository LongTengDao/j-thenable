/*!
 * 模块名称：j-thenable
 * 模块功能：模仿 Promise API 的同步防爆栈工具。从属于“简计划”。
   　　　　　Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".
 * 模块版本：4.1.0
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

    var freeze = Object.freeze;

    var seal = Object.seal;

    var version = '4.1.0';

    var Promise_prototype = typeof Promise!=='undefined' ? Promise.prototype : undefined;

    var getPrototypeOf = Object.getPrototypeOf;

    var undefined$1 = void 0;

    var PENDING = 0;
    var FULFILLED = 1;
    var REJECTED = 2;
    var Private_call;
    var Private = function () { Private_call(this); };
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
        Private_call = function Private_call(THIS) { STATUS.set(THIS, PENDING); };
        isThenable = function isThenable(value) { return STATUS.has(value); };
        /* delete: */
        delete_dependents = function delete_dependents(THIS) { DEPENDENTS['delete'](THIS); };
        delete_onfulfilled = function delete_onfulfilled(THIS) { ONFULFILLED['delete'](THIS); };
        delete_onrejected = function delete_onrejected(THIS) { ONREJECTED['delete'](THIS); };
        delete_onthen = function delete_onthen(THIS) { ONTHEN['delete'](THIS); };
        delete_onfulfilled_if_has = function delete_onfulfilled_if_has(THIS) { ONFULFILLED['delete'](THIS); };
        delete_onrejected_if_has = function delete_onrejected_if_has(THIS) { ONREJECTED['delete'](THIS); }; /**/
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
        delete_onrejected = function delete_onrejected(THIS) { THIS._onrejected = undefined$1; };
        delete_onfulfilled = function delete_onfulfilled(THIS) { THIS._onfulfilled = undefined$1; };
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
        function _onrejected(error) { get_status(THIS) === PENDING && flow(THIS, error, REJECTED); }
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
                    get_dependents(value).push({
                        _status: 0,
                        _value: undefined$1,
                        _dependents: undefined$1,
                        _onfulfilled: function (index) {
                            return function (value) {
                                if (get_status(THIS) === PENDING) {
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
                value.then(function (index) {
                    var red;
                    return function (value) {
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
                    };
                }(index), _onrejected);
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
        function _onfulfilled(value) { get_status(THIS) === PENDING && flow(THIS, value, FULFILLED); }
        function _onrejected(error) { get_status(THIS) === PENDING && flow(THIS, error, REJECTED); }
        var that = {
            _status: 0,
            _value: undefined$1,
            _dependents: undefined$1,
            _onfulfilled: _onfulfilled,
            _onrejected: _onrejected
        };
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
                value.then(_onfulfilled, _onrejected);
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
        var thenable = new Private;
        switch (get_status(THIS)) {
            case PENDING:
                prepend(THIS);
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
                prepend(THIS);
                if (typeof onfulfilled === 'function') {
                    onto(THIS, onfulfilled, thenable);
                }
                else {
                    set_value(thenable, get_value(THIS));
                    set_status(thenable, FULFILLED);
                }
                return thenable;
            case REJECTED:
                prepend(THIS);
                if (typeof onrejected === 'function') {
                    onto(THIS, onrejected, thenable);
                }
                else {
                    set_value(thenable, get_value(THIS));
                    set_status(thenable, REJECTED);
                }
                return thenable;
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

    return _export;

}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsIl8udHMiLCJyZXNvbHZlLnRzIiwicmVqZWN0LnRzIiwiYWxsLnRzIiwicmFjZS50cyIsInBlbmQudHMiLCJhd2FpdC50cyIsIlRoZW5hYmxlLnRzIiwiVGhlbmFibGUucHJvdG90eXBlLnRzIiwiZXhwb3J0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0ICc0LjEuMCc7IiwiaW1wb3J0IFByb21pc2VfcHJvdG90eXBlIGZyb20gJy5Qcm9taXNlLnByb3RvdHlwZT8nO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLldlYWtNYXAnO1xuaW1wb3J0IGdldFByb3RvdHlwZU9mIGZyb20gJy5PYmplY3QuZ2V0UHJvdG90eXBlT2YnO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxuZXhwb3J0IHR5cGUgRXhlY3V0b3IgPSAocmVzb2x2ZT8gOih2YWx1ZSA6YW55KSA9PiB2b2lkLCByZWplY3Q/IDooZXJyb3IgOmFueSkgPT4gdm9pZCkgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIE9uZnVsZmlsbGVkID0gKHZhbHVlIDphbnkpID0+IGFueTtcbmV4cG9ydCB0eXBlIE9ucmVqZWN0ZWQgPSAoZXJyb3IgOmFueSkgPT4gYW55O1xuZXhwb3J0IHR5cGUgT250aGVuID0gKCkgPT4gYW55O1xuZXhwb3J0IHR5cGUgU3RhdHVzID0gMCB8IDEgfCAyO1xuZXhwb3J0IHR5cGUgUHJpdmF0ZSA9IHtcblx0X3N0YXR1cyA6U3RhdHVzLFxuXHRfdmFsdWUgOmFueSxcblx0X2RlcGVuZGVudHMgOlByaXZhdGVbXSB8IHVuZGVmaW5lZCxcblx0X29uZnVsZmlsbGVkIDpPbmZ1bGZpbGxlZCB8IHVuZGVmaW5lZCxcblx0X29ucmVqZWN0ZWQgOk9ucmVqZWN0ZWQgfCB1bmRlZmluZWQsXG5cdF9vbnRoZW4gOk9udGhlbiB8IHVuZGVmaW5lZCxcblx0dGhlbiAodGhpcyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQ/IDpPbmZ1bGZpbGxlZCwgb25yZWplY3RlZD8gOk9ucmVqZWN0ZWQpIDpQcml2YXRlLFxufTtcblxuZXhwb3J0IHZhciBQRU5ESU5HIDowID0gMDtcbmV4cG9ydCB2YXIgRlVMRklMTEVEIDoxID0gMTtcbmV4cG9ydCB2YXIgUkVKRUNURUQgOjIgPSAyO1xuXG5leHBvcnQgdmFyIFByaXZhdGVfY2FsbCA6KFRISVMgOlByaXZhdGUpID0+IHZvaWQ7XG5leHBvcnQgdmFyIFByaXZhdGUgOnsgbmV3ICgpIDpQcml2YXRlIH0gPSBmdW5jdGlvbiAodGhpcyA6UHJpdmF0ZSkgOnZvaWQgeyBQcml2YXRlX2NhbGwodGhpcyk7IH0gYXMgYW55O1xuZXhwb3J0IHZhciBpc1RoZW5hYmxlIDoodmFsdWUgOmFueSkgPT4gdmFsdWUgaXMgUHJpdmF0ZTtcblxuZXhwb3J0IHZhciBkZWxldGVfZGVwZW5kZW50cyA6KFRISVMgOlByaXZhdGUpID0+IHZvaWQ7XG52YXIgZGVsZXRlX29ucmVqZWN0ZWQgOihUSElTIDpQcml2YXRlKSA9PiB2b2lkO1xudmFyIGRlbGV0ZV9vbmZ1bGZpbGxlZCA6KFRISVMgOlByaXZhdGUpID0+IHZvaWQ7XG52YXIgZGVsZXRlX29udGhlbiA6KFRISVMgOlByaXZhdGUpID0+IHZvaWQ7XG5cbnZhciBkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb25yZWplY3RlZF9pZl9oYXMgOihUSElTIDpQcml2YXRlKSA9PiB2b2lkO1xuXG5leHBvcnQgdmFyIGdldF9zdGF0dXMgOihUSElTIDpQcml2YXRlKSA9PiBTdGF0dXM7XG5leHBvcnQgdmFyIGdldF92YWx1ZSA6KFRISVMgOlByaXZhdGUpID0+IGFueTtcbmV4cG9ydCB2YXIgZ2V0X2RlcGVuZGVudHMgOihUSElTIDpQcml2YXRlKSA9PiBQcml2YXRlW10gfCB1bmRlZmluZWQ7XG52YXIgZ2V0X29uZnVsZmlsbGVkIDooVEhJUyA6UHJpdmF0ZSkgPT4gT25mdWxmaWxsZWQgfCB1bmRlZmluZWQ7XG52YXIgZ2V0X29ucmVqZWN0ZWQgOihUSElTIDpQcml2YXRlKSA9PiBPbnJlamVjdGVkIHwgdW5kZWZpbmVkO1xudmFyIGdldF9vbnRoZW4gOihUSElTIDpQcml2YXRlKSA9PiBPbnRoZW4gfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB2YXIgc2V0X3N0YXR1cyA6KFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzKSA9PiB2b2lkO1xuZXhwb3J0IHZhciBzZXRfdmFsdWUgOihUSElTIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA9PiB2b2lkO1xuZXhwb3J0IHZhciBzZXRfZGVwZW5kZW50cyA6KFRISVMgOlByaXZhdGUsIGRlcGVuZGVudHMgOlByaXZhdGVbXSkgPT4gdm9pZDtcbmV4cG9ydCB2YXIgc2V0X29uZnVsZmlsbGVkIDooVEhJUyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQgOk9uZnVsZmlsbGVkKSA9PiB2b2lkO1xuZXhwb3J0IHZhciBzZXRfb25yZWplY3RlZCA6KFRISVMgOlByaXZhdGUsIG9ucmVqZWN0ZWQgOk9ucmVqZWN0ZWQpID0+IHZvaWQ7XG5leHBvcnQgdmFyIHNldF9vbnRoZW4gOihUSElTIDpQcml2YXRlLCBvbnRoZW4gOk9udGhlbikgPT4gdm9pZDtcblxuaWYgKCB0eXBlb2YgV2Vha01hcD09PSdmdW5jdGlvbicgKSB7XG5cdHZhciBTVEFUVVMgOldlYWtNYXA8UHJpdmF0ZSwgU3RhdHVzPiA9IG5ldyBXZWFrTWFwO1xuXHR2YXIgVkFMVUUgOldlYWtNYXA8UHJpdmF0ZSwgYW55PiA9IG5ldyBXZWFrTWFwO1xuXHR2YXIgREVQRU5ERU5UUyA6V2Vha01hcDxQcml2YXRlLCBQcml2YXRlW10+ID0gbmV3IFdlYWtNYXA7XG5cdHZhciBPTkZVTEZJTExFRCA6V2Vha01hcDxQcml2YXRlLCBPbmZ1bGZpbGxlZD4gPSBuZXcgV2Vha01hcDtcblx0dmFyIE9OUkVKRUNURUQgOldlYWtNYXA8UHJpdmF0ZSwgT25yZWplY3RlZD4gPSBuZXcgV2Vha01hcDtcblx0dmFyIE9OVEhFTiA6V2Vha01hcDxQcml2YXRlLCBPbnRoZW4+ID0gbmV3IFdlYWtNYXA7XG5cdFxuXHRQcml2YXRlX2NhbGwgPSBmdW5jdGlvbiBQcml2YXRlX2NhbGwgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgU1RBVFVTLnNldChUSElTLCBQRU5ESU5HKTsgfTtcblx0aXNUaGVuYWJsZSA9IGZ1bmN0aW9uIGlzVGhlbmFibGUgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBQcml2YXRlIHsgcmV0dXJuIFNUQVRVUy5oYXModmFsdWUpOyB9O1xuXHRcblx0LyogZGVsZXRlOiAqL1xuXHRkZWxldGVfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGRlbGV0ZV9kZXBlbmRlbnRzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IERFUEVOREVOVFNbJ2RlbGV0ZSddKFRISVMpOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBkZWxldGVfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05GVUxGSUxMRURbJ2RlbGV0ZSddKFRISVMpOyB9O1xuXHRkZWxldGVfb25yZWplY3RlZCA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnJlamVjdGVkIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9OUkVKRUNURURbJ2RlbGV0ZSddKFRISVMpOyB9O1xuXHRkZWxldGVfb250aGVuID0gZnVuY3Rpb24gZGVsZXRlX29udGhlbiAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTlRIRU5bJ2RlbGV0ZSddKFRISVMpOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzID0gZnVuY3Rpb24gZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTkZVTEZJTExFRFsnZGVsZXRlJ10oVEhJUyk7IH07XG5cdGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTlJFSkVDVEVEWydkZWxldGUnXShUSElTKTsgfTsvKiovXG5cdC8qIHNldCB1bmRlZmluZWQ6ICogL1xuXHRkZWxldGVfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGRlbGV0ZV9kZXBlbmRlbnRzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IERFUEVOREVOVFMuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBkZWxldGVfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05GVUxGSUxMRUQuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb25yZWplY3RlZCA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnJlamVjdGVkIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9OUkVKRUNURUQuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb250aGVuID0gZnVuY3Rpb24gZGVsZXRlX29udGhlbiAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTlRIRU4uc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzID0gZnVuY3Rpb24gZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTkZVTEZJTExFRC5oYXMoVEhJUykgJiYgT05GVUxGSUxMRUQuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9O1xuXHRkZWxldGVfb25yZWplY3RlZF9pZl9oYXMgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZF9pZl9oYXMgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05SRUpFQ1RFRC5oYXMoVEhJUykgJiYgT05SRUpFQ1RFRC5zZXQoVEhJUywgdW5kZWZpbmVkISk7IH07LyoqL1xuXHRcblx0Z2V0X3N0YXR1cyA9IGZ1bmN0aW9uIGdldF9zdGF0dXMgKFRISVMgOlByaXZhdGUpIDpTdGF0dXMgeyByZXR1cm4gU1RBVFVTLmdldChUSElTKSE7IH07XG5cdGdldF92YWx1ZSA9IGZ1bmN0aW9uIGdldF92YWx1ZSAoVEhJUyA6UHJpdmF0ZSkgOmFueSB7IHJldHVybiBWQUxVRS5nZXQoVEhJUyk7IH07XG5cdGdldF9kZXBlbmRlbnRzID0gZnVuY3Rpb24gZ2V0X2RlcGVuZGVudHMgKFRISVMgOlByaXZhdGUpIDpQcml2YXRlW10gfCB1bmRlZmluZWQgeyByZXR1cm4gREVQRU5ERU5UUy5nZXQoVEhJUyk7IH07XG5cdGdldF9vbmZ1bGZpbGxlZCA9IGZ1bmN0aW9uIGdldF9vbmZ1bGZpbGxlZCAoVEhJUyA6UHJpdmF0ZSkgOk9uZnVsZmlsbGVkIHwgdW5kZWZpbmVkIHsgcmV0dXJuIE9ORlVMRklMTEVELmdldChUSElTKTsgfTtcblx0Z2V0X29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBnZXRfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOk9ucmVqZWN0ZWQgfCB1bmRlZmluZWQgeyByZXR1cm4gT05SRUpFQ1RFRC5nZXQoVEhJUyk7IH07XG5cdGdldF9vbnRoZW4gPSBmdW5jdGlvbiBnZXRfb250aGVuIChUSElTIDpQcml2YXRlKSA6T250aGVuIHwgdW5kZWZpbmVkIHsgcmV0dXJuIE9OVEhFTi5nZXQoVEhJUyk7IH07XG5cdFxuXHRzZXRfc3RhdHVzID0gZnVuY3Rpb24gc2V0X3N0YXR1cyAoVEhJUyA6UHJpdmF0ZSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHsgU1RBVFVTLnNldChUSElTLCBzdGF0dXMpOyB9O1xuXHRzZXRfdmFsdWUgPSBmdW5jdGlvbiBzZXRfdmFsdWUgKFRISVMgOlByaXZhdGUsIHZhbHVlIDphbnkpIDp2b2lkIHsgVkFMVUUuc2V0KFRISVMsIHZhbHVlKTsgfTtcblx0c2V0X2RlcGVuZGVudHMgPSBmdW5jdGlvbiBzZXRfZGVwZW5kZW50cyAoVEhJUyA6UHJpdmF0ZSwgZGVwZW5kZW50cyA6UHJpdmF0ZVtdKSA6dm9pZCB7IERFUEVOREVOVFMuc2V0KFRISVMsIGRlcGVuZGVudHMpOyB9O1xuXHRzZXRfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBzZXRfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUsIG9uZnVsZmlsbGVkIDpPbmZ1bGZpbGxlZCkgOnZvaWQgeyBPTkZVTEZJTExFRC5zZXQoVEhJUywgb25mdWxmaWxsZWQpOyB9O1xuXHRzZXRfb25yZWplY3RlZCA9IGZ1bmN0aW9uIHNldF9vbnJlamVjdGVkIChUSElTIDpQcml2YXRlLCBvbnJlamVjdGVkIDpPbnJlamVjdGVkKSA6dm9pZCB7IE9OUkVKRUNURUQuc2V0KFRISVMsIG9ucmVqZWN0ZWQpOyB9O1xuXHRzZXRfb250aGVuID0gZnVuY3Rpb24gc2V0X29udGhlbiAoVEhJUyA6UHJpdmF0ZSwgb250aGVuIDpPbnRoZW4pIDp2b2lkIHsgT05USEVOLnNldChUSElTLCBvbnRoZW4pOyB9O1xufVxuZWxzZSB7XG5cdFByaXZhdGVfY2FsbCA9IGZ1bmN0aW9uIFByaXZhdGVfY2FsbCAoKSA6dm9pZCB7IH07XG5cdGlzVGhlbmFibGUgPSBnZXRQcm90b3R5cGVPZlxuXHRcdD8gZnVuY3Rpb24gKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBQcml2YXRlIHtcblx0XHRcdHZhciBQcml2YXRlX3Byb3RvdHlwZSA6UHJpdmF0ZSA9IFByaXZhdGUucHJvdG90eXBlO1xuXHRcdFx0aXNUaGVuYWJsZSA9IGZ1bmN0aW9uIGlzVGhlbmFibGUgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBQcml2YXRlIHsgcmV0dXJuIHZhbHVlIT1udWxsICYmIGdldFByb3RvdHlwZU9mKHZhbHVlKT09PVByaXZhdGVfcHJvdG90eXBlOyB9O1xuXHRcdFx0cmV0dXJuIGlzVGhlbmFibGUodmFsdWUpO1xuXHRcdH1cblx0XHQ6IGZ1bmN0aW9uIGlzVGhlbmFibGUgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBQcml2YXRlIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUHJpdmF0ZTsgfTtcblx0XG5cdC8qIHNldCB1bmRlZmluZWQ6ICovXG5cdGRlbGV0ZV9kZXBlbmRlbnRzID0gZnVuY3Rpb24gZGVsZXRlX2RlcGVuZGVudHMgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgVEhJUy5fZGVwZW5kZW50cyA9IHVuZGVmaW5lZDsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBUSElTLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9O1xuXHRkZWxldGVfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBkZWxldGVfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgVEhJUy5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7IH07XG5cdGRlbGV0ZV9vbnRoZW4gPSBmdW5jdGlvbiBkZWxldGVfb250aGVuIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IFRISVMuX29udGhlbiA9IHVuZGVmaW5lZDsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyA9IGZ1bmN0aW9uIGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXMgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgaWYgKCBUSElTLl9vbmZ1bGZpbGxlZCApIHsgVEhJUy5fb25mdWxmaWxsZWQgPSB1bmRlZmluZWQ7IH0gfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzID0gZnVuY3Rpb24gZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IGlmICggVEhJUy5fb25yZWplY3RlZCApIHsgVEhJUy5fb25yZWplY3RlZCA9IHVuZGVmaW5lZDsgfSB9Oy8qKi9cblx0XG5cdGdldF9zdGF0dXMgPSBmdW5jdGlvbiBnZXRfc3RhdHVzIChUSElTIDpQcml2YXRlKSA6U3RhdHVzIHsgcmV0dXJuIFRISVMuX3N0YXR1czsgfTtcblx0Z2V0X3ZhbHVlID0gZnVuY3Rpb24gZ2V0X3ZhbHVlIChUSElTIDpQcml2YXRlKSA6YW55IHsgcmV0dXJuIFRISVMuX3ZhbHVlOyB9O1xuXHRnZXRfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGdldF9kZXBlbmRlbnRzIChUSElTIDpQcml2YXRlKSA6UHJpdmF0ZVtdIHwgdW5kZWZpbmVkIHsgcmV0dXJuIFRISVMuX2RlcGVuZGVudHM7IH07XG5cdGdldF9vbmZ1bGZpbGxlZCA9IGZ1bmN0aW9uIGdldF9vbmZ1bGZpbGxlZCAoVEhJUyA6UHJpdmF0ZSkgOk9uZnVsZmlsbGVkIHwgdW5kZWZpbmVkIHsgcmV0dXJuIFRISVMuX29uZnVsZmlsbGVkOyB9O1xuXHRnZXRfb25yZWplY3RlZCA9IGZ1bmN0aW9uIGdldF9vbnJlamVjdGVkIChUSElTIDpQcml2YXRlKSA6T25yZWplY3RlZCB8IHVuZGVmaW5lZCB7IHJldHVybiBUSElTLl9vbnJlamVjdGVkOyB9O1xuXHRnZXRfb250aGVuID0gZnVuY3Rpb24gZ2V0X29udGhlbiAoVEhJUyA6UHJpdmF0ZSkgOk9udGhlbiB8IHVuZGVmaW5lZCB7IHJldHVybiBUSElTLl9vbnRoZW47IH07XG5cdFxuXHRzZXRfc3RhdHVzID0gZnVuY3Rpb24gc2V0X3N0YXR1cyAoVEhJUyA6UHJpdmF0ZSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHsgVEhJUy5fc3RhdHVzID0gc3RhdHVzOyB9O1xuXHRzZXRfdmFsdWUgPSBmdW5jdGlvbiBzZXRfdmFsdWUgKFRISVMgOlByaXZhdGUsIHZhbHVlIDphbnkpIDp2b2lkIHsgVEhJUy5fdmFsdWUgPSB2YWx1ZTsgfTtcblx0c2V0X2RlcGVuZGVudHMgPSBmdW5jdGlvbiBzZXRfZGVwZW5kZW50cyAoVEhJUyA6UHJpdmF0ZSwgZGVwZW5kZW50cyA6UHJpdmF0ZVtdKSA6dm9pZCB7IFRISVMuX2RlcGVuZGVudHMgPSBkZXBlbmRlbnRzOyB9O1xuXHRzZXRfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBzZXRfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUsIG9uZnVsZmlsbGVkIDpPbmZ1bGZpbGxlZCkgOnZvaWQgeyBUSElTLl9vbmZ1bGZpbGxlZCA9IG9uZnVsZmlsbGVkOyB9O1xuXHRzZXRfb25yZWplY3RlZCA9IGZ1bmN0aW9uIHNldF9vbnJlamVjdGVkIChUSElTIDpQcml2YXRlLCBvbnJlamVjdGVkIDpPbnJlamVjdGVkKSA6dm9pZCB7IFRISVMuX29ucmVqZWN0ZWQgPSBvbnJlamVjdGVkOyB9O1xuXHRzZXRfb250aGVuID0gZnVuY3Rpb24gc2V0X29udGhlbiAoVEhJUyA6UHJpdmF0ZSwgb250aGVuIDpPbnRoZW4pIDp2b2lkIHsgVEhJUy5fb250aGVuID0gb250aGVuOyB9O1xufVxuXG5leHBvcnQgdmFyIGlzUHJvbWlzZSA6KHZhbHVlIDphbnkpID0+IHZhbHVlIGlzIFJlYWRvbmx5PFByb21pc2U8YW55Pj4gPSBQcm9taXNlX3Byb3RvdHlwZVxuXHQ/IGdldFByb3RvdHlwZU9mXG5cdFx0PyBmdW5jdGlvbiBpc1Byb21pc2UgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBSZWFkb25seTxQcm9taXNlPGFueT4+IHsgcmV0dXJuIHZhbHVlIT1udWxsICYmIGdldFByb3RvdHlwZU9mKHZhbHVlKT09PVByb21pc2VfcHJvdG90eXBlOyB9XG5cdFx0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRmdW5jdGlvbiBQcm9taXNlICgpIHt9XG5cdFx0XHRQcm9taXNlLnByb3RvdHlwZSA9IFByb21pc2VfcHJvdG90eXBlO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIGlzUHJvbWlzZSAodmFsdWUgOmFueSkgOnZhbHVlIGlzIFJlYWRvbmx5PFByb21pc2U8YW55Pj4geyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlOyB9O1xuXHRcdH0oKVxuXHQ6IGZ1bmN0aW9uIGlzUHJvbWlzZSAoKSB7IHJldHVybiBmYWxzZTsgfSBhcyBhbnk7XG5cbnR5cGUgUHJlcGVuZFN0YWNrID0geyBuZXh0U3RhY2sgOlByZXBlbmRTdGFjayB8IG51bGwsIHRoZW5hYmxlIDpQcml2YXRlLCBvbnRoZW4gOk9udGhlbiB9O1xudmFyIHByZXBlbmRTdGFjayA6UHJlcGVuZFN0YWNrIHwgbnVsbCA9IG51bGw7XG52YXIgcHJlcGVuZGluZyA6Ym9vbGVhbiA9IGZhbHNlO1xuZXhwb3J0IGZ1bmN0aW9uIHByZXBlbmQgKHRoZW5hYmxlIDpQcml2YXRlKSA6dm9pZCB7XG5cdHZhciBfb250aGVuIDpPbnRoZW4gfCB1bmRlZmluZWQgPSBnZXRfb250aGVuKHRoZW5hYmxlKTtcblx0aWYgKCAhX29udGhlbiApIHsgcmV0dXJuOyB9XG5cdGRlbGV0ZV9vbnRoZW4odGhlbmFibGUpO1xuXHRpZiAoIHByZXBlbmRpbmcgKSB7XG5cdFx0cHJlcGVuZFN0YWNrID0geyBuZXh0U3RhY2s6IHByZXBlbmRTdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCBvbnRoZW46IF9vbnRoZW4gfTtcblx0XHRyZXR1cm47XG5cdH1cblx0cHJlcGVuZGluZyA9IHRydWU7XG5cdGZvciAoIDsgOyApIHtcblx0XHR0cnkge1xuXHRcdFx0dmFyIHZhbHVlIDphbnkgPSBfb250aGVuKCk7XG5cdFx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0XHRfb250aGVuID0gZ2V0X29udGhlbih2YWx1ZSk7XG5cdFx0XHRcdGlmICggX29udGhlbiApIHtcblx0XHRcdFx0XHRkZWxldGVfb250aGVuKHZhbHVlKTtcblx0XHRcdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkhLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdHByZXBlbmRTdGFjayA9IHsgbmV4dFN0YWNrOiBwcmVwZW5kU3RhY2ssIHRoZW5hYmxlOiB2YWx1ZSwgb250aGVuOiBfb250aGVuIH07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHN0YXR1cyA6U3RhdHVzID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKCBzdGF0dXM9PT1QRU5ESU5HICkgeyBnZXRfZGVwZW5kZW50cyh2YWx1ZSkhLnB1c2godGhlbmFibGUpOyB9XG5cdFx0XHRcdFx0ZWxzZSB7IGZsb3codGhlbmFibGUsIGdldF92YWx1ZSh2YWx1ZSksIHN0YXR1cyk7IH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7IGRlcGVuZCh0aGVuYWJsZSwgdmFsdWUpOyB9XG5cdFx0XHRlbHNlIHsgZmxvdyh0aGVuYWJsZSwgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHR9XG5cdFx0Y2F0Y2ggKGVycm9yKSB7IGZsb3codGhlbmFibGUsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0XHRpZiAoICFwcmVwZW5kU3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBwcmVwZW5kU3RhY2sudGhlbmFibGU7XG5cdFx0X29udGhlbiA9IHByZXBlbmRTdGFjay5vbnRoZW47XG5cdFx0cHJlcGVuZFN0YWNrID0gcHJlcGVuZFN0YWNrLm5leHRTdGFjaztcblx0fVxuXHRwcmVwZW5kaW5nID0gZmFsc2U7XG59XG5cbnR5cGUgRmxvd1N0YWNrID0geyBuZXh0U3RhY2sgOkZsb3dTdGFjayB8IG51bGwsIHRoZW5hYmxlIDpQcml2YXRlLCB2YWx1ZSA6YW55LCBzdGF0dXMgOlN0YXR1cyB9O1xudmFyIGZsb3dTdGFjayA6Rmxvd1N0YWNrIHwgbnVsbCA9IG51bGw7XG52YXIgZmxvd2luZyA6Ym9vbGVhbiA9IGZhbHNlO1xuZXhwb3J0IGZ1bmN0aW9uIGZsb3cgKHRoZW5hYmxlIDpQcml2YXRlLCB2YWx1ZSA6YW55LCBzdGF0dXMgOlN0YXR1cykgOnZvaWQge1xuXHRpZiAoIGZsb3dpbmcgKSB7XG5cdFx0Zmxvd1N0YWNrID0geyBuZXh0U3RhY2s6IGZsb3dTdGFjaywgdGhlbmFibGU6IHRoZW5hYmxlLCB2YWx1ZTogdmFsdWUsIHN0YXR1czogc3RhdHVzIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGZsb3dpbmcgPSB0cnVlO1xuXHRmb3IgKCB2YXIgX3N0YXR1cyA6U3RhdHVzOyA7ICkge1xuXHRcdHN0YWNrOiB7XG5cdFx0XHRpZiAoIHN0YXR1cz09PUZVTEZJTExFRCApIHtcblx0XHRcdFx0ZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzKHRoZW5hYmxlKTtcblx0XHRcdFx0dmFyIF9vbmZ1bGZpbGxlZCA6T25mdWxmaWxsZWQgfCB1bmRlZmluZWQgPSBnZXRfb25mdWxmaWxsZWQodGhlbmFibGUpO1xuXHRcdFx0XHRpZiAoIF9vbmZ1bGZpbGxlZCApIHtcblx0XHRcdFx0XHRkZWxldGVfb25mdWxmaWxsZWQodGhlbmFibGUpO1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IF9vbmZ1bGZpbGxlZCh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0X3N0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRcdFx0XHRcdGdldF9kZXBlbmRlbnRzKHZhbHVlKSEucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSBnZXRfdmFsdWUodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1cyA9IF9zdGF0dXM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRkZXBlbmQodGhlbmFibGUsIHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0YnJlYWsgc3RhY2s7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0aWYgKCBnZXRfc3RhdHVzKHRoZW5hYmxlKSE9PVBFTkRJTkcgKSB7IGJyZWFrIHN0YWNrOyB9XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGVycm9yO1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyh0aGVuYWJsZSk7XG5cdFx0XHRcdHZhciBfb25yZWplY3RlZCA6T25yZWplY3RlZCB8IHVuZGVmaW5lZCA9IGdldF9vbnJlamVjdGVkKHRoZW5hYmxlKTtcblx0XHRcdFx0aWYgKCBfb25yZWplY3RlZCApIHtcblx0XHRcdFx0XHRkZWxldGVfb25yZWplY3RlZCh0aGVuYWJsZSk7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhbHVlID0gX29ucmVqZWN0ZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0cHJlcGVuZCh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdF9zdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkhLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gZ2V0X3ZhbHVlKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQcm9taXNlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0ZGVwZW5kKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7IHN0YXR1cyA9IEZVTEZJTExFRDsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyh0aGVuYWJsZSkhPT1QRU5ESU5HICkgeyBicmVhayBzdGFjazsgfVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgdmFsdWUpO1xuXHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgc3RhdHVzKTtcblx0XHRcdHZhciBfZGVwZW5kZW50cyA6UHJpdmF0ZVtdIHwgdW5kZWZpbmVkID0gZ2V0X2RlcGVuZGVudHModGhlbmFibGUpO1xuXHRcdFx0aWYgKCBfZGVwZW5kZW50cyApIHtcblx0XHRcdFx0ZGVsZXRlX2RlcGVuZGVudHModGhlbmFibGUpO1xuXHRcdFx0XHRmb3IgKCB2YXIgaW5kZXggOm51bWJlciA9IF9kZXBlbmRlbnRzLmxlbmd0aDsgaW5kZXg7ICkge1xuXHRcdFx0XHRcdGZsb3dTdGFjayA9IHsgbmV4dFN0YWNrOiBmbG93U3RhY2ssIHRoZW5hYmxlOiBfZGVwZW5kZW50c1stLWluZGV4XSwgdmFsdWU6IHZhbHVlLCBzdGF0dXM6IHN0YXR1cyB9O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICggIWZsb3dTdGFjayApIHsgYnJlYWs7IH1cblx0XHR0aGVuYWJsZSA9IGZsb3dTdGFjay50aGVuYWJsZTtcblx0XHR2YWx1ZSA9IGZsb3dTdGFjay52YWx1ZTtcblx0XHRzdGF0dXMgPSBmbG93U3RhY2suc3RhdHVzO1xuXHRcdGZsb3dTdGFjayA9IGZsb3dTdGFjay5uZXh0U3RhY2s7XG5cdH1cblx0Zmxvd2luZyA9IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVwZW5kICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOlJlYWRvbmx5PHsgdGhlbiAoLi4uYXJncyA6YW55W10pIDphbnkgfT4pIDp2b2lkIHtcblx0dmFyIHJlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0dmFsdWUudGhlbihcblx0XHRmdW5jdGlvbiBvbmZ1bGZpbGxlZCAodmFsdWUgOmFueSkgOnZvaWQge1xuXHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdGZsb3codGhlbmFibGUsIHZhbHVlLCBGVUxGSUxMRUQpO1xuXHRcdH0sXG5cdFx0ZnVuY3Rpb24gb25yZWplY3RlZCAoZXJyb3IgOmFueSkgOnZvaWQge1xuXHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdGZsb3codGhlbmFibGUsIGVycm9yLCBSRUpFQ1RFRCk7XG5cdFx0fVxuXHQpO1xufVxuIiwiaW1wb3J0IHsgaXNUaGVuYWJsZSwgaXNQcm9taXNlLCBkZXBlbmQsIEZVTEZJTExFRCwgUkVKRUNURUQsIFBFTkRJTkcsIFByaXZhdGUsIHNldF9kZXBlbmRlbnRzLCBzZXRfdmFsdWUsIHNldF9zdGF0dXMsIGdldF9zdGF0dXMgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXNvbHZlICh2YWx1ZT8gOmFueSkgOlB1YmxpYyB7XG5cdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7IHJldHVybiB2YWx1ZTsgfVxuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRcdHRyeV9kZXBlbmQoVEhJUywgdmFsdWUpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHNldF92YWx1ZShUSElTLCB2YWx1ZSk7XG5cdFx0c2V0X3N0YXR1cyhUSElTLCBGVUxGSUxMRUQpO1xuXHR9XG5cdHJldHVybiBUSElTO1xufTtcblxuZnVuY3Rpb24gdHJ5X2RlcGVuZCAoVEhJUyA6UHJpdmF0ZSwgdmFsdWUgOmFueSkge1xuXHR0cnkgeyBkZXBlbmQoVEhJUywgdmFsdWUpOyB9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRzZXRfdmFsdWUoVEhJUywgZXJyb3IpO1xuXHRcdFx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdFx0fVxuXHR9XG59XG5cbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7IiwiaW1wb3J0IHsgUkVKRUNURUQsIFByaXZhdGUsIHNldF9zdGF0dXMsIHNldF92YWx1ZSB9IGZyb20gJy4vXyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlamVjdCAoZXJyb3I/IDphbnkpIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0c2V0X3ZhbHVlKFRISVMsIGVycm9yKTtcblx0cmV0dXJuIFRISVM7XG59O1xuXG5pbXBvcnQgUHVibGljIGZyb20gJy4vVGhlbmFibGUnOyIsImltcG9ydCB1bmRlZmluZWQgZnJvbSAnLnVuZGVmaW5lZCc7XG5cbmltcG9ydCB7IFBFTkRJTkcsIFJFSkVDVEVELCBGVUxGSUxMRUQsIGZsb3csIHByZXBlbmQsIGlzVGhlbmFibGUsIGlzUHJvbWlzZSwgU3RhdHVzLCBQcml2YXRlLCBPbmZ1bGZpbGxlZCwgZ2V0X3N0YXR1cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBkZWxldGVfZGVwZW5kZW50cywgc2V0X2RlcGVuZGVudHMsIGdldF9kZXBlbmRlbnRzLCBnZXRfdmFsdWUgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhbGwgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10pIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHR0cnkgeyBhbGxfdHJ5KHZhbHVlcywgVEhJUyk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdGRlbGV0ZV9kZXBlbmRlbnRzKFRISVMpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn07XG5cbmZ1bmN0aW9uIGFsbF90cnkgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10sIFRISVMgOlByaXZhdGUpIDp2b2lkIHtcblx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRmdW5jdGlvbiBfb25yZWplY3RlZCAoZXJyb3IgOmFueSkgOmFueSB7IGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICYmIGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR2YXIgX3ZhbHVlIDphbnlbXSA9IFtdO1xuXHR2YXIgY291bnQgOm51bWJlciA9IDA7XG5cdHZhciBjb3VudGVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRmb3IgKCB2YXIgbGVuZ3RoIDpudW1iZXIgPSB2YWx1ZXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdHZhciB2YWx1ZSA6YW55ID0gdmFsdWVzW2luZGV4XTtcblx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0cHJlcGVuZCh2YWx1ZSk7XG5cdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHQrK2NvdW50O1xuXHRcdFx0XHRfdmFsdWVbaW5kZXhdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkhLnB1c2goe1xuXHRcdFx0XHRcdF9zdGF0dXM6IDAsXG5cdFx0XHRcdFx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdFx0XHRcdFx0X2RlcGVuZGVudHM6IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRfb25mdWxmaWxsZWQ6IGZ1bmN0aW9uIChpbmRleCA6bnVtYmVyKSA6T25mdWxmaWxsZWQge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdFx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0X3ZhbHVlW2luZGV4XSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdGlmICggIS0tY291bnQgJiYgY291bnRlZCApIHsgZmxvdyhUSElTLCBfdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9KGluZGV4KSxcblx0XHRcdFx0XHRfb25yZWplY3RlZDogX29ucmVqZWN0ZWRcblx0XHRcdFx0fSBhcyBQcml2YXRlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBfc3RhdHVzPT09UkVKRUNURUQgKSB7XG5cdFx0XHRcdHNldF92YWx1ZShUSElTLCBnZXRfdmFsdWUodmFsdWUpKTtcblx0XHRcdFx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSBnZXRfdmFsdWUodmFsdWUpOyB9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdFx0Kytjb3VudDtcblx0XHRcdF92YWx1ZVtpbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0XHR2YWx1ZS50aGVuKFxuXHRcdFx0XHRmdW5jdGlvbiAoaW5kZXggOm51bWJlcikgOk9uZnVsZmlsbGVkIHtcblx0XHRcdFx0XHR2YXIgcmVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAodmFsdWUgOmFueSkgOnZvaWQge1xuXHRcdFx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0aWYgKCAhLS1jb3VudCAmJiBjb3VudGVkICkgeyBmbG93KFRISVMsIF92YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0oaW5kZXgpLFxuXHRcdFx0XHRfb25yZWplY3RlZFxuXHRcdFx0KTtcblx0XHR9XG5cdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSB2YWx1ZTsgfVxuXHR9XG5cdGNvdW50ZWQgPSB0cnVlO1xuXHRpZiAoICFjb3VudCAmJiBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRzZXRfdmFsdWUoVEhJUywgX3ZhbHVlKTtcblx0XHRzZXRfc3RhdHVzKFRISVMsIEZVTEZJTExFRCk7XG5cdFx0ZGVsZXRlX2RlcGVuZGVudHMoVEhJUyk7XG5cdH1cbn1cblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgdW5kZWZpbmVkIGZyb20gJy51bmRlZmluZWQnO1xuXG5pbXBvcnQgeyBmbG93LCBwcmVwZW5kLCBQRU5ESU5HLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBTdGF0dXMsIGlzVGhlbmFibGUsIGlzUHJvbWlzZSwgUHJpdmF0ZSwgZ2V0X3N0YXR1cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBkZWxldGVfZGVwZW5kZW50cywgc2V0X2RlcGVuZGVudHMsIGdldF9kZXBlbmRlbnRzLCBnZXRfdmFsdWUgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByYWNlICh2YWx1ZXMgOnJlYWRvbmx5IGFueVtdKSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0dHJ5IHsgcmFjZV90cnkodmFsdWVzLCBUSElTKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkge1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIGVycm9yKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgUkVKRUNURUQpO1xuXHRcdFx0ZGVsZXRlX2RlcGVuZGVudHMoVEhJUyk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufTtcblxuZnVuY3Rpb24gcmFjZV90cnkgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10sIFRISVMgOlByaXZhdGUpIDp2b2lkIHtcblx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRmdW5jdGlvbiBfb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDphbnkgeyBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyAmJiBmbG93KFRISVMsIHZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdGZ1bmN0aW9uIF9vbnJlamVjdGVkIChlcnJvciA6YW55KSA6YW55IHsgZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgJiYgZmxvdyhUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdHZhciB0aGF0IDpQcml2YXRlID0ge1xuXHRcdF9zdGF0dXM6IDAsXG5cdFx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdFx0X2RlcGVuZGVudHM6IHVuZGVmaW5lZCxcblx0XHRfb25mdWxmaWxsZWQ6IF9vbmZ1bGZpbGxlZCxcblx0XHRfb25yZWplY3RlZDogX29ucmVqZWN0ZWRcblx0fSBhcyBQcml2YXRlO1xuXHRmb3IgKCB2YXIgbGVuZ3RoIDpudW1iZXIgPSB2YWx1ZXMubGVuZ3RoLCBpbmRleCA6bnVtYmVyID0gMDsgaW5kZXg8bGVuZ3RoOyArK2luZGV4ICkge1xuXHRcdHZhciB2YWx1ZSA6YW55ID0gdmFsdWVzW2luZGV4XTtcblx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0cHJlcGVuZCh2YWx1ZSk7XG5cdFx0XHR2YXIgX3N0YXR1cyA6U3RhdHVzID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkgeyBnZXRfZGVwZW5kZW50cyh2YWx1ZSkhLnB1c2godGhhdCk7IH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzZXRfdmFsdWUoVEhJUywgZ2V0X3ZhbHVlKHZhbHVlKSk7XG5cdFx0XHRcdHNldF9zdGF0dXMoVEhJUywgX3N0YXR1cyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmICggaXNQcm9taXNlKHZhbHVlKSApIHtcblx0XHRcdHZhbHVlLnRoZW4oX29uZnVsZmlsbGVkLCBfb25yZWplY3RlZCk7XG5cdFx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUykhPT1QRU5ESU5HICkgeyBicmVhazsgfVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCB2YWx1ZSk7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIEZVTEZJTExFRCk7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuXG5pbXBvcnQgeyBQcml2YXRlLCBPbnRoZW4sIHNldF9kZXBlbmRlbnRzLCBzZXRfb250aGVuIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGVuZCAob250aGVuIDpPbnRoZW4pIDpQdWJsaWMge1xuXHRpZiAoIHR5cGVvZiBvbnRoZW4hPT0nZnVuY3Rpb24nICkgeyB0aHJvdyBUeXBlRXJyb3IoJ1RoZW5hYmxlLnBlbmQob250aGVuIGlzIG5vdCBhIGZ1bmN0aW9uKScpOyB9XG5cdHZhciBUSElTIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0c2V0X29udGhlbihUSElTLCBvbnRoZW4pO1xuXHRyZXR1cm4gVEhJUztcbn07XG5cbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7IiwiaW1wb3J0IHsgaXNUaGVuYWJsZSwgRlVMRklMTEVELCBSRUpFQ1RFRCwgcHJlcGVuZCwgZ2V0X3N0YXR1cywgZ2V0X3ZhbHVlIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRhd2FpdDogZnVuY3Rpb24gKHZhbHVlIDphbnkpIDphbnkge1xuXHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdHN3aXRjaCAoIGdldF9zdGF0dXModmFsdWUpICkge1xuXHRcdFx0XHRjYXNlIEZVTEZJTExFRDpcblx0XHRcdFx0XHRyZXR1cm4gZ2V0X3ZhbHVlKHZhbHVlKTtcblx0XHRcdFx0Y2FzZSBSRUpFQ1RFRDpcblx0XHRcdFx0XHR0aHJvdyBnZXRfdmFsdWUodmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cbn0uYXdhaXQ7XG4iLCJpbXBvcnQgVHlwZUVycm9yIGZyb20gJy5UeXBlRXJyb3InO1xuXG5pbXBvcnQgeyBQRU5ESU5HLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBTdGF0dXMsIFByaXZhdGUsIGlzVGhlbmFibGUsIGlzUHJvbWlzZSwgZmxvdywgZGVwZW5kLCBwcmVwZW5kLCBFeGVjdXRvciwgT25mdWxmaWxsZWQsIE9ucmVqZWN0ZWQsIFByaXZhdGVfY2FsbCwgZ2V0X3N0YXR1cywgZ2V0X2RlcGVuZGVudHMsIGdldF92YWx1ZSwgc2V0X2RlcGVuZGVudHMsIHNldF92YWx1ZSwgc2V0X3N0YXR1cywgZGVsZXRlX2RlcGVuZGVudHMgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgeyBQdWJsaWMgYXMgZGVmYXVsdCB9O1xuXG50eXBlIFB1YmxpYyA9IFJlYWRvbmx5PG9iamVjdCAmIHtcblx0dGhlbiAodGhpcyA6UHVibGljLCBvbmZ1bGZpbGxlZD8gOk9uZnVsZmlsbGVkLCBvbnJlamVjdGVkPyA6T25yZWplY3RlZCkgOlB1YmxpYyxcbn0+O1xuXG52YXIgUHVibGljIDp7IG5ldyAoZXhlY3V0b3IgOkV4ZWN1dG9yKSA6UHVibGljIH0gPSBmdW5jdGlvbiBUaGVuYWJsZSAodGhpcyA6UHJpdmF0ZSwgZXhlY3V0b3IgOkV4ZWN1dG9yKSA6dm9pZCB7XG5cdGlmICggdHlwZW9mIGV4ZWN1dG9yIT09J2Z1bmN0aW9uJyApIHsgdGhyb3cgVHlwZUVycm9yKCduZXcgVGhlbmFibGUoZXhlY3V0b3IgaXMgbm90IGEgZnVuY3Rpb24pJyk7IH1cblx0dmFyIGV4ZWN1dGVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHR2YXIgcmVkIDpib29sZWFuIHwgdW5kZWZpbmVkO1xuXHR2YXIgX3ZhbHVlIDphbnk7XG5cdHZhciBfc3RhdHVzIDpTdGF0dXMgfCB1bmRlZmluZWQ7XG5cdHZhciBUSElTIDpQcml2YXRlID0gdGhpcztcblx0Ly90aGlzIGluc3RhbmNlb2YgVGhlbmFibGUgfHwgdGhyb3coVHlwZUVycm9yKCkpO1xuXHRQcml2YXRlX2NhbGwoVEhJUyk7XG5cdHRyeSB7XG5cdFx0ZXhlY3V0b3IoXG5cdFx0XHRmdW5jdGlvbiByZXNvbHZlICh2YWx1ZSA6YW55KSB7XG5cdFx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYgKCBleGVjdXRlZCApIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0cHJlcGVuZCh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdF9zdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgZ2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKFRISVMpOyB9XG5cdFx0XHRcdFx0XHRcdGVsc2UgeyBmbG93KFRISVMsIGdldF92YWx1ZSh2YWx1ZSksIF9zdGF0dXMhKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7IGRlcGVuZChUSElTLCB2YWx1ZSk7IH1cblx0XHRcdFx0XHRcdGVsc2UgeyBmbG93KFRISVMsIHZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoIChlcnJvcikgeyBpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkgeyBmbG93KFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH0gfVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdF92YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdF9zdGF0dXMgPSBGVUxGSUxMRUQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiByZWplY3QgKGVycm9yIDphbnkpIHtcblx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoIGV4ZWN1dGVkICkgeyBmbG93KFRISVMsIGVycm9yLCBSRUpFQ1RFRCk7IH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0X3ZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0X3N0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0XHRpZiAoICFyZWQgKSB7XG5cdFx0XHRleGVjdXRlZCA9IHRydWU7XG5cdFx0XHRzZXRfZGVwZW5kZW50cyhUSElTLCBbXSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggIXJlZCApIHtcblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRzZXRfdmFsdWUoVEhJUywgZXJyb3IpO1xuXHRcdFx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cdHRyeSB7IHJFZChUSElTLCBfc3RhdHVzISwgX3ZhbHVlKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkge1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIGVycm9yKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgUkVKRUNURUQpO1xuXHRcdFx0ZGVsZXRlX2RlcGVuZGVudHMoVEhJUyk7XG5cdFx0fVxuXHR9XG59IGFzIGFueTtcblxuZnVuY3Rpb24gckVkIChUSElTIDpQcml2YXRlLCBzdGF0dXMgOlN0YXR1cywgdmFsdWUgOmFueSkgOnZvaWQge1xuXHRpZiAoIHN0YXR1cz09PUZVTEZJTExFRCApIHtcblx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0cHJlcGVuZCh2YWx1ZSk7XG5cdFx0XHRzdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdGlmICggc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRcdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkhLnB1c2goVEhJUyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2V0X3ZhbHVlKFRISVMsIGdldF92YWx1ZSh2YWx1ZSkpO1xuXHRcdFx0XHRzZXRfc3RhdHVzKFRISVMsIHN0YXR1cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICggaXNQcm9taXNlKHZhbHVlKSApIHtcblx0XHRcdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0XHRcdGRlcGVuZChUSElTLCB2YWx1ZSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cdHNldF92YWx1ZShUSElTLCB2YWx1ZSk7XG5cdHNldF9zdGF0dXMoVEhJUywgc3RhdHVzKTtcbn1cbiIsImltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5pbXBvcnQgV2Vha01hcCBmcm9tICcuV2Vha01hcCc7XG5pbXBvcnQgdW5kZWZpbmVkIGZyb20gJy51bmRlZmluZWQnO1xuXG5pbXBvcnQgeyBQRU5ESU5HLCBSRUpFQ1RFRCwgRlVMRklMTEVELCBQcml2YXRlLCBpc1RoZW5hYmxlLCBpc1Byb21pc2UsIFN0YXR1cywgZGVwZW5kLCBwcmVwZW5kLCBPbmZ1bGZpbGxlZCwgT25yZWplY3RlZCwgZ2V0X3N0YXR1cywgc2V0X2RlcGVuZGVudHMsIHNldF9vbmZ1bGZpbGxlZCwgc2V0X29ucmVqZWN0ZWQsIGdldF9kZXBlbmRlbnRzLCBzZXRfdmFsdWUsIGdldF92YWx1ZSwgc2V0X3N0YXR1cyB9IGZyb20gJy4vXyc7XG5cbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBXZWFrTWFwPT09J2Z1bmN0aW9uJ1xuXHQ/IHsgdGhlbjogdGhlbiB9XG5cdDoge1xuXHRcdF9zdGF0dXM6IFBFTkRJTkcsXG5cdFx0X3ZhbHVlOiB1bmRlZmluZWQsXG5cdFx0X2RlcGVuZGVudHM6IHVuZGVmaW5lZCxcblx0XHRfb25mdWxmaWxsZWQ6IHVuZGVmaW5lZCxcblx0XHRfb25yZWplY3RlZDogdW5kZWZpbmVkLFxuXHRcdF9vbnRoZW46IHVuZGVmaW5lZCxcblx0XHR0aGVuOiB0aGVuXG5cdH07XG5cbmZ1bmN0aW9uIHRoZW4gKHRoaXMgOlByaXZhdGUsIG9uZnVsZmlsbGVkPyA6T25mdWxmaWxsZWQsIG9ucmVqZWN0ZWQ/IDpPbnJlamVjdGVkKSA6UHJpdmF0ZSB7XG5cdHZhciBUSElTIDpQcml2YXRlID0gdGhpcztcblx0dmFyIHRoZW5hYmxlIDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdHN3aXRjaCAoIGdldF9zdGF0dXMoVEhJUykgKSB7XG5cdFx0Y2FzZSBQRU5ESU5HOlxuXHRcdFx0cHJlcGVuZChUSElTKTtcblx0XHRcdHNldF9kZXBlbmRlbnRzKHRoZW5hYmxlLCBbXSk7XG5cdFx0XHRpZiAoIHR5cGVvZiBvbmZ1bGZpbGxlZD09PSdmdW5jdGlvbicgKSB7IHNldF9vbmZ1bGZpbGxlZCh0aGVuYWJsZSwgb25mdWxmaWxsZWQpOyB9XG5cdFx0XHRpZiAoIHR5cGVvZiBvbnJlamVjdGVkPT09J2Z1bmN0aW9uJyApIHsgc2V0X29ucmVqZWN0ZWQodGhlbmFibGUsIG9ucmVqZWN0ZWQpOyB9XG5cdFx0XHRnZXRfZGVwZW5kZW50cyhUSElTKSEucHVzaCh0aGVuYWJsZSk7XG5cdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0Y2FzZSBGVUxGSUxMRUQ6XG5cdFx0XHRwcmVwZW5kKFRISVMpO1xuXHRcdFx0aWYgKCB0eXBlb2Ygb25mdWxmaWxsZWQ9PT0nZnVuY3Rpb24nICkgeyBvbnRvKFRISVMsIG9uZnVsZmlsbGVkLCB0aGVuYWJsZSk7IH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzZXRfdmFsdWUodGhlbmFibGUsIGdldF92YWx1ZShUSElTKSk7XG5cdFx0XHRcdHNldF9zdGF0dXModGhlbmFibGUsIEZVTEZJTExFRCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0Y2FzZSBSRUpFQ1RFRDpcblx0XHRcdHByZXBlbmQoVEhJUyk7XG5cdFx0XHRpZiAoIHR5cGVvZiBvbnJlamVjdGVkPT09J2Z1bmN0aW9uJyApIHsgb250byhUSElTLCBvbnJlamVjdGVkLCB0aGVuYWJsZSk7IH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzZXRfdmFsdWUodGhlbmFibGUsIGdldF92YWx1ZShUSElTKSk7XG5cdFx0XHRcdHNldF9zdGF0dXModGhlbmFibGUsIFJFSkVDVEVEKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGVuYWJsZTtcblx0fVxuXHR0aHJvdyBUeXBlRXJyb3IoJ01ldGhvZCBUaGVuYWJsZS5wcm90b3R5cGUudGhlbiBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG59XG5cbmZ1bmN0aW9uIG9udG8gKFRISVMgOlByaXZhdGUsIG9uIDooXyA6YW55KSA9PiBhbnksIHRoZW5hYmxlIDpQcml2YXRlKSB7XG5cdHRyeSB7IG9udG9fdHJ5KHRoZW5hYmxlLCBvbihnZXRfdmFsdWUoVEhJUykpKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIGdldF9zdGF0dXModGhlbmFibGUpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgZXJyb3IpO1xuXHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgUkVKRUNURUQpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBvbnRvX3RyeSAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnkpIDp2b2lkIHtcblx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHR2YXIgc3RhdHVzIDpTdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRpZiAoIHN0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRzZXRfZGVwZW5kZW50cyh0aGVuYWJsZSwgW10pO1xuXHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRzZXRfdmFsdWUodGhlbmFibGUsIGdldF92YWx1ZSh2YWx1ZSkpO1xuXHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgc3RhdHVzKTtcblx0XHR9XG5cdH1cblx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0c2V0X2RlcGVuZGVudHModGhlbmFibGUsIFtdKTtcblx0XHRkZXBlbmQodGhlbmFibGUsIHZhbHVlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRzZXRfdmFsdWUodGhlbmFibGUsIHZhbHVlKTtcblx0XHRzZXRfc3RhdHVzKHRoZW5hYmxlLCBGVUxGSUxMRUQpO1xuXHR9XG59XG4iLCJpbXBvcnQgV2Vha01hcCBmcm9tICcuV2Vha01hcCc7XG5pbXBvcnQgZnJlZXplIGZyb20gJy5PYmplY3QuZnJlZXplJztcbmltcG9ydCBzZWFsIGZyb20gJy5PYmplY3Quc2VhbCc7XG5cbmltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IHJlc29sdmUgZnJvbSAnLi9yZXNvbHZlJztcbmltcG9ydCByZWplY3QgZnJvbSAnLi9yZWplY3QnO1xuaW1wb3J0IGFsbCBmcm9tICcuL2FsbCc7XG5pbXBvcnQgcmFjZSBmcm9tICcuL3JhY2UnO1xuaW1wb3J0IHBlbmQgZnJvbSAnLi9wZW5kJztcbmltcG9ydCBBV0FJVCBmcm9tICcuL2F3YWl0JztcbmV4cG9ydCB7XG5cdHJlc29sdmUsXG5cdHJlamVjdCxcblx0YWxsLFxuXHRyYWNlLFxuXHRwZW5kLFxuXHRBV0FJVCBhcyBhd2FpdCxcbn07XG5cbmltcG9ydCB7IFByaXZhdGUsIEV4ZWN1dG9yIH0gZnJvbSAnLi9fJztcbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7XG5pbXBvcnQgcHJvdG90eXBlIGZyb20gJy4vVGhlbmFibGUucHJvdG90eXBlJztcblB1YmxpYy5wcm90b3R5cGUgPSBQcml2YXRlLnByb3RvdHlwZSA9IHR5cGVvZiBXZWFrTWFwPT09J2Z1bmN0aW9uJyA/IC8qI19fUFVSRV9fKi8gZnJlZXplKHByb3RvdHlwZSkgOiBzZWFsID8gLyojX19QVVJFX18qLyBzZWFsKHByb3RvdHlwZSkgOiBwcm90b3R5cGU7XG5cbmltcG9ydCBEZWZhdWx0IGZyb20gJy5kZWZhdWx0Pz0nO1xuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdChQdWJsaWMsIHtcblx0dmVyc2lvbjogdmVyc2lvbixcblx0VGhlbmFibGU6IFB1YmxpYyxcblx0cmVzb2x2ZTogcmVzb2x2ZSxcblx0cmVqZWN0OiByZWplY3QsXG5cdGFsbDogYWxsLFxuXHRyYWNlOiByYWNlLFxuXHRwZW5kOiBwZW5kLFxuXHRhd2FpdDogQVdBSVRcbn0pO1xuXG52YXIgVGhlbmFibGUgOlJlYWRvbmx5PHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfT4gPSBmcmVlemUgPyAvKiNfX1BVUkVfXyovIGZyZWV6ZShQdWJsaWMpIDogUHVibGljO1xudHlwZSBUaGVuYWJsZSA9IFB1YmxpYztcbmV4cG9ydCB7IFRoZW5hYmxlIH07XG4iXSwibmFtZXMiOlsidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrQkFBZSxPQUFPOzs7Ozs7OzswQkFBQyx0QkNvQmhCLElBQUksT0FBTyxHQUFNLENBQUMsQ0FBQztBQUMxQixJQUFPLElBQUksU0FBUyxHQUFNLENBQUMsQ0FBQztBQUM1QixJQUFPLElBQUksUUFBUSxHQUFNLENBQUMsQ0FBQztB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