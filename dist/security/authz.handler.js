"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const restify_errors_1 = require("restify-errors");
exports.authorize = (...profiles) => {
    return (req, resp, next) => {
        if (req.authenticate !== undefined && req.authenticate.hasAny(...profiles)) {
            req.log.debug('User %s is authorized with profiles %s. Required profiles %j', req.authenticate._id, req.authenticate.profiles, req.path(), profiles);
            next();
        }
        else {
            if (req.authenticate) {
                req.log.debug('Permission denied for %s. Required profiles: %j. User profiles: %j', req.authenticate._id, profiles, req.authenticate.profiles);
            }
            next(new restify_errors_1.ForbiddenError('Permission denied'));
        }
    };
};
