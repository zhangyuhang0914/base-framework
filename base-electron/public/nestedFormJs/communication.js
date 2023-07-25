"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Communication = /** @class */ (function () {
    function Communication(target, options) {
        var _this = this;
        this.target = target;
        this.targetInfo = { referer: '' };
        this.connected = false;
        this.uuid = 1;
        this.options = __assign({ targetOrigin: '*' }, options);
        this.header = {};
        this.eventHandler = function (ev) {
            var data = ev.data;
            if (_this.onmessage)
                _this.onmessage(ev);
            switch (data.type) {
                case 'PUT':
                    if (data.header.hasOwnProperty('Reply-UUID'))
                        for (var i = 0; i < _this.pendingList.length; i++) {
                            var p = _this.pendingList[i];
                            if (p.uuid === data.header['Reply-UUID']) {
                                _this.pendingList.splice(i, 1)[0].callback(data.data, ev);
                                break;
                            }
                        }
                    else if (typeof _this.receiverAction === 'function')
                        _this.receiverAction(data.data, ev);
                    break;
                case 'GET':
                    if (typeof _this.providerAction === 'function')
                        _this.sendMessage({
                            type: 'PUT',
                            header: { 'Reply-UUID': data.uuid },
                            data: _this.providerAction(data.data, ev)
                        });
                    break;
                case 'OPTIONS':
                    if (!_this.connected) {
                        var referer = location.origin + location.pathname;
                        if (referer === _this.targetInfo.referer)
                            _this.connected = true;
                        _this.targetInfo.referer = referer;
                        _this.handshake();
                    }
                    break;
            }
        };
        this.pendingList = [];
    }
    Communication.prototype.init = function () {
        addEventListener('message', this.eventHandler);
        this.handshake();
    };
    Communication.prototype.destroy = function () {
        removeEventListener('message', this.eventHandler);
        this.connected = false;
    };
    Communication.prototype.setHeader = function (header) {
        this.header = header;
    };
    Communication.prototype.put = function (data) {
        this.sendMessage('PUT', data);
    };
    Communication.prototype.get = function (data, callback) {
        var uuid = this.getNewUUID();
        this.pendingList.push({ uuid: uuid, callback: callback });
        this.sendMessage({ uuid: uuid, type: 'GET', data: data });
    };
    Communication.prototype.handshake = function () {
        this.sendMessage({
            type: 'OPTIONS',
            header: {
                Origin: location.origin,
                Pathname: location.pathname,
                Referer: this.targetInfo.referer
            },
            data: ''
        });
    };
    Communication.prototype.sendMessage = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        switch (args.length) {
            case 1:
                {
                    var messageEntity = args[0];
                    var contentType = void 0;
                    if (typeof messageEntity.data === 'string')
                        contentType = 'text/plain';
                    else
                        contentType = 'application/json';
                    messageEntity.uuid = (_a = messageEntity.uuid) !== null && _a !== void 0 ? _a : this.getNewUUID();
                    messageEntity.header = __assign(__assign(__assign({}, this.header), { 'Content-Type': contentType }), messageEntity.header);
                    this.target.postMessage(__assign(__assign({}, messageEntity), { timestamp: new Date().getTime() }), this.options.targetOrigin);
                }
                break;
            case 2:
                {
                    var type = args[0], data = args[1];
                    this.sendMessage({ type: type, data: data });
                }
                break;
        }
    };
    Communication.prototype.getNewUUID = function () {
        return this.uuid++;
    };
    return Communication;
}());
