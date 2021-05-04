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
        delete: () => { return Promise.resolve(pizzaMockDB[0].id) },
        update: () => { return Promise.resolve(pizzaMockDB[0]) },
    };
    mainHandler = new MainHandler(service);
    event = {
        body: JSON.stringify({
            id: "1",
            title: 'Carbonara',
            count: 350,
            description: 'Carbonara',
            price: 15,
        })
    };
});

describe('insertOne', () => {

    it('should return 200 status code', async () => {
        const result = await mainHandler.insertOnePizza(event);
        expect(result.statusCode).toEqual(200);
    }),

        it('should return id after insert', async () => {
            const result = await mainHandler.insertOnePizza(event);
            const clearResult = JSON.parse(result.body);
            const expected = pizzaMockDB[0].id;
            expect(clearResult).toEqual(expected);
        })

});
