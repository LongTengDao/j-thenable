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
var Thenable = freeze ? /*#__PURE__*/ freeze(Public) : Public;

export default _export;
export { Thenable, all, AWAIT as await, pend, race, reject, resolve, version };

/*¡ j-thenable */

//# sourceMappingURL=index.mjs.map