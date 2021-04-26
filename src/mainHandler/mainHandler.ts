import { HEADER, LOGGER } from "../const";
import { Pizza, Response } from "../entities";

export interface Service {
    getAll(): Promise<Pizza[] | null| Error>,
    getPizzaByID(id: string): Promise<Pizza | null | Error>,
    insertOne(pizza: Pizza): Promise<string | null | Error>,
}

export class MainHandler {
    constructor(private _service: Service) { }

    public async getAllPizzas(event: any): Promise<Response> {
        try {
            const pizzas = await this._service.getAll();

            if(pizzas instanceof Error){
                throw new Error(pizzas.message);
            }

            if (!pizzas) {
                LOGGER.warn(`[getAllPizzas] Empty pizzas DB`);
                return {
                    statusCode: 404,
                    headers: HEADER,
                    body: JSON.stringify('No result'),
                };
            }

            const response: Response = {
                statusCode: 200,
                headers: HEADER,
                body: JSON.stringify(pizzas),
            };

            LOGGER.info(`[getAllPizzas] return prepared response - ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            LOGGER.error(`[getAllPizzas] ${error}`)
            return { statusCode: 500, headers: HEADER, body: 'Some server error.' };
        }
    }

    public async getPizzaByID(event: any): Promise<Response> {
        try {
            const id = event.pathParameters.id;
            const pizza = await this._service.getPizzaByID(id);

            if(pizza instanceof Error){
                throw new Error(pizza.message);
            }

            if (!pizza) {
                LOGGER.warn(`[getAllPizzas] Ask undefined pizza ID`);
                return {
                    statusCode: 404,
                    headers: HEADER,
                    body: JSON.stringify('No result'),
                };
            }

            const response = {
                statusCode: 200,
                headers: HEADER,
                body: JSON.stringify(pizza),
            };

            LOGGER.info(`[getAllPizzas] return prepared response - ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            LOGGER.error(`[getAllPizzas] ${error}`)
            return { statusCode: 500, headers: HEADER, body: 'Some server error.' };
        }
    }

    public async insertOnePizza(event: any): Promise<Response> {
        try {

            if (!this.isInputBodyValid(event)) {
                return {
                    statusCode: 400,
                    headers: HEADER,
                    body: JSON.stringify('Insert failed!'),
                };
            }

            const insertedPizza = JSON.parse(event.body) as Pizza;
            LOGGER.info(`[insertOnePizza] input event - ${insertedPizza}`);

            const pizzaId = await this._service.insertOne(insertedPizza);

            if(pizzaId instanceof Error){
                throw new Error(pizzaId.message);
            }

            if (!pizzaId) {
                LOGGER.warn(`[insertOnePizza] Insert failed!`);
                return {
                    statusCode: 422,
                    headers: HEADER,
                    body: JSON.stringify('Insert failed!'),
                };
            }

            const response = {
                statusCode: 200,
                headers: HEADER,
                body: JSON.stringify(pizzaId),
            };

            LOGGER.info(`[insertOnePizza] return prepared response - ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            LOGGER.error(`[insertOnePizza] ${error}`)
            return { statusCode: 500, headers: HEADER, body: 'Some server error.' };
        }
    }

    private isInputBodyValid(event: any): boolean {
        try {
            const insertedPizza = JSON.parse(event.body) as Pizza;
            if (
                insertedPizza
                && insertedPizza.title
                && insertedPizza.price
            ) {
                return true;
            }
            return false;
        } catch (error) {
            LOGGER.error(`[checkInputBody] Wrong format!`);
            return false;
        }

    }
}
