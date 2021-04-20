--create extension if not exists "uuid-ossp";

--create  table products (
--	id uuid primary key default uuid_generate_v4(),
--	title text NOT NULL,
--	description text,
--	price integer
--);

--create  table stocks (
--	product_id uuid,
--	FOREIGN KEY (product_id) REFERENCES products (id),
--	count integer
--);

--INSERT INTO products (title, description, price) values
--('Carbonara', 'Carbonara pizza description', 15),
--('Pipa', 'Pipa pizza description', 10),
--('Pupro', 'Pupro pizza description', 13),
--('Allatriste', 'Allatriste pizza description', 20),
--('WHITE', 'WHITE pizza description', 12),
--('RED', 'RED pizza description', 16),
--('WHITE-maxi', 'WHITE-maxi pizza description', 14);

--INSERT INTO stocks (product_id, count) values
--('545a5d77-9144-4a03-8a8b-95790b0c1886', 5),
--('9b3aa056-3e15-4b81-a80b-b44ff20b946d', 4),
--('5d73ff24-d6ba-4e7c-a5b8-0e125f6f2ec2', 6),
--('c5d109c0-4f02-4432-9540-f30a15e1ece5', 7),
--('060e0315-707a-4e75-a7d9-3556a1489b3a', 3),
--('5970a705-e933-4bba-a9dc-67f8ce0df59d', 3),
--('f4ac9a06-fb96-4495-b6d6-c6c12d993ede', 3);
