import { pizzaMockDB } from '../mocks/pizza';
import { Service, MainHandler } from '../../mainHandler/mainHandler';

let service: Service;
let mainHandler: MainHandler;
let event: any;

beforeEach(() => {
    service = {
        getAll: () => { return Promise.resolve(pizzaMockDB) },
        getPizzaByID: () => { return Promise.resolve(pizzaMockDB[0]) },
        insertOne: () => { return Promise.resolve(pizzaMockDB[0].id) },
    };
    mainHandler = new MainHandler(service);
    event = {
        pathParameters: {
            id: '1'
        }
    };
});

describe('getAllPizzas', () => {

    it('should return 200 status code', async () => {
        const result = await mainHandler.getPizzaByID(event);
        expect(result.statusCode).toEqual(200);
    }),

        it('should return all mock pizzas', async () => {
            const result = await mainHandler.getPizzaByID(event);
            const clearResult = JSON.parse(result.body);
            const expected = pizzaMockDB[0];
            expect(clearResult).toEqual(expected);
        }),

        it('should return 500 status code', async () => {
            const result = await mainHandler.getPizzaByID('error');
            expect(result.statusCode).toEqual(500);
        }),

        it('should return 404 status code', async () => {
            service.getPizzaByID = (id:string) => { return Promise.resolve(null) };
            event.pathParameters.id = 'errorId'
            const result = await mainHandler.getPizzaByID(event);
            expect(result.statusCode).toEqual(404);
        })

});
