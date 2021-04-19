import { PizzaService } from '../service/service';
import { HEADER, LOGGER } from '../const';

export async function getAllPizzas(event: any) {
    try {
        const service = new PizzaService();
        const pizzas = await service.getAll();

        if (!pizzas) {
            LOGGER.warn(`[getAllPizzas] Empty pizzas DB`);
            return {
                statusCode: 404,
                headers: HEADER,
                body: JSON.stringify('No result'),
            };
        }

        const response = {
            statusCode: 200,
            headers: HEADER,
            body: JSON.stringify(pizzas),
        };

        LOGGER.info(`[getAllPizzas] return prepared response - ${JSON.stringify(response)}`);
        return response;
    } catch (error) {
        LOGGER.error(`[getAllPizzas] ${error}`)
        return { statusCode: 500, body: 'Some server error.' };
    }
};
