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
exports.PizzaService = void 0;
const dbOptions_1 = require("../const/dbOptions");
const pg_1 = require("pg");
const const_1 = require("../const");
class PizzaService {
    constructor() {
        this.init();
    }
    init() {
        if (!this._connection) {
            this._connection = new pg_1.Client(dbOptions_1.dbOptions);
        }
        return this._connection;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._connection.connect();
                const query = 'SELECT id, title, description, price, s.count as count FROM public.products JOIN stocks s ON products.id = s.product_id';
                const res = yield this._connection.query(query);
                return (res === null || res === void 0 ? void 0 : res.rows) || null;
            }
            catch (error) {
                const_1.LOGGER.error(`[PizzaService.getAll()] - ${error}`);
                return new Error(error);
            }
            finally {
                yield this._connection.end();
            }
        });
    }
    getPizzaByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._connection.connect();
                const query = `SELECT id, title, description, price, s.count as count
                            FROM public.products
                            JOIN stocks s ON products.id = s.product_id
                            where id=$1`;
                const res = yield this._connection.query(query, [id]);
                return (res === null || res === void 0 ? void 0 : res.rows[0]) || null;
            }
            catch (error) {
                const_1.LOGGER.error(`[PizzaService.getPizzaByID()] - ${error}`);
                return new Error(error);
            }
            finally {
                yield this._connection.end();
            }
        });
    }
    insertOne(pizza) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._connection.connect();
                const productQuery = `INSERT INTO products (title, description, price) values ($1, $2, $3) RETURNING id`;
                const productRes = yield this._connection.query(productQuery, [pizza.title, pizza.description, pizza.price]);
                const productId = productRes.rows[0].id;
                const stocksQuery = `INSERT INTO stocks (product_id, count) values ($1, $2) RETURNING product_id`;
                const stocksRes = yield this._connection.query(stocksQuery, [productId, pizza.count]);
                return (stocksRes === null || stocksRes === void 0 ? void 0 : stocksRes.rows[0]) || null;
            }
            catch (error) {
                const_1.LOGGER.error(`[PizzaService.insertOne()] - ${error}`);
                return new Error(error);
            }
            finally {
                yield this._connection.end();
            }
        });
    }
    update(pizza) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._connection.connect();
                const productQuery = `UPDATE public.products SET title=$1, description=$2, price=$3 WHERE id=$4`;
                yield this._connection.query(productQuery, [pizza.title, pizza.description, pizza.price, pizza.id]);
                const stocksQuery = `UPDATE public.stocks SET count=$2 WHERE product_id=$1`;
                yield this._connection.query(stocksQuery, [pizza.id, pizza.count]);
                const query = `SELECT id, title, description, price, s.count as count
            FROM public.products
            JOIN stocks s ON products.id = s.product_id
            where id=$1`;
                const res = yield this._connection.query(query, [pizza.id]);
                return (res === null || res === void 0 ? void 0 : res.rows[0]) || null;
            }
            catch (error) {
                const_1.LOGGER.error(`[PizzaService.update()] - ${error}`);
                return new Error(error);
            }
            finally {
                yield this._connection.end();
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._connection.connect();
                const stocksQuery = `DELETE FROM public.stocks WHERE product_id=$1`;
                yield this._connection.query(stocksQuery, [id]);
                const productQuery = `DELETE FROM public.products WHERE id=$1`;
                yield this._connection.query(productQuery, [id]);
                return id || null;
            }
            catch (error) {
                const_1.LOGGER.error(`[PizzaService.delete()] - ${error}`);
                return new Error(error);
            }
            finally {
                yield this._connection.end();
            }
        });
    }
}
exports.PizzaService = PizzaService;
//# sourceMappingURL=service.js.map