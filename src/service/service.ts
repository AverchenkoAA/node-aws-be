import { Pizza } from '../entities/pizza';
import { pizzaMockDB } from '../mocks/pizza';

export class PizzaService {
    public getAll(): Pizza[] {
        return pizzaMockDB;
    }

    public getPizzaByID(id: string): Pizza | undefined{
        return pizzaMockDB.find((pizza) => id === pizza.id);
    }
}
