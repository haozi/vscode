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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("@coder/logger");
var fs = __importStar(require("fs-extra"));
var http = __importStar(require("http"));
var httpolyglot = __importStar(require("httpolyglot"));
var path = __importStar(require("path"));
var querystring = __importStar(require("querystring"));
var safe_compare_1 = __importDefault(require("safe-compare"));
var tarFs = __importStar(require("tar-fs"));
var url = __importStar(require("url"));
var zlib = __importStar(require("zlib"));
var http_1 = require("../common/http");
var util_1 = require("../common/util");
var socket_1 = require("./socket");
var util_2 = require("./util");
var AuthType;
(function (AuthType) {
    AuthType["Password"] = "password";
    AuthType["None"] = "none";
})(AuthType = exports.AuthType || (exports.AuthType = {}));
/**
 * Provides HTTP responses. This abstract class provides some helpers for
 * interpreting, creating, and authenticating responses.
 */
var HttpProvider = /** @class */ (function () {
    function HttpProvider(options) {
        this.options = options;
        this.rootPath = path.resolve(__dirname, "../..");
    }
    HttpProvider.prototype.dispose = function () {
        // No default behavior.
    };
    /**
     * Handle web sockets on the registered endpoint.
     */
    HttpProvider.prototype.handleWebSocket = function (
    /* eslint-disable @typescript-eslint/no-unused-vars */
    _route, _request, _socket, _head) {
        throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
    };
    /**
     * Get the base relative to the provided route. For each slash we need to go
     * up a directory. For example:
     * / => ./
     * /foo => ./
     * /foo/ => ./../
     * /foo/bar => ./../
     * /foo/bar/ => ./../../
     */
    HttpProvider.prototype.base = function (route) {
        var depth = (route.originalPath.match(/\//g) || []).length;
        return util_1.normalize("./" + (depth > 1 ? "../".repeat(depth - 1) : ""));
    };
    /**
     * Get error response.
     */
    HttpProvider.prototype.getErrorRoot = function (route, title, header, body) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUtf8Resource(this.rootPath, "src/browser/pages/error.html")];
                    case 1:
                        response = _a.sent();
                        response.content = response.content
                            .replace(/{{ERROR_TITLE}}/g, title)
                            .replace(/{{ERROR_HEADER}}/g, header)
                            .replace(/{{ERROR_BODY}}/g, body);
                        return [2 /*return*/, this.replaceTemplates(route, response)];
                }
            });
        });
    };
    /**
     * Replace common templates strings.
     */
    HttpProvider.prototype.replaceTemplates = function (route, response, sessionId) {
        var options = {
            base: this.base(route),
            commit: this.options.commit,
            logLevel: logger_1.logger.level,
            sessionId: sessionId,
        };
        response.content = response.content
            .replace(/{{COMMIT}}/g, this.options.commit)
            .replace(/{{TO}}/g, Array.isArray(route.query.to) ? route.query.to[0] : route.query.to || "/dashboard")
            .replace(/{{BASE}}/g, this.base(route))
            .replace(/"{{OPTIONS}}"/, "'" + JSON.stringify(options) + "'");
        return response;
    };
    Object.defineProperty(HttpProvider.prototype, "isDev", {
        get: function () {
            return this.options.commit === "development";
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get a file resource.
     * TODO: Would a stream be faster, at least for large files?
     */
    HttpProvider.prototype.getResource = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var filePath, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        filePath = path.join.apply(path, parts);
                        _a = {};
                        return [4 /*yield*/, fs.readFile(filePath)];
                    case 1: return [2 /*return*/, (_a.content = _b.sent(), _a.filePath = filePath, _a)];
                }
            });
        });
    };
    /**
     * Get a file resource as a string.
     */
    HttpProvider.prototype.getUtf8Resource = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var filePath, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        filePath = path.join.apply(path, parts);
                        _a = {};
                        return [4 /*yield*/, fs.readFile(filePath, "utf8")];
                    case 1: return [2 /*return*/, (_a.content = _b.sent(), _a.filePath = filePath, _a)];
                }
            });
        });
    };
    /**
     * Tar up and stream a directory.
     */
    HttpProvider.prototype.getTarredResource = function (request) {
        var parts = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parts[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var filePath, stream, headers, compress_1;
            return __generator(this, function (_a) {
                filePath = path.join.apply(path, parts);
                stream = tarFs.pack(filePath);
                headers = {};
                if (request.headers["accept-encoding"] && request.headers["accept-encoding"].includes("gzip")) {
                    logger_1.logger.debug("gzipping tar", logger_1.field("filePath", filePath));
                    compress_1 = zlib.createGzip();
                    stream.pipe(compress_1);
                    stream.on("error", function (error) { return compress_1.destroy(error); });
                    stream.on("close", function () { return compress_1.end(); });
                    stream = compress_1;
                    headers["content-encoding"] = "gzip";
                }
                return [2 /*return*/, { stream: stream, filePath: filePath, mime: "application/x-tar", cache: true, headers: headers }];
            });
        });
    };
    /**
     * Helper to error on invalid methods (default GET).
     */
    HttpProvider.prototype.ensureMethod = function (request, method) {
        var check = Array.isArray(method) ? method : [method || "GET"];
        if (!request.method || !check.includes(request.method)) {
            throw new http_1.HttpError("Unsupported method " + request.method, http_1.HttpCode.BadRequest);
        }
    };
    /**
     * Helper to error if not authorized.
     */
    HttpProvider.prototype.ensureAuthenticated = function (request) {
        if (!this.authenticated(request)) {
            throw new http_1.HttpError("Unauthorized", http_1.HttpCode.Unauthorized);
        }
    };
    /**
     * Use the first query value or the default if there isn't one.
     */
    HttpProvider.prototype.queryOrDefault = function (value, def) {
        if (Array.isArray(value)) {
            value = value[0];
        }
        return typeof value !== "undefined" ? value : def;
    };
    /**
     * Return the provided password value if the payload contains the right
     * password otherwise return false. If no payload is specified use cookies.
     */
    HttpProvider.prototype.authenticated = function (request, payload) {
        switch (this.options.auth) {
            case AuthType.None:
                return true;
            case AuthType.Password:
                if (typeof payload === "undefined") {
                    payload = this.parseCookies(request);
                }
                if (this.options.password && payload.key) {
                    for (var i = 0; i < payload.key.length; ++i) {
                        if (safe_compare_1.default(payload.key[i], this.options.password)) {
                            return payload.key[i];
                        }
                    }
                }
                return false;
            default:
                throw new Error("Unsupported auth type " + this.options.auth);
        }
    };
    /**
     * Parse POST data.
     */
    HttpProvider.prototype.getData = function (request) {
        return request.method === "POST" || request.method === "DELETE"
            ? new Promise(function (resolve, reject) {
                var body = "";
                var onEnd = function () {
                    off(); // eslint-disable-line @typescript-eslint/no-use-before-define
                    resolve(body || undefined);
                };
                var onError = function (error) {
                    off(); // eslint-disable-line @typescript-eslint/no-use-before-define
                    reject(error);
                };
                var onData = function (d) {
                    body += d;
                    if (body.length > 1e6) {
                        onError(new http_1.HttpError("Payload is too large", http_1.HttpCode.LargePayload));
                        request.connection.destroy();
                    }
                };
                var off = function () {
                    request.off("error", onError);
                    request.off("data", onError);
                    request.off("end", onEnd);
                };
                request.on("error", onError);
                request.on("data", onData);
                request.on("end", onEnd);
            })
            : Promise.resolve(undefined);
    };
    /**
     * Parse cookies.
     */
    HttpProvider.prototype.parseCookies = function (request) {
        var cookies = {};
        if (request.headers.cookie) {
            request.headers.cookie.split(";").forEach(function (keyValue) {
                var _a = util_1.split(keyValue, "="), key = _a[0], value = _a[1];
                if (!cookies[key]) {
                    cookies[key] = [];
                }
                cookies[key].push(decodeURI(value));
            });
        }
        return cookies;
    };
    return HttpProvider;
}());
exports.HttpProvider = HttpProvider;
/**
 * Provides a heartbeat using a local file to indicate activity.
 */
var Heart = /** @class */ (function () {
    function Heart(heartbeatPath, isActive) {
        this.heartbeatPath = heartbeatPath;
        this.isActive = isActive;
        this.heartbeatInterval = 60000;
        this.lastHeartbeat = 0;
    }
    /**
     * Write to the heartbeat file if we haven't already done so within the
     * timeout and start or reset a timer that keeps running as long as there is
     * activity. Failures are logged as warnings.
     */
    Heart.prototype.beat = function () {
        var _this = this;
        var now = Date.now();
        if (now - this.lastHeartbeat >= this.heartbeatInterval) {
            logger_1.logger.trace("heartbeat");
            fs.outputFile(this.heartbeatPath, "").catch(function (error) {
                logger_1.logger.warn(error.message);
            });
            this.lastHeartbeat = now;
            if (typeof this.heartbeatTimer !== "undefined") {
                clearTimeout(this.heartbeatTimer);
            }
            this.heartbeatTimer = setTimeout(function () {
                _this.isActive()
                    .then(function (active) {
                    if (active) {
                        _this.beat();
                    }
                })
                    .catch(function (error) {
                    logger_1.logger.warn(error.message);
                });
            }, this.heartbeatInterval);
        }
    };
    return Heart;
}());
exports.Heart = Heart;
/**
 * An HTTP server. Its main role is to route incoming HTTP requests to the
 * appropriate provider for that endpoint then write out the response. It also
 * covers some common use cases like redirects and caching.
 */
var HttpServer = /** @class */ (function () {
    function HttpServer(options) {
        var _this = this;
        this.options = options;
        this.providers = new Map();
        this.socketProvider = new socket_1.SocketProxyProvider();
        this.onRequest = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var route, payload, _a, error_1, e, code, content;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.heart.beat();
                        route = this.parseUrl(request);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 6]);
                        _a = this.maybeRedirect(request, route);
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, route.provider.handleRequest(route, request)];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        payload = _a;
                        if (!payload) {
                            throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                        }
                        response.writeHead(payload.redirect ? http_1.HttpCode.Redirect : payload.code || http_1.HttpCode.Ok, __assign(__assign(__assign(__assign(__assign({ "Content-Type": payload.mime || util_2.getMediaMime(payload.filePath) }, (payload.redirect ? { Location: this.constructRedirect(request, route, payload) } : {})), (request.headers["service-worker"] ? { "Service-Worker-Allowed": route.provider.base(route) } : {})), (payload.cache ? { "Cache-Control": "public, max-age=31536000" } : {})), (payload.cookie
                            ? {
                                "Set-Cookie": [
                                    payload.cookie.key + "=" + payload.cookie.value,
                                    "Path=" + util_1.normalize(payload.cookie.path || "/", true),
                                    "HttpOnly",
                                    "SameSite=strict",
                                ].join(";"),
                            }
                            : {})), payload.headers));
                        if (payload.stream) {
                            payload.stream.on("error", function (error) {
                                response.writeHead(error.code === "ENOENT" ? http_1.HttpCode.NotFound : http_1.HttpCode.ServerError);
                                response.end(error.message);
                            });
                            payload.stream.on("close", function () { return response.end(); });
                            payload.stream.pipe(response);
                        }
                        else if (typeof payload.content === "string" || payload.content instanceof Buffer) {
                            response.end(payload.content);
                        }
                        else if (payload.content && typeof payload.content === "object") {
                            response.end(JSON.stringify(payload.content));
                        }
                        else {
                            response.end();
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _b.sent();
                        e = error_1;
                        if (error_1.code === "ENOENT" || error_1.code === "EISDIR") {
                            e = new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                        }
                        logger_1.logger.debug("Request error", logger_1.field("url", request.url));
                        logger_1.logger.debug(error_1.stack);
                        code = typeof e.code === "number" ? e.code : http_1.HttpCode.ServerError;
                        return [4 /*yield*/, route.provider.getErrorRoot(route, code, code, e.message)];
                    case 5:
                        content = (_b.sent()).content;
                        response.writeHead(code);
                        response.end(content);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        this.onUpgrade = function (request, socket, head) { return __awaiter(_this, void 0, void 0, function () {
            var route, _a, _b, _c, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        this.heart.beat();
                        socket.on("error", function () { return socket.destroy(); });
                        if (this.options.cert && !socket.encrypted) {
                            throw new http_1.HttpError("HTTP websocket", http_1.HttpCode.BadRequest);
                        }
                        if (!request.headers.upgrade || request.headers.upgrade.toLowerCase() !== "websocket") {
                            throw new http_1.HttpError("HTTP/1.1 400 Bad Request", http_1.HttpCode.BadRequest);
                        }
                        route = this.parseUrl(request);
                        if (!route.provider) {
                            throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                        }
                        _b = (_a = route.provider).handleWebSocket;
                        _c = [route, request];
                        return [4 /*yield*/, this.socketProvider.createProxy(socket)];
                    case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent(), head]))];
                    case 2:
                        if (!(_d.sent())) {
                            throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _d.sent();
                        socket.destroy(error_2);
                        logger_1.logger.warn("discarding socket connection: " + error_2.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.heart = new Heart(path.join(util_2.xdgLocalDir, "heartbeat"), function () { return __awaiter(_this, void 0, void 0, function () {
            var connections;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnections()];
                    case 1:
                        connections = _a.sent();
                        logger_1.logger.trace(connections + " active connection" + util_1.plural(connections));
                        return [2 /*return*/, connections !== 0];
                }
            });
        }); });
        this.protocol = this.options.cert ? "https" : "http";
        if (this.protocol === "https") {
            this.server = httpolyglot.createServer({
                cert: this.options.cert && fs.readFileSync(this.options.cert),
                key: this.options.certKey && fs.readFileSync(this.options.certKey),
            }, this.onRequest);
        }
        else {
            this.server = http.createServer(this.onRequest);
        }
    }
    HttpServer.prototype.dispose = function () {
        this.socketProvider.stop();
        this.providers.forEach(function (p) { return p.dispose(); });
    };
    HttpServer.prototype.getConnections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.server.getConnections(function (error, count) {
                            return error ? reject(error) : resolve(count);
                        });
                    })];
            });
        });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    HttpServer.prototype.registerHttpProvider = function (endpoint, provider) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        endpoint = endpoint.replace(/^\/+|\/+$/g, "");
        if (this.providers.has("/" + endpoint)) {
            throw new Error(endpoint + " is already registered");
        }
        if (/\//.test(endpoint)) {
            throw new Error("Only top-level endpoints are supported (got " + endpoint + ")");
        }
        var p = new (provider.bind.apply(provider, __spreadArrays([void 0, {
                auth: this.options.auth || AuthType.None,
                base: "/" + endpoint,
                commit: this.options.commit,
                password: this.options.password,
            }], args)))();
        this.providers.set("/" + endpoint, p);
        return p;
    };
    /**
     * Start listening on the specified port.
     */
    HttpServer.prototype.listen = function () {
        var _this = this;
        if (!this.listenPromise) {
            this.listenPromise = new Promise(function (resolve, reject) {
                _this.server.on("error", reject);
                _this.server.on("upgrade", _this.onUpgrade);
                var onListen = function () { return resolve(_this.address()); };
                if (_this.options.socket) {
                    _this.server.listen(_this.options.socket, onListen);
                }
                else {
                    _this.server.listen(_this.options.port, _this.options.host, onListen);
                }
            });
        }
        return this.listenPromise;
    };
    /**
     * The *local* address of the server.
     */
    HttpServer.prototype.address = function () {
        var address = this.server.address();
        var endpoint = typeof address !== "string" && address !== null
            ? (address.address === "::" ? "localhost" : address.address) + ":" + address.port
            : address;
        return endpoint && this.protocol + "://" + endpoint;
    };
    /**
     * Return any necessary redirection before delegating to a provider.
     */
    HttpServer.prototype.maybeRedirect = function (request, route) {
        // If we're handling TLS ensure all requests are redirected to HTTPS.
        if (this.options.cert && !request.connection.encrypted) {
            return { redirect: route.fullPath };
        }
        return undefined;
    };
    /**
     * Given a path that goes from the base, construct a relative redirect URL
     * that will get you there considering that the app may be served from an
     * unknown base path. If handling TLS, also ensure HTTPS.
     */
    HttpServer.prototype.constructRedirect = function (request, route, payload) {
        var query = __assign(__assign({}, route.query), (payload.query || {}));
        Object.keys(query).forEach(function (key) {
            if (typeof query[key] === "undefined") {
                delete query[key];
            }
        });
        var secure = request.connection.encrypted;
        var redirect = (this.options.cert && !secure ? this.protocol + "://" + request.headers.host + "/" : "") +
            util_1.normalize(route.provider.base(route) + "/" + payload.redirect, true) +
            (Object.keys(query).length > 0 ? "?" + querystring.stringify(query) : "");
        logger_1.logger.debug("Redirecting", logger_1.field("secure", !!secure), logger_1.field("from", request.url), logger_1.field("to", redirect));
        return redirect;
    };
    /**
     * Parse a request URL so we can route it.
     */
    HttpServer.prototype.parseUrl = function (request) {
        var parse = function (fullPath) {
            var match = fullPath.match(/^(\/?[^/]*)(.*)$/);
            var _a = match ? match.map(function (p) { return p.replace(/\/+$/, ""); }) : ["", "", ""], /* ignore */ base = _a[1], requestPath = _a[2];
            if (base.indexOf(".") !== -1) {
                // Assume it's a file at the root.
                requestPath = base;
                base = "/";
            }
            else if (base === "") {
                // Happens if it's a plain `domain.com`.
                base = "/";
            }
            requestPath = requestPath || "/index.html";
            return { base: base, requestPath: requestPath };
        };
        var parsedUrl = request.url ? url.parse(request.url, true) : { query: {}, pathname: "" };
        var originalPath = parsedUrl.pathname || "/";
        var fullPath = util_1.normalize(originalPath, true);
        var _a = parse(fullPath), base = _a.base, requestPath = _a.requestPath;
        // Providers match on the path after their base so we need to account for
        // that by shifting the next base out of the request path.
        var provider = this.providers.get(base);
        if (base !== "/" && provider) {
            return __assign(__assign({}, parse(requestPath)), { fullPath: fullPath, query: parsedUrl.query, provider: provider, originalPath: originalPath });
        }
        // Fall back to the top-level provider.
        provider = this.providers.get("/");
        if (!provider) {
            throw new Error("No provider for " + base);
        }
        return { base: base, fullPath: fullPath, requestPath: requestPath, query: parsedUrl.query, provider: provider, originalPath: originalPath };
    };
    return HttpServer;
}());
exports.HttpServer = HttpServer;
//# sourceMappingURL=http.js.map