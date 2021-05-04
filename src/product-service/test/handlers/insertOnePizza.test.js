"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pizza_1 = require("../mocks/pizza");
const mainHandler_1 = require("../../mainHandler/mainHandler");
let service;
let mainHandler;
let event;
beforeEach(() => {
    service = {
        getAll: () => { return Promise.resolve(pizza_1.pizzaMockDB); },
        getPizzaByID: () => { return Promise.resolve(pizza_1.pizzaMockDB[0]); },
        insertOne: () => { return Promise.resolve(pizza_1.pizzaMockDB[0].id); },
        delete: () => { return Promise.resolve(pizza_1.pizzaMockDB[0].id); },
        update: () => { return Promise.resolve(pizza_1.pizzaMockDB[0]); },
    };
    mainHandler = new mainHandler_1.MainHandler(service);
    event = {
        body: JSON.stringify({
            id: "1",
            title: 'Carbonara',
            count: 350,
            description: 'Carbonara',
            price: 15,
        })
    };
});
describe('insertOne', () => {
    it('should return 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield mainHandler.insertOnePizza(event);
        expect(result.statusCode).toEqual(200);
    })),
        it('should return id after insert', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield mainHandler.insertOnePizza(event);
            const clearResult = JSON.parse(result.body);
            const expected = pizza_1.pizzaMockDB[0].id;
            expect(clearResult).toEqual(expected);
        }));
});
//# sourceMappingURL=insertOnePizza.test.js.map