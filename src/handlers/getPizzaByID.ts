import { PizzaService } from '../service/service';
import { HEADER, LOGGER } from '../const';

export async function getPizzaByID(event: any) {
    try {
        const id = event.pathParameters.id;
        const service = new PizzaService();
        const pizza = service.getPizzaByID(id);

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
        return { statusCode: 500, body: 'Some server error.' };
    }
};
