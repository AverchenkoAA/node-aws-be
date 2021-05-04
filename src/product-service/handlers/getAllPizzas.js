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
exports.getAllPizzas = void 0;
const service_1 = require("../service/service");
const mainHandler_1 = require("../mainHandler/mainHandler");
function getAllPizzas(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = new service_1.PizzaService();
        const mainHandler = new mainHandler_1.MainHandler(service);
        return mainHandler.getAllPizzas(event);
    });
}
exports.getAllPizzas = getAllPizzas;
;
//# sourceMappingURL=getAllPizzas.js.map