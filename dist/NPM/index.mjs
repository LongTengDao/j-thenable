/*!
 * 模块名称：j-thenable
 * 模块功能：模仿 Promise API 的同步防爆栈工具。从属于“简计划”。
   　　　　　Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".
 * 模块版本：1.0.2
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-thenable/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-thenable/
 */

var version = '1.0.2';

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
            r(THIS, error, REJECTED);
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
                            if (count > 1) {
                                --count;
                            }
                            else {
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
    }
    catch (error) {
        if (THIS._status === PENDING) {
            r(THIS, error, REJECTED);
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
            r(THIS, error, REJECTED);
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

//# sourceMappingURL=index.mjs.map