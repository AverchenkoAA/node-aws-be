import { PizzaService } from '../service/service';
import { Pizza } from '../entities/pizza';
import { HEADER, LOGGER } from '../const';

export async function insertOnePizza(event: any) {
    try {
        const insertedPizza = JSON.parse(event.body) as Pizza;
        LOGGER.info(`[insertOnePizza] input event - ${insertedPizza}`);

        const service = new PizzaService();
        const pizzaId = await service.insertOne(insertedPizza);

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
        return { statusCode: 500, body: 'Some server error.' };
    }
};
