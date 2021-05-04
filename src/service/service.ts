import { Pizza } from '../entities/pizza';
import { dbOptions } from '../const/dbOptions';
import { Client } from 'pg';
import { LOGGER } from '../const';

export class PizzaService {
    private _connection!: Client;

    constructor() {
        this.init();
    }

    private init(): Client {
        if (!this._connection) {
            this._connection = new Client(dbOptions);
        }
        return this._connection;
    }

    public async getAll(): Promise<Pizza[] | null | Error> {
        try {
            await this._connection.connect();

            const query = 'SELECT id, title, description, price, s.count as count FROM public.products JOIN stocks s ON products.id = s.product_id';

            const res = await this._connection.query(query);
            return res?.rows || null;
        } catch (error) {
            LOGGER.error(`[PizzaService.getAll()] - ${error}`);
            return new Error(error);
        } finally {
            await this._connection.end()
        }
    }

    public async getPizzaByID(id: string): Promise<Pizza | null | Error> {
        try {
            await this._connection.connect();

            const query = `SELECT id, title, description, price, s.count as count
                            FROM public.products
                            JOIN stocks s ON products.id = s.product_id
                            where id=$1`;

            const res = await this._connection.query(query, [id]);
            return res?.rows[0] || null;
        } catch (error) {
            LOGGER.error(`[PizzaService.getPizzaByID()] - ${error}`);
            return new Error(error);
        } finally {
            await this._connection.end()
        }
    }

    public async insertOne(pizza: Pizza): Promise<string | null | Error> {
        try {
            await this._connection.connect();

            const productQuery = `INSERT INTO products (title, description, price) values ($1, $2, $3) RETURNING id`;

            const productRes = await this._connection.query(productQuery, [pizza.title, pizza.description, pizza.price]);
            const productId = productRes.rows[0].id;

            const stocksQuery = `INSERT INTO stocks (product_id, count) values ($1, $2) RETURNING product_id`;

            const stocksRes = await this._connection.query(stocksQuery, [productId, pizza.count]);

            return stocksRes?.rows[0] || null;
        } catch (error) {
            LOGGER.error(`[PizzaService.insertOne()] - ${error}`);
            return new Error(error);
        } finally {
            await this._connection.end()
        }
    }

    public async update(pizza: Pizza): Promise<Pizza | null | Error> {
        try {
            await this._connection.connect();

            const productQuery = `UPDATE public.products SET title=$1, description=$2, price=$3 WHERE id=$4`;

            await this._connection.query(productQuery, [pizza.title, pizza.description, pizza.price, pizza.id]);

            const stocksQuery = `UPDATE public.stocks SET count=$2 WHERE product_id=$1`;

            await this._connection.query(stocksQuery, [pizza.id, pizza.count]);

            const query = `SELECT id, title, description, price, s.count as count
            FROM public.products
            JOIN stocks s ON products.id = s.product_id
            where id=$1`;

            const res = await this._connection.query(query, [pizza.id]);
            return res?.rows[0] || null;
        } catch (error) {
            LOGGER.error(`[PizzaService.update()] - ${error}`);
            return new Error(error);
        } finally {
            await this._connection.end()
        }
    }

    public async delete(id: string): Promise<string | null | Error> {
        try {
            await this._connection.connect();

            const stocksQuery = `DELETE FROM public.stocks WHERE product_id=$1`;

            await this._connection.query(stocksQuery, [id]);

            const productQuery = `DELETE FROM public.products WHERE id=$1`;

            await this._connection.query(productQuery, [id]);

            return id || null;
        } catch (error) {
            LOGGER.error(`[PizzaService.delete()] - ${error}`);
            return new Error(error);
        } finally {
            await this._connection.end()
        }
    }
}
