"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const supertest_1 = __importDefault(require("supertest"));
const mongoose = __importStar(require("mongoose"));
let address = global.address;
const auth = global.auth;
test('get /reviews', () => {
    return supertest_1.default(address)
        .get('/reviews')
        .then(Response => {
        expect(Response.status).toBe(200);
        expect(Response.body.items).toBeInstanceOf(Array);
    })
        .catch(fail);
});
test('get /reviews/aaaaa - not found', () => {
    return supertest_1.default(address)
        .get('/reviews/aaaaa')
        .then(response => {
        expect(response.status).toBe(404);
    })
        .catch(fail);
});
/*
  Exemplo de como pode ser um post para reviews
*/
test('post /reviews', () => {
    return supertest_1.default(address)
        .post('/reviews')
        .set('Authorization', auth)
        .send({
        date: '2018-02-02T20:20:20',
        rating: 4,
        comments: 'ok',
        user: new mongoose.Types.ObjectId(),
        restaurant: new mongoose.Types.ObjectId()
    })
        .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.rating).toBe(4);
        expect(response.body.comments).toBe('ok');
        expect(response.body.user).toBeDefined();
        expect(response.body.restaurant).toBeDefined();
    })
        .catch(fail);
});
