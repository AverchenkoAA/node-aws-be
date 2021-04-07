import { PizzaService } from '../service/service';

export async function getPizzaByID(event: any) {
    try {
        const { id } = event.queryStringParameters;
        const service = new PizzaService();
        const pizza = service.getPizzaByID(id) || 'No result';
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(pizza),
        };
        return response;
    } catch (error) {
        console.log(`[getPizzaByID] Error - ${error}`);
        return { statusCode: 500, body: 'Some server error.' };
    }
};
