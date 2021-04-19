import { Pizza } from '../entities/pizza';
import { dbOptions } from '../const/dbOptions';
import { Client } from 'pg';
import { LOGGER } from '../const';

export class PizzaService {
    private _connection!: Client;

    constructor() {
        this.init();
    }
    /**
     * init
     */
    public init(): Client {
        if (!this._connection) {
            this._connection = new Client(dbOptions);
        }
        return this._connection;
    }

    public async getAll(): Promise<Pizza[]> {
        try {
            await this._connection.connect();

            const query = 'SELECT id, title, description, price, s.count as count FROM public.products JOIN stocks s ON products.id = s.product_id';

            const res = await this._connection.query(query);
            return res.rows;
        } catch (error) {
            LOGGER.error(`[PizzaService.getAll()] - ${error}`);
            return [];
        } finally {
            await this._connection.end()
        }
    }

    public async getPizzaByID(id: string): Promise<Pizza | null> {
        try {
            await this._connection.connect();

            const query = `SELECT id, title, description, price, s.count as count
                            FROM public.products
                            JOIN stocks s ON products.id = s.product_id
                            where id=$1`;

            const res = await this._connection.query(query, [id]);
            return res.rows[0];
        } catch (error) {
            LOGGER.error(`[PizzaService.getPizzaByID()] - ${error}`);
            return null;
        } finally {
            await this._connection.end()
        }
    }

    public async insertOne(pizza: Pizza): Promise<string | null> {
        try {
            await this._connection.connect();

            const productQuery = `INSERT INTO products (title, description, price) values ($1, $2, $3) RETURNING id`;

            const productRes = await this._connection.query(productQuery, [pizza.title, pizza.description, pizza.price]);
            const productId = productRes.rows[0].id;

            const stocksQuery = `INSERT INTO stocks (product_id, count) values ($1, $2) RETURNING product_id`;

            const stocksRes = await this._connection.query(stocksQuery, [productId, pizza.count]);

            return stocksRes.rows[0];
        } catch (error) {
            LOGGER.error(`[PizzaService.insertOne()] - ${error}`);
            return null;
        } finally {
            await this._connection.end()
        }
    }
}
