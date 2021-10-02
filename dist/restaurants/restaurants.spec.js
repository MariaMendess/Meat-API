"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const supertest_1 = __importDefault(require("supertest"));
let address = global.address;
const auth = global.auth;
test('get /restaurants', () => {
    return supertest_1.default(address)
        .get('/restaurants')
        .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.items).toBeInstanceOf(Array);
    })
        .catch(fail);
});
test('get /restaurants/aaaaa - not found', () => {
    return supertest_1.default(address)
        .get('/restaurants/aaaaa')
        .then(response => {
        expect(response.status).toBe(404);
    })
        .catch(fail);
});
/*
  Exemplo de como pode ser um post para restaurants
*/
test('post /restaurants', () => {
    return supertest_1.default(address)
        .post('/restaurants')
        .set('Authorization', auth)
        .send({
        name: 'Burger House',
        menu: [{ name: "Coke", price: 5 }]
    })
        .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe('Burger House');
        expect(response.body.menu).toBeInstanceOf(Array);
        expect(response.body.menu).toHaveLength(1);
        expect(response.body.menu[0]).toMatchObject({ name: "Coke", price: 5 });
    })
        .catch(fail);
});
