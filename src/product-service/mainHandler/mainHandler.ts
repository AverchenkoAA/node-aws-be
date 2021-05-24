import { HEADER, LOGGER } from "../const";
import { Pizza, Response } from "../entities";
import AWS from 'aws-sdk';

export interface Service {
    getAll(): Promise<Pizza[] | null | Error>,
    getPizzaByID(id: string): Promise<Pizza | null | Error>,
    insertOne(pizza: Pizza): Promise<string | null | Error>,
    insertMany(pizzas: Pizza[]): Promise<string | null | Error>,
    update(pizza: Pizza): Promise<Pizza | null | Error>,
    delete(id: string): Promise<string | null | Error>
}

export class MainHandler {

    constructor(private _service: Service) { }

    public async getAllPizzas(event: any): Promise<Response> {
        try {
            const pizzas = await this._service.getAll();

            if (pizzas instanceof Error) {
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

            if (pizza instanceof Error) {
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

            if (pizzaId instanceof Error) {
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

    public async catalogBatchProcess(event: any): Promise<void> {
        console.log('Start read from SQS');
        try {

            const products = event.Records.map((record: { body: any; }) => {
                return JSON.parse(record.body);
            });
            LOGGER.info(`[catalogBatchProcess] input products - ${products}`);

            if (products.length === 0) { return }

            const result = await this._service.insertMany(products as Pizza[]);
            LOGGER.info(`[catalogBatchProcess] result of insert - ${result}`);

            const sns = new AWS.SNS({ region: 'eu-west-1' });
            sns.publish({
                Subject: 'New pizzas were updated',
                Message: JSON.stringify(products),
                TopicArn: process.env.SNS_ARN
            }, ()=>{
                LOGGER.info(`Send email notification with - ${result}`);
            });
        } catch (error) {
            console.log(error);
        }
    }

    public async updateOnePizza(event: any): Promise<Response> {
        try {

            if (!this.isInputBodyValid(event)) {
                return {
                    statusCode: 400,
                    headers: HEADER,
                    body: JSON.stringify('Update failed!'),
                };
            }

            const updateedPizza = JSON.parse(event.body) as Pizza;
            LOGGER.info(`[UpdateOnePizza] input event - ${updateedPizza}`);

            const pizzaId = await this._service.update(updateedPizza);

            if (pizzaId instanceof Error) {
                throw new Error(pizzaId.message);
            }

            if (!pizzaId) {
                LOGGER.warn(`[UpdateOnePizza] Update failed!`);
                return {
                    statusCode: 422,
                    headers: HEADER,
                    body: JSON.stringify('Update failed!'),
                };
            }

            const response = {
                statusCode: 200,
                headers: HEADER,
                body: JSON.stringify(pizzaId),
            };

            LOGGER.info(`[UpdateOnePizza] return prepared response - ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            LOGGER.error(`[UpdateOnePizza] ${error}`)
            return { statusCode: 500, headers: HEADER, body: 'Some server error.' };
        }
    }

    public async deleteOnePizza(event: any): Promise<Response> {
        try {
            const id = event?.pathParameters?.id || null;

            if (!id) {
                return {
                    statusCode: 400,
                    headers: HEADER,
                    body: JSON.stringify('Delete failed!'),
                };
            }

            LOGGER.info(`[deleteOnePizza] input event with id - ${id}`);

            const pizzaId = await this._service.delete(id);

            if (pizzaId instanceof Error) {
                throw new Error(pizzaId.message);
            }

            if (!pizzaId) {
                LOGGER.warn(`[deleteOnePizza] Update failed!`);
                return {
                    statusCode: 422,
                    headers: HEADER,
                    body: JSON.stringify('Update failed!'),
                };
            }

            const response = {
                statusCode: 200,
                headers: HEADER,
                body: JSON.stringify(`Pizza with id: ${pizzaId} - was deleted`),
            };

            LOGGER.info(`[deleteOnePizza] return prepared response - ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            LOGGER.error(`[deleteOnePizza] ${error}`)
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
