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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var secret_manager_1 = require("@google-cloud/secret-manager");
var client = new secret_manager_1.SecretManagerServiceClient();
var collection;
var _a = process.env, MONGO_SECRET = _a.MONGO_SECRET, DB = _a.DB, COLLECTION = _a.COLLECTION;
var connectDb = function () { return __awaiter(void 0, void 0, void 0, function () {
    var version, mongoUrl, connection;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!MONGO_SECRET || !DB || !COLLECTION) {
                    throw Error("Incomplete environment variables");
                }
                return [4, client.accessSecretVersion({ name: MONGO_SECRET })];
            case 1:
                version = (_c.sent())[0];
                mongoUrl = (_b = (_a = version === null || version === void 0 ? void 0 : version.payload) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.toString();
                if (!mongoUrl) {
                    throw Error("No mongo url found");
                }
                return [4, mongodb_1.MongoClient.connect(mongoUrl, {
                        useUnifiedTopology: true
                    })];
            case 2:
                connection = _c.sent();
                collection = connection.db(DB).collection(COLLECTION);
                return [2];
        }
    });
}); };
exports.handler = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var daily, weekly, monthly;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                res.set("Access-Control-Allow-Origin", "*");
                if (req.method === "OPTIONS") {
                    res.set("Access-Control-Allow-Methods", "GET");
                    res.set("Access-Control-Allow-Headers", "Content-Type");
                    res.set("Access-Control-Max-Age", "3600");
                    return [2, res.status(204).send("")];
                }
                if (!!collection) return [3, 2];
                return [4, connectDb()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4, getAggregatedData({ day: { $dayOfMonth: "$date" } })];
            case 3:
                daily = _a.sent();
                return [4, getAggregatedData({ week: { $week: "$date" } })];
            case 4:
                weekly = _a.sent();
                return [4, getAggregatedData({})];
            case 5:
                monthly = _a.sent();
                res.status(200).json({ daily: daily, weekly: weekly, monthly: monthly });
                return [2];
        }
    });
}); };
var getAggregatedData = function (options) {
    return collection
        .aggregate([
        {
            $group: {
                _id: __assign({ year: { $year: "$date" }, month: { $month: "$date" } }, options),
                week: { $last: "$week" },
                month: { $last: "$month" }
            }
        },
        { $sort: { _id: 1 } },
    ])
        .toArray();
};
