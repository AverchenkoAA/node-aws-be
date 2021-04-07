import { getAllPizzas } from '../handlers/getAllPizzas';
import { pizzaMockDB } from '../mocks/pizza';

describe('getAllPizzas', () => {

    it('should return 200 status code', async () => {
        const result = await getAllPizzas(null);
        expect(result.statusCode).toEqual(200);
    }),

    it('should return all mock pizzas', async () => {
        const result = await getAllPizzas(null);
        const clearResult = JSON.parse(result.body);
        const expected = pizzaMockDB;
        expect(clearResult).toEqual(expected);
    })

});
