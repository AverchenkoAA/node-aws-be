import { getPizzaByID } from '../handlers/getPizzaByID';
import { pizzaMockDB } from '../mocks/pizza';

let event: any;

beforeEach(()=>{
    event = {
        pathParameters: {
            id: '1'
        }
    };
});

describe('getAllPizzas', () => {

    it('should return 200 status code', async () => {
        const result = await getPizzaByID(event);
        expect(result.statusCode).toEqual(200);
    }),

    it('should return all mock pizzas', async () => {
        const result = await getPizzaByID(event);
        const clearResult = JSON.parse(result.body);
        const expected = pizzaMockDB[0];
        expect(clearResult).toEqual(expected);
    }),

    it('should return 500 status code', async () => {
        const result = await getPizzaByID('error');
        expect(result.statusCode).toEqual(500);
    }),

    it('should return 404 status code', async () => {
        event.pathParameters.id = 'errorId'
        const result = await getPizzaByID(event);
        expect(result.statusCode).toEqual(404);
    })

});
