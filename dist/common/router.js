"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const events_1 = require("events");
const restify_errors_1 = require("restify-errors");
class Router extends events_1.EventEmitter {
    envelope(document) {
        return document;
    }
    envelopeAll(documents, options = {}) {
        return documents;
    }
    render(resp, next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document);
                resp.json(this.envelope(document));
            }
            else {
                throw new restify_errors_1.NotFoundError('Documento não encontrado');
            }
            return next(false);
        };
    }
    renderAll(resp, next, options = {}) {
        return (documents) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document);
                });
                resp.json(this.envelopeAll(documents, options));
            }
            else {
                resp.json(this.envelopeAll([]));
            }
            return next(false);
        };
    }
}
exports.Router = Router;
