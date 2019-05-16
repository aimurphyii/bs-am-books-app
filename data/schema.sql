DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn NUMERIC(20),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(255)   
);



INSERT INTO books (title, author, isbn, image_url, description, bookshelf)
VALUES('Game', 'who', '2453433', 'https://sdkjngosg', 'thanos dies', 'End game');


INSERT INTO books (title, author, isbn, image_url, description, bookshelf)
VALUES('buddy','who', '4598734957','https://jfydhgfyhdthosg', 'he\''s an elf?', 'buddy the elf');