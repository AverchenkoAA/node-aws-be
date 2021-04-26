import { pizzaMockDB } from '../mocks/pizza';
import { Service, MainHandler } from '../../mainHandler/mainHandler';

let service: Service;
let mainHandler: MainHandler;

beforeEach(() => {
    service = {
        getAll: () => { return Promise.resolve(pizzaMockDB) },
        getPizzaByID: () => { return Promise.resolve(pizzaMockDB[0]) },
        insertOne: () => { return Promise.resolve(pizzaMockDB[0].id) },
    };
    mainHandler = new MainHandler(service);
});

describe('getAllPizzas', () => {

    it('should return 200 status code', async () => {
        const result = await mainHandler.getAllPizzas(null);
        expect(result.statusCode).toEqual(200);
    }),

        it('should return all mock pizzas', async () => {
            const result = await mainHandler.getAllPizzas(null);
            const clearResult = JSON.parse(result.body);
            const expected = pizzaMockDB;
            expect(clearResult).toEqual(expected);
        })

});
