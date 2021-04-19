import { Pizza } from '../entities/pizza';

export const pizzaMockDB: Pizza[] = [
    {
        id: "1",
        title: 'Carbonara',
        count: 350,
        description:'Carbonara',
        price: 15,
        // srceen: 'simple-url-screen-carbonara'
    },
    {
        id: "2",
        title: 'Pipa',
        description:'Pipa',
        count: 400,
        price: 10,
        // srceen: 'simple-url-screen-pipa'
    },
    {
        id: "3",
        title: 'Pupro',
        description:'Pupro',
        count: 250,
        price: 13,
        // srceen: 'simple-url-screen-pupro'
    },
    {
        id: "4",
        title: 'Allatriste',
        description:'Allatriste',
        count: 500,
        price: 20,
        // srceen: 'simple-url-screen-allatriste'
    }
];
