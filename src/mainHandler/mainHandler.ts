import { HEADER, LOGGER } from "../const";
import { Pizza, Response } from "../entities";

export interface Service {
    getAll(): Promise<Pizza[] | null>,
    getPizzaByID(id: string): Promise<Pizza | null>,
    insertOne(pizza: Pizza): Promise<string | null>,
}

export class MainHandler {
    constructor(private _service: Service) { }

    public async getAllPizzas(event: any): Promise<Response> {
        try {
            const pizzas = await this._service.getAll();

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
            const insertedPizza = JSON.parse(event.body) as Pizza;
            LOGGER.info(`[insertOnePizza] input event - ${insertedPizza}`);

            const pizzaId = await this._service.insertOne(insertedPizza);

            if (!pizzaId) {
                LOGGER.warn(`[insertOnePizza] Insert failed!`);
                return {
                    statusCode: 400,
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
}
