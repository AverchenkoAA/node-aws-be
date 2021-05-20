import { PizzaService } from '../service/service';
import { MainHandler } from '../mainHandler/mainHandler';

export async function getAllPizzas(event: any) {
    const service = new PizzaService();
    const mainHandler = new MainHandler(service);
    return mainHandler.getAllPizzas(event);
};
