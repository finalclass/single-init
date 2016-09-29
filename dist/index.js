"use strict";
var SingleInit = (function () {
    function SingleInit(initFunc) {
        this.initFunc = initFunc;
        this.callbacks = [];
        this.state = 'cold';
        this.resultErr = null;
        this.result = null;
    }
    SingleInit.prototype.get = function (callback) {
        var _this = this;
        if (callback === void 0) { callback = function (err) { }; }
        return new Promise(function (resolve, reject) {
            function callbackWrapped(err, data) {
                if (err) {
                    reject(err);
                    callback(err);
                }
                else {
                    resolve(data);
                    callback(null, data);
                }
            }
            if (_this.state === 'complete') {
                return callbackWrapped(_this.resultErr, _this.result);
            }
            //if it's initializing then callback will be called anyway:
            _this.callbacks.push(callbackWrapped);
            if (_this.state === 'cold') {
                _this.initialize();
            }
        });
    };
    SingleInit.prototype.initialize = function () {
        var _this = this;
        this.state = 'initializing';
        this.initFunc(function (err, result) {
            _this.state = 'complete';
            if (err) {
                _this.resultErr = err;
                _this.callCallbacks();
            }
            else {
                _this.result = result;
                _this.callCallbacks();
            }
        });
    };
    SingleInit.prototype.callCallbacks = function () {
        var _this = this;
        this.callbacks.forEach(function (callback) {
            callback(_this.resultErr, _this.result);
        });
        this.callbacks = [];
    };
    return SingleInit;
}());
module.exports = SingleInit;
//# sourceMappingURL=index.js.map