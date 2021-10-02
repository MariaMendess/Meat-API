"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const model_router_1 = require("../model-router");
const restify_1 = __importDefault(require("restify"));
const users_model_1 = require("./users.model");
const auth_handler_1 = require("../../security/auth.handler");
const authz_handler_1 = require("../../security/authz.handler");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, resp, netx) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(user => user ? [user] : [])
                    .then(this.renderAll(resp, netx, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                    .catch();
            }
            else {
                netx();
            }
        };
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get(`/${this.basePath}`, restify_1.default.plugins.conditionalHandler([
            { version: '2.0.0', handler: [authz_handler_1.authorize('admin'), this.findByEmail, this.findAll] },
            { version: '1.0.0', handler: [authz_handler_1.authorize('admin'), this.findAll] }
        ]));
        //application.get('/users',  this.findAll)
        //application.get('/users:id', [this.valedateId, this.findById])
        application.get(`/${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.valedateId, this.findById]);
        application.post(`/${this.basePath}`, [authz_handler_1.authorize('admin'), this.save]);
        application.put(`/${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.valedateId, this.replace]);
        application.patch(`/${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.valedateId, this.update]);
        application.del(`/${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.valedateId, this.delete]);
        application.post(`/${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
exports.usersRouter = new UsersRouter();
