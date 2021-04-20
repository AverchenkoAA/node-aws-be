import { PizzaService } from '../service/service';
import { MainHandler } from '../mainHandler/mainHandler';

export async function getPizzaByID(event: any) {
    const service = new PizzaService();
    const mainHandler = new MainHandler(service);
    return mainHandler.getPizzaByID(event);
};
