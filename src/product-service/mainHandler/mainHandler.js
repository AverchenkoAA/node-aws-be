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
exports.MainHandler = void 0;
const const_1 = require("../const");
class MainHandler {
    constructor(_service) {
        this._service = _service;
    }
    getAllPizzas(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pizzas = yield this._service.getAll();
                if (pizzas instanceof Error) {
                    throw new Error(pizzas.message);
                }
                if (!pizzas) {
                    const_1.LOGGER.warn(`[getAllPizzas] Empty pizzas DB`);
                    return {
                        statusCode: 404,
                        headers: const_1.HEADER,
                        body: JSON.stringify('No result'),
                    };
                }
                const response = {
                    statusCode: 200,
                    headers: const_1.HEADER,
                    body: JSON.stringify(pizzas),
                };
                const_1.LOGGER.info(`[getAllPizzas] return prepared response - ${JSON.stringify(response)}`);
                return response;
            }
            catch (error) {
                const_1.LOGGER.error(`[getAllPizzas] ${error}`);
                return { statusCode: 500, headers: const_1.HEADER, body: 'Some server error.' };
            }
        });
    }
    getPizzaByID(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = event.pathParameters.id;
                const pizza = yield this._service.getPizzaByID(id);
                if (pizza instanceof Error) {
                    throw new Error(pizza.message);
                }
                if (!pizza) {
                    const_1.LOGGER.warn(`[getAllPizzas] Ask undefined pizza ID`);
                    return {
                        statusCode: 404,
                        headers: const_1.HEADER,
                        body: JSON.stringify('No result'),
                    };
                }
                const response = {
                    statusCode: 200,
                    headers: const_1.HEADER,
                    body: JSON.stringify(pizza),
                };
                const_1.LOGGER.info(`[getAllPizzas] return prepared response - ${JSON.stringify(response)}`);
                return response;
            }
            catch (error) {
                const_1.LOGGER.error(`[getAllPizzas] ${error}`);
                return { statusCode: 500, headers: const_1.HEADER, body: 'Some server error.' };
            }
        });
    }
    insertOnePizza(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isInputBodyValid(event)) {
                    return {
                        statusCode: 400,
                        headers: const_1.HEADER,
                        body: JSON.stringify('Insert failed!'),
                    };
                }
                const insertedPizza = JSON.parse(event.body);
                const_1.LOGGER.info(`[insertOnePizza] input event - ${insertedPizza}`);
                const pizzaId = yield this._service.insertOne(insertedPizza);
                if (pizzaId instanceof Error) {
                    throw new Error(pizzaId.message);
                }
                if (!pizzaId) {
                    const_1.LOGGER.warn(`[insertOnePizza] Insert failed!`);
                    return {
                        statusCode: 422,
                        headers: const_1.HEADER,
                        body: JSON.stringify('Insert failed!'),
                    };
                }
                const response = {
                    statusCode: 200,
                    headers: const_1.HEADER,
                    body: JSON.stringify(pizzaId),
                };
                const_1.LOGGER.info(`[insertOnePizza] return prepared response - ${JSON.stringify(response)}`);
                return response;
            }
            catch (error) {
                const_1.LOGGER.error(`[insertOnePizza] ${error}`);
                return { statusCode: 500, headers: const_1.HEADER, body: 'Some server error.' };
            }
        });
    }
    updateOnePizza(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isInputBodyValid(event)) {
                    return {
                        statusCode: 400,
                        headers: const_1.HEADER,
                        body: JSON.stringify('Update failed!'),
                    };
                }
                const updateedPizza = JSON.parse(event.body);
                const_1.LOGGER.info(`[UpdateOnePizza] input event - ${updateedPizza}`);
                const pizzaId = yield this._service.update(updateedPizza);
                if (pizzaId instanceof Error) {
                    throw new Error(pizzaId.message);
                }
                if (!pizzaId) {
                    const_1.LOGGER.warn(`[UpdateOnePizza] Update failed!`);
                    return {
                        statusCode: 422,
                        headers: const_1.HEADER,
                        body: JSON.stringify('Update failed!'),
                    };
                }
                const response = {
                    statusCode: 200,
                    headers: const_1.HEADER,
                    body: JSON.stringify(pizzaId),
                };
                const_1.LOGGER.info(`[UpdateOnePizza] return prepared response - ${JSON.stringify(response)}`);
                return response;
            }
            catch (error) {
                const_1.LOGGER.error(`[UpdateOnePizza] ${error}`);
                return { statusCode: 500, headers: const_1.HEADER, body: 'Some server error.' };
            }
        });
    }
    deleteOnePizza(event) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = ((_a = event === null || event === void 0 ? void 0 : event.pathParameters) === null || _a === void 0 ? void 0 : _a.id) || null;
                if (!id) {
                    return {
                        statusCode: 400,
                        headers: const_1.HEADER,
                        body: JSON.stringify('Delete failed!'),
                    };
                }
                const_1.LOGGER.info(`[deleteOnePizza] input event with id - ${id}`);
                const pizzaId = yield this._service.delete(id);
                if (pizzaId instanceof Error) {
                    throw new Error(pizzaId.message);
                }
                if (!pizzaId) {
                    const_1.LOGGER.warn(`[deleteOnePizza] Update failed!`);
                    return {
                        statusCode: 422,
                        headers: const_1.HEADER,
                        body: JSON.stringify('Update failed!'),
                    };
                }
                const response = {
                    statusCode: 200,
                    headers: const_1.HEADER,
                    body: JSON.stringify(`Pizza with id: ${pizzaId} - was deleted`),
                };
                const_1.LOGGER.info(`[deleteOnePizza] return prepared response - ${JSON.stringify(response)}`);
                return response;
            }
            catch (error) {
                const_1.LOGGER.error(`[deleteOnePizza] ${error}`);
                return { statusCode: 500, headers: const_1.HEADER, body: 'Some server error.' };
            }
        });
    }
    isInputBodyValid(event) {
        try {
            const insertedPizza = JSON.parse(event.body);
            if (insertedPizza
                && insertedPizza.id
                && insertedPizza.title
                && insertedPizza.price) {
                return true;
            }
            return false;
        }
        catch (error) {
            const_1.LOGGER.error(`[checkInputBody] Wrong format!`);
            return false;
        }
    }
}
exports.MainHandler = MainHandler;
//# sourceMappingURL=mainHandler.js.map