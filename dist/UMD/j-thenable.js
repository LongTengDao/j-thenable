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

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Thenable = factory());
}(this, function () { 'use strict';

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

    return _export;

}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnNpb24/dGV4dCIsIl8udHMiLCJyZXNvbHZlLnRzIiwicmVqZWN0LnRzIiwiYWxsLnRzIiwicmFjZS50cyIsInBlbmQudHMiLCJhd2FpdC50cyIsIlRoZW5hYmxlLnRzIiwiVGhlbmFibGUucHJvdG90eXBlLnRzIiwiZXhwb3J0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0ICc0LjIuMSc7IiwiaW1wb3J0IFByb21pc2VfcHJvdG90eXBlIGZyb20gJy5Qcm9taXNlLnByb3RvdHlwZT8nO1xuaW1wb3J0IFdlYWtNYXAgZnJvbSAnLldlYWtNYXAnO1xuaW1wb3J0IGdldFByb3RvdHlwZU9mIGZyb20gJy5PYmplY3QuZ2V0UHJvdG90eXBlT2YnO1xuaW1wb3J0IHByZXZlbnRFeHRlbnNpb25zIGZyb20gJy5PYmplY3QucHJldmVudEV4dGVuc2lvbnMnO1xuaW1wb3J0IHVuZGVmaW5lZCBmcm9tICcudW5kZWZpbmVkJztcblxuZXhwb3J0IHR5cGUgRXhlY3V0b3IgPSAocmVzb2x2ZT8gOih2YWx1ZSA6YW55KSA9PiB2b2lkLCByZWplY3Q/IDooZXJyb3IgOmFueSkgPT4gdm9pZCkgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIE9uZnVsZmlsbGVkID0gKHZhbHVlIDphbnkpID0+IGFueTtcbmV4cG9ydCB0eXBlIE9ucmVqZWN0ZWQgPSAoZXJyb3IgOmFueSkgPT4gYW55O1xuZXhwb3J0IHR5cGUgT250aGVuID0gKCkgPT4gYW55O1xuZXhwb3J0IHR5cGUgU3RhdHVzID0gMCB8IDEgfCAyO1xuZXhwb3J0IHR5cGUgUHJpdmF0ZSA9IHtcblx0X3N0YXR1cyA6U3RhdHVzLFxuXHRfdmFsdWUgOmFueSxcblx0X2RlcGVuZGVudHMgOlByaXZhdGVbXSB8IHVuZGVmaW5lZCxcblx0X29uZnVsZmlsbGVkIDpPbmZ1bGZpbGxlZCB8IHVuZGVmaW5lZCxcblx0X29ucmVqZWN0ZWQgOk9ucmVqZWN0ZWQgfCB1bmRlZmluZWQsXG5cdF9vbnRoZW4gOk9udGhlbiB8IHVuZGVmaW5lZCxcblx0dGhlbiAodGhpcyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQ/IDpPbmZ1bGZpbGxlZCwgb25yZWplY3RlZD8gOk9ucmVqZWN0ZWQpIDpQcml2YXRlLFxufTtcblxuZXhwb3J0IHZhciBQRU5ESU5HIDowID0gMDtcbmV4cG9ydCB2YXIgRlVMRklMTEVEIDoxID0gMTtcbmV4cG9ydCB2YXIgUkVKRUNURUQgOjIgPSAyO1xuXG5leHBvcnQgdmFyIFByaXZhdGVfY2FsbCA6KFRISVMgOlByaXZhdGUpID0+IHZvaWQ7XG5leHBvcnQgdmFyIFByaXZhdGUgOnsgbmV3ICgpIDpQcml2YXRlIH0gPSBmdW5jdGlvbiBQcml2YXRlICh0aGlzIDpQcml2YXRlKSA6dm9pZCB7IFByaXZhdGVfY2FsbCh0aGlzKTsgfSBhcyBhbnk7XG5leHBvcnQgdmFyIGlzVGhlbmFibGUgOih2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBQcml2YXRlO1xuXG5leHBvcnQgdmFyIGRlbGV0ZV9kZXBlbmRlbnRzIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb25yZWplY3RlZCA6KFRISVMgOlByaXZhdGUpID0+IHZvaWQ7XG52YXIgZGVsZXRlX29uZnVsZmlsbGVkIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb250aGVuIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzIDooVEhJUyA6UHJpdmF0ZSkgPT4gdm9pZDtcbnZhciBkZWxldGVfb25yZWplY3RlZF9pZl9oYXMgOihUSElTIDpQcml2YXRlKSA9PiB2b2lkO1xuXG5leHBvcnQgdmFyIGdldF9zdGF0dXMgOihUSElTIDpQcml2YXRlKSA9PiBTdGF0dXM7XG5leHBvcnQgdmFyIGdldF92YWx1ZSA6KFRISVMgOlByaXZhdGUpID0+IGFueTtcbmV4cG9ydCB2YXIgZ2V0X2RlcGVuZGVudHMgOihUSElTIDpQcml2YXRlKSA9PiBQcml2YXRlW10gfCB1bmRlZmluZWQ7XG52YXIgZ2V0X29uZnVsZmlsbGVkIDooVEhJUyA6UHJpdmF0ZSkgPT4gT25mdWxmaWxsZWQgfCB1bmRlZmluZWQ7XG52YXIgZ2V0X29ucmVqZWN0ZWQgOihUSElTIDpQcml2YXRlKSA9PiBPbnJlamVjdGVkIHwgdW5kZWZpbmVkO1xudmFyIGdldF9vbnRoZW4gOihUSElTIDpQcml2YXRlKSA9PiBPbnRoZW4gfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB2YXIgc2V0X3N0YXR1cyA6KFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzKSA9PiB2b2lkO1xuZXhwb3J0IHZhciBzZXRfdmFsdWUgOihUSElTIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA9PiB2b2lkO1xuZXhwb3J0IHZhciBzZXRfZGVwZW5kZW50cyA6KFRISVMgOlByaXZhdGUsIGRlcGVuZGVudHMgOlByaXZhdGVbXSkgPT4gdm9pZDtcbmV4cG9ydCB2YXIgc2V0X29uZnVsZmlsbGVkIDooVEhJUyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQgOk9uZnVsZmlsbGVkKSA9PiB2b2lkO1xuZXhwb3J0IHZhciBzZXRfb25yZWplY3RlZCA6KFRISVMgOlByaXZhdGUsIG9ucmVqZWN0ZWQgOk9ucmVqZWN0ZWQpID0+IHZvaWQ7XG5leHBvcnQgdmFyIHNldF9vbnRoZW4gOihUSElTIDpQcml2YXRlLCBvbnRoZW4gOk9udGhlbikgPT4gdm9pZDtcblxuaWYgKCB0eXBlb2YgV2Vha01hcD09PSdmdW5jdGlvbicgKSB7XG5cdHZhciBTVEFUVVMgOldlYWtNYXA8UHJpdmF0ZSwgU3RhdHVzPiA9IG5ldyBXZWFrTWFwO1xuXHR2YXIgVkFMVUUgOldlYWtNYXA8UHJpdmF0ZSwgYW55PiA9IG5ldyBXZWFrTWFwO1xuXHR2YXIgREVQRU5ERU5UUyA6V2Vha01hcDxQcml2YXRlLCBQcml2YXRlW10+ID0gbmV3IFdlYWtNYXA7XG5cdHZhciBPTkZVTEZJTExFRCA6V2Vha01hcDxQcml2YXRlLCBPbmZ1bGZpbGxlZD4gPSBuZXcgV2Vha01hcDtcblx0dmFyIE9OUkVKRUNURUQgOldlYWtNYXA8UHJpdmF0ZSwgT25yZWplY3RlZD4gPSBuZXcgV2Vha01hcDtcblx0dmFyIE9OVEhFTiA6V2Vha01hcDxQcml2YXRlLCBPbnRoZW4+ID0gbmV3IFdlYWtNYXA7XG5cdFxuXHRQcml2YXRlX2NhbGwgPSBwcmV2ZW50RXh0ZW5zaW9ucyAmJiAvKiNfX1BVUkVfXyovIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbyA6YW55ID0gcHJldmVudEV4dGVuc2lvbnMoe30pO1xuXHRcdFZBTFVFLnNldChvLCBvKTtcblx0XHRyZXR1cm4gVkFMVUUuaGFzKG8pO1xuXHR9KClcblx0XHQ/IGZ1bmN0aW9uIFByaXZhdGVfY2FsbCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBTVEFUVVMuc2V0KHByZXZlbnRFeHRlbnNpb25zKFRISVMpLCBQRU5ESU5HKTsgfVxuXHRcdDogZnVuY3Rpb24gUHJpdmF0ZV9jYWxsIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IFNUQVRVUy5zZXQoVEhJUywgUEVORElORyk7IH07XG5cdGlzVGhlbmFibGUgPSBmdW5jdGlvbiBpc1RoZW5hYmxlICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUHJpdmF0ZSB7IHJldHVybiBTVEFUVVMuaGFzKHZhbHVlKTsgfTtcblx0XG5cdC8qIGRlbGV0ZTogKi9cblx0ZGVsZXRlX2RlcGVuZGVudHMgPSBmdW5jdGlvbiBkZWxldGVfZGVwZW5kZW50cyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBERVBFTkRFTlRTWydkZWxldGUnXShUSElTKTsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkID0gZnVuY3Rpb24gZGVsZXRlX29uZnVsZmlsbGVkIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9ORlVMRklMTEVEWydkZWxldGUnXShUSElTKTsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTlJFSkVDVEVEWydkZWxldGUnXShUSElTKTsgfTtcblx0ZGVsZXRlX29udGhlbiA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnRoZW4gKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05USEVOWydkZWxldGUnXShUSElTKTsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyA9IGRlbGV0ZV9vbmZ1bGZpbGxlZDtcblx0ZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzID0gZGVsZXRlX29ucmVqZWN0ZWQ7LyoqL1xuXHQvKiBzZXQgdW5kZWZpbmVkOiAqIC9cblx0ZGVsZXRlX2RlcGVuZGVudHMgPSBmdW5jdGlvbiBkZWxldGVfZGVwZW5kZW50cyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBERVBFTkRFTlRTLnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkID0gZnVuY3Rpb24gZGVsZXRlX29uZnVsZmlsbGVkIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9ORlVMRklMTEVELnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBPTlJFSkVDVEVELnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29udGhlbiA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnRoZW4gKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05USEVOLnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29uZnVsZmlsbGVkX2lmX2hhcyA9IGZ1bmN0aW9uIGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXMgKFRISVMgOlByaXZhdGUpIDp2b2lkIHsgT05GVUxGSUxMRUQuaGFzKFRISVMpICYmIE9ORlVMRklMTEVELnNldChUSElTLCB1bmRlZmluZWQhKTsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzID0gZnVuY3Rpb24gZGVsZXRlX29ucmVqZWN0ZWRfaWZfaGFzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IE9OUkVKRUNURUQuaGFzKFRISVMpICYmIE9OUkVKRUNURUQuc2V0KFRISVMsIHVuZGVmaW5lZCEpOyB9Oy8qKi9cblx0XG5cdGdldF9zdGF0dXMgPSBmdW5jdGlvbiBnZXRfc3RhdHVzIChUSElTIDpQcml2YXRlKSA6U3RhdHVzIHsgcmV0dXJuIFNUQVRVUy5nZXQoVEhJUykhOyB9O1xuXHRnZXRfdmFsdWUgPSBmdW5jdGlvbiBnZXRfdmFsdWUgKFRISVMgOlByaXZhdGUpIDphbnkgeyByZXR1cm4gVkFMVUUuZ2V0KFRISVMpOyB9O1xuXHRnZXRfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGdldF9kZXBlbmRlbnRzIChUSElTIDpQcml2YXRlKSA6UHJpdmF0ZVtdIHwgdW5kZWZpbmVkIHsgcmV0dXJuIERFUEVOREVOVFMuZ2V0KFRISVMpOyB9O1xuXHRnZXRfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBnZXRfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUpIDpPbmZ1bGZpbGxlZCB8IHVuZGVmaW5lZCB7IHJldHVybiBPTkZVTEZJTExFRC5nZXQoVEhJUyk7IH07XG5cdGdldF9vbnJlamVjdGVkID0gZnVuY3Rpb24gZ2V0X29ucmVqZWN0ZWQgKFRISVMgOlByaXZhdGUpIDpPbnJlamVjdGVkIHwgdW5kZWZpbmVkIHsgcmV0dXJuIE9OUkVKRUNURUQuZ2V0KFRISVMpOyB9O1xuXHRnZXRfb250aGVuID0gZnVuY3Rpb24gZ2V0X29udGhlbiAoVEhJUyA6UHJpdmF0ZSkgOk9udGhlbiB8IHVuZGVmaW5lZCB7IHJldHVybiBPTlRIRU4uZ2V0KFRISVMpOyB9O1xuXHRcblx0c2V0X3N0YXR1cyA9IGZ1bmN0aW9uIHNldF9zdGF0dXMgKFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzKSA6dm9pZCB7IFNUQVRVUy5zZXQoVEhJUywgc3RhdHVzKTsgfTtcblx0c2V0X3ZhbHVlID0gZnVuY3Rpb24gc2V0X3ZhbHVlIChUSElTIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA6dm9pZCB7IFZBTFVFLnNldChUSElTLCB2YWx1ZSk7IH07XG5cdHNldF9kZXBlbmRlbnRzID0gZnVuY3Rpb24gc2V0X2RlcGVuZGVudHMgKFRISVMgOlByaXZhdGUsIGRlcGVuZGVudHMgOlByaXZhdGVbXSkgOnZvaWQgeyBERVBFTkRFTlRTLnNldChUSElTLCBkZXBlbmRlbnRzKTsgfTtcblx0c2V0X29uZnVsZmlsbGVkID0gZnVuY3Rpb24gc2V0X29uZnVsZmlsbGVkIChUSElTIDpQcml2YXRlLCBvbmZ1bGZpbGxlZCA6T25mdWxmaWxsZWQpIDp2b2lkIHsgT05GVUxGSUxMRUQuc2V0KFRISVMsIG9uZnVsZmlsbGVkKTsgfTtcblx0c2V0X29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBzZXRfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSwgb25yZWplY3RlZCA6T25yZWplY3RlZCkgOnZvaWQgeyBPTlJFSkVDVEVELnNldChUSElTLCBvbnJlamVjdGVkKTsgfTtcblx0c2V0X29udGhlbiA9IGZ1bmN0aW9uIHNldF9vbnRoZW4gKFRISVMgOlByaXZhdGUsIG9udGhlbiA6T250aGVuKSA6dm9pZCB7IE9OVEhFTi5zZXQoVEhJUywgb250aGVuKTsgfTtcbn1cbmVsc2Uge1xuXHRQcml2YXRlX2NhbGwgPSBmdW5jdGlvbiBQcml2YXRlX2NhbGwgKCkgOnZvaWQgeyB9O1xuXHRpc1RoZW5hYmxlID0gZ2V0UHJvdG90eXBlT2Zcblx0XHQ/IGZ1bmN0aW9uICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUHJpdmF0ZSB7XG5cdFx0XHR2YXIgUHJpdmF0ZV9wcm90b3R5cGUgOlByaXZhdGUgPSBQcml2YXRlLnByb3RvdHlwZTtcblx0XHRcdGlzVGhlbmFibGUgPSBmdW5jdGlvbiBpc1RoZW5hYmxlICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUHJpdmF0ZSB7IHJldHVybiB2YWx1ZSE9bnVsbCAmJiBnZXRQcm90b3R5cGVPZih2YWx1ZSk9PT1Qcml2YXRlX3Byb3RvdHlwZTsgfTtcblx0XHRcdHJldHVybiBpc1RoZW5hYmxlKHZhbHVlKTtcblx0XHR9XG5cdFx0OiBmdW5jdGlvbiBpc1RoZW5hYmxlICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUHJpdmF0ZSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFByaXZhdGU7IH07XG5cdFxuXHQvKiBzZXQgdW5kZWZpbmVkOiAqL1xuXHRkZWxldGVfZGVwZW5kZW50cyA9IGZ1bmN0aW9uIGRlbGV0ZV9kZXBlbmRlbnRzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IFRISVMuX2RlcGVuZGVudHMgPSB1bmRlZmluZWQ7IH07XG5cdGRlbGV0ZV9vbmZ1bGZpbGxlZCA9IGZ1bmN0aW9uIGRlbGV0ZV9vbmZ1bGZpbGxlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBUSElTLl9vbmZ1bGZpbGxlZCA9IHVuZGVmaW5lZDsgfTtcblx0ZGVsZXRlX29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBkZWxldGVfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBUSElTLl9vbnJlamVjdGVkID0gdW5kZWZpbmVkOyB9O1xuXHRkZWxldGVfb250aGVuID0gZnVuY3Rpb24gZGVsZXRlX29udGhlbiAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBUSElTLl9vbnRoZW4gPSB1bmRlZmluZWQ7IH07XG5cdGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXMgPSBmdW5jdGlvbiBkZWxldGVfb25mdWxmaWxsZWRfaWZfaGFzIChUSElTIDpQcml2YXRlKSA6dm9pZCB7IGlmICggVEhJUy5fb25mdWxmaWxsZWQgKSB7IFRISVMuX29uZnVsZmlsbGVkID0gdW5kZWZpbmVkOyB9IH07XG5cdGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyA9IGZ1bmN0aW9uIGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyAoVEhJUyA6UHJpdmF0ZSkgOnZvaWQgeyBpZiAoIFRISVMuX29ucmVqZWN0ZWQgKSB7IFRISVMuX29ucmVqZWN0ZWQgPSB1bmRlZmluZWQ7IH0gfTsvKiovXG5cdFxuXHRnZXRfc3RhdHVzID0gZnVuY3Rpb24gZ2V0X3N0YXR1cyAoVEhJUyA6UHJpdmF0ZSkgOlN0YXR1cyB7IHJldHVybiBUSElTLl9zdGF0dXM7IH07XG5cdGdldF92YWx1ZSA9IGZ1bmN0aW9uIGdldF92YWx1ZSAoVEhJUyA6UHJpdmF0ZSkgOmFueSB7IHJldHVybiBUSElTLl92YWx1ZTsgfTtcblx0Z2V0X2RlcGVuZGVudHMgPSBmdW5jdGlvbiBnZXRfZGVwZW5kZW50cyAoVEhJUyA6UHJpdmF0ZSkgOlByaXZhdGVbXSB8IHVuZGVmaW5lZCB7IHJldHVybiBUSElTLl9kZXBlbmRlbnRzOyB9O1xuXHRnZXRfb25mdWxmaWxsZWQgPSBmdW5jdGlvbiBnZXRfb25mdWxmaWxsZWQgKFRISVMgOlByaXZhdGUpIDpPbmZ1bGZpbGxlZCB8IHVuZGVmaW5lZCB7IHJldHVybiBUSElTLl9vbmZ1bGZpbGxlZDsgfTtcblx0Z2V0X29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBnZXRfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSkgOk9ucmVqZWN0ZWQgfCB1bmRlZmluZWQgeyByZXR1cm4gVEhJUy5fb25yZWplY3RlZDsgfTtcblx0Z2V0X29udGhlbiA9IGZ1bmN0aW9uIGdldF9vbnRoZW4gKFRISVMgOlByaXZhdGUpIDpPbnRoZW4gfCB1bmRlZmluZWQgeyByZXR1cm4gVEhJUy5fb250aGVuOyB9O1xuXHRcblx0c2V0X3N0YXR1cyA9IGZ1bmN0aW9uIHNldF9zdGF0dXMgKFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzKSA6dm9pZCB7IFRISVMuX3N0YXR1cyA9IHN0YXR1czsgfTtcblx0c2V0X3ZhbHVlID0gZnVuY3Rpb24gc2V0X3ZhbHVlIChUSElTIDpQcml2YXRlLCB2YWx1ZSA6YW55KSA6dm9pZCB7IFRISVMuX3ZhbHVlID0gdmFsdWU7IH07XG5cdHNldF9kZXBlbmRlbnRzID0gZnVuY3Rpb24gc2V0X2RlcGVuZGVudHMgKFRISVMgOlByaXZhdGUsIGRlcGVuZGVudHMgOlByaXZhdGVbXSkgOnZvaWQgeyBUSElTLl9kZXBlbmRlbnRzID0gZGVwZW5kZW50czsgfTtcblx0c2V0X29uZnVsZmlsbGVkID0gZnVuY3Rpb24gc2V0X29uZnVsZmlsbGVkIChUSElTIDpQcml2YXRlLCBvbmZ1bGZpbGxlZCA6T25mdWxmaWxsZWQpIDp2b2lkIHsgVEhJUy5fb25mdWxmaWxsZWQgPSBvbmZ1bGZpbGxlZDsgfTtcblx0c2V0X29ucmVqZWN0ZWQgPSBmdW5jdGlvbiBzZXRfb25yZWplY3RlZCAoVEhJUyA6UHJpdmF0ZSwgb25yZWplY3RlZCA6T25yZWplY3RlZCkgOnZvaWQgeyBUSElTLl9vbnJlamVjdGVkID0gb25yZWplY3RlZDsgfTtcblx0c2V0X29udGhlbiA9IGZ1bmN0aW9uIHNldF9vbnRoZW4gKFRISVMgOlByaXZhdGUsIG9udGhlbiA6T250aGVuKSA6dm9pZCB7IFRISVMuX29udGhlbiA9IG9udGhlbjsgfTtcbn1cblxuZXhwb3J0IHZhciBpc1Byb21pc2UgOih2YWx1ZSA6YW55KSA9PiB2YWx1ZSBpcyBSZWFkb25seTxQcm9taXNlPGFueT4+ID0gUHJvbWlzZV9wcm90b3R5cGVcblx0PyBnZXRQcm90b3R5cGVPZlxuXHRcdD8gZnVuY3Rpb24gaXNQcm9taXNlICh2YWx1ZSA6YW55KSA6dmFsdWUgaXMgUmVhZG9ubHk8UHJvbWlzZTxhbnk+PiB7IHJldHVybiB2YWx1ZSE9bnVsbCAmJiBnZXRQcm90b3R5cGVPZih2YWx1ZSk9PT1Qcm9taXNlX3Byb3RvdHlwZTsgfVxuXHRcdDogZnVuY3Rpb24gKCkge1xuXHRcdFx0ZnVuY3Rpb24gUHJvbWlzZSAoKSB7fVxuXHRcdFx0UHJvbWlzZS5wcm90b3R5cGUgPSBQcm9taXNlX3Byb3RvdHlwZTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiBpc1Byb21pc2UgKHZhbHVlIDphbnkpIDp2YWx1ZSBpcyBSZWFkb25seTxQcm9taXNlPGFueT4+IHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZTsgfTtcblx0XHR9KClcblx0OiBmdW5jdGlvbiBpc1Byb21pc2UgKCkgeyByZXR1cm4gZmFsc2U7IH0gYXMgYW55O1xuXG50eXBlIFByZXBlbmRTdGFjayA9IHsgbmV4dFN0YWNrIDpQcmVwZW5kU3RhY2sgfCBudWxsLCB0aGVuYWJsZSA6UHJpdmF0ZSwgb250aGVuIDpPbnRoZW4gfTtcbnZhciBwcmVwZW5kU3RhY2sgOlByZXBlbmRTdGFjayB8IG51bGwgPSBudWxsO1xudmFyIHByZXBlbmRpbmcgOmJvb2xlYW4gPSBmYWxzZTtcbmV4cG9ydCBmdW5jdGlvbiBwcmVwZW5kICh0aGVuYWJsZSA6UHJpdmF0ZSkgOnZvaWQge1xuXHR2YXIgX29udGhlbiA6T250aGVuIHwgdW5kZWZpbmVkID0gZ2V0X29udGhlbih0aGVuYWJsZSk7XG5cdGlmICggIV9vbnRoZW4gKSB7IHJldHVybjsgfVxuXHRkZWxldGVfb250aGVuKHRoZW5hYmxlKTtcblx0aWYgKCBwcmVwZW5kaW5nICkge1xuXHRcdHByZXBlbmRTdGFjayA9IHsgbmV4dFN0YWNrOiBwcmVwZW5kU3RhY2ssIHRoZW5hYmxlOiB0aGVuYWJsZSwgb250aGVuOiBfb250aGVuIH07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHByZXBlbmRpbmcgPSB0cnVlO1xuXHRmb3IgKCA7IDsgKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHZhciB2YWx1ZSA6YW55ID0gX29udGhlbigpO1xuXHRcdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdFx0X29udGhlbiA9IGdldF9vbnRoZW4odmFsdWUpO1xuXHRcdFx0XHRpZiAoIF9vbnRoZW4gKSB7XG5cdFx0XHRcdFx0ZGVsZXRlX29udGhlbih2YWx1ZSk7XG5cdFx0XHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRwcmVwZW5kU3RhY2sgPSB7IG5leHRTdGFjazogcHJlcGVuZFN0YWNrLCB0aGVuYWJsZTogdmFsdWUsIG9udGhlbjogX29udGhlbiB9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBzdGF0dXMgOlN0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0XHRcdGlmICggc3RhdHVzPT09UEVORElORyApIHsgZ2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTsgfVxuXHRcdFx0XHRcdGVsc2UgeyBmbG93KHRoZW5hYmxlLCBnZXRfdmFsdWUodmFsdWUpLCBzdGF0dXMpOyB9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBpc1Byb21pc2UodmFsdWUpICkgeyBkZXBlbmQodGhlbmFibGUsIHZhbHVlKTsgfVxuXHRcdFx0ZWxzZSB7IGZsb3codGhlbmFibGUsIHZhbHVlLCBGVUxGSUxMRUQpOyB9XG5cdFx0fVxuXHRcdGNhdGNoIChlcnJvcikgeyBmbG93KHRoZW5hYmxlLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdFx0aWYgKCAhcHJlcGVuZFN0YWNrICkgeyBicmVhazsgfVxuXHRcdHRoZW5hYmxlID0gcHJlcGVuZFN0YWNrLnRoZW5hYmxlO1xuXHRcdF9vbnRoZW4gPSBwcmVwZW5kU3RhY2sub250aGVuO1xuXHRcdHByZXBlbmRTdGFjayA9IHByZXBlbmRTdGFjay5uZXh0U3RhY2s7XG5cdH1cblx0cHJlcGVuZGluZyA9IGZhbHNlO1xufVxuXG50eXBlIEZsb3dTdGFjayA9IHsgbmV4dFN0YWNrIDpGbG93U3RhY2sgfCBudWxsLCB0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMgfTtcbnZhciBmbG93U3RhY2sgOkZsb3dTdGFjayB8IG51bGwgPSBudWxsO1xudmFyIGZsb3dpbmcgOmJvb2xlYW4gPSBmYWxzZTtcbmV4cG9ydCBmdW5jdGlvbiBmbG93ICh0aGVuYWJsZSA6UHJpdmF0ZSwgdmFsdWUgOmFueSwgc3RhdHVzIDpTdGF0dXMpIDp2b2lkIHtcblx0aWYgKCBmbG93aW5nICkge1xuXHRcdGZsb3dTdGFjayA9IHsgbmV4dFN0YWNrOiBmbG93U3RhY2ssIHRoZW5hYmxlOiB0aGVuYWJsZSwgdmFsdWU6IHZhbHVlLCBzdGF0dXM6IHN0YXR1cyB9O1xuXHRcdHJldHVybjtcblx0fVxuXHRmbG93aW5nID0gdHJ1ZTtcblx0Zm9yICggdmFyIF9zdGF0dXMgOlN0YXR1czsgOyApIHtcblx0XHRzdGFjazoge1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1GVUxGSUxMRUQgKSB7XG5cdFx0XHRcdGRlbGV0ZV9vbnJlamVjdGVkX2lmX2hhcyh0aGVuYWJsZSk7XG5cdFx0XHRcdHZhciBfb25mdWxmaWxsZWQgOk9uZnVsZmlsbGVkIHwgdW5kZWZpbmVkID0gZ2V0X29uZnVsZmlsbGVkKHRoZW5hYmxlKTtcblx0XHRcdFx0aWYgKCBfb25mdWxmaWxsZWQgKSB7XG5cdFx0XHRcdFx0ZGVsZXRlX29uZnVsZmlsbGVkKHRoZW5hYmxlKTtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBfb25mdWxmaWxsZWQodmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0cHJlcGVuZCh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdF9zdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHtcblx0XHRcdFx0XHRcdFx0XHRnZXRfZGVwZW5kZW50cyh2YWx1ZSkhLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gZ2V0X3ZhbHVlKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXMgPSBfc3RhdHVzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQcm9taXNlKHZhbHVlKSApIHtcblx0XHRcdFx0XHRcdFx0ZGVwZW5kKHRoZW5hYmxlLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrIHN0YWNrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyh0aGVuYWJsZSkhPT1QRU5ESU5HICkgeyBicmVhayBzdGFjazsgfVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRcdHN0YXR1cyA9IFJFSkVDVEVEO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGRlbGV0ZV9vbmZ1bGZpbGxlZF9pZl9oYXModGhlbmFibGUpO1xuXHRcdFx0XHR2YXIgX29ucmVqZWN0ZWQgOk9ucmVqZWN0ZWQgfCB1bmRlZmluZWQgPSBnZXRfb25yZWplY3RlZCh0aGVuYWJsZSk7XG5cdFx0XHRcdGlmICggX29ucmVqZWN0ZWQgKSB7XG5cdFx0XHRcdFx0ZGVsZXRlX29ucmVqZWN0ZWQodGhlbmFibGUpO1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IF9vbnJlamVjdGVkKHZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRfc3RhdHVzID0gZ2V0X3N0YXR1cyh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IGdldF92YWx1ZSh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0c3RhdHVzID0gX3N0YXR1cztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0XHRcdFx0XHRcdGRlcGVuZCh0aGVuYWJsZSwgdmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRicmVhayBzdGFjaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgeyBzdGF0dXMgPSBGVUxGSUxMRUQ7IH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGdldF9zdGF0dXModGhlbmFibGUpIT09UEVORElORyApIHsgYnJlYWsgc3RhY2s7IH1cblx0XHRcdFx0XHRcdHZhbHVlID0gZXJyb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRzZXRfdmFsdWUodGhlbmFibGUsIHZhbHVlKTtcblx0XHRcdHNldF9zdGF0dXModGhlbmFibGUsIHN0YXR1cyk7XG5cdFx0XHR2YXIgX2RlcGVuZGVudHMgOlByaXZhdGVbXSB8IHVuZGVmaW5lZCA9IGdldF9kZXBlbmRlbnRzKHRoZW5hYmxlKTtcblx0XHRcdGlmICggX2RlcGVuZGVudHMgKSB7XG5cdFx0XHRcdGRlbGV0ZV9kZXBlbmRlbnRzKHRoZW5hYmxlKTtcblx0XHRcdFx0Zm9yICggdmFyIGluZGV4IDpudW1iZXIgPSBfZGVwZW5kZW50cy5sZW5ndGg7IGluZGV4OyApIHtcblx0XHRcdFx0XHRmbG93U3RhY2sgPSB7IG5leHRTdGFjazogZmxvd1N0YWNrLCB0aGVuYWJsZTogX2RlcGVuZGVudHNbLS1pbmRleF0sIHZhbHVlOiB2YWx1ZSwgc3RhdHVzOiBzdGF0dXMgfTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoICFmbG93U3RhY2sgKSB7IGJyZWFrOyB9XG5cdFx0dGhlbmFibGUgPSBmbG93U3RhY2sudGhlbmFibGU7XG5cdFx0dmFsdWUgPSBmbG93U3RhY2sudmFsdWU7XG5cdFx0c3RhdHVzID0gZmxvd1N0YWNrLnN0YXR1cztcblx0XHRmbG93U3RhY2sgPSBmbG93U3RhY2submV4dFN0YWNrO1xuXHR9XG5cdGZsb3dpbmcgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcGVuZCAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDpSZWFkb25seTx7IHRoZW4gKC4uLmFyZ3MgOmFueVtdKSA6YW55IH0+KSA6dm9pZCB7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhbHVlLnRoZW4oXG5cdFx0ZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRmbG93KHRoZW5hYmxlLCB2YWx1ZSwgRlVMRklMTEVEKTtcblx0XHR9LFxuXHRcdGZ1bmN0aW9uIG9ucmVqZWN0ZWQgKGVycm9yIDphbnkpIDp2b2lkIHtcblx0XHRcdGlmICggcmVkICkgeyByZXR1cm47IH1cblx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRmbG93KHRoZW5hYmxlLCBlcnJvciwgUkVKRUNURUQpO1xuXHRcdH1cblx0KTtcbn1cbiIsImltcG9ydCB7IGlzVGhlbmFibGUsIGlzUHJvbWlzZSwgZGVwZW5kLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBQRU5ESU5HLCBQcml2YXRlLCBzZXRfZGVwZW5kZW50cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBnZXRfc3RhdHVzIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzb2x2ZSAodmFsdWU/IDphbnkpIDpQdWJsaWMge1xuXHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkgeyByZXR1cm4gdmFsdWU7IH1cblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0aWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0XHR0cnlfZGVwZW5kKFRISVMsIHZhbHVlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRzZXRfdmFsdWUoVEhJUywgdmFsdWUpO1xuXHRcdHNldF9zdGF0dXMoVEhJUywgRlVMRklMTEVEKTtcblx0fVxuXHRyZXR1cm4gVEhJUztcbn07XG5cbmZ1bmN0aW9uIHRyeV9kZXBlbmQgKFRISVMgOlByaXZhdGUsIHZhbHVlIDphbnkpIHtcblx0dHJ5IHsgZGVwZW5kKFRISVMsIHZhbHVlKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkge1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIGVycm9yKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgUkVKRUNURUQpO1xuXHRcdH1cblx0fVxufVxuXG5pbXBvcnQgUHVibGljIGZyb20gJy4vVGhlbmFibGUnOyIsImltcG9ydCB7IFJFSkVDVEVELCBQcml2YXRlLCBzZXRfc3RhdHVzLCBzZXRfdmFsdWUgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWplY3QgKGVycm9yPyA6YW55KSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdHJldHVybiBUSElTO1xufTtcblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgdW5kZWZpbmVkIGZyb20gJy51bmRlZmluZWQnO1xuXG5pbXBvcnQgeyBQRU5ESU5HLCBSRUpFQ1RFRCwgRlVMRklMTEVELCBmbG93LCBwcmVwZW5kLCBpc1RoZW5hYmxlLCBpc1Byb21pc2UsIFN0YXR1cywgUHJpdmF0ZSwgZ2V0X3N0YXR1cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBkZWxldGVfZGVwZW5kZW50cywgc2V0X2RlcGVuZGVudHMsIGdldF9kZXBlbmRlbnRzLCBnZXRfdmFsdWUsIHNldF9vbmZ1bGZpbGxlZCwgc2V0X29ucmVqZWN0ZWQgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhbGwgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10pIDpQdWJsaWMge1xuXHR2YXIgVEhJUyA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHR0cnkgeyBhbGxfdHJ5KHZhbHVlcywgVEhJUyk7IH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdGRlbGV0ZV9kZXBlbmRlbnRzKFRISVMpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gVEhJUztcbn07XG5cbmZ1bmN0aW9uIGFsbF90cnkgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10sIFRISVMgOlByaXZhdGUpIDp2b2lkIHtcblx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRmdW5jdGlvbiBvbnJlamVjdGVkIChlcnJvciA6YW55KSA6YW55IHsgZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgJiYgZmxvdyhUSElTLCBlcnJvciwgUkVKRUNURUQpOyB9XG5cdHZhciBfdmFsdWUgOmFueVtdID0gW107XG5cdHZhciBjb3VudCA6bnVtYmVyID0gMDtcblx0dmFyIGNvdW50ZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdGZvciAoIHZhciBsZW5ndGggOm51bWJlciA9IHZhbHVlcy5sZW5ndGgsIGluZGV4IDpudW1iZXIgPSAwOyBpbmRleDxsZW5ndGg7ICsraW5kZXggKSB7XG5cdFx0dmFyIHZhbHVlIDphbnkgPSB2YWx1ZXNbaW5kZXhdO1xuXHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdHZhciBfc3RhdHVzIDpTdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRcdGlmICggX3N0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdCsrY291bnQ7XG5cdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHZhciB0aGF0IDpQcml2YXRlID0gbmV3IFByaXZhdGU7XG5cdFx0XHRcdCggZnVuY3Rpb24gKGluZGV4IDpudW1iZXIpIHtcblx0XHRcdFx0XHRzZXRfb25mdWxmaWxsZWQodGhhdCwgZnVuY3Rpb24gb25mdWxmaWxsZWQgKHZhbHVlIDphbnkpIDp2b2lkIHtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0aWYgKCAhLS1jb3VudCAmJiBjb3VudGVkICkgeyBmbG93KFRISVMsIF92YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ICkoaW5kZXgpO1xuXHRcdFx0XHRzZXRfb25yZWplY3RlZCh0aGF0LCBvbnJlamVjdGVkKTtcblx0XHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoYXQpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIF9zdGF0dXM9PT1SRUpFQ1RFRCApIHtcblx0XHRcdFx0c2V0X3ZhbHVlKFRISVMsIGdldF92YWx1ZSh2YWx1ZSkpO1xuXHRcdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHsgX3ZhbHVlW2luZGV4XSA9IGdldF92YWx1ZSh2YWx1ZSk7IH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0XHQrK2NvdW50O1xuXHRcdFx0X3ZhbHVlW2luZGV4XSA9IHVuZGVmaW5lZDtcblx0XHRcdCggZnVuY3Rpb24gKGluZGV4IDpudW1iZXIpIHtcblx0XHRcdFx0dmFyIHJlZCA6Ym9vbGVhbiB8IHVuZGVmaW5lZDtcblx0XHRcdFx0dmFsdWUudGhlbihcblx0XHRcdFx0XHRmdW5jdGlvbiBvbmZ1bGZpbGxlZCAodmFsdWUgOmFueSkgOnZvaWQge1xuXHRcdFx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRcdFx0XHRcdF92YWx1ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0aWYgKCAhLS1jb3VudCAmJiBjb3VudGVkICkgeyBmbG93KFRISVMsIF92YWx1ZSwgRlVMRklMTEVEKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0b25yZWplY3RlZFxuXHRcdFx0XHQpO1xuXHRcdFx0fSApKGluZGV4KTtcblx0XHR9XG5cdFx0ZWxzZSB7IF92YWx1ZVtpbmRleF0gPSB2YWx1ZTsgfVxuXHR9XG5cdGNvdW50ZWQgPSB0cnVlO1xuXHRpZiAoICFjb3VudCAmJiBnZXRfc3RhdHVzKFRISVMpPT09UEVORElORyApIHtcblx0XHRzZXRfdmFsdWUoVEhJUywgX3ZhbHVlKTtcblx0XHRzZXRfc3RhdHVzKFRISVMsIEZVTEZJTExFRCk7XG5cdFx0ZGVsZXRlX2RlcGVuZGVudHMoVEhJUyk7XG5cdH1cbn1cblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgeyBmbG93LCBwcmVwZW5kLCBQRU5ESU5HLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBTdGF0dXMsIGlzVGhlbmFibGUsIGlzUHJvbWlzZSwgUHJpdmF0ZSwgZ2V0X3N0YXR1cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBkZWxldGVfZGVwZW5kZW50cywgc2V0X2RlcGVuZGVudHMsIGdldF9kZXBlbmRlbnRzLCBnZXRfdmFsdWUsIHNldF9vbmZ1bGZpbGxlZCwgc2V0X29ucmVqZWN0ZWQgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByYWNlICh2YWx1ZXMgOnJlYWRvbmx5IGFueVtdKSA6UHVibGljIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0dHJ5IHsgcmFjZV90cnkodmFsdWVzLCBUSElTKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICkge1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIGVycm9yKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgUkVKRUNURUQpO1xuXHRcdFx0ZGVsZXRlX2RlcGVuZGVudHMoVEhJUyk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBUSElTO1xufTtcblxuZnVuY3Rpb24gcmFjZV90cnkgKHZhbHVlcyA6cmVhZG9ubHkgYW55W10sIFRISVMgOlByaXZhdGUpIDp2b2lkIHtcblx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRmdW5jdGlvbiBvbmZ1bGZpbGxlZCAodmFsdWUgOmFueSkgOmFueSB7IGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICYmIGZsb3coVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0ZnVuY3Rpb24gb25yZWplY3RlZCAoZXJyb3IgOmFueSkgOmFueSB7IGdldF9zdGF0dXMoVEhJUyk9PT1QRU5ESU5HICYmIGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHR2YXIgdGhhdCA6UHJpdmF0ZSA9IG5ldyBQcml2YXRlO1xuXHRzZXRfb25mdWxmaWxsZWQodGhhdCwgb25mdWxmaWxsZWQpO1xuXHRzZXRfb25yZWplY3RlZCh0aGF0LCBvbnJlamVjdGVkKTtcblx0Zm9yICggdmFyIGxlbmd0aCA6bnVtYmVyID0gdmFsdWVzLmxlbmd0aCwgaW5kZXggOm51bWJlciA9IDA7IGluZGV4PGxlbmd0aDsgKytpbmRleCApIHtcblx0XHR2YXIgdmFsdWUgOmFueSA9IHZhbHVlc1tpbmRleF07XG5cdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0dmFyIF9zdGF0dXMgOlN0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0aWYgKCBfc3RhdHVzPT09UEVORElORyApIHsgZ2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoYXQpOyB9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2V0X3ZhbHVlKFRISVMsIGdldF92YWx1ZSh2YWx1ZSkpO1xuXHRcdFx0XHRzZXRfc3RhdHVzKFRISVMsIF9zdGF0dXMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0XHR2YWx1ZS50aGVuKG9uZnVsZmlsbGVkLCBvbnJlamVjdGVkKTtcblx0XHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKSE9PVBFTkRJTkcgKSB7IGJyZWFrOyB9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c2V0X3ZhbHVlKFRISVMsIHZhbHVlKTtcblx0XHRcdHNldF9zdGF0dXMoVEhJUywgRlVMRklMTEVEKTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxufVxuXG5pbXBvcnQgUHVibGljIGZyb20gJy4vVGhlbmFibGUnOyIsImltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5cbmltcG9ydCB7IFByaXZhdGUsIE9udGhlbiwgc2V0X2RlcGVuZGVudHMsIHNldF9vbnRoZW4gfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwZW5kIChvbnRoZW4gOk9udGhlbikgOlB1YmxpYyB7XG5cdGlmICggdHlwZW9mIG9udGhlbiE9PSdmdW5jdGlvbicgKSB7IHRocm93IFR5cGVFcnJvcignVGhlbmFibGUucGVuZChvbnRoZW4gaXMgbm90IGEgZnVuY3Rpb24pJyk7IH1cblx0dmFyIFRISVMgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRzZXRfb250aGVuKFRISVMsIG9udGhlbik7XG5cdHJldHVybiBUSElTO1xufTtcblxuaW1wb3J0IFB1YmxpYyBmcm9tICcuL1RoZW5hYmxlJzsiLCJpbXBvcnQgeyBpc1RoZW5hYmxlLCBGVUxGSUxMRUQsIFJFSkVDVEVELCBwcmVwZW5kLCBnZXRfc3RhdHVzLCBnZXRfdmFsdWUgfSBmcm9tICcuL18nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGF3YWl0OiBmdW5jdGlvbiAodmFsdWUgOmFueSkgOmFueSB7XG5cdFx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRcdHByZXBlbmQodmFsdWUpO1xuXHRcdFx0c3dpdGNoICggZ2V0X3N0YXR1cyh2YWx1ZSkgKSB7XG5cdFx0XHRcdGNhc2UgRlVMRklMTEVEOlxuXHRcdFx0XHRcdHJldHVybiBnZXRfdmFsdWUodmFsdWUpO1xuXHRcdFx0XHRjYXNlIFJFSkVDVEVEOlxuXHRcdFx0XHRcdHRocm93IGdldF92YWx1ZSh2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxufS5hd2FpdDtcbiIsImltcG9ydCBUeXBlRXJyb3IgZnJvbSAnLlR5cGVFcnJvcic7XG5cbmltcG9ydCB7IFBFTkRJTkcsIEZVTEZJTExFRCwgUkVKRUNURUQsIFN0YXR1cywgUHJpdmF0ZSwgaXNUaGVuYWJsZSwgaXNQcm9taXNlLCBmbG93LCBkZXBlbmQsIHByZXBlbmQsIEV4ZWN1dG9yLCBPbmZ1bGZpbGxlZCwgT25yZWplY3RlZCwgUHJpdmF0ZV9jYWxsLCBnZXRfc3RhdHVzLCBnZXRfZGVwZW5kZW50cywgZ2V0X3ZhbHVlLCBzZXRfZGVwZW5kZW50cywgc2V0X3ZhbHVlLCBzZXRfc3RhdHVzLCBkZWxldGVfZGVwZW5kZW50cyB9IGZyb20gJy4vXyc7XG5cbmV4cG9ydCB7IFB1YmxpYyBhcyBkZWZhdWx0IH07XG5cbnR5cGUgUHVibGljID0gUmVhZG9ubHk8b2JqZWN0ICYge1xuXHR0aGVuICh0aGlzIDpQdWJsaWMsIG9uZnVsZmlsbGVkPyA6T25mdWxmaWxsZWQsIG9ucmVqZWN0ZWQ/IDpPbnJlamVjdGVkKSA6UHVibGljLFxufT47XG5cbnZhciBQdWJsaWMgOnsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfSA9IGZ1bmN0aW9uIFRoZW5hYmxlICh0aGlzIDpQcml2YXRlLCBleGVjdXRvciA6RXhlY3V0b3IpIDp2b2lkIHtcblx0aWYgKCB0eXBlb2YgZXhlY3V0b3IhPT0nZnVuY3Rpb24nICkgeyB0aHJvdyBUeXBlRXJyb3IoJ25ldyBUaGVuYWJsZShleGVjdXRvciBpcyBub3QgYSBmdW5jdGlvbiknKTsgfVxuXHR2YXIgZXhlY3V0ZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhciByZWQgOmJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHZhciBfdmFsdWUgOmFueTtcblx0dmFyIF9zdGF0dXMgOlN0YXR1cyB8IHVuZGVmaW5lZDtcblx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHQvL3RoaXMgaW5zdGFuY2VvZiBUaGVuYWJsZSB8fCB0aHJvdyhUeXBlRXJyb3IoKSk7XG5cdFByaXZhdGVfY2FsbChUSElTKTtcblx0dHJ5IHtcblx0XHRleGVjdXRvcihcblx0XHRcdGZ1bmN0aW9uIHJlc29sdmUgKHZhbHVlIDphbnkpIHtcblx0XHRcdFx0aWYgKCByZWQgKSB7IHJldHVybjsgfVxuXHRcdFx0XHRyZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAoIGV4ZWN1dGVkICkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRpZiAoIGlzVGhlbmFibGUodmFsdWUpICkge1xuXHRcdFx0XHRcdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0X3N0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRpZiAoIF9zdGF0dXM9PT1QRU5ESU5HICkgeyBnZXRfZGVwZW5kZW50cyh2YWx1ZSkhLnB1c2goVEhJUyk7IH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7IGZsb3coVEhJUywgZ2V0X3ZhbHVlKHZhbHVlKSwgX3N0YXR1cyEpOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICggaXNQcm9taXNlKHZhbHVlKSApIHsgZGVwZW5kKFRISVMsIHZhbHVlKTsgfVxuXHRcdFx0XHRcdFx0ZWxzZSB7IGZsb3coVEhJUywgdmFsdWUsIEZVTEZJTExFRCk7IH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycm9yKSB7IGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7IGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfSB9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0X3ZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdFx0X3N0YXR1cyA9IEZVTEZJTExFRDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uIHJlamVjdCAoZXJyb3IgOmFueSkge1xuXHRcdFx0XHRpZiAoIHJlZCApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdHJlZCA9IHRydWU7XG5cdFx0XHRcdGlmICggZXhlY3V0ZWQgKSB7IGZsb3coVEhJUywgZXJyb3IsIFJFSkVDVEVEKTsgfVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRfdmFsdWUgPSBlcnJvcjtcblx0XHRcdFx0XHRfc3RhdHVzID0gUkVKRUNURUQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHRcdGlmICggIXJlZCApIHtcblx0XHRcdGV4ZWN1dGVkID0gdHJ1ZTtcblx0XHRcdHNldF9kZXBlbmRlbnRzKFRISVMsIFtdKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0Y2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCAhcmVkICkge1xuXHRcdFx0cmVkID0gdHJ1ZTtcblx0XHRcdHNldF92YWx1ZShUSElTLCBlcnJvcik7XG5cdFx0XHRzZXRfc3RhdHVzKFRISVMsIFJFSkVDVEVEKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0dHJ5IHsgckVkKFRISVMsIF9zdGF0dXMhLCBfdmFsdWUpOyB9XG5cdGNhdGNoIChlcnJvcikge1xuXHRcdGlmICggZ2V0X3N0YXR1cyhUSElTKT09PVBFTkRJTkcgKSB7XG5cdFx0XHRzZXRfdmFsdWUoVEhJUywgZXJyb3IpO1xuXHRcdFx0c2V0X3N0YXR1cyhUSElTLCBSRUpFQ1RFRCk7XG5cdFx0XHRkZWxldGVfZGVwZW5kZW50cyhUSElTKTtcblx0XHR9XG5cdH1cbn0gYXMgYW55O1xuXG5mdW5jdGlvbiByRWQgKFRISVMgOlByaXZhdGUsIHN0YXR1cyA6U3RhdHVzLCB2YWx1ZSA6YW55KSA6dm9pZCB7XG5cdGlmICggc3RhdHVzPT09RlVMRklMTEVEICkge1xuXHRcdGlmICggaXNUaGVuYWJsZSh2YWx1ZSkgKSB7XG5cdFx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHRcdHN0YXR1cyA9IGdldF9zdGF0dXModmFsdWUpO1xuXHRcdFx0aWYgKCBzdGF0dXM9PT1QRU5ESU5HICkge1xuXHRcdFx0XHRzZXRfZGVwZW5kZW50cyhUSElTLCBbXSk7XG5cdFx0XHRcdGdldF9kZXBlbmRlbnRzKHZhbHVlKSEucHVzaChUSElTKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzZXRfdmFsdWUoVEhJUywgZ2V0X3ZhbHVlKHZhbHVlKSk7XG5cdFx0XHRcdHNldF9zdGF0dXMoVEhJUywgc3RhdHVzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCBpc1Byb21pc2UodmFsdWUpICkge1xuXHRcdFx0c2V0X2RlcGVuZGVudHMoVEhJUywgW10pO1xuXHRcdFx0ZGVwZW5kKFRISVMsIHZhbHVlKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0c2V0X3ZhbHVlKFRISVMsIHZhbHVlKTtcblx0c2V0X3N0YXR1cyhUSElTLCBzdGF0dXMpO1xufVxuIiwiaW1wb3J0IFR5cGVFcnJvciBmcm9tICcuVHlwZUVycm9yJztcbmltcG9ydCBXZWFrTWFwIGZyb20gJy5XZWFrTWFwJztcbmltcG9ydCB1bmRlZmluZWQgZnJvbSAnLnVuZGVmaW5lZCc7XG5cbmltcG9ydCB7IFBFTkRJTkcsIFJFSkVDVEVELCBGVUxGSUxMRUQsIFByaXZhdGUsIGlzVGhlbmFibGUsIGlzUHJvbWlzZSwgU3RhdHVzLCBkZXBlbmQsIHByZXBlbmQsIE9uZnVsZmlsbGVkLCBPbnJlamVjdGVkLCBnZXRfc3RhdHVzLCBzZXRfZGVwZW5kZW50cywgc2V0X29uZnVsZmlsbGVkLCBzZXRfb25yZWplY3RlZCwgZ2V0X2RlcGVuZGVudHMsIHNldF92YWx1ZSwgZ2V0X3ZhbHVlLCBzZXRfc3RhdHVzIH0gZnJvbSAnLi9fJztcblxuZXhwb3J0IGRlZmF1bHQgdHlwZW9mIFdlYWtNYXA9PT0nZnVuY3Rpb24nXG5cdD8geyB0aGVuOiB0aGVuIH1cblx0OiB7XG5cdFx0X3N0YXR1czogUEVORElORyxcblx0XHRfdmFsdWU6IHVuZGVmaW5lZCxcblx0XHRfZGVwZW5kZW50czogdW5kZWZpbmVkLFxuXHRcdF9vbmZ1bGZpbGxlZDogdW5kZWZpbmVkLFxuXHRcdF9vbnJlamVjdGVkOiB1bmRlZmluZWQsXG5cdFx0X29udGhlbjogdW5kZWZpbmVkLFxuXHRcdHRoZW46IHRoZW5cblx0fTtcblxuZnVuY3Rpb24gdGhlbiAodGhpcyA6UHJpdmF0ZSwgb25mdWxmaWxsZWQ/IDpPbmZ1bGZpbGxlZCwgb25yZWplY3RlZD8gOk9ucmVqZWN0ZWQpIDpQcml2YXRlIHtcblx0dmFyIFRISVMgOlByaXZhdGUgPSB0aGlzO1xuXHRpZiAoIGlzVGhlbmFibGUoVEhJUykgKSB7XG5cdFx0cHJlcGVuZChUSElTKTtcblx0XHR2YXIgdGhlbmFibGUgOlByaXZhdGUgPSBuZXcgUHJpdmF0ZTtcblx0XHRzd2l0Y2ggKCBnZXRfc3RhdHVzKFRISVMpICkge1xuXHRcdFx0Y2FzZSBQRU5ESU5HOlxuXHRcdFx0XHRzZXRfZGVwZW5kZW50cyh0aGVuYWJsZSwgW10pO1xuXHRcdFx0XHRpZiAoIHR5cGVvZiBvbmZ1bGZpbGxlZD09PSdmdW5jdGlvbicgKSB7IHNldF9vbmZ1bGZpbGxlZCh0aGVuYWJsZSwgb25mdWxmaWxsZWQpOyB9XG5cdFx0XHRcdGlmICggdHlwZW9mIG9ucmVqZWN0ZWQ9PT0nZnVuY3Rpb24nICkgeyBzZXRfb25yZWplY3RlZCh0aGVuYWJsZSwgb25yZWplY3RlZCk7IH1cblx0XHRcdFx0Z2V0X2RlcGVuZGVudHMoVEhJUykhLnB1c2godGhlbmFibGUpO1xuXHRcdFx0XHRyZXR1cm4gdGhlbmFibGU7XG5cdFx0XHRjYXNlIEZVTEZJTExFRDpcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25mdWxmaWxsZWQ9PT0nZnVuY3Rpb24nICkgeyBvbnRvKFRISVMsIG9uZnVsZmlsbGVkLCB0aGVuYWJsZSk7IH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0c2V0X3ZhbHVlKHRoZW5hYmxlLCBnZXRfdmFsdWUoVEhJUykpO1xuXHRcdFx0XHRcdHNldF9zdGF0dXModGhlbmFibGUsIEZVTEZJTExFRCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdFx0Y2FzZSBSRUpFQ1RFRDpcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb25yZWplY3RlZD09PSdmdW5jdGlvbicgKSB7IG9udG8oVEhJUywgb25yZWplY3RlZCwgdGhlbmFibGUpOyB9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgZ2V0X3ZhbHVlKFRISVMpKTtcblx0XHRcdFx0XHRzZXRfc3RhdHVzKHRoZW5hYmxlLCBSRUpFQ1RFRCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoZW5hYmxlO1xuXHRcdH1cblx0fVxuXHR0aHJvdyBUeXBlRXJyb3IoJ01ldGhvZCBUaGVuYWJsZS5wcm90b3R5cGUudGhlbiBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG59XG5cbmZ1bmN0aW9uIG9udG8gKFRISVMgOlByaXZhdGUsIG9uIDooXyA6YW55KSA9PiBhbnksIHRoZW5hYmxlIDpQcml2YXRlKSB7XG5cdHRyeSB7IG9udG9fdHJ5KHRoZW5hYmxlLCBvbihnZXRfdmFsdWUoVEhJUykpKTsgfVxuXHRjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIGdldF9zdGF0dXModGhlbmFibGUpPT09UEVORElORyApIHtcblx0XHRcdHNldF92YWx1ZSh0aGVuYWJsZSwgZXJyb3IpO1xuXHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgUkVKRUNURUQpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBvbnRvX3RyeSAodGhlbmFibGUgOlByaXZhdGUsIHZhbHVlIDphbnkpIDp2b2lkIHtcblx0aWYgKCBpc1RoZW5hYmxlKHZhbHVlKSApIHtcblx0XHRwcmVwZW5kKHZhbHVlKTtcblx0XHR2YXIgc3RhdHVzIDpTdGF0dXMgPSBnZXRfc3RhdHVzKHZhbHVlKTtcblx0XHRpZiAoIHN0YXR1cz09PVBFTkRJTkcgKSB7XG5cdFx0XHRzZXRfZGVwZW5kZW50cyh0aGVuYWJsZSwgW10pO1xuXHRcdFx0Z2V0X2RlcGVuZGVudHModmFsdWUpIS5wdXNoKHRoZW5hYmxlKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRzZXRfdmFsdWUodGhlbmFibGUsIGdldF92YWx1ZSh2YWx1ZSkpO1xuXHRcdFx0c2V0X3N0YXR1cyh0aGVuYWJsZSwgc3RhdHVzKTtcblx0XHR9XG5cdH1cblx0ZWxzZSBpZiAoIGlzUHJvbWlzZSh2YWx1ZSkgKSB7XG5cdFx0c2V0X2RlcGVuZGVudHModGhlbmFibGUsIFtdKTtcblx0XHRkZXBlbmQodGhlbmFibGUsIHZhbHVlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRzZXRfdmFsdWUodGhlbmFibGUsIHZhbHVlKTtcblx0XHRzZXRfc3RhdHVzKHRoZW5hYmxlLCBGVUxGSUxMRUQpO1xuXHR9XG59XG4iLCJpbXBvcnQgV2Vha01hcCBmcm9tICcuV2Vha01hcCc7XG5pbXBvcnQgZnJlZXplIGZyb20gJy5PYmplY3QuZnJlZXplJztcbmltcG9ydCBzZWFsIGZyb20gJy5PYmplY3Quc2VhbCc7XG5cbmltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdmVyc2lvbj90ZXh0JztcbmV4cG9ydCB7IHZlcnNpb24gfTtcblxuaW1wb3J0IHJlc29sdmUgZnJvbSAnLi9yZXNvbHZlJztcbmltcG9ydCByZWplY3QgZnJvbSAnLi9yZWplY3QnO1xuaW1wb3J0IGFsbCBmcm9tICcuL2FsbCc7XG5pbXBvcnQgcmFjZSBmcm9tICcuL3JhY2UnO1xuaW1wb3J0IHBlbmQgZnJvbSAnLi9wZW5kJztcbmltcG9ydCBBV0FJVCBmcm9tICcuL2F3YWl0JztcbmV4cG9ydCB7XG5cdHJlc29sdmUsXG5cdHJlamVjdCxcblx0YWxsLFxuXHRyYWNlLFxuXHRwZW5kLFxuXHRBV0FJVCBhcyBhd2FpdCxcbn07XG5cbmltcG9ydCB7IFByaXZhdGUsIEV4ZWN1dG9yIH0gZnJvbSAnLi9fJztcbmltcG9ydCBQdWJsaWMgZnJvbSAnLi9UaGVuYWJsZSc7XG5pbXBvcnQgcHJvdG90eXBlIGZyb20gJy4vVGhlbmFibGUucHJvdG90eXBlJztcblB1YmxpYy5wcm90b3R5cGUgPSBQcml2YXRlLnByb3RvdHlwZSA9IHR5cGVvZiBXZWFrTWFwPT09J2Z1bmN0aW9uJyA/IC8qI19fUFVSRV9fKi8gZnJlZXplKHByb3RvdHlwZSkgOiBzZWFsID8gLyojX19QVVJFX18qLyBzZWFsKHByb3RvdHlwZSkgOiBwcm90b3R5cGU7XG5cbmltcG9ydCBEZWZhdWx0IGZyb20gJy5kZWZhdWx0Pz0nO1xuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdChQdWJsaWMsIHtcblx0dmVyc2lvbjogdmVyc2lvbixcblx0VGhlbmFibGU6IFB1YmxpYyxcblx0cmVzb2x2ZTogcmVzb2x2ZSxcblx0cmVqZWN0OiByZWplY3QsXG5cdGFsbDogYWxsLFxuXHRyYWNlOiByYWNlLFxuXHRwZW5kOiBwZW5kLFxuXHRhd2FpdDogQVdBSVRcbn0pO1xuXG52YXIgVGhlbmFibGUgOlJlYWRvbmx5PHsgbmV3IChleGVjdXRvciA6RXhlY3V0b3IpIDpQdWJsaWMgfT4gPSBmcmVlemUgPyAvKiNfX1BVUkVfXyovIGZyZWV6ZShQdWJsaWMpIDogUHVibGljO1xudHlwZSBUaGVuYWJsZSA9IFB1YmxpYztcbmV4cG9ydCB7IFRoZW5hYmxlIH07XG4iXSwibmFtZXMiOlsidW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrQkFBZSxPQUFPOzs7Ozs7Ozs7OzBCQUFDLHRCQ3FCaEIsSUFBSSxPQUFPLEdB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