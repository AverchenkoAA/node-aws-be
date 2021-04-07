import { PizzaService } from '../service/service';

export async function getAllPizzas(event: any) {
    try {
        const service = new PizzaService();
        const pizzas = service.getAll() || 'No result';
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(pizzas),
        };
        return response;
    } catch (error) {
        console.log(`[getAllPizzas] Error - ${error}`);
        return { statusCode: 500, body: 'Some server error.' };
    }
};
